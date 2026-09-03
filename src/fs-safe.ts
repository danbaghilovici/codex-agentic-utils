import {
  copyFile,
  mkdir,
  readFile,
  rename,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";

export async function exists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readUtf8(filePath: string): Promise<string> {
  return readFile(filePath, "utf8");
}

export function checksum(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export async function checksumFile(filePath: string): Promise<string> {
  return checksum(await readUtf8(filePath));
}

export async function atomicWrite(
  filePath: string,
  content: string,
): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporary = path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${randomUUID()}.tmp`,
  );
  await writeFile(temporary, content, "utf8");
  await rename(temporary, filePath);
}

export async function backupFile(
  source: string,
  projectRoot: string,
  relativePath: string,
): Promise<string> {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const destination = path.join(
    projectRoot,
    ".codex-agentic-utils",
    "backups",
    stamp,
    relativePath,
  );
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);
  return destination;
}
