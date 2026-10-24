# Opus review – BF Spec 028 corrections

Date: 2026-10-07
Request: [`opus-028-corrections-review-request.md`](opus-028-corrections-review-request.md)
Original report: [`opus-028-review.md`](opus-028-review.md) (unchanged)
Targets: source `dd9db85`, review target `acce81f`, tip `5720ba3`

## Verdict

**The bounded corrections are accepted.** Every product and demo finding from
the original report is closed, or closed within its disclosed scope. B2 stays
open as an external merge prerequisite, as the request says.

This is not owner visual sign-off, Canonical-main activation or merge
readiness. One new demo-chrome defect (N1) should be fixed before the owner's
visual pass. The other new items are disclosures for the owner to accept.

## Independently verified

- **Bundles.** A fresh build of `dd9db85` in a scratch worktree reproduces all
  four served After bundles. They match `provenance.json`. The Before bundles
  are unchanged from the verified `6deca997` build. No source, config, script
  or demo file changed after `dd9db85` except `provenance.json`.
- **Evidence.** Manifest SHA-256 `9a454edc…` matches. 146/146 files
  hash-verify.
- **Live Chromium probes** on BF's own pages, comparing `?bundle=before` and
  `?bundle=after`, are below.

## Findings by original ID

| ID | Status | Evidence |
|---|---|---|
| B1 | Closed | Bare and untyped inputs have an inset block-end self-paint with zero border. They keep the Before block-end margin (2.88px in both). Validation colours flow through `--bf-native-field-stroke-color`. Wrapped fields are excluded, so the edge is not doubled. |
| D2 | Closed | The Tooltip frame and elevation sit on the 320px message in both detached and positioned modes. The 816px wrapper is no longer framed. |
| S1 | Closed (bounded) | Raw `td` stays `static` and self-paints. BF cells stay `relative` with an overlay. The real ContextualMenu in a BF table escapes the cell (31px below the cell, hit-tested). Arbitrary absolute children in BF cells still clip, as disclosed. |
| S2 | Closed (opt-in) | Card root stays `overflow: visible`. `.bf-card-scroll` is focusable, labelled and scrolls. The Card menu crosses the Card edge and is hit-tested After; Before it is clipped. Existing wide content without the wrapper still overflows, as disclosed. |
| S3 | Closed | Leaf controls no longer set `position: relative` in normal mode (see N5). |
| M1 | Closed | Per the request; not re-probed. |
| D1/M2 | Closed | The bespoke shell is gone. BF's chrome, baseline grid, tone, tier and the Before/After footer drive real component pages. Real viewport narrowing gives no horizontal overflow at 390 and 960px on the spacing, form and side-navigation pages. |
| S4 | Closed (bounded) | Firefox density/@scope cases are covered. Full Firefox remains an explicit limit. |
| B2 | Open – external | The full SHA, override origin and regeneration guard are recorded. Activation still needs the equivalent rulings on Canonical main and a BF repin. |

## New findings

### N1 – The mobile catalog toggle overlaps the brand on `side-navigation.html` (fix before the owner's pass)

At 390px, the shared chrome's **Pages** toggle (`bf-side-navigation-toggle`,
0,0 99×37) overlaps the visible "Baseline Foundry" brand (32,16 311×48). The
overlap is about 1,400px². It happens in both bundles, so it is a chrome
defect, not a bundle regression. The request reports the mobile catalog
overlay as fixed, but on this page it is not. The tooltip and spacing pages
don't show it.

Screenshots: `H:/WSL_dev_projects/temp/opus-028c-sidenav-390-{before,after}.png`.

### N2 – Forced colours change one-sided boundaries to all-sided (owner to accept)

In forced colours, two fallbacks draw an inset all-sided `outline` instead of a
one-sided rule, because neither element can host the overlay:

- bare native fields
- raw native table cells

So the field becomes a box, and the raw table becomes a full cell grid. SP-5
asks for one-sided forced-colours paint on one-sided strokes. This is a
reasoned deviation, but it is still a deviation and needs the owner's explicit
acceptance or a note in the ruling.

### N3 – Untyped inputs are now in scope (disclose)

`input:not([type])` joins every field selector. Untyped inputs used to keep the
UA 2px border. They now get the full BF field treatment. That is probably
right, but it is a consumer-visible change and should be in the change list.

### N4 – Provenance checks validate prose literals (minor)

`validateCanonicalSpacingArtifact` compares whole sentences: `baseRole`,
`origin`, `status` and `regenerationGuard`. Any rewording breaks validation.
Enums or short codes, with the prose kept as non-validated notes, would be
sturdier.

### N5 – Forced colours alone make leaf controls containing blocks (minor)

`allSidedStrokeSelfPaintCss` sets `position: relative` only under
`forced-colors: active`. Absolute descendants of a leaf control then anchor
differently by mode. This is rare for leaf controls, so it is recorded only.

## Explicit non-claims

These remain open: owner visual sign-off, Canonical-main activation (B2),
Safari, full Firefox, real Windows contrast themes, native display scaling and
the disclosed fractional long-stack drift.
