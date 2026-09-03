import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { AGENT_NAMES, SKILL_NAMES } from "../src/constants.js";

const root = path.resolve(import.meta.dirname, "..");

describe("Codex asset contracts", () => {
  it("has valid opt-in skills without Claude references", async () => {
    for (const name of SKILL_NAMES) {
      const skill = await readFile(
        path.join(root, "skills", name, "SKILL.md"),
        "utf8",
      );
      const metadata = await readFile(
        path.join(root, "skills", name, "agents", "openai.yaml"),
        "utf8",
      );
      expect(skill).toMatch(new RegExp(`^---\\nname: ${name}\\n`));
      expect(skill).toMatch(/\ndescription: .+\n---\n/);
      expect(skill).toContain(`$${name}`);
      expect(skill).not.toContain(".claude/");
      expect(skill).not.toContain("claude-code-spec-workflow");
      expect(metadata).toContain("allow_implicit_invocation: false");
    }
  });

  it("ships only the four non-spec custom agents", async () => {
    expect((await readdir(path.join(root, "agents"))).sort()).toEqual(
      AGENT_NAMES.map((name) => `${name}.toml`).sort(),
    );
    for (const name of AGENT_NAMES) {
      const agent = await readFile(
        path.join(root, "agents", `${name}.toml`),
        "utf8",
      );
      expect(agent).toContain(`name = "${name}"`);
    }
  });

  it("uses conventional paths and numbered output names", async () => {
    const adr = await readFile(
      path.join(root, "skills", "adr-create", "SKILL.md"),
      "utf8",
    );
    const hld = await readFile(
      path.join(root, "skills", "hld-create", "SKILL.md"),
      "utf8",
    );
    expect(adr).toContain("docs/adr/ADR-NNNN-kebab-title.md");
    expect(hld).toContain("docs/hld/HLD-NNNN-kebab-title.md");
  });
});
