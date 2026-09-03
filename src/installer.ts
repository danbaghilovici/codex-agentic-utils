import { readdir } from "node:fs/promises";
import path from "node:path";

import {
  AGENT_NAMES,
  INSTALL_ROOT,
  PACKAGE_NAME,
  PACKAGE_VERSION,
  SKILL_NAMES,
} from "./constants.js";
import {
  atomicWrite,
  backupFile,
  checksum,
  checksumFile,
  exists,
  readUtf8,
} from "./fs-safe.js";
import { findPackageRoot } from "./package-root.js";

const AGENTS_START = "<!-- codex-agentic-utils:start -->";
const AGENTS_END = "<!-- codex-agentic-utils:end -->";
const AGENTS_SECTION = `${AGENTS_START}
## Codex Agentic Utils

Use the installed ADR and HLD workflows only when the user explicitly invokes $adr-create or
$hld-create. The workflows use the custom agents installed under .codex/agents/; they may also
be selected directly when their specialist role fits the user request.

- $adr-create uses its bundled assets/adr-template.md and promotes approved ADR/ proposals to
  docs/adr/ (removing the source proposal after the destination is saved).
- $hld-create uses its bundled assets/hld-template.md and writes approved architecture documents
  under docs/hld/.
${AGENTS_END}`;

export type InstallActionStatus =
  "create" | "update" | "unchanged" | "preserve";
export interface InstallAction {
  path: string;
  status: InstallActionStatus;
  reason?: string;
}
export interface InstallationManifest {
  schemaVersion: 1;
  package: string;
  version: string;
  installedAt: string;
  files: Record<string, string>;
  preserved: string[];
}
export interface InstallResult {
  dryRun: boolean;
  actions: InstallAction[];
  manifest: InstallationManifest;
}
interface SourceFile {
  source: string;
  destination: string;
}

async function walkFiles(directory: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walkFiles(candidate)));
    else if (entry.isFile()) files.push(candidate);
  }
  return files;
}

async function sourceFiles(
  projectRoot: string,
  packageRoot: string,
): Promise<SourceFile[]> {
  const files: SourceFile[] = [];
  for (const skill of SKILL_NAMES) {
    const root = path.join(packageRoot, "skills", skill);
    for (const source of await walkFiles(root)) {
      files.push({
        source,
        destination: path.join(
          projectRoot,
          ".agents",
          "skills",
          skill,
          path.relative(root, source),
        ),
      });
    }
  }
  for (const agent of AGENT_NAMES) {
    files.push({
      source: path.join(packageRoot, "agents", `${agent}.toml`),
      destination: path.join(projectRoot, ".codex", "agents", `${agent}.toml`),
    });
  }
  return files;
}

function relativeTo(root: string, filePath: string): string {
  return path.relative(root, filePath).split(path.sep).join("/");
}

async function readManifest(
  projectRoot: string,
): Promise<InstallationManifest | undefined> {
  const manifestPath = path.join(projectRoot, INSTALL_ROOT, "install.json");
  if (!(await exists(manifestPath))) return undefined;
  try {
    const value: unknown = JSON.parse(await readUtf8(manifestPath));
    if (
      typeof value === "object" &&
      value !== null &&
      (value as { schemaVersion?: unknown }).schemaVersion === 1 &&
      typeof (value as { files?: unknown }).files === "object"
    )
      return value as InstallationManifest;
  } catch {
    // A corrupt manifest must never cause an installer overwrite.
  }
  return undefined;
}

function replaceManagedSection(existing: string): string {
  const start = existing.indexOf(AGENTS_START);
  const end = existing.indexOf(AGENTS_END);
  if (start >= 0 && end >= start) {
    return `${existing.slice(0, start)}${AGENTS_SECTION}${existing.slice(end + AGENTS_END.length)}`;
  }
  return `${existing.trimEnd()}${existing.trim() ? "\n\n" : ""}${AGENTS_SECTION}\n`;
}

export async function installAgenticUtils(
  projectRoot: string,
  options: { dryRun?: boolean; packageRoot?: string } = {},
): Promise<InstallResult> {
  const root = path.resolve(projectRoot);
  const packageRoot = options.packageRoot ?? (await findPackageRoot());
  const previous = await readManifest(root);
  const actions: InstallAction[] = [];
  const files: Record<string, string> = {};
  const preserved: string[] = [];

  for (const file of await sourceFiles(root, packageRoot)) {
    const relative = relativeTo(root, file.destination);
    const sourceContent = await readUtf8(file.source);
    const sourceChecksum = checksum(sourceContent);
    let status: InstallActionStatus = "create";
    let reason: string | undefined;
    if (await exists(file.destination)) {
      const currentChecksum = await checksumFile(file.destination);
      if (currentChecksum === sourceChecksum) status = "unchanged";
      else if (previous?.files[relative] === currentChecksum) status = "update";
      else {
        status = "preserve";
        reason = "Existing file is untracked or customized.";
      }
    }
    actions.push({ path: relative, status, ...(reason ? { reason } : {}) });
    if (status === "preserve") {
      preserved.push(relative);
      if (previous?.files[relative]) files[relative] = previous.files[relative];
      continue;
    }
    files[relative] = sourceChecksum;
    if (!options.dryRun && status === "update")
      await backupFile(file.destination, root, relative);
    if (!options.dryRun && (status === "create" || status === "update")) {
      await atomicWrite(file.destination, sourceContent);
    }
  }

  const agentsPath = path.join(root, "AGENTS.md");
  const agentsRelative = "AGENTS.md";
  const existingAgents = (await exists(agentsPath))
    ? await readUtf8(agentsPath)
    : "";
  const desiredAgents = replaceManagedSection(existingAgents);
  const desiredAgentsChecksum = checksum(desiredAgents);
  let agentsStatus: InstallActionStatus = "create";
  let agentsReason: string | undefined;
  if (existingAgents) {
    const currentChecksum = checksum(existingAgents);
    if (currentChecksum === desiredAgentsChecksum) agentsStatus = "unchanged";
    else if (!previous || previous.files[agentsRelative] === currentChecksum)
      agentsStatus = "update";
    else {
      agentsStatus = "preserve";
      agentsReason = "AGENTS.md was customized after installation.";
    }
  }
  actions.push({
    path: agentsRelative,
    status: agentsStatus,
    ...(agentsReason ? { reason: agentsReason } : {}),
  });
  if (agentsStatus === "preserve") {
    preserved.push(agentsRelative);
    if (previous?.files[agentsRelative])
      files[agentsRelative] = previous.files[agentsRelative];
  } else {
    files[agentsRelative] = desiredAgentsChecksum;
  }
  if (!options.dryRun && agentsStatus === "update")
    await backupFile(agentsPath, root, agentsRelative);
  if (
    !options.dryRun &&
    (agentsStatus === "create" || agentsStatus === "update")
  ) {
    await atomicWrite(agentsPath, desiredAgents);
  }

  const manifest: InstallationManifest = {
    schemaVersion: 1,
    package: PACKAGE_NAME,
    version: PACKAGE_VERSION,
    installedAt: new Date().toISOString(),
    files,
    preserved,
  };
  if (!options.dryRun) {
    await atomicWrite(
      path.join(root, INSTALL_ROOT, "install.json"),
      `${JSON.stringify(manifest, null, 2)}\n`,
    );
  }
  return { dryRun: Boolean(options.dryRun), actions, manifest };
}
