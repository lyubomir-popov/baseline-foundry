# Review: Nested density audit

## Outcome

- The shared demo rail and both side-navigation specimens compose the existing
  orange tagged-logo primitive with the Baseline Foundry wordmark. The brand is
  optional panel markup, not a new mandatory side-navigation API.
- `is-nested` is limited to auxiliary chips, status labels, and badges. No
  automatic ancestor selector or `bf-button.is-nested` contract was added.
- Nested line-height removes up to one active rem-based baseline of leading but
  never falls below the body-font-size token (one body em). Symmetric padding
  is capped to the host body line;
  block margins are zero; chip borders paint as an inset shadow and add no
  occupied-block footprint.
- Table actions remain normal-sized `bf-button is-link` actions. The active tier
  continues to own standalone density.

## Adversarial findings

- A first App-tier browser measurement showed the preset's later body-typography
  rule restoring the standalone line height. The preset now explicitly
  reapplies the public nested line token after its general typography pass,
  keeping zero specificity and avoiding a private offset.
- The shared rail's former flex column allowed its inner drawer to shrink to
  the viewport and move the sticky brand above the restored scroll position.
  The fixed rail now uses normal block flow; the inner BF panel owns its full
  scroll height and the brand remains at the viewport top.
- App has a `1em` body line and therefore no removable leading. The contract
  removes border/margin footprint there rather than forcing a sub-font-size
  line that could clip copy.
- Group dividers and headings were direct children of a zero-gap group, leaving
  heading-to-list spacing implicit and allowing the divider to span the whole
  rail. `bf-side-navigation-group-header` now owns the tight semantic rule and
  heading; the group owns a fixed 0.5rem transition to its list. The rule keeps
  the global 0.5rem occupied compensation, starts at the continuation text
  rail, and reaches the navigation end edge.
- The shared persistent rail incorrectly reused `bf-side-navigation-drawer`.
  A fresh build therefore applied the public off-canvas transform and removed
  the entire sidebar. The persistent rail now composes the panel and side
  navigation only; drawer state remains limited to real drawer specimens.
- Adjacent-page buttons carried a nested `bf-theme is-dark`, so their paint and
  chevrons stayed dark-themed on a light page. Removing the nested theme lets
  the complete control inherit the live page tone.
- The breadcrumb was centred inside header padding while the tagged brand used
  its fixed mark/title line. A shared derived line-centre and 3rem brand block
  now align both text fragments without a transform; the header rule paints
  in-box and cannot add baseline drift.
- Native color and composite range controls each recalculated a nominal row
  height, exposing a subpixel blue-rule step under browser zoom. Color now uses
  a metric-strut wrapper and an inline range stretches within its paired
  numeric row. Stacked ranges retain their independent grid-snapped track row.
- Repeated navigation links used natural border/margin boxes directly as grid
  tracks, accumulating rasterised rem-border remainder. Shared five-baseline
  tracks now absorb that remainder while links keep their natural paint.

## Browser evidence

- Side-navigation and tab fixtures were measured in Editorial, Documentation,
  App, and OS, in light and dark.
- Every nested side-navigation host matched a plain row's rendered height.
- The nested-badge tab matched the plain tab height in every tier and tone.
- The shared brand remained visible after restored rail scrolling; its orange
  tag start and root navigation text start had zero rendered spread.
- All three tagged logo assets loaded and both reviewed routes had clean browser
  consoles.
- The vertical audit now contains 28 distinct single-line fixtures, seven
  unboxed text roles, and nine real nested host/content combinations, each
  preceded by a five-letter baseline reference.
- The former independent bucket is gone. Breadcrumbs share the unboxed text
  family; table cells target the shared interface row with in-box compensation.
- Editorial, Documentation, App, and OS were measured in light and dark with
  shared chrome present. Unboxed-text height spread was zero; single-line and
  nested-host end-line spread stayed below one rasterised rem-based border at
  the enlarged browser zoom. Both reviewed tones had clean consoles.
- The grouped navigation correction was visually re-reviewed on the real
  side-navigation route in all four tiers and both tones. The optional brand
  remained visible, rule starts matched heading/list starts, and rule ends had
  zero spread from the navigation edge.
- The active thick-bar tab and pill chip are now the first component specimens
  after the five-letter reference, so both contracts are visible without
  horizontal scrolling.
- Editorial, Documentation, App, and OS were visually re-reviewed in light and
  dark after a fresh build. Shared chrome and the tagged brand remained present
  in all eight states; chip, active tab, text, color, and range end rules shared
  one rendered height in every tier and tone.
- Follow-up review made the audit tab's initial state explicit through its
  class, ARIA state, and roving tabindex. The badge-in-chip fixture now uses a
  genuinely compact chip inside a table row; its line floor resolves from the
  body-font-size token rather than an inherited `em`, and its value text
  inherits that compact line so the nested badge cannot enlarge the row.
- Follow-up validation passed `npm test` with 6,956 static contracts and clean
  component baselines and browser behavior, then passed a fresh full-catalog
  `npm run qa:components` capture. Live light/editorial and dark/OS review
  confirmed the active rule before interaction and the contained badge.

## Vertical coverage findings

- File input no longer double-pads its outer native field and selector button.
- Color and range controls now use the shared single-line target.
- Contextual-menu commands use the shared in-box start/end compensation.
- Table cells no longer have a status-label `:has()` density branch; chip,
  status, and badge nesting is explicit in table, navigation, tab, and chip
  hosts.
- [`contracts/vertical-coverage.md`](contracts/vertical-coverage.md) records the
  exhaustive primitive, nesting, representative, and content-driven
  dispositions.

## Gates

- `npm run build`: pass.
- `npm run test:build`: pass, 6,936 checks.
- `npm run test:behavior`: pass.
- `npm test`: pass.
- `npm run qa:components`: pass, zero component-baseline failures.

## Release evidence

- Release candidate `fdc1af7` was pushed to `main` with package metadata at
  0.1.6 after `release:preflight:test`, `release:check`, and clean-package
  verification passed.
- OIDC run `33407886292` published the immutable npm version successfully,
  then encountered an npm propagation `ETARGET` during its immediate
  exact-version install. Resume run `33408438187` skipped publication and
  completed exact registry verification, checksum generation, tagging, and
  release creation.
- `baseline-foundry@0.1.6` installs cleanly with 30 root exports and 21 asset
  entry points. Tag `v0.1.6` resolves to `fdc1af7`; the GitHub release contains
  `baseline-foundry-0.1.6.tgz` and `checksums.txt`.
