---
name: hld-create
description: Produce an approval-gated high-level and low-level architecture design using the project's conventional HLD template.
---

# Create a High-Level Design

Use this skill only when the user explicitly invokes `$hld-create`.

Gather the scope, goals, non-goals, functional and non-functional constraints, dependencies,
stakeholders, and success criteria. Inspect the actual repository before drafting. Use
`hld-architect` to prepare the high-level design and `hld-reviewer` to review it when those custom
agents are available; otherwise retain their roles in the active session.

Use `docs/hld/hld-template.md` exactly when it exists. If it is missing, offer to copy the bundled
`assets/hld-template.md` to that conventional path and wait for explicit confirmation before writing
the template.

Present only the high-level sections and review findings first. Ask explicitly for approval before
starting low-level design. After approval, complete the low-level sections. When the repository or
proposed implementation uses NestJS, request `nestjs-expert` validation and incorporate or surface
its findings; otherwise state that NestJS validation is not applicable.

Present the complete design and request final approval. Do not write the document before that
approval. On approval, scan `docs/hld/` for `HLD-NNNN-*.md`, choose the next unused four-digit number,
and save `docs/hld/HLD-NNNN-kebab-title.md`. Never overwrite an existing HLD without explicit user
direction.
