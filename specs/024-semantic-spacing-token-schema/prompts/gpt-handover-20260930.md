# Handover – start here (2026-09-30)

You are the executing agent for Spec 024. Read this whole file before acting.
Where it conflicts with `implementation-handover.md` or `tasks.md`, this file
wins until step 2 has brought those files into line.

## Owner decision – confirmed 2026-09-30

**Components before tokens.** Pragma component families are implemented and
approved visually first. The design-tokens schema and token file come last,
transcribed from what the approved components use.

## Where things stand

- Pre-CP1 geometry (T004*) is accepted. The spike
  `feat/bf-inside-out-geometry` (tip `1c2c6ba73`) is **evidence only**: it sits
  on a stale snapshot, carries the private carrier and evidence stories, and is
  never pushed or turned into a PR (FR-050, FR-051).
- T005–T011 are complete: 169 rows bucketed, 11 candidate roles.
- **No reviewable Pragma branch exists yet.** Nothing on Pragma `main` uses the
  new spacing.
- The owner added FR-054 (owner visual gate) on 2026-09-29. Those edits are
  uncommitted in this worktree: `spec.md`, `tasks.md`, `plan.md`,
  `quickstart.md`, `implementation-handover.md`, `README.md`.
- The owner will show the work to the Pragma lead engineer through draft PRs
  on `canonical/pragma`, not through this spec package.

## Testing while the design is open

The design, rules and values are still moving. Do not write tests to prove
them yet.

- Add **no new tests or test suites**: no per-component checks, no
  measurement matrices, no static rule tests. The gallery is the evidence.
- When a change makes an existing Pragma test fail because it pins the old
  geometry, update that assertion to the new value, or delete it if it
  asserts something the new model removes. Record which, in one line, in the
  commit body.
- Run only what you need while iterating.
- Before any push, the Pragma root gate must pass: `bun run check` and
  `bun run test` from the repo root. That is Pragma's own rule, not a design
  check.
- The tests that lock the design in – including one that fails if a value in
  `spacing-roles.css` lacks a token ID – are written after the owner approves
  the design, in the token phase.

## Steps

### 1. Commit the FR-054 edits

One commit: `docs(spec-024): add owner visual gate`. Do not reword them. Do not
push.

### 2. Amend the spec for components-first

Add FR-055 to `spec.md`, marked "Owner direction, 2026-09-30":

- Component families are implemented in Pragma before the tokens are authored
  in design-tokens.
- Values live in one Pragma file, `packages/styles/main/src/spacing-roles.css`.
  It binds only `--ds-*` properties. Each value carries a comment naming the
  intended semantic token ID (for example `spacing.gap.group.block`) and its
  Site/Docs/App values; OS is `null`.
- No `--spacing-*` declarations in Pragma (FR-034 stands).
- The schema and design-tokens work (T014–T025) moves after the last family
  and transcribes `spacing-roles.css`. The transcription check is written
  then, not now.
- While the design is open, verification is the FR-054 gallery plus Pragma's
  root gate before a push. No new tests.
- CP1 (T012/T013) still reviews the taxonomy, as a working hypothesis. Family
  cuts may change it; each change is recorded in the cut's task entry.
- FR-050 and FR-051 still govern the spike, which stays evidence only.

Resequence `tasks.md`:
- CP1;
- foundation cut;
- family cuts in `recut-handoff.md` order;
- schema and tokens (current T014–T025);
- Jira.

Update the "Short answer" in `implementation-handover.md` and "Current status"
in `README.md` to match. Keep edits minimal; do not rewrite history sections.
Commit: `docs(spec-024): put components before tokens`.

### 3. Build the gallery tool and the CP1 gallery (T011a)

Write `specs/024-semantic-spacing-token-schema/scripts/build-visual-gallery.ts`
to FR-054a–f. Concretely:

- Inputs: `--gate`, `--before <sha>`, `--after <sha>`, `--packages` (any of
  `ds-global`, `ds-global-form`, `ds-app`).
- For each SHA, create a temporary Pragma worktree outside the tracked tree,
  `bun install`, then `bun run build:storybook` in each package. Remove the
  temporary worktrees afterwards. Never edit Pragma source.
- Serve each `storybook-static` on an ephemeral port; never bind 6114 or 6115.
- List stories from each build's `index.json`. Skip docs entries. Match
  before/after by story ID; a story present on one side only is listed as
  added or removed.
- Render every story at `globals=context:site`, `context:docs` and
  `context:app`: Chromium, DPR 1, 16px root, viewport 1280×900, full page,
  fonts ready. Run Playwright from Node, not Bun.
- Diff each pair with `pixelmatch`. Record the changed-pixel share and the
  rendered-height delta.
- Write one `index.html`:
  - a header with gate, both SHAs, viewport and per-package counts of changed,
    unchanged, added, removed and failed stories;
  - the "where to look" list (FR-054c);
  - changed pairs sorted by changed share, each showing before, after and
    diff, with a guide toggle (baseline unit 8/4/4px and body line 24/20/20px
    for Site/Docs/App);
  - unchanged pairs collapsed.
- Put evidence-only stories – IDs ending `-comparison` or titled
  "comparison" – in a separate labelled section.
- Write everything to `H:\WSL_dev_projects\temp\spec-024-<gate>-gallery-<yyyymmdd>\`
  with a `manifest.json` hashing every image and the page.

Keep it a plain single-file script. If a story cannot render in isolation,
list it as failed; do not patch it.

Run it for CP1: before `313ee82c13a126b779b9bd75902da5af13c28505`, after
`1c2c6ba73`, packages `ds-global,ds-global-form`. The "where to look" list
must cover:
- the added blank body line after paragraphs and list items;
- Docs/App form gaps: 8→4 between options, 48→16 between fields;
- Card, Tile, Tooltip and Popover padding;
- Section;
- ColorInput.

Link the gallery and its manifest SHA-256 from `cp1-review-packet.md` and tick
T011a. Commit: `feat(spec-024): add visual gallery generator`.

**Stop and hand back.** The owner looks at the gallery before anything else.

### 4. After the owner signs off the CP1 gallery

Two things run in parallel.

**4a. CP1 review (T012).** Prepare the Opus request with the gallery attached.
Every finding with a visible effect must cite its gallery entry. Hand the
request to the owner; you do not send it.

**4b. Foundation cut.** Sync Pragma `main` (fetch, fast-forward, both SHAs
equal), then create the branch per Pragma `AGENTS.md`:

```powershell
git worktree add -b feat/spacing-inside-out-foundation `
  .claude/worktrees/feat-spacing-inside-out-foundation origin/main
bun install
```

Port from the spike, re-derived against current `main` rather than
cherry-picked:

- the row contract's per-edge block inset term;
- typography first-baseline extraction, phase and closure, including the
  `.ds`-scoped list reset from `1c2c6ba73`;
- the `--ds-gap-*` scale and the container-gap mapping;
- `spacing-roles.css` in place of `_spike-geometry.css`, with no `--_spike-*`
  names in production.

Leave out evidence stories, spike tests and component-specific changes.

This cut changes all prose (the body-line closure) and every gap; the gallery
must show that. Build the gallery: before is the `main` SHA, after is the cut
tip, packages `ds-global,ds-global-form,ds-app`. Apply any CP1 finding that
affects the foundation before the owner's sign-off. Conventional commits.
Stop for sign-off.

### 5. First family – Commands (Button, Chip, Tabs)

Branch `feat/spacing-commands` on top of the foundation. Use the spike's
measured control insets: zero on Site, one baseline unit on Docs/App, giving
occupied 40/32/32px at a 16px root. Build the gallery: before is the
foundation tip, after is the Commands tip. Stop for sign-off.

### 6. Share with the lead engineer – only when the owner says so

- Run the Pragma root gate.
- Push both branches.
- Open **draft** PRs on `canonical/pragma`, using the PR template.
- Write descriptions that stand alone per Pragma `AGENTS.md`: no Baseline
  Foundry paths, task IDs, review files or model names. Say what the change
  does visually and why, and embed the key before/after screenshots from the
  gallery.
- Never merge. Merging to Pragma `main` triggers a release; that is the lead
  engineer's call.

Later families follow the `recut-handoff.md` order: one family, one gallery,
one owner sign-off, then the next.

## Hard stops

- No push, PR or merge unless the owner says so in the conversation.
- Never push `feat/bf-inside-out-geometry` or `test/spec-024-t008-comparison`.
- No `--spacing-*` in Pragma; no `--_spike-*` outside the spike.
- No planning or Jira files in Pragma.
- No new tests while the design is open.
- No gate or next family without the owner's gallery sign-off (FR-054).

## Hand-back format (FR-054e)

End every hand-back with exactly:

1. the gallery link, or "no visible change" with the reason;
2. what you are unsure of;
3. the decisions you need from the owner.
