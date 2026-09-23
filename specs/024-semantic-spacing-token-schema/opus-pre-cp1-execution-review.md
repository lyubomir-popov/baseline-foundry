# Opus execution-readiness review — pre-CP1 geometry spike

**Reviewer**: Claude Opus 5, via GitHub Copilot in VS Code
**Review date**: 2026-09-22
**Custody baseline**: T004c accepted as complete; not reopened
**Verdict**: implementation may resume only after the Spec 022/024 amendments
below are recorded and the isolated spike worktree exists.

This is the execution-readiness review requested after T004c. It resolves how
T004d–T004h can run without editing the evidence reference, minting provider
properties in Pragma or crossing CP1/CP2. It is not T004h, CP1 or CP2.

## Reviewed sources

- the complete Spec 024 package;
- Pragma `feat/bf-shared-alignment` and Spec 022;
- the live 12-token design-tokens spacing source; and
- clean design-tokens worktree `feat-020b-page-grid-tokens` at `ba4db94`.

## Findings

1. Spec 022 makes production geometry in `feat/bf-shared-alignment` read-only
   during evidence closure. Spec 024 cannot edit that worktree by implication.
2. The provider has no control block-inset or `gap.element.block` role. The
   required gap rename/value changes are design-tokens work gated by CP2.
3. T004f has no target in the reference: `modifiers.density.css` is an
   intentional no-op there, and recalculating `--density-lh-*` contradicts
   FR-037b.
4. T004e would duplicate the active 020b grid-token authority.
5. The reference already breaches FR-034 by declaring
   `--spacing-gap-section-block`; deleting it closes that breach and FR-043a.
6. `--first-baseline-offset` is not published. The current 1cap expression,
   provider-authored nudge primitives and `feat/bf-metric-nudge` are competing
   possible authorities.
7. Pragma has no OS root or consumer, so this spike cannot render OS without
   inventing a surface and values.
8. The pinned-alias hard stop applies to a production foundation cut, not to
   the already-redirected historical reference state.

## Decisions

### Isolate the spike

Spec 022 continues to govern evidence. Keep `feat/bf-shared-alignment`
read-only. Create:

```text
branch:   feat/bf-inside-out-geometry
worktree: H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-inside-out-geometry
base:     313ee82c13a126b779b9bd75902da5af13c28505
```

The base is the verified T004c full-working-tree snapshot of
`feat/bf-shared-alignment`, not its dirty branch tip `e26c650c0`.

### Use one private evidence-only carrier

Create only `packages/styles/main/src/_spike-geometry.css`. It declares:

```text
--_spike-inset-control-block
--_spike-gap-element-block
--_spike-gap-group-block
--_spike-gap-pattern-block
```

Each value carries a comment naming the provider role it stands in for. No
component may read a `--_spike-*` property directly: the file binds the public
`--ds-*` contract names, and components continue to consume only that contract.
No `--spacing-*` property may be declared in Pragma.

The file is deleted and its values are transcribed into design-tokens as the
first Phase 3 act after CP2. Any `--_spike-*` occurrence outside this file, or
on a branch other than this spike, is a failure.

### Preserve the current metric authority during the spike

Extract the existing expression into
`--_typography-<role>-first-baseline-offset` in `alignment.css`:

```css
calc(
  (
    var(--typography-<role>-line-height-dimension) +
    var(--_typography-cap-unit)
  ) / 2
)
```

Rewrite the existing nudge formula to consume that property and prove the
extraction moves no geometry. This property is the single later substitution
point for real metrics. Do not adopt provider nudge primitives or merge
`feat/bf-metric-nudge` during this spike; raise the unused provider primitives
at CP2.

### Defer grid ownership and retire T004f

- T004e is deferred to Spec 020b. In the spike, delete the local
  `--grid-gutter` and `--grid-margin` redirects so Pragma stops binding them to
  a component inset; do not author replacement values.
- T004f is removed from pre-CP1. The live `origin/main`
  `modifiers.density.css`, its `--density-*` channels and ten compatibility
  aliases are mandatory T017a migration inputs.

### Defer OS values without weakening the four-product contract

Pragma has no OS product root or consumer, so no OS comparison sheet is
required in this spike. Record every new OS role value as `null`, never zero.
CP2 must resolve the OS member before provider implementation.

## Corrected sequence

1. **T004c0** — create the isolated branch/worktree above from exact recovery
   snapshot `313ee82c...`; the evidence reference remains read-only.
2. **T004d0** — create `_spike-geometry.css`, its expiry header, four private
   channels and provider-role annotations.
3. **T004d1b** — extract and publish the per-role first-baseline offset; prove
   no geometry moved.
4. **T004d** — add per-edge block inset inputs to the row contract.
5. **T004d1a** — establish every control inset by measurement: Site 40px,
   Docs/App 32px occupied; OS `null`.
6. **T004d2** — implement block-start phase and block-end closure from the
   published offset.
7. **T004g** — apply element/group/pattern, separate inset from gap, repoint
   known padding owners, delete `--spacing-gap-section-block`, and remove the
   two grid redirects without replacing them.
8. **T004h** — stop for independent adversarial review by a reviewer other than
   the implementer.

T004e is deferred to 020b. T004f is replaced by the T017a migration
disposition. Neither is an implementation step in this spike.

## Permitted scope

- **Writable repository**: Pragma only.
- **Writable worktree**: `feat-bf-inside-out-geometry` only.
- **Read-only references**: `feat/bf-shared-alignment`, design-tokens,
  canonical-spacing-spec and the 020b worktree.
- **Writable production files**:
  - `packages/styles/main/src/_spike-geometry.css`;
  - `packages/styles/main/src/component-contract.css`;
  - `packages/styles/main/src/spacing.css`, deletions only;
  - `packages/styles/typography/src/alignment.css`;
  - stylesheets for the T004g owners named in `tasks.md`.
- Audit fixtures, catalogs, pages and focused tests may change only to produce
  the required comparison sheets and measurements.

## Stop conditions

Stop on any of:

- a new `--spacing-*` declaration in Pragma;
- any edit in `feat/bf-shared-alignment`;
- any edit in design-tokens, canonical-spacing-spec or the 020b worktree;
- a `--_spike-*` reference outside `_spike-geometry.css`;
- an invented OS value or a non-null placeholder;
- an unannotated spike value;
- a push, PR, publish or release; or
- arrival at T004h without an independent reviewer.

The settled gap scale, merge principle, inset/gap distinction, density
constraint and inside-out geometry are unchanged. T004h, CP1 and CP2 remain
mandatory.
