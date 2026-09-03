import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export async function findPackageRoot(): Promise<string> {
  const fromModule = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
  );
  try {
    await access(path.join(fromModule, "package.json"));
    return fromModule;
  } catch {
    throw new Error("Unable to locate the codex-agentic-utils package root.");
  }
}
