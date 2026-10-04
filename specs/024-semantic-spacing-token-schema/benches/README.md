# Checkpoint A concept benches

These are isolated CSS explanations for T011c / FR-054h. The stroke bench
loads this worktree's generated BF stylesheet and uses its component classes,
colour channels and typography. The bench authors the experimental FR-063
geometry, including padding, line-height, widths and radii, so it is a
production-styled concept rather than a production component rendering. The
other concept benches import no production CSS. None is the commit-based
review bench required by T011b / FR-054g, and none grants production sign-off.

Serve the Spec 024 worktree root, so the pages can load its existing font over
HTTP. No font binary is added by this change:

```powershell
python -m http.server 8797 --bind 127.0.0.1
```

Open <http://127.0.0.1:8797/specs/024-semantic-spacing-token-schema/benches/>.
The existing body-phase server on 8796 is left alone. Stop this server with
Ctrl+C if running it in a terminal.

Before reviewing the stroke page, run `npm run build:theme`. Its generated
stylesheet is reproducible from BF source commit
`c97ae4fca21ee1e87d23b208951abe3ed61a223f`; a fresh build produces
SHA-256
`41562b85745135ac4bcd35581bb608098ce1e18abd777d6cd0d4dcee5eac0934`
for `dist/styles.css`, matching the correction-evidence input. The stroke
driver rebuilds the stylesheet and fails if that hash changes.

Native radios select CSS using `:has()`. Every composition occurs once.
JavaScript reads geometry and fills diagnostic outputs; it does not set layout
properties, count lines for closure, choose fonts, or fetch styles. Body-phase
markers and typography classes are static, so the comparison works with scripts
disabled. Keyboard shortcuts are listed on each page; native radio arrow keys
also work.

| Page | What it isolates | Approval state |
|---|---|---|
| `body-phase/` | bU, superseded default closure, opt-in cancelled closure; type-scale / nearest / upward heading leading | Mechanism decided; heading leading and class name pending |
| `control-row/` | Symmetric border-aware row edges, occupied closure, action inset for leading icons, square icon-only action | Ruling decided; concept awaits review |
| `surface-insets/` | Symmetric control-seat invariant; compact / standard / major outside-edge insets | Control rule decided; per-tier surface values and compact block hypothesis pending |
| `gaps-seams/` | Group / pattern gaps, parent-owned plain-section seams, filled child surfaces | Ruling decided; concept awaits review |
| `continuation/` | Start inset + mark size + mark gap, including input changes | Ruling decided; concept awaits review |
| `governed-density/` | Approved host fit, constant font size, deprecated density selector with no effect | Ruling decided; concept awaits review |
| `strokes/` | Layout-border comparison, paint-only strokes, composed states, forced colours, native controls and direction | Decided; adoption verification pending |

## Inputs and limits

Checkpoint A's whole-bU control and surface geometry claims are limited to
DPR 1. At fractional layout scale Chromium can snap an authored 1px layout
border to a smaller used CSS width, while these benches still subtract the
authored 1px from padding. The result is a correspondingly short painted or
occupied box. Fractional-scale evidence therefore uses separate Chromium
launches with `--force-device-scale-factor` at 1.25 and 1.5; changing only a
Playwright context's `deviceScaleFactor` does not exercise this border
snapping. The evidence records the used border widths and geometry as observed
and does not tune the bench values to pass. FR-063 selects the prospective
stroke remedy, whose adoption remains conditional on the separate stroke bench.

The checkpoint-A correction driver also compares layout geometry with and
without JavaScript for every layout-affecting alternative on all six pages.
All 165 states match. Its surface assertions pass 52 of 60 states. Two Site
compact `control block inset` failures are artefacts of the old layout-border
construction: subtracting a 1px border from a 0px inset clamps the padding to
zero and produces 34px, while the FR-063 stroke construction closes at 32px.
The six real owner-decision failures are the Docs/App standard `action role /
half` alternatives: half of 12px is 6px, so they occupy 42px on a 4px grid.
For that asymmetric choice, “about half” must resolve to 4px or 8px. Owner
review then identified that the proof panels ignored the tier controls and that
the surface proposal could be mistaken for the symmetric control-seat rule.
The repaired page drives one BF-styled specimen path from every control, states
the equal `inset + nudge` control invariant first, and adds the full-action
symmetric surface alternative (16/16 Site; 12/12 Docs/App). All six
plain-section seams equal the tier's `group` gap.

The stroke page uses separate Chromium launches at scale factors 1, 1.25, 1.5
and 2; every context has a null viewport. It records layout-border snapping as
an observation and requires the paint-only construction to keep identical CSS
geometry at every scale. Forced-colours emulation tests cascade ownership only.
Real Windows contrast-theme keyboard checks in Chromium and Firefox, and
Safari coverage of ordinary painting and native controls, remain human checks
and are not claimed by this bench.

The body-phase page is ported from the supplied temporary demo. Relative shift,
closure-only after headings, and the JavaScript line-count option are removed.
The leading comparison is retained. The original canvas-derived cap ratio is
replaced with element-local `1cap`; the body anchor is a registered `<length>`
computed at the stage's body size so headings cannot reinterpret its cap unit.
Nudges snap to 1/64px, making padding and its cancellation equal layout units.
This is a Pragma cap-proxy concept, not BF's measured font-metric implementation.

The body-phase badges retain actual first/last marker residuals. Their acceptance
display uses **under 1px**, as FR-043d specifies, rather than the supplied demo's
0.5px display threshold. No renderer compensation is added. Snapping of line
height demonstrates the CSS mechanism; unsnapped wrapping deliberately fails.
Its one-line closure formula is sufficient only when line heights are whole body
lines. The type-scale comparison does not promise that property.

Baseline, body size/leading, control block inset and proposed group/pattern gaps
come from FR-039, FR-043c and FR-056. The current gap proposal is Site
24/64px and Docs/App 16/32px, from FR-043 before FR-043c. The prior framed-box
model is the 8px block / 16px inline candidate recorded in
`../t008-current-main-evidence.md`; it is not every current production surface.
Field/action/mark values below match the local Canonical spacing adapter
`config/canonical-spacing.resolved.json` (editorial/documentation/app), and the
inspected provider sources. All are literal bench inputs, not new public tokens.

| Input (px) | Site | Docs | App |
|---|---:|---:|---:|
| Body size / leading | 16/24 | 14/20 | 14/20 |
| bU | 8 | 4 | 4 |
| Control block inset | 0 | 4 | 4 |
| Field inline | 8 | 8 | 4 |
| Action inline | 16 | 12 | 12 |
| Mark size / gap | 16/8 | 16/8 | 16/4 |
| Old continuation alias | 32 | 24 | 24 |
| Proposed group / pattern | 24/72 | 20/40 | 20/40 |

FR-060's 1rem standard-surface starting value is shown as 16px side/end and 8px
top in all tiers. Docs/App currently have 12px action insets, so applying that
starting value literally is not yet the same as reading their action role.
The page also shows full-action symmetric block padding because FR-060's
asymmetry is a surface proposal, not a change to the symmetric control-row
contract, and the owner has reopened that distinction for visual review.
Targeted Chromium verification at real launch scale factors 1 and 1.5 passes
112/112 checks: tier-panel switching, every compact and standard choice,
equal control-seat padding, 40/32/32 occupied rows, zero layout borders,
paint-only strokes and the forced-colours outline fallback. Evidence is at
`H:\WSL_dev_projects\temp\spec-024-surface-symmetry-20261004\`.
The compact page proposes the field-inline magnitude on block edges too, clearly
labelled as a hypothesis because the field role has no block axis. Major overlays
show 32px inline grid margins, leaving their undecided block edges at the prior
candidate. These ambiguities must be settled before the production surface cut;
the benches do not decide or change a provider role.

The control page compares action variants without changing the action inset.
Its square claim concerns the painted box; the trailing closure still contributes
to the occupied row. The density page is a minimal enrolled-chip/table model,
not a proof of every approved host or of production Chip behavior. ColorInput,
TokenSwatch ownership, the exception backlog and the role-count recomputation
remain written CP1 work for checkpoint B.

Browser evidence and the review request are recorded in `../opus-A-review-request.md`.
