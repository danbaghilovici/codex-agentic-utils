# Codex Agentic Utils

Reusable Codex skills and specialist agents for architecture decisions and design documents. It is
intentionally complementary to [`codex-spec-workflow`](https://github.com/danbaghilovici/codex-spec-workflow):
this package does not install specification, task-execution, or bug-fix workflows.

## Install into a project

Requires Node.js 20+ and the Codex CLI.

```bash
npm install -g codex-agentic-utils
cd /path/to/project
codex-agentic-utils install --dry-run
codex-agentic-utils install
codex-agentic-utils doctor
```

The installer places skills in `.agents/skills`, custom agents in `.codex/agents`, and a small
managed section in `AGENTS.md`. It records checksums in `.codex-agentic-utils/install.json`, preserves
unmanaged or customized files, and backs up managed updates.

## Use

Invoke the skills explicitly in Codex:

```text
$adr-create Evaluate whether to use PostgreSQL or DynamoDB for audit data.
$hld-create Design a tenant provisioning service.
```

`$adr-create` uses its bundled `assets/adr-template.md` and writes approved documents as
`docs/adr/ADR-NNNN-kebab-title.md`. When the approved proposal is stored in the repository-root
`ADR/` directory, it is moved there and the source proposal is removed after the destination is saved.
`$hld-create` uses its bundled `assets/hld-template.md` and writes approved documents as
`docs/hld/HLD-NNNN-kebab-title.md`. The skills do not look for project-local templates.

The package also installs four custom agents for direct use: `adr-research-architect`,
`hld-architect`, `hld-reviewer`, and `nestjs-expert`.

## Update and diagnose

```bash
codex-agentic-utils update --project /path/to/project
codex-agentic-utils doctor --project /path/to/project --json
```

## License

MIT. See [LICENSE](LICENSE).
