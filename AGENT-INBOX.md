# Agent Inbox

Machine-generated handoffs, long diagnostics, and cross-repo follow-up notes go here.

Do not use this file for user notes. User-authored async notes belong in `INBOX.md`.

The agent should triage anything durable from this file into `TODO.md`, `ROADMAP.md`, `STATUS.md`, `HISTORY.md`, or `docs/specs.md`, then empty this file back to this header template.

## 2026-04-29 - portfolio top-navigation baseline follow-up

- Downstream repo: `portfolio`
- Context: portfolio is already using BF-owned `bf-top-navigation` markup, not a leftover bespoke nav. The remaining defect was measured on both the live portfolio route and the isolated `/demo/bf-top-navigation` demo.
- Current BF behavior measured downstream and in the local BF demo: `.bf-top-navigation-row` resolves to `50px` total height because BF sets `min-block-size: 48px` and `padding-block: 1px`; the underline/rule lives on the full-width `.bf-top-navigation` container via inset box-shadow rather than the inner content-width shell.
- Downstream workaround landed in `portfolio`: local shell class removes the extra row padding and moves the underline onto the fixed-width inner shell so the bar is `48px` tall and the rule aligns with the page content width.
- Requested upstream follow-up: review whether BF's default top-navigation contract should itself resolve to an exact baseline multiple and whether the underline should live on an inner width shell (or have a first-class modifier for that) instead of always spanning the viewport width.
- Useful repro: compare `portfolio` live route `/about` before/after the local override and the current BF demo route `/demo/bf-top-navigation` in portfolio, which still reflects the upstream default behavior.

## 2026-04-29 - a4-generator designer shell follow-up

- `a4-generator` removed its local designer stylesheet to satisfy a strict BF-only UI invariant.
- Existing BF primitives were enough for a dark `bf-application` + `bf-main` + pinned `bf-aside` + `bf-panel` shell.
- The missing piece relative to `brand-layout-ops` is a first-class BF top-navigation application shell. `brand-layout-ops` still carries repo-local CSS for `.bf-application.is-top-navigation-shell`, pinned-aside grid areas with `.bf-top-navigation`, full-height shell sizing, and related top-navigation dropdown row refinements.
- Request: promote that shell contract into BF so downstream repos can get the Brand Layout Ops layout without adding local UI CSS.
- Desired contract: BF-owned layout/styling for `.bf-application.is-top-navigation-shell` with `.bf-top-navigation`, `.bf-main`, optional pinned `.bf-aside`, full-height application sizing, and the required dark-theme top-navigation/dropdown affordances.
- Once BF owns that contract, `a4-generator` can switch from its current BF-native fallback shell to the same top-navigation structure used by `brand-layout-ops` without violating the no-local-CSS invariant.