# Agent Inbox

Machine-generated handoffs, long diagnostics, and cross-repo follow-up notes go here.

Do not use this file for user notes. User-authored async notes belong in `INBOX.md`.

The agent should triage anything durable from this file into `TODO.md`, `ROADMAP.md`, `STATUS.md`, `HISTORY.md`, or `docs/specs.md`, then empty this file back to this header template.

## Forward-port BF main cleanup and downstream portability

Continue from `baseline-foundry` `main` only.

### Goal

Move the useful May Baseline Foundry integration work onto `main` cleanly, without reviving `panel`, and realign all downstream repos to the intended `os` and `app` model while matching the old `panel` behavior and density that were validated on `master`.

### Critical architectural rule

`panel` was intentionally phased out. `os` replaces `panel`. The preferred public surfaces are `os` and `app`. Do not bring `panel` back as a first-class design contract just to preserve a temporary sync state. Instead, use `os` and `app` on `main` to reproduce the old `panel` look and behavior that existed on `master`.

### Branch mess to account for

- `baseline-foundry` `main` is the source of truth and the remote default branch.
- `baseline-foundry` `master` diverged from `main` at `914394d` on `2026-04-03`.
- `main` has many unique commits beyond that split; `master` had a short May burst layered on older divergence.
- The `master`-only May commits were:
  - `77ff707` on `2026-05-09`: docs note only
  - `31836d5` on `2026-05-10`: workspace and machine-transfer housekeeping
  - `f448bc1` on `2026-05-11`: the only `master`-only commit with substantive BF code value
  - `6964b66` on `2026-05-11`: handoff docs only
  - later docs note on `master`: `eec1a5c`
- Do not cherry-pick those commits verbatim onto `main`. They conflict on top of `main`. Treat `f448bc1` as a behavioral reference only. Drop the rest.
- Downstream repos were temporarily aligned against a `master`-based BF state. That temporary state included a `panel`-based compatibility path. That is not the target architecture.
- The downstream reference commits from that temporary sync pass were:
  - `baseline-foundry`: `f448bc1`
  - `brand-layout-ops`: `6d8d9e0`
  - `a4-generator`: `89185a4`
  - `diagram-generator`: `679599b`
- Use those commits only as behavioral references for what needs to survive. Do not preserve them as history.

### Progress update (2026-05-11, local)

- The BF-side `main` forward-port work listed below is now landed locally and validated through `npm run build:theme && npm run test:build` (`3680` checks green).
- The completed BF-side slices cover:
   - split action-vs-field inline padding tokens in source and built contract
   - field-token-driven `bf-search-box` and `bf-search-and-filter` trailing-control sizing
   - top-navigation dropdown/search-toggle slot sizing moved off hard-coded baseline multiples
   - shared authoring-accent variables wired into the pinned-aside resize handle contract
- The remaining migration work is downstream follow-up on top of this BF state, not more BF parity work.

### Required BF work on `main`

1. Implement split inline padding tokens for action and navigation surfaces versus field and value surfaces.
   - Emit `controlInlinePaddingAction` and `controlInlinePaddingField` in the built contract.
   - Keep the legacy `controlInlinePadding` alias only if compatibility requires it, and document it as compatibility rather than the preferred API.
   - Apply the intended values:
     - editorial and documentation: `1rem` action, `0.5rem` field
     - app and os: `0.5rem` action, `0.25rem` field
2. Make search-box sizing derive from the field token.
   - This includes search-field padding and trailing-control sizing.
   - The purpose is to prevent the overlap and regression seen earlier in dense tiers.
3. Add shared authoring-accent variables for the gold selection and resize chrome.
   - Cover accent, hover, line, strong line, outline, stronger outline, shadow, and focus ring.
   - Wire BF resize and authoring surfaces to those shared variables so downstreams stop hardcoding their own gold variants.
4. Preserve the `os` and `app` surface model.
   - Do not reintroduce `panel` as a first-class preset.
   - If a temporary compatibility alias is absolutely unavoidable for migration, make it explicit, temporary, documented, and clearly subordinate to `os`.
   - The preferred end state is that downstreams consume `os` or `app` directly, not `panel`.
5. Update or add build-time validation so the new `main`-based contract is exercised and not left implicit.

### Required downstream follow-up

1. Brand Layout Ops must stop depending on `panel` as a design concept.
   - Move it onto the correct `main`-based BF contract using `os` where the old `panel` usage lived.
   - Match the old `panel` density, spacing, and shell behavior from `master` without restoring `panel` itself.
   - Use `app` only where `app` is truly the intended surface.
2. A4 Generator must do the same.
   - Move from the temporary `panel`-based sync state to the correct `os` or `app` usage on top of BF `main`.
   - Match the old `panel` density and interaction feel from `master` without restoring `panel` itself.
3. Diagram Generator must continue to work for people who do not have access to private BF.
   - Keep the sibling-preferred plus vendored fallback model.
   - Update the vendored fallback to match the new `main`-based BF contract.
   - Do not leave it coupled to the old `panel` export shape.
   - Its `os`-based fallback should visually match the old `panel` surface that was validated on `master`.
4. Refresh all vendored BF snapshots or exported assets after the BF `main` changes land.
5. Rebuild and validate all downstream repos after the sync.

### Validation expectations

- Baseline Foundry must build cleanly and prove the new token, search-field, and authoring-accent contract.
- Brand Layout Ops must build cleanly and keep its shell and authoring chrome consistent.
- A4 Generator must build cleanly and keep its designer shell consistent.
- Diagram Generator must run without private BF present, using vendored fallback assets that match the new BF `main` contract.
- Do a visual sanity check across downstreams for:
  - action versus field padding
  - search-field spacing
  - selection and resize gold chrome
  - shell consistency
   - parity with the old `panel` look and density from `master`, now expressed through `os` and `app`
  - no regressions caused by replacing the temporary `panel` path with `os` or `app`

### Branch cleanup guidance

- Do not delete `master` until `main` fully contains the intended behavior through fresh forward commits.
- After the BF `main` migration and all downstream updates are complete and validated, summarize exactly what moved, what was intentionally dropped, and why.
- Once `main` is proven to supersede the temporary `master`-only work, branch cleanup can happen safely.
- If branch cleanup is requested after that, delete `master` only after confirming that `main` contains the desired BF behavior and the downstream repos have been resynced from it.

### Deliverables

1. Fresh commits on `baseline-foundry` `main` that forward-port the useful May BF work without resurrecting `panel`.
2. Fresh downstream commits that consume that new `main`-based contract cleanly.
3. Short documentation updates explaining:
   - `os` replaces `panel`
   - the `master`-only commits were not replayed verbatim
   - the migration was done as a clean forward-port on top of `main`
4. A final summary listing the exact new commits on `baseline-foundry`, `brand-layout-ops`, `a4-generator`, and `diagram-generator` that contain the migrated state.