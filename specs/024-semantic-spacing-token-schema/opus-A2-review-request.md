# Opus checkpoint A2 review request

Checkpoint A2 is ready for independent adversarial review. The implementing
agents have stopped at T011f. No Pragma source, production recut, push, PR or
publication was performed. This request does not replace the independent review
required by FR-048 or the owner's later visual sign-off.

## Reviewer instruction

Act as the Opus reviewer for Spec 024 checkpoint A2. Read the live handover at
`H:\WSL_dev_projects\baseline-foundry\AGENT-INBOX.md`, this request, FR-063
through FR-063g, `opus-A-review.md`, and the actual diffs. Write
`opus-A2-review.md` beside this file. Record the actual model identity, reviewed
commit IDs, findings with severity and reproduction steps, and an accept /
accept with bounded corrections / reject verdict. State separately whether the
checkpoint-A correction list is discharged. Do not infer owner visual sign-off.

## Exact scope and commits

Worktree: `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-024-semantic-spacing-token-schema`

Branch: `feat/024-semantic-spacing-token-schema`

The supplied review and ruling records are:

- `5e200b87198385bffb240f3ec38b726c83d0a2fe` — checkpoint A review and FR-063 second opinion;
- `222da736aa8bee310ce07b76c443003cbd0c96d4` — FR-063–FR-063g, FR-043e correction, tasks and handover order.

T011d consists of seven atomic correction commits:

- `eb7f6abc6b34ee42b678663bc35ece077339d72a` — preserve the Current nested-surface inset;
- `b02736f26fc9a0e0677db5fbe526f7f35166ed68` — apply text nudges in the seam specimen;
- `780579e44259db7066b2fca5bcc80d9fc4c814c4` — include borders in seam diagnostics;
- `947732b2080a9a0f99fa3bf629d160494c22bf49` — expose the surface-value alternatives;
- `7c3631475f8b259df60901bc886bd4d53cd78173` — document and reproduce fractional-scale limits;
- `891a22c447009989cc4489ba8f585f40e25713db` — remove transient server metadata;
- `b5c729be4e42002a87729aa42bb11da376621dd4` — verify every layout alternative without JavaScript and record the surface results.

T011e is:

- `0e5dec5aa35a10315ec6f6d4564e29a0805956ad` — add the eight-specimen stroke concept bench.

Review with:

```powershell
git diff 222da736aa8bee310ce07b76c443003cbd0c96d4 0e5dec5aa35a10315ec6f6d4564e29a0805956ad -- specs/024-semantic-spacing-token-schema/benches specs/024-semantic-spacing-token-schema/tasks.md
```

The later commit containing this request and task status changes is review
documentation only. The owner-owned `canonical-spacing-spec` edits remain
uncommitted and outside this implementation.

## T011d correction evidence

Evidence root:
`H:\WSL_dev_projects\temp\spec-024-checkpoint-a-corrections-20261004\`

Manifest SHA-256:
`6ad4b2793d14868a8435f69fa3bf2b1006c20f3ddb373fecd3b6210e8aaab1c8`.

- Separate Chromium launches reproduce the layout-border defect: 1px at scale
  1, 0.8px at 1.25 and 0.666667px at 1.5. Site controls occupy 40/40/32px at
  scale 1, 39.59375/39.59375/31.59375px at 1.25, and
  39.322918/39.322918/31.322918px at 1.5. The evidence records these as
  observations and does not tune them away.
- JavaScript-enabled and disabled geometry matches in 165/165 alternatives:
  body phase 81, control row 6, surfaces 36, gaps 6, continuation 24 and
  governed density 12.
- Surface/seam assertions pass 52/60. All six plain-section seams equal the
  tier's group gap. Eight deliberately exposed alternatives fail whole-bU
  closure by 2px: Site compact with the control-block inset in both standard
  modes, and Docs/App standard with the action-role reading in all three
  compact modes. Treat these as owner-decision evidence, not accepted values.
- The original checkpoint A and marker-fix evidence roots remain unchanged.

## T011e stroke evidence

Live page:
<http://127.0.0.1:8797/specs/024-semantic-spacing-token-schema/benches/strokes/>.

Evidence root:
`H:\WSL_dev_projects\temp\spec-024-stroke-bench-20261004\`

Manifest SHA-256:
`2d9523c63df4828b7e79bb298c1a7f7e28f66d50b8a5cdf0becb00928ca193e8`.

Chromium 151.0.7922.34 ran in four separate launches at scale 1, 1.25, 1.5
and 2, every context using `viewport: null`. The packet contains Current,
Proposed and forced-colours screenshots at every scale plus raw edge crops.
All 1,346 automated checks pass with no page or HTTP errors.

The checks cover:

- identical Proposed occupied geometry at every scale and whole-bU uniform controls;
- current layout-border shortfalls at fractional scales;
- a uniform spread ring and ordered physical per-side layers at square and rounded corners;
- fixed named shadow slots whose empty value is `0 0 0 0 transparent`, including every combined state;
- zero layout borders and non-`none` assembled shadow lists in Proposed mode;
- explicit forced-colours outline ownership for unfocused, focus,
  invalid, focused-invalid, selected, disabled and focusable-disabled states;
- a thicker inset focus outline and non-colour invalid/selected cues;
- dense child host equality, fixed-padding clearance and the opaque-child occlusion case;
- named paint owners and appearance modes for text input, textarea, select and range;
- nested RTL/LTR logical-start mapping while physical hooks remain physical.

Chromium also snaps authored outline widths at fractional scale. The boundary is
0.8px at 1.25 and 0.666667px at 1.5; the focused outline remains visibly
different at 2.4px and 2.66667px. Review this as forced-colours evidence rather
than an identical-raster claim.

## Pressure points

1. Confirm every T011d correction is faithfully implemented and the eight
   failing surface alternatives are recorded without being presented as passes.
2. Verify that the stroke page contains each T011e specimen once and that its
   JavaScript only reports geometry.
3. Challenge the slot grammar, ordering and cascade. No winning state rule may
   replace the assembled `box-shadow`, and no optional slot may resolve to
   `none` inside the list.
4. Inspect square-corner order and rounded mixed-side taper in the edge crops.
   The bench must not claim even rounded mixed strokes.
5. Inspect forced-colours cascade precedence. There must be no `outline: none`
   on the paint owner; focus must remain distinguishable from the boundary by
   more than colour.
6. Check dense fit, fixed padding, opaque-child occlusion, native affordances,
   appearance ownership and nested direction behavior against FR-063e/f.
7. Distinguish launch-scale proof from context DPR emulation and geometry from
   raster sharpness. Reproduce hashes before relying on the evidence packet.
8. Confirm that no Pragma file adopted FR-063 and that T011c remains open until
   this review discharges the correction list and the owner signs off the bench.

## Known limits and human-only checks

Forced-colours automation uses
`page.emulateMedia({ forcedColors: "active" })`; it proves the CSS cascade, not
a Windows contrast theme. The following remain explicitly pending and must not
be inferred from this packet:

- real Windows contrast-theme keyboard checks in Chromium;
- real Windows contrast-theme keyboard checks in Firefox;
- Safari normal-paint and native-control coverage on macOS.

No repository-wide BF or Pragma gate was run. This checkpoint changes isolated
concept pages and documentation only. Full repository gates remain required at
their implementation checkpoints.

## Owner hand-back boundary

After the Opus verdict, owner visual sign-off is still required before any
Pragma family adopts FR-063. The owner must also choose the surface alternatives
using the recorded closure failures. Heading leading, the opt-in class name and
whether FR-058 squares the painted or occupied button box remain open at their
recorded later checkpoints.
