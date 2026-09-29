# T008 current-main comparison evidence

T008 was rerun from synced Pragma `main`; it is not inferred from the
historical T004 spike. The local evidence branch is non-mergeable and MUST NOT
be pushed, merged, published or used as a production base.

## Source identity

- Repository: `canonical/pragma`
- Branch: `test/spec-024-t008-comparison`
- Base/local main/origin main:
  `90386bfbfb170fbabc1a306e425470cdc41c6494`
- Capture HEAD: `6acc5a29c9f3ed57846d207155548eb0afcf887c`
- Capture status: clean
- Changed paths: one comparison story, its story-only CSS and one collector
- Browser: Chromium `149.0.7827.55`, DPR 1, 1600px viewport

There is no production-source edit. The evidence CSS is imported only by the
comparison story and is labelled in the sheet as a current-main-derived
candidate.

## Comparison sheets

Each product sheet contains three top-aligned, heterogeneous rows:

1. Button / Chip / KeyboardKey, led by Button, for boxed text;
2. paragraph / Field Label / InlineCode, led by paragraph, for unboxed text;
3. Card / Tile / Tooltip, led by Card, for framed and painted surfaces.

Pink rules show the candidate product baseline and blue rules show body-line
rhythm. The collector appends an inline zero-size marker to the real text owner
in each component. All nine product-by-row groups measure `0px` first-baseline
spread.

The external-row controls keep equal start/end padding and put closure in
`margin-block-end`. Their measured geometry is:

| Product | painted | trailing compensation | occupied target |
|---|---:|---:|---:|
| Site | 36.906px | 3.088px | 39.994px |
| Docs | 30.281px | 1.702px | 31.983px |
| App | 30.281px | 1.702px | 31.983px |

The collector separately asserts each padding edge against semantic inset +
cap nudge - that edge's actual border. It accepts at `0.02px`, covering the
recorded Chromium fractional-rounding loss without becoming the general CP1
metric bound.

Card's 1px frame resolves to 7px block and 15px inline padding; borderless Tile
and Tooltip resolve to 8px block and 16px inline padding. Thus every outside
surface edge is 8px block / 16px inline in this bounded sheet. The sheet uses a
single-content Card deliberately: it does not adjudicate the open
Card/Modal/SidePanel section-seam decision or whether major overlays need a
surface-role breaker.

Site's candidate guide is 8px while the pinned legacy aliases
`--space-baseline` and `--baseline-height` remain 4px. That is intentional:
the sheet exercises the proposed Site rhythm without redirecting an unmigrated
legacy alias.

## Mechanical evidence

The collector resolves all nineteen FR-033 aliases to pixels in the product
root and an adjacent candidate root. Before/after values are equal and also
match pinned current-main values in all three products:

- nine foundation/page aliases: `--space-baseline`, `--baseline-height`, the
  three `--container-gap-*` aliases, both `--component-padding-*` aliases,
  `--grid-gutter` and `--grid-margin`;
- ten published pre-namespace compatibility aliases:
  `--lh-{comfy,dense}`, `--pad-inline-{comfy,dense}` and
  `--space-{lg,md,sm}-{comfy,dense}`.

The unmigrated sentinel is RangeInput. Its TSX and CSS blobs are pinned and
absent from the branch diff. Two RangeInput instances in the same runtime - one
outside and one inside `.t008-candidate` - have equal normalized input
rectangle, four borders, four paddings, four margins and output-text X/Y ink
offsets in every product. This is selector-containment evidence, not a
cross-commit baseline comparison.

The collector refuses a dirty worktree or any mismatch among merge base, local
`main` and `origin/main`. It writes the six PNG/measurement artifacts first,
then records each artifact's byte length and SHA-256 in the manifest.

## Artifact identity

Evidence directory:

```text
H:\WSL_dev_projects\temp\spec-024-t008-current-main-20260929-final2
```

Recovery archive:

```text
H:\WSL_dev_projects\temp\spec-024-t008-current-main-20260929-final2.zip
```

- Manifest SHA-256:
  `0946c4f00e6c7622595b21ece96a644c58c33d20aa580e91429de277ac8b5fb2`
- Archive SHA-256:
  `b848067a409fe50ee07397a7d99d010dbc98fc8f9f752ec7d7b0c238941228f7`
- Archive size: 217,581 bytes

The adjacent JSON is the machine authority; the PNGs are the bounded human and
agent evidence required by FR-046.

## Reproduction

Run the form Storybook on port 6007 from the evidence worktree, then run from
the Pragma repository root:

```powershell
node scripts/spec-024-t008-capture.mjs `
  --base-url http://127.0.0.1:6007 `
  --output H:\WSL_dev_projects\temp\spec-024-t008-current-main-20260929-final2
```

Node is intentional: Bun's Playwright transport hung before the browser
handshake in the recorded environment. Bun remains the package runner. The
collector fails on provenance drift, alias drift, a baseline spread above
`0.5px`, an occupied-control miss above `0.02px`, a per-edge equation failure,
a surface-edge equation failure, a changed sentinel source or changed
normalized sentinel geometry.
