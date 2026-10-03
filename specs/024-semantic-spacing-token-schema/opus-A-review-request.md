# Opus checkpoint A review request

Checkpoint A is ready for an independent adversarial review. The implementing
agent has stopped. No checkpoint B–E work, production recut, push, PR or
publication has been performed in this handover run. Do not treat the checks
below as the independent review required by FR-048.

## Start here

Act as adversarial reviewer for Spec 024/026 checkpoint A. Read
`H:\WSL_dev_projects\baseline-foundry\AGENT-INBOX.md` (handover 2026-10-03)
and this request, verify against the cited FRs and actual diffs, and write
`opus-A-review.md` beside this file. Record your actual model identity, the
reviewed commits, findings with severity and reproduction steps, and an
accept / accept with bounded corrections / reject verdict.

The handover is in BF's main checkout, not this worktree's older inbox. Preserve
its uncommitted edits. Review the supplied specification changes as governing
inputs; committing them did not constitute independent review of their author.

## Exact identities and scope

| Item | Identity |
|---|---|
| Spec 024 worktree | `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-024-semantic-spacing-token-schema` |
| Branch | `feat/024-semantic-spacing-token-schema` |
| Spec 024 supplied-rulings commit | `a162a166b49c3ecc96e275478172dfc7e294ac04` |
| Checkpoint A implementation commit | `648adb55f95c114f42c2ef3b6c18b2cda8571168` |
| Spec 026 supplied-rulings commit | `2307c18ffdca71602522e582eeac30af822450d7` |
| Spec 026 worktree | `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-026-body-line-text-phase` |

Review the implementation diff:

```powershell
git diff a162a166b49c3ecc96e275478172dfc7e294ac04 648adb55f95c114f42c2ef3b6c18b2cda8571168 -- specs/024-semantic-spacing-token-schema/benches specs/024-semantic-spacing-token-schema/tasks.md
```

The later commit containing this request changes review documentation only.
Spec 026 has only its supplied R11–R15 committed; its implementation is unchanged.
The canonical-spacing-spec drafts and BF main inbox remain uncommitted user work.
The temporary demo source is preserved outside git.

## Governing requirements

Read Spec 024 FR-039b, FR-039b3, FR-039c, FR-043c, FR-043d, FR-043e,
FR-048, FR-054e, FR-054h and FR-056–FR-061, and task T011c. Read spacing draft
§2.8.2–2.8.4 and §3.3 at
`H:\WSL_dev_projects\canonical-spacing-spec\specs\spacing\draft.md`.
The type scale is
`H:\WSL_dev_projects\canonical-spacing-spec\specs\type scale\draft.md`.
Spec 026 R11–R15 provide the later BF boundary; there is no BF production change
to review at A. FR-054g's real commit-based review generator belongs to D.

## What changed

- `benches/index.html` lists all six concept decisions and their approval state.
  It separately identifies the written CP1 decisions left for B.
- `body-phase/` ports the supplied demo. Relative shift, closure-only after
  headings and JS line-count layout are removed. Type-scale / nearest / upward
  leading, three tiers, three column widths, both grid overlays and outlines stay.
  The page initially shows body phase so the pending Site leading is immediately
  visible. Its class name is only an internal specimen selector, not a public API.
- The other pages isolate control rows and FR-058 variants, FR-060 surface sizes,
  FR-043c gaps / FR-061 seams, FR-059 continuation and FR-057 governed density.
- Layout alternatives are CSS rules selected by native radios or checkboxes.
  Each specimen is rendered once. Shared `measure.js` only reads geometry and
  writes diagnostic outputs; static body-phase markers likewise require no JS.
- Font URLs load BF's existing tracked Ubuntu Sans asset over HTTP. No font
  binary, Pragma source, production stylesheet or provider token is added.
- `benches/README.md` records inputs, source routing, limits and unresolved
  hypotheses. `tasks.md` records evidence and leaves T011c unchecked pending review.

## Review pressure points

1. **CSS-only layout.** Disable JavaScript and check that selecting each alternative
   still works. Ensure diagnostics do not feed line counts, cap ratios or offsets
   back into layout. The original JS class insertion and marker insertion are now
   static markup.
2. **Body anchor and closure.** The concept uses local `1cap`, not the original
   canvas ratio. `--A` is a registered length evaluated at the stage's body font
   size; descendants must not reinterpret it in heading cap units. Nudges snap to
   1/64px, with equal negative cancellation. Inspect occupied paragraphs and
   baseline drift through wrapped headings. The unsnapped type-scale comparison
   intentionally cannot promise phase after wrapping.
3. **Tolerance.** Badges show actual residuals and use FR-043d's under-1px bound,
   replacing the original demo's 0.5px display threshold. No whole-pixel renderer
   correction or compensating fudge is introduced. BF's metric engine is not
   implemented or certified by this cap-proxy bench.
4. **Heading choices.** Site H3/H4 remain pending at 24/24 versus 24/48; Docs H3/H4
   and App H2 demonstrate 24/40. The ordinary 24/32 alternative is shown as a
   comparison, not accepted for CSS-only body phase. No typography token changes.
5. **Action square.** Leading-icon actions retain each tier's action inset.
   Icon-only actions have equal block/inline padding around a square mark canvas;
   square means the painted box. Their trailing compensation is still outside
   it and belongs to occupied-row geometry.
6. **Surface ambiguity.** The owner's 16px standard starting value is shown in
   all tiers, while existing Docs/App action insets are 12px. This is explicitly
   pending confirmation, not an action-token change. Compact block edges use the
   field-inline magnitude as a labelled hypothesis; no field block role exists.
   Major overlay gutters show 32px; their block edges are deliberately held at
   the prior candidate because the ruling specifies gutters only.
7. **Seams and density.** Plain sections have no block padding in the proposal;
   the parent owns a group gap. Filled child surfaces keep their own padding.
   The density specimen preserves the plain host size at constant body font
   size, and requesting the deprecated class does nothing in the proposal.
8. **Claims and boundaries.** "Current model" means the bounded old proposal
   documented in the README, not compiled styles from a historical commit.
   The production before/after generator is still D. The density model proves
   only its minimal composition. Count, ColorInput, TokenSwatch ownership and
   backlog approval remain B; public opt-in naming remains the owner's decision.

## Evidence

Live decision index:
<http://127.0.0.1:8797/specs/024-semantic-spacing-token-schema/benches/>.
The server serves this worktree root on loopback. Existing port 8796 is untouched.

External evidence root:
`H:\WSL_dev_projects\temp\spec-024-checkpoint-a-20261003\`.

- `measurements.json`: 57 comparison states, 82 passing checks, zero page or
  HTTP errors; Chromium 151.0.7922.34, DPR 1, 1440×1000 desktop viewport.
- Body phase: Site/Docs/App × nearest/up × 22/34/46rem all show 15/15 blocks
  within FR-043d. Occupied body blocks remain whole lines with no accumulating
  body-baseline drift. Nine unsnapped comparison states are also recorded.
- All three control tiers have square painted close actions and whole-bU
  occupied controls; marker baseline spread is 0px.
- Continuation remains aligned at all four mark/gap input combinations.
- Governed nesting preserves the plain host height; the deprecated density
  request changes no proposed chip geometry. A filled child retains its insets.
- All seven routes have no viewport overflow at 375px and 768px. Body-phase
  specimens deliberately scroll horizontally inside their stage at narrow widths.
- `index.png`, the six page screenshots and `body-phase-no-js.png` were visually
  inspected by the implementer. Diagnostics fit their blocks and do not obscure
  the compositions.
- `verify-benches.cjs` preserves the external browser-check driver. It is
  evidence tooling, not a newly added repository unit-test suite.
- `manifest.json` hashes served source bytes, committed source blobs, the font
  source, handover, original temporary demo, all screenshots and evidence files.
  CRLF/LF source hashes are recorded separately because git normalises text.
  Its SHA-256 is
  `55b474762430c73b3f269e6a00234d8636a25b18c4f9c8b58a157d0db85272e9`.

Re-run `verify-benches.cjs` from the evidence root if needed; it uses the Spec
024 worktree's installed Playwright. Copy the evidence first if preserving the
recorded hashes, as a re-run overwrites the captured outputs.

Repository-wide BF and Pragma runtime gates were not run for this checkpoint:
only static concept pages and task documentation changed. They remain required
at their implementation/closeout checkpoints; this is not a push-ready claim.
`git diff --cached --check` passed before the implementation commit.

## Owner hand-back (FR-054e)

1. Bench: <http://127.0.0.1:8797/specs/024-semantic-spacing-token-schema/benches/>.
2. Uncertainty: Site 24/24 visual comfort and the two labelled FR-060 mappings;
   cap-proxy concepts do not certify BF font metrics or production host coverage.
3. Decisions needed: independent Opus checkpoint A verdict before the next work
   package; owner heading-leading and surface-value confirmation before the
   affected production changes. Public opt-in naming stays pending for C.
