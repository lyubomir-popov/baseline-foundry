# ApplicationLayout mobile chrome integration review

Date: 2026-10-09
Branch: `feat/028-shared-spacing-decisions`
Final source/runtime: `6f7f4683979746f1fbf96f6de77f6767560cec00`
Prior published carrier: `9d23de59d02582039c07f644a48c2617af13613d`

## Verdict and scope

The bounded mobile demo repair is ready for owner visual review, subject to the independent findings recorded alongside this report. This is an engineering integration verdict, not an external Opus verdict or owner sign-off. The next mandated external review is the existing Spec 024 T011g popup-correction request. Accepted spacing repairs and accepted R1 remain closed; this slice does not create another R1/ApplicationLayout Opus loop.

Only `demo/page-chrome.css` and `scripts/verify-component-behavior.ts` change execution. The source commits are `914c5540b2a1470f84e4bd8452638d9e14156179` (mobile repair and regression coverage) and `6f7f4683979746f1fbf96f6de77f6767560cec00` (settled-paint readiness). No product CSS/runtime, measured spacing values, config, dependency, archived Before bundle, After CSS bundle or provenance changes. Pragma and design-tokens are untouched. Documentation routes the completed prerequisite and outstanding gates.

## Integration findings and dispositions

1. The original shared rail/header/footer covered the real ApplicationLayout brand, Pin and Close at 390px. Independent baseline evidence reproduces all eight Before/After × tier cases. The new selector follows the actual direct ApplicationLayout anatomy and expanded state, under the exact opposite of its product `min-width: 48rem` breakpoint. It hides direct shared header/footer with retained layout boxes and removes the shared rail with `display: none`. An explicitly visible rail descendant cannot escape that removal. At 768px and above the rule does not apply, including persistent pinned navigation. Root inspected the CSS diff and actual mobile screenshot evidence.
2. Regression checks use real pointer opening and Pin/unpin/Close, full forward and reverse Tab cycles, Close/Escape trigger restoration, all five shared controls tested at their focused coordinates, real Pages recovery, both bundles, four tiers and integer breakpoint neighbors. Pages can scroll offscreen during a complete document focus cycle; ordinary scrolling before its pointer test is necessary. These checks do not claim all shared controls stay simultaneously onscreen.
3. Independent evidence identifies a pre-existing persistent-layout Pin pointer limitation in four of 32 probes: Before and After Docs at 768px, and Before and After Editorial at 1035px. The footer covers Pin in these cases; keyboard Space activates all 32. The root 768px programmatic pin check proves state/chrome retention only. This slice fixes the below-768px mobile overlap; it does not certify all-width ApplicationLayout visual approval. The four pointer cases are recorded as separate follow-up work.
4. The initial root full test and worker behavior attempt 4 encountered the existing SideNavigation immediate-reopen brand hit assertion before its drawer animation settled. The independent timing probe found the new ApplicationLayout selector matched zero in all eight states; every SideNavigation state owned its brand center by 100ms, with transforms settled at 180/250ms. The final harness waits for non-running drawer animation and real target ownership before the unchanged acceptance assertions. Accepted R1 CSS/runtime behavior is unchanged.
5. Failed worker attempts are preserved: TSX callback serialization, offscreen Pages assumption, premature ApplicationLayout transition sampling, and the later SideNavigation readiness race. Independent matrix attempts also preserve their probe defects and subsequent corrections. Its final broad attempt evaluated 144 states and 1708 assertions, with 12 failure records (1696 assertions passed); it is not a green aggregate. The nine focused failed-route reruns pass 252 assertions with no failures, using normal non-forced locator clicks, fresh actionability/scrolling and an explicit drawer-open assertion before Escape. They identify the eight sticky-header-covered product reopen cases and one Before/Docs catalog/focus/fatal route as probe defects. Full independent details remain adjacent. Root full test at `914c5540b2a1470f84e4bd8452638d9e14156179` failed on the SideNavigation race. Root caught an incorrect brand selector in unpublished candidate `4ca109f17b3a832adfc6a7fdaf8857a726717078`, terminated its owned test process tree, preserved its partial log/cancellation record/diff, corrected to the actual `.bf-top-navigation-link`, and amended that unpublished readiness commit. The cancelled run is not a pass. Final green gates below all belong to `6f7f4683979746f1fbf96f6de77f6767560cec00`.

## Final root gates

Node 22.21.1; pinned npm 11.19.0. Commands ran from the BF root. Full test includes source build, static contracts, component baseline checks and browser behavior. QA captures are copied separately into the new evidence root.

| Target | Exit | Seconds | Log SHA-256 |
|---|---|---|---|
| `check:types` | 0 | 1.12 | `495868b9969288e49fe43f0c79cdcb673fe488529af95a020247b5335ddf69ea` |
| `test` | 0 | 263.75 | `3992ea607fbe5185c2a52ba2325b03b57dccdfe9f4c5e5b79a0efd26d4528ed3` |
| `qa:components` | 0 | 122.49 | `f0aed169c8602d7c975934dba059f482a5b9539e5a2eb5bab52a44d8f82b4a4e` |
| `verify:spec-028-provenance` | 0 | 1.41 | `c5ce9b26b635d62b7cd40b1d3a54fcc9e9c44bfa7b0e8e7e5f779a3cf270aaeb` |

Raw records live under `H:/WSL_dev_projects/temp/bf-028-application-chrome-20261009/`. The adjacent independent and worker reports record exact coverage, findings and failed attempts. The new manifest seals this slice only; all four previous manifests and the protected source/receipt/probe files are independently rechecked without rerunning their output-producing verifiers.

## Remaining limits and next checkpoint

Full Firefox/Safari, native Windows contrast themes/display scaling and fractional viewport pixels are not covered by this Chromium slice. Attempted fractional CDP viewport dimensions were rejected; changing author root font size does not alter the media-query rem threshold. Integer breakpoint checks and complementary source conditions are the evidence. Product non-modal background focus and DrawerPanel's retained shared chrome are unchanged limitations.

The existing dependency audit fails on transitive `source-map-js` GHSA-68fv-2mgg-jv7q after passing engineering checks. Prior acceptance-carrier CI runs 37996976168 and 37996970551 both finished with that failure. Dependencies are unchanged; local gates do not certify release/CI readiness.

Owner visual approval, the explicit N2 forced-colors outline fallback decision, equivalent governing-main activation and full-SHA repin remain open. Spec 024 T011g's existing popup request remains pending. T011i contributes signed-off values to design-tokens after T011h sign-off; Pragma foundation work follows its planning and governing activation gates. No merge, release, token publication, waiver or new ruling is inferred.
