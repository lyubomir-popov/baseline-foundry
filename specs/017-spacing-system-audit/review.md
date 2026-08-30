# Review: Spacing System Audit

Status: final adversarial review; no unresolved high- or medium-severity API,
accessibility, responsive, spacing-ownership, or review-runtime finding.

## Review 1 — rule authoring and semantic API

- **Pass:** Bare `<hr>` now owns the generic separator contract. Pattern rule
  classes only provide structural placement, so `bf-divided-section-rule` is
  not competing with a generic visual class.
- **Pass:** `is-muted` was removed from rule markup because it had no selector;
  `is-highlighted` remains on semantic native rules and has a defined visual
  result.
- **Pass:** No active source or demo relies on `bf-rule`; the basic selector
  keeps the same background, thickness, reset, and trailing compensation.
- **Finding resolved:** The historical `bf-rule` API duplicated native
  semantics and created unnecessary class-pair variation.

## Review 2 — responsive composition

- **Pass:** Hero, basic section, divided section, tiered-list header, rich
  lists, tab section, and linked-logo 50/50 layouts use a 45rem query-container
  threshold.
- **Pass:** Visual inspection at a 47.5rem viewport produced a 43.5625rem tiered-list
  allocation that stayed one column; at 50rem it allocated 46.0625rem and became
  two columns with no overflow. The other reviewed shared-split surfaces also
  had no overflow at their 737–47rem expanded allocations.
- **Pass:** 25/75 rails, repeated-card density, navigation, and grid-shell
  transitions remain documented exceptions rather than accidental divergent
  50/50 implementations.

## Review 3 — source and test hygiene

- **Pass:** The generated CSS static gate passes 6,093 checks after the
  source-only changes.
- **Pass:** Existing global card `is-muted` uses were kept intact; only no-op
  rule modifiers were removed.
- **Pass:** The full component behavior suite passed after adding the
  constrained shared-split checks and scoping the rich-list CTA to its 50/50
  layout.
- **Pass:** Component baseline verification and `qa:components` screenshot
  capture completed across the full catalog with zero reported failures.
- **Pass:** T005–T016 are complete; the final adversarial pass and release
  gates found no unresolved high- or medium-severity issue.

## Review 4 — axis-specific audit surface

- **Pass:** The spacing overview now leads to distinct full-width horizontal
  and vertical audit routes. Neither route uses a hero or basic-section 50/50
  composition, so the raw components have the room needed for direct review.
- **Pass:** Every audit heading identifies exactly one axis and one variable or
  occupied-block family. Button/segmented/tab/pagination controls are in the
  horizontal action-inset family; they are not mixed with field insets.
- **Pass:** Accordion, list tree, switch, side navigation, TOC, and notification
  appear together in one icon-led/navigation review bucket. Table-cell content
  appears beside the field inset comparison. Page margin, grid gutter,
  navigation depth, and TOC nesting remain layout contracts rather than
  component-padding buckets.

## Review 5 — measured bucket consolidation and confirmed fixes

- **Pass:** The keyline analysis distinguishes axis-specific field/action,
  leading-mark, disclosure, side-navigation, TOC, panel, and specialist inset
  relationships from vertical metric-box and occupied-block families. It
  records all remaining author-visible offset owners before proposing another
  utility or component.
- **Pass:** The component inset vocabulary is now explicit in source: field,
  action, and continuation are the only component-owned inline starts. Plain
  side-navigation headings/commands, disclosure rows, tree leaves, and the
  tagged application-navigation block share continuation; marked rows move
  their mark canvas backward from that copy rail. Page/grid placement and
  named navigation depth remain structural rather than creating another
  component inset.
- **Pass:** Page-chrome and component-demo documentation drawers use a grouped
  H3-plus-UL structure. Groups have an authored 1.5rem gap; every group after
  the first begins with a real `hr`, tightly followed by its H3. The former
  list `::after` divider was removed, and linked headings no longer receive a
  second nested action inset.
- **Pass:** Numeric fields retain native input semantics and keyboard
  increment/decrement behaviour. Their field-owned paired chevron uses the
  same 1rem canvas, vertical centre, trailing position, and reserved padding as
  select, without Chromium's additional spin slot. Status labels now use body,
  rather than H5, metric nudges, fixing the documentation-tier coloured-block
  shift.
- **Pass:** Field, table-cell, chip, borderless-chip, and status-label content
  share green. Commands use the literal one-rem red inset in all four tiers;
  bordered command surfaces subtract the scalable border from their authored
  padding so the first glyph still lands exactly on red.
- **Pass:** Prose lists, ticked/crossed lists and checkbox/radio labels share
  the leading-mark size/gap/offset family. Their copy uses a calculated
  tier-specific remainder to land on blue without a fourth guide. The
  unordered-list dot, state-list marks, checkbox, and radio share an exact
  centre. The enlarged radio dot is concentric with its outer circle, and the
  checkbox check is within one-third of a scalable border unit of optical
  centre. The divided-list half-baseline icon offset was removed.
- **Pass:** Accordion, list-tree, notification, and panel copy now share one
  measured 2rem icon-label continuation in every tier. The notification icon is derived
  backward from that copy line so every tier retains its compact icon-to-text
  gap. The App panel's former 1.5rem content inset was the final outlier and now
  resolves through the same blue continuation owner. The audit did not add a
  fourth guide: red is the literal one-rem inset, green is compact field-like
  content, and blue owns marked/disclosure copy.
- **Current regression validation:** Browser review confirmed both audit routes
  inside the shared 18rem page chrome in light and dark themes, with clean
  fresh consoles. The fixed red/green/blue 0.0625rem overlay is visible at 50%
  opacity only on the horizontal route and recalculates after tier and viewport
  changes; the vertical route instead uses horizontal start/end rules.
  Playwright measured zero keyline delta for the field,
  command, marked-copy, accordion, list-tree, notification, and panel fixtures
  across all four tiers in both tones; the common mark-centre spread and radio
  concentric delta were also zero. Light Editorial and dark OS screenshots were
  inspected directly after runtime initialisation.
- **Latest navigation review:** Playwright measured the shared page-navigation
  heading, plain-link, disclosure, tree-leaf, and tagged-brand starts at the
  two-rem continuation rail, and group separation at exactly 1.5rem in all four
  tiers and both tones. Light Editorial and dark OS screenshots of both the
  horizontal audit and side-navigation component were inspected with page
  chrome present; linked and plain specimen headings both resolved to the same
  two-rem continuation start.

## Review 6 — release-blocking adversarial findings

- **High finding resolved — stale review server:** The source contained the
  grouped navigation rail, but the long-running Vite process retained an old
  page-chrome module graph in the Windows/WSL-shared workspace. This reproduced
  the reported edge-touching rail and missing rules in a real browser. Vite now
  polls that workspace; a source edit made after restart appeared through the
  same running `127.0.0.1:4173` process without another restart. Static
  validation contracts the polling configuration.
- **Medium finding resolved — masked inline baseline:** The compact tag audit
  used a flex cluster, so it did not exercise CSS inline baseline behaviour.
  A true inline body/chip/borderless-chip row exposed a tier-dependent chip
  text drop. Removing the redundant negative vertical-align compensation gives
  both chip treatments zero text-bottom delta beside body text in all four
  tiers; behavior coverage now measures that relationship.
- **Medium finding resolved — unclassified surface starts:** Copy-bearing
  fields, cards, option cards, inline options, modal regions, drawer headers,
  tooltips, search popups and code regions now choose continuation. Contextual
  menu and code-header dropdown commands choose action. The legacy panel inset
  remains a direct padding owner only on the structural top-navigation row;
  no fourth author-visible component guide remains.
- **Medium finding resolved — misleading tiered-list fixture:** The invalid
  full-width list specimens were removed, but the replacement 28rem cap sat
  below the compact row's 32rem query threshold. The two- and three-slot rows
  now live in a supported eight-column BF grid span and visibly render their
  intended slots. The 16-column nested-grid proof was widened to 110rem so its
  content box still clears the 105.0625rem query threshold after the shared
  continuation inset.
- **Terminology and inbox:** Active “element-owned spacing” headings were
  replaced with the current container-owned model. The human inbox items are
  represented by durable demo, source, test and contract changes, and the
  inbox has returned to its empty header.

## Review 7 — final visual evidence

- A real external browser showed the horizontal audit in light Editorial and
  dark OS with shared chrome present, exactly 13 navigation groups, 12 real
  separators, a two-rem heading/link continuation inset, and a 1.5rem
  inter-group gap.
- The three rem-authored fixed overlay lines resolved to one rendered pixel at
  the default root, 50% opacity, and red/green/blue. The number and select
  affordances visibly shared their canvas and trailing position; leading marks,
  disclosure rows, notification and panel copy were inspected on the same
  guides.
- The vertical audit was inspected in light and dark with shared chrome. Its
  true-inline body/chip/borderless-chip row has zero measured baseline delta in
  Editorial, Documentation, App and OS. Affected card/surface and code-snippet
  routes were also inspected in light/dark with no overflow or browser-console
  warnings.

## Review 8 — owner follow-up: branded rail, truncation, and block rhythm

- **Pass — no fourth inset:** The page/grid margin remains responsive layout
  geometry. The tagged orange Circle of Friends block, Baseline Foundry
  wordmark composition, root plain side-navigation row, disclosure label,
  list-tree parent/child, accordion, notification, and panel all consume the
  local continuation inset. This avoids coupling component internals to a
  viewport-dependent grid margin.
- **Pass — real primary-navigation fixture:** `side-navigation.html` now
  contains the Canonical tagged orange brand inside a sticky navigation-brand
  panel header, followed by plain and disclosure primary-navigation rows.
  Playwright measured the tag, Workspace, and Machines starts at the same
  coordinate in light and dark.
- **Pass — select pressure:** Select owns one 1rem trailing chevron canvas and
  clips/ellipsizes long selected text before it. Light/dark browser review of a
  constrained specimen showed no text/chevron collision.
- **Pass — vertical audit model:** Six horizontally scrollable rows compare
  shipped specimens at a shared red block start and individual blue occupied
  ends. The inset overlay is absent. Controls form one occupied family across
  all tiers; tabs remain with navigation, and density-tuned table rows are
  permitted to differ by no more than one baseline rather than being flattened
  into controls.
- **Finding resolved — icon-only control collapse:** Inline-flex icon-only
  buttons previously lost the body line box and became shorter than text
  controls. A zero-width body-line metric strut restores occupied rhythm
  without a target height; the icon-only specialization is gapless so close
  controls do not gain inline overflow.
- **Evidence:** `npm run build`, `npm run test:build` (6,571 checks), and
  `npm run test:behavior` passed. In-app browser screenshots verified the
  horizontal/vertical audits, branded side-navigation rail, and constrained
  select in light and dark with shared chrome and clean consoles. `npm test`
  and `npm run qa:components` then passed with zero component-baseline
  failures. Temporary browser servers now bind within the browser-safe dynamic
  port range, removing the observed `ERR_UNSAFE_PORT` release-gate flake.

## Review 9 — tabbed chapter and measured 5rem height families

- **Pass — chapter composition:** The spacing chapter uses two shipped
  basic-section rows for heading-left/content-right guidance. Horizontal and
  vertical audit buttons are keyboard-operable BF tabs; they change the panel
  and URL hash without changing the page pathname.
- **Pass — single source:** The tab panels load the readable axis-route section
  markup rather than duplicating it. Direct horizontal and vertical routes
  remain available for isolated QA, while the chapter contains one H1 and the
  active panel is labelled by its selected tab.
- **Pass — measured vertical buckets:** Every raw specimen is exactly 5rem
  wide. Playwright measured equality across Editorial, Documentation, App, and
  OS for nine controls; six compact tree/navigation/choice rows; seven text
  runs; the divided-list/tab pair; and the accordion/chip pair. Table remains
  within one baseline of controls but is documented with breadcrumbs as an
  independent density contract.
- **Pass — focused evidence:** Per-specimen H6 labels, textarea, file, range,
  and content-driven composite surfaces are absent. The actual component copy
  identifies each compact specimen, and the six rows sit closer through the
  normal pattern stack rather than a section stack.
- **Pass — overlay and browser state:** A fresh real-browser review in light
  and dark retained one shared header and side navigation with no console
  errors. Horizontal shows the three one-rendered-pixel rem-authored guides;
  vertical hides them and retains its red-start/blue-end rules.
- **Evidence:** `npm run build`, `npm run test:build` (6,573 checks),
  `npm run test:behavior`, `npm test`, and `npm run qa:components` passed with
  zero component-baseline failures.
