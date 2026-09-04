---
name: hld-create
description: Produce an approval-gated high-level and low-level architecture design using the skill's bundled HLD template.
---

# Create a High-Level Design

Use this skill only when the user explicitly invokes `$hld-create`.

Gather the scope, goals, non-goals, functional and non-functional constraints, dependencies,
stakeholders, and success criteria. Inspect the actual repository before drafting. Use
`hld-architect` to prepare the high-level design and `hld-reviewer` to review it when those custom
agents are available; otherwise retain their roles in the active session.

Use the bundled `assets/hld-template.md` exactly. Do not look for or use a project-local template.

Present only the high-level sections and review findings first. Ask explicitly for approval before
starting low-level design. After approval, complete the low-level sections. When the repository or
proposed implementation uses NestJS, request `nestjs-expert` validation and incorporate or surface
its findings; otherwise state that NestJS validation is not applicable.

Save the completed design as a review proposal in the repository-root `HLD/` directory and request
final approval. Do not write the final HLD under `docs/hld/` before that approval. On approval, scan
`docs/hld/` for `HLD-NNNN-*.md`, choose the next unused four-digit number, and promote the approved
proposal by moving it to `docs/hld/HLD-NNNN-kebab-title.md`: verify the destination was saved
successfully, then delete that specific source proposal. Do not leave a duplicate in `HLD/`, do not
delete unrelated proposals there, and do not overwrite an existing HLD without explicit user
direction.
