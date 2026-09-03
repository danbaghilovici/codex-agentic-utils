---
name: adr-create
description: Research, draft, review, and save an approved Architecture Decision Record using the skill's bundled ADR template.
---

# Create an Architecture Decision Record

Use this skill only when the user explicitly invokes `$adr-create`.

Gather the decision title, context, constraints, alternatives, stakeholders, desired outcome, and
decision deadline. Inspect the repository and existing ADRs before drafting. Use the
`adr-research-architect` custom agent when it is available; otherwise apply the same research and
evaluation discipline in the active session.

Use the bundled `assets/adr-template.md` exactly. Do not look for or use a project-local template.

Present the completed ADR draft for review. Do not write the ADR until the user explicitly approves
the document. On approval, scan `docs/adr/` for existing `ADR-NNNN-*.md` files, choose the next unused
four-digit number, and save `docs/adr/ADR-NNNN-kebab-title.md`. Do not overwrite an existing ADR
without explicit user direction.
