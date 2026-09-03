#!/usr/bin/env node
import path from "node:path";
import { Command } from "commander";

import { PACKAGE_VERSION } from "./constants.js";
import { runDoctor } from "./doctor.js";
import { installAgenticUtils, type InstallResult } from "./installer.js";

function printInstall(result: InstallResult): void {
  for (const action of result.actions) {
    process.stdout.write(
      `${action.status.padEnd(9)} ${action.path}${action.reason ? ` — ${action.reason}` : ""}\n`,
    );
  }
  process.stdout.write(
    `${result.dryRun ? "Dry run" : "Installation"} complete.\n`,
  );
}

const program = new Command()
  .name("codex-agentic-utils")
  .description(
    "Install Codex ADR and architecture-design skills into a project",
  )
  .version(PACKAGE_VERSION);

for (const name of ["install", "update"] as const) {
  program
    .command(name)
    .description("Install or safely update project-local skills and agents")
    .option("-p, --project <path>", "Target project", process.cwd())
    .option("--dry-run", "Preview changes without writing", false)
    .action(async (options: { project: string; dryRun: boolean }) => {
      printInstall(
        await installAgenticUtils(path.resolve(options.project), {
          dryRun: options.dryRun,
        }),
      );
    });
}

program
  .command("doctor")
  .description("Verify the project-local installation")
  .option("-p, --project <path>", "Target project", process.cwd())
  .option("--json", "Output JSON", false)
  .action(async (options: { project: string; json: boolean }) => {
    const findings = await runDoctor(path.resolve(options.project));
    if (options.json)
      process.stdout.write(`${JSON.stringify(findings, null, 2)}\n`);
    else
      for (const finding of findings)
        process.stdout.write(
          `${finding.level.toUpperCase().padEnd(7)} ${finding.check}: ${finding.message}\n`,
        );
    if (findings.some((finding) => finding.level === "error"))
      process.exitCode = 1;
  });

program.parseAsync().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
