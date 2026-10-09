# Documentation Policy (FR/EN) for Cosmic Studio

## 1) Language policy by documentation type

### Canonical language rules

- **Canonical language is English** for any document tied to code, configuration, DevOps, CI/CD, architecture, troubleshooting, and AI prompts.
- **French is prioritized** for user onboarding guides, product presentations, and internal non-technical alignment.
- **No mixed-language pages**: one page, one language, except the root `README.md` which is the repository's bilingual navigation entry point.

### Language matrix

| Documentation type                               | Default language | Notes                                            |
| ------------------------------------------------ | ---------------- | ------------------------------------------------ |
| Root technical README, setup, architecture       | English          | Primary source for contributors and agents       |
| AI prompts, agent instructions, system workflows | English          | Required for consistency with tools and models   |
| Code conventions, CI/CD, DevOps runbooks         | English          | Canonical technical reference                    |
| User onboarding guides (internal French team)    | French           | French-first, can link to English technical docs |
| Product narrative, commercial positioning, demos | French           | Audience-first content                           |
| Business glossary                                | FR -> EN         | French term with canonical English equivalent    |

## 2) Documentation folder structure conventions (GitHub)

Current structure — all `docs/` content is technical/agent-facing and stays
English-only per the language matrix above; there is no French-only content
today, so `docs/en/` and `docs/fr/` subfolders don't exist and should only be
introduced once a French human-facing doc is actually added:

```text
/
├── README.md                 # Bilingual minimal entry point (navigation + links)
├── README.en.md              # English project entry (technical)
├── README.fr.md              # French project entry (onboarding/product)
├── DOCS_POLICY.md            # This policy
├── CONTRIBUTING.md, SECURITY.md, GUIDELINES.md, DESIGN_GUIDELINE.md # English technical references
├── CLAUDE.md, AGENTS.md, .github/copilot-instructions.md            # English AI-agent instructions
└── docs/
    ├── glossary.md            # FR -> EN domain glossary
    ├── lessons.md             # Persistent AI-agent lessons log
    └── pricing-simulator.md   # Feature-specific technical reference
```

Naming conventions:

- Use lowercase kebab-case for file names under `docs/`.
- If a French human-facing guide is added, put it under `docs/fr/` and its English counterpart under `docs/en/`, keeping mirrored paths — don't mix languages in one file.
- Root-level documentation entry points may keep established names such as `README.md`, `README.en.md`, `README.fr.md`, and `DOCS_POLICY.md`.

## 3) Human docs vs agent/system docs coherence

To keep a consistent experience across human and machine consumers:

1. **Single source of truth**: technical truth lives in English docs first.
2. **Stable structure**: keep the same heading order across mirrored docs when both languages exist.
3. **Navigation parity**: each French page should link to its English counterpart (and reverse).
4. **Template parity**: use shared templates for runbooks, ADRs, and guides.
5. **Metadata discipline**: include language tags in front matter when used (`lang: en` or `lang: fr`).
6. **Prompt discipline**: prompts and agent instructions remain English-only, even when product context is French.

Recommended minimum page skeleton:

1. Purpose
2. Scope
3. Steps / Procedure
4. Validation
5. Related links

## 4) Update workflow

For each documentation change:

1. Identify document type (technical/system vs human-facing).
2. Write in the canonical language for that type.
3. Add cross-links between EN and FR equivalents when both exist.
4. Keep terminology aligned with `docs/glossary.md`.
5. `README.en.md` and `README.fr.md` are the same document in two languages: any change to one must be applied to the other in the same commit (same sections, same heading order, same content). English is canonical if they disagree.
6. Validate Markdown formatting and link integrity.

## 5) Governance

- In conflicts, **English technical documentation wins** as canonical source.
- French adaptations must preserve meaning, not redefine technical behavior.
- Any new prompt, workflow, or configuration instruction must be published in English.
