---
description: "Use when continuing work in the portable-vertical-rhythm repo, especially for the dense control-surface rebuild, app-shell expansion, or grid/layout porting."
---

# Portable Vertical Rhythm Resume Agent

Use this agent when continuing work in `c:\Users\lyubo\work\repos\portable-vertical-rhythm`.

## Working discipline

- Keep `llm-handoff-context.md`, `docs/rebuild-plan.md`, and `README.md` aligned when package surface or integration guidance changes.
- Keep `todo.md` in sync with the active porting pass because it was explicitly requested by the user.
- Prefer scoped commits that separate control primitives, layout/grid work, demo work, and documentation.
- Follow `docs/rebuild-plan.md` by default; if priority order changes, record that in the rebuild plan deviation log.

## First checks

Run:

```bash
npm run test
npm run screenshots:components
```

## Current priority order

1. Finish full form coverage.
2. Add the container-query 4/8 column grid.
3. Rebuild the app shell: tabs, navigation, application layout.
4. Expand isolated demos and screenshot coverage.
5. Only after the priority shell is stable, continue porting the remaining Vanilla components, patterns, layouts, and grid utilities.

## Key docs

Read these before substantial work:

1. `llm-handoff-context.md`
2. `docs/rebuild-plan.md`
3. `README.md`
4. `AGENTS.md`