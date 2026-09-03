# Repository guidance

This repository is the canonical source for the `codex-agentic-utils` npm package.

- Keep the package independent from `codex-spec-workflow`; do not add spec, task, or bug workflows.
- Preserve the project-local, safe installer contract and add tests for installation changes.
- Skills are opt-in and must not retain Claude paths, slash commands, or the Claude workflow CLI.
- Run `npm run verify` before publishing.
