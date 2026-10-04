# Opus checkpoint A2 final correction review request

Review the bounded corrections from `opus-A2-correction-review.md`. This is a
narrow final pass; do not repeat findings already marked discharged unless the
new changes regress them. Do not infer owner visual sign-off.

## Reviewer instruction

Act as the Opus reviewer for the final checkpoint A2 corrections. Write
`opus-A2-final-review.md` beside this request. Record the actual model
identity and reviewed commits. State whether P1-A, P2-A, and P3-A are
discharged, and whether the P1-A/P3-B checkpoint-C obligations are correctly
recorded. Give an accept / accept with bounded corrections / reject verdict.

## Scope

Worktree:
`H:\WSL_dev_projects\baseline-foundry-worktrees\feat-024-semantic-spacing-token-schema`

Branch: `feat/024-semantic-spacing-token-schema`

- `115c7f3` — render Site 34px/32px and Docs/App 42px/40px/44px surface
  comparisons directly;
- `733cc8a` — record the first correction review;
- `029937e` — restore forced-colours boundaries after BF mouse-focus resets;
- `e23e303` — document generated-style reproduction, correct the fidelity
  claim, and carry focus-reset and slot-update obligations into checkpoint C;
- `10e9738` — apply the same mouse-boundary restoration to the range owner.

Review with:

```powershell
git show 115c7f3
git show 029937e 10e9738 -- specs/024-semantic-spacing-token-schema/benches/strokes/styles.css
git show e23e303 -- specs/024-semantic-spacing-token-schema/benches/README.md specs/024-semantic-spacing-token-schema/tasks.md
```

## Finding disposition

### P1-A · mouse-focused forced-colours boundary

The forced-colours cascade now restores a 1px inset boundary for
`.stroke-owner:focus:not(:focus-visible)` at specificity above BF's reset.
The range has an equivalent rule because it is a pseudo-element-owned native
control rather than a `.stroke-owner`.

The thick outline is limited to `:focus-visible`, the static evidence class,
and `.select-owner:focus-within`, whose wrapper owns select paint. Generic
`:focus-within` no longer thickens every owner.

The driver mouse-clicks the uniform button, composed button, mixed field,
nested chip, text input, textarea, select, and range under forced-colours
emulation. Every owner must keep an outline; mouse-only owners must retain the
ordinary boundary width and offset. Keyboard focus and range operation remain
covered separately.

### P2-A · generated stylesheet reproduction

`benches/README.md` requires `npm run build:theme` before review. It records
BF source commit `c97ae4fca21ee1e87d23b208951abe3ed61a223f` and the generated
`dist/styles.css` SHA-256:
`41562b85745135ac4bcd35581bb608098ce1e18abd777d6cd0d4dcee5eac0934`.

The evidence driver runs that build before launching Chromium and fails if the
build fails or the fresh stylesheet hash differs.

### P3-A and checkpoint-C obligations

The README and task now say precisely that BF supplies component classes,
colour channels and typography while the concept bench locally authors the
experimental padding, line-height, widths and radii.

T026b now requires production hover, focus, invalid, selection and elevation
rules to update named slots. It also requires forced-colours overrides for
every production `outline: none` focus reset: mouse focus keeps the boundary,
`:focus-visible` owns thick focus, and only wrapper paint owners may use
`:focus-within`.

## Evidence

Live surface explanation:
<http://127.0.0.1:8797/specs/024-semantic-spacing-token-schema/benches/surface-insets/>

Live stroke bench:
<http://127.0.0.1:8797/specs/024-semantic-spacing-token-schema/benches/strokes/>

Evidence root:
`H:\WSL_dev_projects\temp\spec-024-stroke-bench-a2-final-20261004\`

Manifest SHA-256:
`c617b3367fdbaa4960754bfa5fe8836d75aae637873a0258b584a49a650d1d4f`

Four separate Chromium 151 launches at scale 1, 1.25, 1.5 and 2 pass
1,095/1,095 checks with no page or HTTP errors. The packet retains the
range-pixel checks, state ownership, independent slots, dense-host failure
mode, geometry stability and square/rounded crops, and adds the generated
stylesheet build gate plus 50 mouse-focus assertions.

## Pending after an accept

- Owner visual sign-off.
- Owner choice of 4px or 8px for the Docs/App standard start inset.
- FR-058 square painted versus occupied box.
- Real Windows contrast-theme keyboard and mouse checks in Chromium and
  Firefox.
- Safari coverage.

If the final corrections pass, state separately that normal and emulated
forced-colours evidence are ready for owner review. Do not grant owner sign-off.
