# Spec 028: external review of the Opus corrections

## Requested verdict and stopping point

Review the corrections to [the original changes-requested report](opus-028-review.md).
Judge whether the product and demo findings are closed, with the disclosed S1
scope and browser limits. Keep B2 Canonical-main activation as a merge
prerequisite: this request cannot activate BF main. Owner visual sign-off also
remains pending. Return findings by original ID plus any new regressions.

Implementation is stopped at this checkpoint. All changes are committed locally;
no push, merge, PR, Pragma implementation or publication occurred. The original
report/request/sealed evidence are unchanged. Our separate GPT verdict is
[corrections integration review](corrections-integration-review.md); it is not
an Opus review. Independent writer/paint/runtime agents used gpt-5.6-sol high.

## Immutable targets and evidence

| Identity | Full pin |
|---|---|
| Branch | `feat/028-shared-spacing-decisions` |
| Before | `6deca99776f35b85afde01b68bb0fffe817e29aa` |
| Corrected product/runtime source | `dd9db8588e549f8f8a21acf6fcdb9585200c60b1` |
| Final demo provenance metadata | `f172e907094f99dbab12baffa17b58030cff9180` |
| Frozen review target | `acce81f9ea09ac2ac00f1168fd895733b5eeb2a9` |
| Canonical feature snapshot | `7169231fcc3168032275d920d32856f9669107ac` |
| Canonical main at seal | `cad4aacf91b7e70bee81730552b76ef0d8291a34` |
| Design-tokens base | `18f57b95b1aa1dfe85a45746016b055c807d6628` |

This request and final routing are a later documentation-only carrier over the
review target. Its exact full commit and this request's SHA are recorded in
Canonical Spec 024 T011h and the late seal proof. Do not treat the carrier as a
new CSS source. Both After provenance source fields resolve to the corrected
source commit; source/config and seven runtime files are frozen.

Correction evidence root:
`H:/WSL_dev_projects/temp/bf-028-opus-corrections-20261006/`.
The [sealed 146-file manifest](H:/WSL_dev_projects/temp/bf-028-opus-corrections-20261006/bf-028-corrections-evidence-manifest.json)
has SHA-256 `9a454edc12176811ae25a6506d0bdcc5ea0d52d22be5cb6018efc7f33df62aae`.
Failed attempts remain distinctly named alongside successful receipts. Scratch
worktrees/dependency junctions are explicitly excluded, not mistaken for evidence.
The late verifier checks every sealed file, unchanged source/runtime, original
report/request, Before bundles, original owner reports, protected board columns
and BF-main inbox. Its output is intentionally outside the immutable seal.

Original package: `H:/WSL_dev_projects/temp/bf-028-20261006/`, overall manifest
`204fdec1e22a5474e4f288c423a8e869666f7c7e76ac2c4af6abbd9b930660cf`, core index
`a6630a06c081233b82374f699b63542208bc467a594708fecb3ef188c88014b4`.
Opus accepted those bundle/numeric proofs; old paint/runtime acceptance does not
clear the new findings. Original report SHA:
`cf5616db8eba51f6361d7501f8d8e6b6503040edc5e0b2da44fa9a3fd67d1466`.

## Findings and corrections

| Finding | Implemented disposition to challenge |
|---|---|
| B1 | Bare input/select/textarea retain normal, validation and forced-color boundaries without requiring wrapper markup or doubling wrapped strokes. Compatibility self-paint retains zero layout borders and native geometry/focus. Commit `94dea088b6c1fdfd7d1066388140b2c4dcfd0e41`. |
| D2 | Tooltip message owns frame and elevation in detached and positioned modes. Detached static message establishes its containing block; ordinary absolute positioning is retained. Tests compare actual frame/message bounds. Commit `9a7d7c8fa99551428206ec8eae7ca38cf5449318`. |
| S1 | Use the report's explicit narrow-to-BF remedy. Raw cells keep static positioning, clipping/ellipsis and self-paint; forced colors add inset cell outlines without layout borders. Owned BF cells retain clipping and one-sided overlays. Supported ContextualMenu descendants escape through neutral wrappers. Arbitrary absolute children in BF cells still clip, as documented and tested. No universal escape or owner waiver is claimed. Commit `959b5599f4cb2e8a0836e71d867def3d7cc34445`. |
| S2 | Disclose Card root overflow `auto` to `visible` independently from stroke work. Named focusable `.bf-card-scroll` owns wide-content scrolling; popup sits outside the inner clipping region. Commit `949c140965ee941bd40411dcc4437e5bec24b9fe`. |
| S3 | Normal leaf controls use bounded self-paint. Filled-child owners retain overlays; named forced-color-only boundary/selection/focus layers preserve native shapes and distinct meaning. Same S1/S3 commit. |
| M1 | Restore exact peer text-top checks; modulo applies only to the separate plain reference. Optical Badge exceptions use actual case-safe labels. Commit `b0831c716d04ff386116ee7aae8615c014aaa3ea`. |
| D1/M2 | Delete bespoke review CSS/JS. Before/After lives in shared BF fixed-footer controls on existing real BF component/spec pages with shared layouts, grid and initializers. Old route redirects. True 390px/mobile and 960px responsive drawer behavior is tested. Loaded version/tier URLs, immutable specimen nodes, async race handling, truthful rollback and retry are covered. Commit `28a7af5bfb761955e4b041b3669d1523d7ec5900`. |
| B2 | Full resolvable feature provenance identifies working overrides over the design-tokens base, with regeneration guards. Ordinary library/adapter use does not require Git; opt-in source verification does. Feature approval is explicitly activation-pending. Final source and metadata pins above. Main activation is not closed. |
| S4 | Actual Firefox 155 covers eight nested-density/@scope cases across all tiers at two widths. Full Firefox interaction coverage is still an explicit limit. |

Root and independent runtime review found a real mobile catalog overlay and a
960px empty rail during this correction. Both were fixed in shared BF chrome;
final pointer-hit/geometry checks pass. Harness-only false failures, including
sampling the drawer-close transition and targeting BF's visually hidden checkbox,
are explained in the reports. Strict checks were retained. Earlier S2 test output
carried a nonexistent source pin despite exit0; it is retained with that limitation.
The corrected pin and final complete triplet supersede it.

## Real BF demo

- [Vertical spacing, After](http://127.0.0.1:4176/demo/spec/spacing-vertical.html?bundle=after)
- [Tooltip, After](http://127.0.0.1:4176/demo/components/tooltip.html?bundle=after)
- [Cards, After](http://127.0.0.1:4176/demo/components/cards.html?bundle=after)
- [Forms, After](http://127.0.0.1:4176/demo/components/form-atlas.html?bundle=after)
- [SideNavigation, After](http://127.0.0.1:4176/demo/components/side-navigation.html?bundle=after)

Use BF's fixed footer: Before/After, Site/Docs/App/OS, tone and baseline grid.
Exercise real Tooltip, Card menu, fields and mobile catalog drawer. Use actual
browser viewport narrowing; there is no simulated Mobile canvas. BF page layout
legitimately follows its selected bundle. Before is archived CSS only: matching
Before token JSON was not preserved, so diagnostics/links are honestly unavailable
in Before rather than displaying After values. Provenance is linked from shared
chrome. Frozen custom Canonical benches are historical diagnostics, not sign-off.

## Validation receipts

All five final logs below exit0 at the source/runtime freeze. Paths are relative
to the correction evidence root.

| Gate/log | SHA-256 |
|---|---|
| `final-check-types.log` | `315ddf78ae96d26254506037f4909ac94e140b75754d9fd7fd7e604ef854d68c` |
| `final-npm-test.log` | `289e26c75131a15f1762aeda87afdf860b77a40860bbe18c8b59d235d49c0816` |
| `final-qa-components.log` | `13d0c4dfbcbd2f94c8d1ffc73714f9c41a90edd9b16c3b7952d43de0728b318e` |
| `final-source-build.log` | `9586af71323b9ad3409390f3cff8c4afe560bc2f8b851bc8005b4876296d4ec5` |
| `final-provenance-verifier.log` | `048469025aa9c09927d1a427288d8d5a9bf08b1e91c9b65a91ad2a7cacbf3ae3` |

Independent reviews:

- [Paint findings](H:/WSL_dev_projects/temp/bf-028-opus-corrections-20261006/paint-review/final-report.md), SHA
  `0d3c79236846499e1c267cc15b39ba0cbce911cbec9159fd4553c7f0eead443f`.
- [Final B2 audit](H:/WSL_dev_projects/temp/bf-028-opus-corrections-20261006/paint-review/b2-final-audit.md), SHA
  `0353e6352a86d639541c58a550dcff40710823f275e517bacdc74f67187adadf`.
- [Runtime/governance findings](H:/WSL_dev_projects/temp/bf-028-opus-corrections-20261006/runtime-governance-review.md), SHA
  `c591d5c8b9273a40e559963221d6fc60059e983f11b487a2b3e5038b636dca2e`.

Root read the full reports and checked every listed artifact hash. Independent
runtime covers 80 DPR1 states (five pages x two widths x four tiers x versions)
and 32 focused vertical/Tooltip states at launch scale/actual DPR1.5. The latter
uses `--force-device-scale-factor=1.5`, not context scaling alone. Raw response
hashes use a plain static server. Paint evidence covers bare/native/forced-color
fields, Tooltip bounds, raw/named tables, popup pointer routing, Card scroll and
exact peer baselines. Root adds 12 real pointer-focus cases and 24 shared-runtime
states at 1100/960/390px with failure rollback/retry and stable nodes. Firefox155
nested-density audit is eight cases, not the full runtime suite.

## External prerequisite and remaining limits

Before BF main adoption, owner must land equivalent governing rulings on
Canonical main and BF must repin the resulting full main SHA, or explicitly
record an exception. Merge method is not prescribed; squash/rebase is compatible
with repinning. Main remains at the pin above with SP-5 Experimental. Feature716
records owner approval with activation pending. Neither feature repair nor
passing tests satisfies this external gate. Design-tokens follows owner sign-off.
Pragma remains gated and uses element-local1cap, while BF retains metric inputs.

Full Firefox runtime, Safari, real Windows contrast themes and native Windows
display scaling remain unvalidated. Browser forced-colors/DPR checks are not
platform sign-off. Residual fractional long-stack drift remains a disclosed
limit. A no-Git full-theme archive probe lacked an IBM font asset; ordinary
library and adapter archive builds passed, not a complete theme reproduction.

Please distinguish acceptance of these bounded corrections from external Opus
verdict, owner visual sign-off, canonical activation and merge readiness. Record
new findings in a new report; preserve the original report and evidence.
