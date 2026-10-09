# Independent adversarial review — ApplicationLayout shared demo chrome

Date: 2026-10-09
Reviewer scratch: `H:\WSL_dev_projects\temp\bf-028-application-chrome-20261009\reviewer`
Baseline: `9d23de59d02582039c07f644a48c2617af13613d`
Reviewed source: `6f7f4683979746f1fbf96f6de77f6767560cec00`

## Verdict

No blocking defect remains in the bounded `<48rem` ApplicationLayout demo-chrome repair. The repair is ready to be presented for the still-required Spec 028/T011h owner mobile visual review. This verdict does not grant that visual approval and does not infer any external Opus verdict.

Complete all-width ApplicationLayout approval is not supported. A separate, pre-existing persistent-navigation limitation remains: a real pointer cannot activate Pin in 4 of 32 independently tested desktop/boundary states because the fixed shared footer owns the Pin center. The affected states are Before and After documentation at 768px, and Before and After editorial at 1035px. Keyboard activation passes in all 32 states. This is outside the new `<48rem` CSS rule and needs separate follow-up before those widths receive complete visual approval.

## Source and scope audit

The committed delta from the baseline contains exactly two files:

- `demo/page-chrome.css`
- `scripts/verify-component-behavior.ts`

No product source, built bundle, config, package manifest, lockfile, dependency, or provenance file changed. All eight Before/After tier bundle hashes still match `demo/spec-028/provenance.json`. The accepted untracked `opus-028-r1-correction-review.md` is unchanged at SHA-256 `04630d8de77da208b7e11c9f17af3cc3dedfed22b16aff6fedb9b2f3bc8955df`.

The working tree also contains root-owned plan, task, inbox, and review-document changes. This review did not alter them or any repository file.

The CSS selector follows the actual demo/product anatomy:

`body:has(> .pc-content > .bf-application > .bf-navigation:not(.is-collapsed))`

Under `@media (width < 48rem)`, it sets only the direct shared rail to `display: none` and the direct shared header/footer to `visibility: hidden`. The direct-child and exact expanded-navigation conditions avoid matching the unrelated SideNavigation specimen. Keeping the rail at `display: none` prevents its own drawer rules from restoring visible descendants. Header/footer keep their boxes, so the demo geometry does not collapse. At 48rem and above the rule no longer applies and shared chrome remains visible.

The behavior harness additions inspect computed display/visibility, retained rectangles, center ownership, rendered descendants, real pointer actions, complete forward/reverse keyboard cycles, pointer Close, Escape, Pin/unpin, boundary states, and all eight Before/After tier combinations at 390px. The final test-only wait observes the existing drawer animation and real brand ownership; it uses no browser helper globals and targets the existing `.bf-top-navigation-link`.

## Baseline diagnosis

The unmodified baseline reproduced the reported overlap at 390px in Before and After across editorial, documentation, app, and OS. The product drawer is fixed at z-index 42, while shared rail/header/footer layers are z-index 140/130. The shared rail/header intercept the visible product brand and the fixed footer/version/tier region intercepts Pin and Close. All eight baseline states reproduced the ownership failure without horizontal overflow or runtime errors.

Raw evidence: `baseline-390-results.json`, `baseline-390-summary.json`, and eight `baseline-*-390-open.png` screenshots.

## Changed-state evidence

The final aggregate attempt is preserved rather than rewritten as a false green result:

- `changed-browser-matrix-attempt3-results.json`: 144 states; 40 narrow ApplicationLayout, 72 persistent ApplicationLayout, 16 SideNavigation, and 16 Tooltip; 1,696 of 1,708 evaluated assertions passed; 12 failure records.
- `changed-browser-matrix-attempt3-summary.json`: compact counts plus only failed state/label pairs.
- All 40 narrow states passed the core repair assertions: real opener route; fixed mobile drawer; product brand/Pin/Close center ownership; shared rail suppression; header/footer hidden with boxes retained; zero visible shared descendants; full forward and reverse cycles with no shared-chrome focus stop; real Pin and unpin; pinned ownership; real Close and focus restoration; restored shared chrome; restored Pages/four-control hits; and no horizontal overflow.
- All 72 persistent states passed persistent layout, shared chrome visibility, four shared-control center ownership, keyboard Pin behavior, Close behavior, the 48rem boundary condition, the 64.75rem shared-chrome condition, and runtime/overflow checks.
- All 32 unrelated states passed their accepted SideNavigation or Tooltip interaction checks.

The 12 aggregate failures were probe-route defects, not product failures:

- Eight Escape assertions attempted a raw-coordinate click after complete document focus traversal. The opener had become geometrically visible under sticky shared breadcrumbs, so its center belonged to those breadcrumbs; the drawer never reopened and Escape correctly left focus on `body`.
- One Before/documentation/LTR/390 state reused a catalog scroll position from before four footer interactions. Its catalog click missed, causing three failed assertions and one subsequent null-state fatal.

The failures were replayed only in the nine affected states with normal, non-forced Playwright pointer actions, a fresh actionable scroll, an explicit assertion that the product drawer opened before Escape, and settlement of the existing catalog transition:

- `changed-browser-matrix-failed-route-supplement-results.json`: 9 states, 252 assertions, 0 failures.
- `changed-browser-matrix-failed-route-supplement-summary.json`: compact zero-failure summary.

Earlier failed attempts are retained under distinct paths. Attempt 1 recorded 231 failures because its oracle treated `checkVisibility()` without `visibilityProperty: true` as proof of rendering, required a desktop Pages control, tested multiple offscreen controls simultaneously, and opened SideNavigation before tier setup. Attempt 2 corrected those issues and left eight raw-coordinate pointer-reopen failures. Neither failed run is presented as green evidence.

## Behavior findings

At 390px and 767px across both bundles, all four tiers, LTR and RTL, with an additional 390px LTR/DPR 1.5 supplement:

- product brand, Pin, and Close own their visible centers;
- Pin and unpin work through real pointer input;
- Close and Escape restore focus to the product opener;
- no hidden shared rail/header/footer focus stop appears in complete forward or reverse cycles;
- after Close or Escape, Pages and the tone, baseline, version, and tier controls regain real center ownership and keyboard reach;
- forcing the shared SideNavigation drawer into its expanded class/ARIA state does not leak a visible or focusable descendant while the ApplicationLayout drawer is open;
- header/footer boxes remain present while hidden; and
- there is no horizontal overflow or console/page error.

The product drawer remains nonmodal. The instrumented full cycles encountered 13 reachable background/product-document stops while it was open. The change removes only hidden shared demo-chrome stops and makes no focus-trap claim.

The accepted SideNavigation timing probe covered Before/After and all four tiers at 390px. Immediately after the expanded class appeared, its drawer was still translated and brand ownership was false in all eight states. Seven owned the brand center by 16ms, all eight by 50ms, and all remained green at 100, 180, 250, and 400ms. Across all 56 timing samples the new ApplicationLayout selector and navigation-anatomy match count was zero. This is an existing transition race, not a regression caused by the new selector. The committed state-based wait addresses the harness race.

The separate persistent Pin probe covered Before/After × four tiers × 768/1035/1036/1440, LTR:

- real pointer activation: 28/32;
- keyboard Space activation: 32/32;
- four pointer failures: documentation/768 and editorial/1035 in both bundles, with `DIV.pc-footer-bar` owning the Pin center.

## Boundary and visual evidence

The browser matrix proves the exact integer complement: 767px uses the fixed mobile drawer and hides/suppresses shared chrome while expanded; 768px, 1035px, 1036px, and 1440px use persistent product navigation and keep shared chrome visible. DPR 1.5 cases passed at 390px and 768px.

Chromium/CDP rejected fractional layout viewport widths such as 767.5 and 1035.5 as invalid parameters. Changing the authored root font size did not alter the media-query `rem` threshold because media queries use the initial font size. Consequently, fractional CSS-layout-pixel widths were not tested. The evidence supports the complementary source queries and integer boundary behavior, not a fractional viewport claim.

Settled screenshots inspected directly:

- `final-settled-before-app-ltr-390-open.png`
- `final-settled-after-app-ltr-390-open.png`
- `final-settled-after-app-rtl-390-open.png`
- `final-settled-after-app-ltr-390-pinned.png`
- `final-settled-after-app-ltr-768-open.png`
- `final-settled-after-app-ltr-1035-open.png`
- `final-settled-after-app-ltr-1036-open.png`

The 390px Before/After and LTR/RTL images show the complete product drawer and scrim without shared chrome covering the brand or Pin/Close row. The pinned image shows the active Pin state. The 768px image shows the expected persistent product navigation together with restored Pages, breadcrumb/header, and footer controls. Screenshot metadata, including computed visibility and center ownership, is in `final-settled-screenshots.json`.

## Environment and limits

Browser evidence used headless Chromium through Playwright. Firefox and WebKit were not tested. No genuine fractional layout viewport was available. Owner visual approval remains outstanding. External Opus sequencing remains unchanged: this review neither replaces nor adds an Opus gate.

Root separately reported the final `6f7f468` gates green: type checking 1.12s, full test 263.75s, QA 122.49s, and provenance 1.41s, with 219 protected files and four prior seals verified.
