# Domain docs

This repository has one domain context. Its glossary is `CONTEXT.md` at the repository root; decisions live in `docs/adr/`.

## Before exploring or changing the codebase

Read `CONTEXT.md` and the ADRs relevant to the work. If a referenced domain document is absent, continue; `/domain-modeling` creates documents when a term or decision is resolved.

Use glossary terms in specs, issue titles, code, tests, and explanations. Treat the glossary as vocabulary rather than a feature specification. Resolve ambiguous or conflicting terms through `/domain-modeling`.

Surface conflicts with an existing ADR explicitly before proposing a different approach. Name the affected ADR and explain why it may need to change.

Keep agreed domain terms in `CONTEXT.md`, consequential trade-offs in `docs/adr/`, and feature requirements in the relevant plan, spec, or issue. Preserve the existing glossary and decisions when setting up or updating engineering skills.
