# Tasks

## First cut (historical)

- [x] Values and compact block inset — `f199993`, gates green
- [x] Tier-sized icons — `955bc27`, gates green
- [x] Derived continuation — `49bae12`, gates green
- [x] Shared gaps and standard surfaces — `6717ccc`, gates green
- [x] Four-tier SP-13 text compensation — `b4a6b13`, independent 28-role oracle green
- [x] Tooltip compact surface — `948f240`, gates green
- [x] Nonzero block-start removal and zero-padding containment — `5184484`, gates green
- [x] Compensation-only block-end governance and final semantic/icon ownership sweep (FR-061a/SP-1) — `65a1436`, gates green; logs `governance-check-types-final.log`, `governance-npm-test-final.log`, `governance-qa-components-final.log`
- [x] SideNavigation panel geometry — `a468e8f`, gates green; logs `sidenav-check-types.log`, `sidenav-npm-test.log`, `sidenav-qa-components.log`
- [x] Governed dense Site Chip — `801e856`, gates green; logs `dense-chip-check-types.log`, `dense-chip-npm-test.log`, `dense-chip-qa-components.log`
- [x] Paint-only row contract — `b395a56`, gates green; logs `row-contract-check-types.log`, `row-contract-npm-test.log`, `row-contract-qa-components.log`
- [x] Paint-only component families
  - [x] Row-bearing commands (Button, Chip, ChoiceRow, SegmentedControl, Pagination) — `5a020b7`, gates green; logs `commands-check-types.log`, `commands-npm-test.log`, `commands-qa-components.log`
  - [x] Native fields and search compositions — `c3512eb`, gates green; logs `fields-check-types.log`, `fields-npm-test.log`, `fields-qa-components.log`
  - [x] Navigation bars, drawers, pagination and navigation actions — `cbcabbe`, gates green; logs `navigation-check-types.log`, `navigation-npm-test.log`, `navigation-qa-components.log`
  - [x] Cards, OptionCard and ContentCard surfaces — `c3af935`, gates green; logs `cards-check-types.log`, `cards-npm-test.log`, `cards-qa-components.log`
  - [x] Panels, modals, popup surfaces and code snippets — `1b00248`, gates green; logs `overlays-check-types.log`, `overlays-npm-test.log`, `overlays-qa-components.log`
  - [x] Feedback surfaces and native marker parts — `f32f9ce`, gates green; logs `feedback-check-types.log`, `feedback-npm-test.log`, `feedback-qa-components.log`
  - [x] Tables, divided lists and tab rules — `ebe54a0`, gates green; logs `tables-check-types.log`, `tables-npm-test.log`, `tables-qa-components.log`
  - [x] Static and editorial rules — `0410c72`, gates green; logs `static-check-types.log`, `static-npm-test.log`, `static-qa-components.log`
  - [x] Navigation popup and application shell frames — `cf48e2f`, gates green; logs `shells-check-types.log`, `shells-npm-test.log`, `shells-qa-components.log`
- [x] Filled-child Card/OptionCard focus repair — `12d47ab`, gates green; logs `focus-overlay-check-types.log`, `focus-overlay-npm-test.log`, `focus-overlay-qa-components.log`
- [x] Before/after review demo and negative specimens — all-tier desktop/mobile behavior matrix green; logs `demo-check-types.log`, `demo-npm-test.log`, `demo-qa-components.log`
- [x] Root gates and Chromium evidence — final contract and paint audits accept the immutable `db10d20` source/demo target
- [x] Conformance board and final Opus request — BF rows done without owner sign-off; manifest `204fdec1e…`

## External Opus corrections

- [x] Preserve the actual changes-requested [report](opus-028-review.md) unchanged
  — `94a9025535b26bfd9f872f328e82a70ee387188e`.
- [x] B1: bare native-field compatibility —
  `94dea088b6c1fdfd7d1066388140b2c4dcfd0e41`; gates green in
  `b1-check-types-final.log`, `b1-npm-test-green2.log`,
  `b1-qa-components-green.log`; independent geometry/forced-color checks pass.
- [x] D2: Tooltip message anchoring —
  `9a7d7c8fa99551428206ec8eae7ca38cf5449318`; gates green in
  `d2-check-types.log`, `d2-npm-test.log`, `d2-qa-components.log`;
  independent bounds and interaction audit passes all 16 states.
- [x] S1/S3: table composition and conditional leaf paint —
  `959b5599f4cb2e8a0836e71d867def3d7cc34445`; required gates green in
  `s1-s3-check-types-final.log`, `s1-s3-npm-test-green.log`,
  `s1-s3-qa-components-final.log`. Independent exact-tip audit accepts the
  review's narrow-to-BF remedy: owned BF cells still clip arbitrary absolute
  children; supported BF menus escape through neutral wrappers.
- [x] S2: Card overflow disclosure and BF content scrolling —
  `949c140965ee941bd40411dcc4437e5bec24b9fe`; `s2-check-types-final.log` and
  `s2-qa-components-final.log` exit 0; independent 8-state audit passes.
  `s2-npm-test-final.log` exits 0 but has the temporary nonexistent source-pin
  limitation. Corrected `s2-provenance-test-build-final.log` exits 0; the final
  complete source/runtime gates now pass with the corrected provenance.
- [x] M1: exact component text-top assertions —
  `b0831c716d04ff386116ee7aae8615c014aaa3ea`; gates green in
  `m1-check-types-final.log`, `m1-npm-test-final.log`,
  `m1-qa-components-final.log`; independent eight-state audit records zero peer
  spread. Reference phase and the case-safe Badge exception remain explicit.
- [x] D1/M2: shared BF Before/After controls, grid and initializers; real mobile
  — `28a7af5bfb761955e4b041b3669d1523d7ec5900`.
- [x] B2/S4: full provenance and working-override guard
  — source `dd9db8588e549f8f8a21acf6fcdb9585200c60b1`, metadata
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
- [ ] External Opus verdict and owner visual sign-off.
- [ ] Owner Canonical main activation and resulting full-SHA artifact re-pin
  before BF main adoption; no exception has been inferred.

Correction logs and independent reports are under
`H:/WSL_dev_projects/temp/bf-028-opus-corrections-20261006/`; sealed 146-file
manifest SHA-256 `9a454edc12176811ae25a6506d0bdcc5ea0d52d22be5cb6018efc7f33df62aae`.
Frozen review target: `acce81f9ea09ac2ac00f1168fd895733b5eeb2a9`.
Failed attempts remain distinct from green gate logs. The original
`bf-028-20261006` evidence and request stay unchanged.

## Final corrected-source gates

All exit 0 at the final source/runtime freeze:

| Log | SHA-256 |
|---|---|
| `final-check-types.log` | `315ddf78ae96d26254506037f4909ac94e140b75754d9fd7fd7e604ef854d68c` |
| `final-npm-test.log` | `289e26c75131a15f1762aeda87afdf860b77a40860bbe18c8b59d235d49c0816` |
| `final-qa-components.log` | `13d0c4dfbcbd2f94c8d1ffc73714f9c41a90edd9b16c3b7952d43de0728b318e` |
| `final-source-build.log` | `9586af71323b9ad3409390f3cff8c4afe560bc2f8b851bc8005b4876296d4ec5` |
| `final-provenance-verifier.log` | `048469025aa9c09927d1a427288d8d5a9bf08b1e91c9b65a91ad2a7cacbf3ae3` |
