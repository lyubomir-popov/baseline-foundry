# Tasks

## First cut (historical)

- [x] Values and compact block inset â€” `f199993`, gates green
- [x] Tier-sized icons â€” `955bc27`, gates green
- [x] Derived continuation â€” `49bae12`, gates green
- [x] Shared gaps and standard surfaces â€” `6717ccc`, gates green
- [x] Four-tier SP-13 text compensation â€” `b4a6b13`, independent 28-role oracle green
- [x] Tooltip compact surface â€” `948f240`, gates green
- [x] Nonzero block-start removal and zero-padding containment â€” `5184484`, gates green
- [x] Compensation-only block-end governance and final semantic/icon ownership sweep (FR-061a/SP-1) â€” `65a1436`, gates green; logs `governance-check-types-final.log`, `governance-npm-test-final.log`, `governance-qa-components-final.log`
- [x] SideNavigation panel geometry â€” `a468e8f`, gates green; logs `sidenav-check-types.log`, `sidenav-npm-test.log`, `sidenav-qa-components.log`
- [x] Governed dense Site Chip â€” `801e856`, gates green; logs `dense-chip-check-types.log`, `dense-chip-npm-test.log`, `dense-chip-qa-components.log`
- [x] Paint-only row contract â€” `b395a56`, gates green; logs `row-contract-check-types.log`, `row-contract-npm-test.log`, `row-contract-qa-components.log`
- [x] Paint-only component families
  - [x] Row-bearing commands (Button, Chip, ChoiceRow, SegmentedControl, Pagination) â€” `5a020b7`, gates green; logs `commands-check-types.log`, `commands-npm-test.log`, `commands-qa-components.log`
  - [x] Native fields and search compositions â€” `c3512eb`, gates green; logs `fields-check-types.log`, `fields-npm-test.log`, `fields-qa-components.log`
  - [x] Navigation bars, drawers, pagination and navigation actions â€” `cbcabbe`, gates green; logs `navigation-check-types.log`, `navigation-npm-test.log`, `navigation-qa-components.log`
  - [x] Cards, OptionCard and ContentCard surfaces â€” `c3af935`, gates green; logs `cards-check-types.log`, `cards-npm-test.log`, `cards-qa-components.log`
  - [x] Panels, modals, popup surfaces and code snippets â€” `1b00248`, gates green; logs `overlays-check-types.log`, `overlays-npm-test.log`, `overlays-qa-components.log`
  - [x] Feedback surfaces and native marker parts â€” `f32f9ce`, gates green; logs `feedback-check-types.log`, `feedback-npm-test.log`, `feedback-qa-components.log`
  - [x] Tables, divided lists and tab rules â€” `ebe54a0`, gates green; logs `tables-check-types.log`, `tables-npm-test.log`, `tables-qa-components.log`
  - [x] Static and editorial rules â€” `0410c72`, gates green; logs `static-check-types.log`, `static-npm-test.log`, `static-qa-components.log`
  - [x] Navigation popup and application shell frames â€” `cf48e2f`, gates green; logs `shells-check-types.log`, `shells-npm-test.log`, `shells-qa-components.log`
- [x] Filled-child Card/OptionCard focus repair â€” `12d47ab`, gates green; logs `focus-overlay-check-types.log`, `focus-overlay-npm-test.log`, `focus-overlay-qa-components.log`
- [x] Before/after review demo and negative specimens â€” all-tier desktop/mobile behavior matrix green; logs `demo-check-types.log`, `demo-npm-test.log`, `demo-qa-components.log`
- [x] Root gates and Chromium evidence â€” final contract and paint audits accept the immutable `db10d20` source/demo target
- [x] Conformance board and final Opus request â€” BF rows done without owner sign-off; manifest `204fdec1eâ€¦`

## External Opus corrections

- [x] Preserve the actual changes-requested [report](opus-028-review.md) unchanged
  â€” `94a9025535b26bfd9f872f328e82a70ee387188e`.
- [x] B1: bare native-field compatibility â€”
  `94dea088b6c1fdfd7d1066388140b2c4dcfd0e41`; gates green in
  `b1-check-types-final.log`, `b1-npm-test-green2.log`,
  `b1-qa-components-green.log`; independent geometry/forced-color checks pass.
- [x] D2: Tooltip message anchoring â€”
  `9a7d7c8fa99551428206ec8eae7ca38cf5449318`; gates green in
  `d2-check-types.log`, `d2-npm-test.log`, `d2-qa-components.log`;
  independent bounds and interaction audit passes all 16 states.
- [x] S1/S3: table composition and conditional leaf paint â€”
  `959b5599f4cb2e8a0836e71d867def3d7cc34445`; required gates green in
  `s1-s3-check-types-final.log`, `s1-s3-npm-test-green.log`,
  `s1-s3-qa-components-final.log`. Independent exact-tip audit accepts the
  review's narrow-to-BF remedy: owned BF cells still clip arbitrary absolute
  children; supported BF menus escape through neutral wrappers.
- [x] S2: Card overflow disclosure and BF content scrolling â€”
  `949c140965ee941bd40411dcc4437e5bec24b9fe`; `s2-check-types-final.log` and
  `s2-qa-components-final.log` exit 0; independent 8-state audit passes.
  `s2-npm-test-final.log` exits 0 but has the temporary nonexistent source-pin
  limitation. Corrected `s2-provenance-test-build-final.log` exits 0; the final
  complete source/runtime gates now pass with the corrected provenance.
- [x] M1: exact component text-top assertions â€”
  `b0831c716d04ff386116ee7aae8615c014aaa3ea`; gates green in
  `m1-check-types-final.log`, `m1-npm-test-final.log`,
  `m1-qa-components-final.log`; independent eight-state audit records zero peer
  spread. Reference phase and the case-safe Badge exception remain explicit.
- [x] D1/M2: shared BF Before/After controls, grid and initializers; real mobile
  â€” `28a7af5bfb761955e4b041b3669d1523d7ec5900`.
- [x] B2/S4: full provenance and working-override guard
  â€” source `dd9db8588e549f8f8a21acf6fcdb9585200c60b1`, metadata
  `f172e907094f99dbab12baffa17b58030cff9180`. Firefox 155 nested-density
  audit passes 8 states; full Firefox interaction coverage is not claimed.
  The external Canonical-main gate remains open below.
- [x] Independent final paint/runtime review and root integration.
  Paint report `0d3c79236846499e1c267cc15b39ba0cbce911cbec9159fd4553c7f0eead443f`;
  B2 report `0353e6352a86d639541c58a550dcff40710823f275e517bacdc74f67187adadf`;
  runtime report `c591d5c8b9273a40e559963221d6fc60059e983f11b487a2b3e5038b636dca2e`.
  Independent runtime: 80 DPR1 + 32 launch-scale/DPR1.5 states. Root: 24
  version/tier/viewport states, real hit testing, failure rollback and retry.
- [x] Seal correction evidence and save the
  [next external request](opus-028-corrections-review-request.md). BF board
  routing is recorded in Canonical T011h; no owner sign-off is claimed.
- [x] External Opus correction verdict: October 7 receipt accepts the bounded
  corrections; preserve the untracked report unchanged. SHA-256
  `f3f0dc8b3409eeb3773e951b1b2ad62ce1b5bef837bd236601d65692493d4183`.
- [ ] Owner visual sign-off on the real component Before/After pages.
- [ ] Owner Canonical main activation and resulting full-SHA artifact re-pin
  before BF main adoption; no exception has been inferred.

Correction logs and independent reports are under
`H:/WSL_dev_projects/temp/bf-028-opus-corrections-20261006/`; sealed 146-file
manifest SHA-256 `9a454edc12176811ae25a6506d0bdcc5ea0d52d22be5cb6018efc7f33df62aae`.
Frozen review target: `acce81f9ea09ac2ac00f1168fd895733b5eeb2a9`.
Failed attempts remain distinct from green gate logs. The original
`bf-028-20261006` evidence and request stay unchanged.

## October 9 initial review follow-up (historical)

- [x] N1: fix the shared Pages toggle overlapping the brand on the mobile
  SideNavigation demo. Verify both bundles, all tiers, responsive widths and
  independent specimen navigation before the owner's visual pass.
- [x] Record N2's owner decision requirement and N3's consumer-visible scope
  change; disposition N4/N5 without silently changing governing rulings.
- [x] Run the repository gates, independent adversarial review and root
  integration checks; seal separate follow-up evidence.
- [x] Save a bounded Opus follow-up request for the new chrome delta at the
  user's requested stopping point. The accepted correction verdict remains
  satisfied; it did not mandate another review of the accepted repairs.

Spec 024's separate T011g popup diagnostic Opus verdict is still pending. This
follow-up does not close that checkpoint or authorize Pragma source work.

## Final corrected-source gates

All exit 0 at the final source/runtime freeze:

| Log | SHA-256 |
|---|---|
| `final-check-types.log` | `315ddf78ae96d26254506037f4909ac94e140b75754d9fd7fd7e604ef854d68c` |
| `final-npm-test.log` | `289e26c75131a15f1762aeda87afdf860b77a40860bbe18c8b59d235d49c0816` |
| `final-qa-components.log` | `13d0c4dfbcbd2f94c8d1ffc73714f9c41a90edd9b16c3b7952d43de0728b318e` |
| `final-source-build.log` | `9586af71323b9ad3409390f3cff8c4afe560bc2f8b851bc8005b4876296d4ec5` |
| `final-provenance-verifier.log` | `048469025aa9c09927d1a427288d8d5a9bf08b1e91c9b65a91ad2a7cacbf3ae3` |

The initial chrome runtime was `2abf5e8576fce8780ce3a68caecaa3ef89106444`;
its published carrier was `f52d0dde3ba267954625f65b939cec90ed914e59`.
The historical [follow-up request](reviews/opus-028-followup-review-request.md)
and 207-file seal remain unchanged. Its external verdict requested medium R1
changes, accepted N2–N5 dispositions and retained the earlier spacing repairs.

## R1 correction and current review boundary

- [x] Read and preserve the actual uncommitted follow-up report, SHA-256
  `69882bae2c294b511e4f9ad1ced47019e07a1279140abcbcf6c041df660772aa`.
- [x] Remove the unconditional mobile z-index override; conditionally hide
  direct shared header/footer rendering, pointer and focus with retained boxes.
  Runtime and harness: `36c93b6a23fe71e74dac7ea147e14e79c7372013`.
- [x] Add complete Tab-from-close cycles for initial/reopened specimens,
  exclude shared chrome while expanded, and verify actual shared Pages/four
  footer keyboard reachability and hits after Escape. Reopened Escape must
  restore its opening trigger; initial markup has no recorded trigger and
  the recovery test explicitly focuses the available trigger.
- [x] Verify the old CSS negative control fails on 7 shared focus stops;
  repair overstrong initial-focus expectations without changing product runtime.
- [x] Run root types/full test/component QA/provenance gates at the runtime pin;
  complete independent browser and root integration review; seal separate
  166-file R1 evidence, SHA-256 `b0d995bd4be84ebac9a2358c07208a180cfe7d55b67739e8d196d9702dc52fc5`.
- [x] Save the [new R1 correction request](reviews/opus-028-r1-correction-review-request.md),
  [root findings](reviews/r1-integration-review.md) and accepted N2–N5
  [dispositions with precise N3 wording](reviews/r1-dispositions.md).
- [ ] Obtain the external R1 correction verdict and owner visual sign-off.
- [ ] Track ApplicationLayout's pre-existing 390px brand/Pin/Close overlap for
  a separate shared-chrome repair before its mobile visual approval. Product
  non-modal background focus and DrawerPanel's retained shared chrome remain
  disclosed limits, not R1 conformance claims.

N2's explicit owner fallback decision and B2 governing-main activation/full-SHA
repin remain open. The separate Spec 024 T011g popup review is still missing
before Pragma source work. Prior carrier CI 37978534940 finished failing at the
dependency audit on `source-map-js` after engineering gates passed; dependencies
are unchanged here and a green release audit remains required. No owner sign-off,
Pragma implementation, main merge, release or token publication is claimed.
