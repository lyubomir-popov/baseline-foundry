# Launchpad Table in-box alignment adversarial review

Date: 2026-09-11  
Verdict: **GO — no remaining P0/P1/P2 findings**

## Accepted Pragma commits

- `a09636728` — native Table cell ledger and exact seven-debt removal
- `0d493827b` — intrinsic/multiline stories and browser evidence
- `eedd20908` — genuine 18px-root Table coverage
- `3692081ab` — wrapped SortButton inherited-line-height correction
- `77c0fc9e4` — real hover/pointer interaction evidence
- `8caeb183e` — reviewed promotion from authorized to active

## Reproduced evidence

- Global CSS contract: `326 raw / 27 sanctioned / 292 transition / 7 advisory / 0 legacy`.
- Scanner tests: 67/67, 160 assertions.
- Focused direct-entry browser matrix: 13/13 in Chromium, Firefox and WebKit.
- Exactly seven transition identities removed; no allowlist additions and no
  classification additions.
- Wrapped sortable header at a 16px root: 143.984375px in Chromium/WebKit and
  144px in Firefox, against a 144px target.
- Wrapped sortable header at a genuine 18px root: 161.984375px in
  Chromium/WebKit and 162px in Firefox, against a 162px target.
- SortButton contributes the inherited 20px/22.5px line box without a target,
  block padding or a second ledger. Real pointer activation and focus behavior
  pass in all three engines.
- Table-scoped axe reports zero violations for Default, Intrinsic multiline and
  colspan, and Narrow sortable headers. Storybook's badge counts inconclusive
  page-framing checks, not Table violations.

## Adversarial correction

The first review was a NO-GO because an action wrapped onto its own flex line
contributed only the SVG's `1em` height: 14px at the 16px document root and
15.75px at 18px. The resulting headers were off-grid in every engine. The
accepted correction uses an inherited inline line-height strut and absolutely
centres the SVG inside that intrinsic line box. A subsequent P2 restored a real
locator hover/click test after a synthetic event had weakened the evidence.

The `.ds.table` proxy, nearer `.ds.table-th` re-resolution, separate zero-spaced
borders, transparent separator reservation, tallest-cell multiline ownership,
Field inset, and zero-footprint header/footer paint all conform. Table is now an
active closed-registry consumer. SideNavigation and Log remain future entries.
