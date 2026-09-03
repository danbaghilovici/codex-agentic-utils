import path from "node:path";

import { AGENT_NAMES, INSTALL_ROOT, SKILL_NAMES } from "./constants.js";
import { checksumFile, exists, readUtf8 } from "./fs-safe.js";
import type { InstallationManifest } from "./installer.js";

export interface DoctorFinding {
  level: "info" | "warning" | "error";
  check: string;
  message: string;
}

export async function runDoctor(projectRoot: string): Promise<DoctorFinding[]> {
  const root = path.resolve(projectRoot);
  const manifestPath = path.join(root, INSTALL_ROOT, "install.json");
  if (!(await exists(manifestPath))) {
    return [
      {
        level: "error",
        check: "installation",
        message: "No codex-agentic-utils installation manifest found.",
      },
    ];
  }
  let manifest: InstallationManifest;
  try {
    manifest = JSON.parse(await readUtf8(manifestPath)) as InstallationManifest;
  } catch {
    return [
      {
        level: "error",
        check: "manifest",
        message: "Installation manifest is not valid JSON.",
      },
    ];
  }
  const findings: DoctorFinding[] = [];
  for (const relative of Object.keys(manifest.files)) {
    const filePath = path.join(root, relative);
    if (!(await exists(filePath))) {
      findings.push({
        level: "error",
        check: "managed-file",
        message: `${relative} is missing.`,
      });
    } else if ((await checksumFile(filePath)) !== manifest.files[relative]) {
      findings.push({
        level: "warning",
        check: "managed-file",
        message: `${relative} was customized.`,
      });
    }
  }
  for (const skill of SKILL_NAMES) {
    const file = path.join(root, ".agents", "skills", skill, "SKILL.md");
    if (!(await exists(file)))
      findings.push({
        level: "error",
        check: "skill",
        message: `${skill} is not installed.`,
      });
  }
  for (const agent of AGENT_NAMES) {
    const file = path.join(root, ".codex", "agents", `${agent}.toml`);
    if (!(await exists(file)))
      findings.push({
        level: "error",
        check: "agent",
        message: `${agent} is not installed.`,
      });
  }
  if (findings.length === 0)
    findings.push({
      level: "info",
      check: "installation",
      message: "Skills and agents are installed and unchanged.",
    });
  return findings;
}
