# Opus review request — T004h pre-CP1 geometry gate

Perform the independent adversarial review required by Spec 024 T004h and
FR-049. Do not edit either repository. Return severity-ranked findings, an
explicit accept/reject decision for T004h, and the minimum required
dispositions. This is not CP1 taxonomy approval and must not broaden into CP2.

## Read first

In this order:

1. `implementation-handover.md`, especially T004d1a through the T004h stop;
2. `contracts/semantic-spacing-schema.md` §7a;
3. `spec.md` FR-039 through FR-043 and FR-046 through FR-053a;
4. `tasks.md` T004d1a through T004h;
5. this request and the evidence packet below.

Newer owner rulings in those files supersede earlier review contracts where
they conflict.

## Review snapshot

- Pragma worktree:
  `H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-inside-out-geometry`
- Branch: `feat/bf-inside-out-geometry`
- Review range:
  `313ee82c13a126b779b9bd75902da5af13c28505..b10c4d541cf1e9411b3a627445aaf847e3df89d6`
- The worktree was clean when the packet was captured.
- This is the isolated exploratory spike. Do not require a rebase, merge,
  publication, PR or recut onto current `main` at this gate.

The relevant local commits in the range are:

```text
d41000e69 test(spacing): preserve T004d1a candidate measurements
5e57efadf feat(typography): align heading rhythm phases
5807711c6 test(typography): verify rendered rhythm closure
55546bef3 fix(typography): isolate rhythm guide geometry
3f3ab3911 fix(typography): anchor rhythm evidence to document
b3a96474d fix(typography): measure natural rhythm evidence
a85762ba6 fix(typography): distinguish one-line and wrapped evidence
99ce3fa36 test(spacing): capture bounded control inset evidence
049e54d2f test(typography): compare closure rhythm alternatives
b10c4d541 feat(spacing): activate semantic gap hierarchy
```

## Settled owner decisions

Review the implementation against these decisions; do not reopen them merely
because another design is possible.

1. Full in-phase closure uses the 24px Site or 20px Docs/App body rhythm, not
   only the 8px/4px baseline unit. The resulting additional blank body line
   after ordinary paragraphs and list items is accepted. The lighter closure
   remained on the baseline-unit grid but moved following text within the body
   line cycle. Margin collapse against zero block-start margins is accepted in
   the spike; component CSS must compose rather than replace the closure.
2. Shallow Section maps to the surface inset. Default, hero and deep Section
   map to the strip inset. Strip and Section share the same major inset
   magnitude; Strip applies it at both block edges, while Section applies it at
   the relevant section edge. No fifth Section inset token is introduced.
3. Gap activation is element/group/pattern = Site 8/24/64px and Docs/App
   4/16/32px. These gaps are baseline-unit aligned but are not uniformly
   body-line aligned. That risk is recorded for CP1 and must not be mistaken
   for a T004g implementation error.
4. The ten non-whole-multiple heading combinations are CP1 type-scale
   exceptions for wrapped headings. One-line alignment remains evidence for
   all 18 heading/product combinations.
5. T004d1a is bounded to Chromium DPR 1, four members, three products and roots
   16/18. The six engine/DPR matrix is deferred to CP2 under FR-046b.

## Evidence packet

Packet root:

`H:\WSL_dev_projects\temp\spec-024-t004h-review-20260928`

Top-level `manifest.json` SHA-256:

`fc725551630c54ba53a6c84e513949bf579ed95cdeaeb951a9374342c960b032`

The manifest independently revalidated at capture HEAD with no missing or
mismatched path:

- 40 changed source, test and fixture files;
- 16 persisted/path-attached T004d1a measurement JSON files;
- 16 comparison artifacts;
- 3 supporting files.

The packet contains:

- `t004d1a/`: the port-6106 Button/Chip and port-6107 Form/Select evidence,
  including the original complete manifest, 16 JSON records and comparison
  sheet. The original manifest SHA-256 is
  `0d43b3f717f0beef0184fa7f14652f36133567015b128814f9b223eb5d2ba21c`.
- `t004d2/heading-continuation-full.png`: the closure comparison evidence.
  The live story ID is `components-heading--text-stack-comparison` on port
  6106.
- `t004g/gap-scale-comparison-1600.png`: the Site/Docs/App gap hierarchy and
  actual shallow/default Section mappings. The live story ID is
  `work-in-progress-component-section--gap-scale-comparison` on port 6106.

T004d1b is an exact algebraic extraction of the existing
`(line-height + 1cap) / 2` first-baseline-offset expression into named private
per-role properties. Its inputs, metric authority and resulting nudge
expressions did not change; focused tests and the earlier independent review
accepted it as a no-geometry-change result.

## Static and focused proof

- The affected-scope padding/inset sweep returns exactly the six approved
  app-shell/fixture boundary hits recorded in the manifest.
- Private gap-channel declarations occur only in
  `packages/styles/main/src/_spike-geometry.css`.
- The carrier-introduction commit `d41000e69a7f2b096b7855b272e95ccb8909696e`
  is contained only by `feat/bf-inside-out-geometry` among local and remote
  branches at capture time.
- The range adds no `--spacing-*` declaration.
- Focused Biome checks for all T004g files, TypeScript for `ds-global` and
  `ds-global-form`, static contract checks and the Chromium DPR 1 Section/gap
  rendered check pass.
- The complete transition test files retain one known pre-existing,
  out-of-scope mismatch: their Timeline assertion expects a 12px marker, while
  the earlier shared marker-canvas implementation uses and renders 16px. T004g
  did not alter that unrelated assertion.

## Questions to answer

1. Does the block inset implementation preserve the per-edge identity and the
   measured control targets under the bounded T004d1a contract?
2. Does phase plus full body-line closure implement the accepted owner decision
   without hiding drift, scripted alignment or forced evidence geometry?
3. Is the Section surface/strip merge applied consistently, and is the
   distinction between gap ownership and inset ownership maintained throughout
   the authorised T004g slice?
4. Do the comparison artifacts show the material outcomes honestly, including
   accepted whitespace and recorded wrapped-heading/gap-rhythm limitations?
5. Is the packet and its manifest complete and internally consistent for the
   bounded T004h gate?
6. Does the unrelated Timeline assertion mismatch block this gate? If yes,
   identify the exact T004h requirement it violates; otherwise record it as a
   downstream disposition rather than expanding this spike.

Do not treat this request as evidence of acceptance. The implementing agent is
not the reviewer, and no independent review has yet been claimed.
