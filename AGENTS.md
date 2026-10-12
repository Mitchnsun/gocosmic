# AGENTS.md

Codex instructions for working in this repository.

- Read and follow `CLAUDE.md`: it is the single source of truth for AI-agent behavior in this project (setup, commands, architecture, testing, commits, PR checklist).
- It points to the companion docs that hold binding rules: `GUIDELINES.md`, `DESIGN_GUIDELINE.md`, `__tests__/TESTING.md` and `docs/lessons.md`. Consult `SECURITY.md` before touching API routes, Server Actions, environment variables, third-party scripts, CSP and security headers, or dependencies.
- Use `yarn`, never `npm`, and do not stop long-running commands early.
- Preserve user changes in the worktree: never revert files you did not intentionally change unless the user explicitly asks.
- Do not bump the version or edit the changelog for ordinary local work, only when preparing a PR or release (see the PR checklist in `CLAUDE.md`).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
