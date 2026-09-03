import { mkdtemp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { installAgenticUtils } from "../src/installer.js";

const packageRoot = path.resolve(import.meta.dirname, "..");

async function createFixturePackage(root: string): Promise<string> {
  const fixture = path.join(root, "fixture-package");
  for (const skill of ["adr-create", "hld-create"]) {
    await mkdir(path.join(fixture, "skills", skill, "agents"), {
      recursive: true,
    });
    await writeFile(
      path.join(fixture, "skills", skill, "SKILL.md"),
      `---\nname: ${skill}\ndescription: fixture\n---\n`,
    );
    await writeFile(
      path.join(fixture, "skills", skill, "agents", "openai.yaml"),
      "policy:\n  allow_implicit_invocation: false\n",
    );
  }
  await mkdir(path.join(fixture, "agents"), { recursive: true });
  for (const agent of [
    "adr-research-architect",
    "hld-architect",
    "hld-reviewer",
    "nestjs-expert",
  ]) {
    await writeFile(
      path.join(fixture, "agents", `${agent}.toml`),
      `name = "${agent}"\n`,
    );
  }
  return fixture;
}

describe("safe installer", () => {
  it("installs skills and agents without replacing unrelated project guidance", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "codex-agentic-utils-"));
    await mkdir(path.join(root, ".agents", "skills", "custom-skill"), {
      recursive: true,
    });
    await writeFile(
      path.join(root, "AGENTS.md"),
      "# Existing guidance\n\nKeep this.\n",
    );
    await writeFile(
      path.join(root, ".agents", "skills", "custom-skill", "SKILL.md"),
      "custom",
    );

    const result = await installAgenticUtils(root, { packageRoot });

    expect(result.actions).toContainEqual(
      expect.objectContaining({
        path: ".agents/skills/adr-create/SKILL.md",
        status: "create",
      }),
    );
    expect(result.actions).toContainEqual(
      expect.objectContaining({
        path: ".codex/agents/hld-reviewer.toml",
        status: "create",
      }),
    );
    expect(
      await readFile(
        path.join(root, ".agents", "skills", "custom-skill", "SKILL.md"),
        "utf8",
      ),
    ).toBe("custom");
    const agents = await readFile(path.join(root, "AGENTS.md"), "utf8");
    expect(agents).toContain("Keep this.");
    expect(agents).toContain("$adr-create");
    expect(agents).toContain("bundled assets/adr-template.md");
    expect(agents).toContain("bundled assets/hld-template.md");
    expect(agents).not.toContain("missing project template");

    for (const [skill, template] of [
      ["adr-create", "adr-template.md"],
      ["hld-create", "hld-template.md"],
    ]) {
      const installedTemplate = await readFile(
        path.join(root, ".agents", "skills", skill, "assets", template),
        "utf8",
      );
      const packagedTemplate = await readFile(
        path.join(packageRoot, "skills", skill, "assets", template),
        "utf8",
      );
      expect(installedTemplate).toBe(packagedTemplate);
    }
  });

  it("preserves a customized managed file and customized AGENTS.md on update", async () => {
    const root = await mkdtemp(
      path.join(tmpdir(), "codex-agentic-utils-update-"),
    );
    await installAgenticUtils(root, { packageRoot });
    const skill = path.join(
      root,
      ".agents",
      "skills",
      "adr-create",
      "SKILL.md",
    );
    await writeFile(skill, "custom skill\n");
    await writeFile(path.join(root, "AGENTS.md"), "custom project guidance\n");

    const result = await installAgenticUtils(root, { packageRoot });

    expect(result.actions).toContainEqual(
      expect.objectContaining({
        path: ".agents/skills/adr-create/SKILL.md",
        status: "preserve",
      }),
    );
    expect(result.actions).toContainEqual(
      expect.objectContaining({
        path: "AGENTS.md",
        status: "preserve",
      }),
    );
    expect(result.manifest.preserved).toEqual(
      expect.arrayContaining([
        ".agents/skills/adr-create/SKILL.md",
        "AGENTS.md",
      ]),
    );
    expect(await readFile(skill, "utf8")).toBe("custom skill\n");
  });

  it("does not write files during a dry run", async () => {
    const root = await mkdtemp(
      path.join(tmpdir(), "codex-agentic-utils-dry-run-"),
    );
    const result = await installAgenticUtils(root, {
      packageRoot,
      dryRun: true,
    });

    expect(result.dryRun).toBe(true);
    await expect(
      readFile(path.join(root, ".codex-agentic-utils", "install.json")),
    ).rejects.toMatchObject({ code: "ENOENT" });
    await expect(readFile(path.join(root, "AGENTS.md"))).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  it("backs up a previously managed file before replacing it during an update", async () => {
    const root = await mkdtemp(
      path.join(tmpdir(), "codex-agentic-utils-backup-"),
    );
    const fixture = await createFixturePackage(root);
    await installAgenticUtils(root, { packageRoot: fixture });
    await writeFile(
      path.join(fixture, "skills", "adr-create", "SKILL.md"),
      "---\nname: adr-create\ndescription: updated fixture\n---\n",
    );

    const result = await installAgenticUtils(root, { packageRoot: fixture });
    const backupRoot = path.join(root, ".codex-agentic-utils", "backups");
    const backups = await readdir(backupRoot);
    const backup = await readFile(
      path.join(
        backupRoot,
        backups[0],
        ".agents",
        "skills",
        "adr-create",
        "SKILL.md",
      ),
      "utf8",
    );

    expect(result.actions).toContainEqual(
      expect.objectContaining({
        path: ".agents/skills/adr-create/SKILL.md",
        status: "update",
      }),
    );
    expect(backup).toContain("description: fixture");
  });
});
