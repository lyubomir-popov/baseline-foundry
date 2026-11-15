# Review: Figure-caption compensation

Date: 2026-11-14. Source base:
`18857d9dacabd95a07b590d9511bc27311b9666f`. Candidate is this branch's bounded
source/test/demo change; no font metrics, role tokens or generator code changed.

## Result

Technical review passes. `.bf-figure-caption` now resets only its start margin,
preserving native or explicitly selected text-role end compensation. Existing
italic/default-color behavior and stronger explicit-role precedence remain.
Container-owned figure and stack gaps are unchanged.

## Validation

Node 22.21.1, npm 11.19.0 (`npx --yes npm@11.19.0`), Windows.

| Check | Result |
|---|---|
| Clean worktree dependency install | `npm ci --ignore-scripts` passes, zero reported vulnerabilities; locked demo fonts copied from the existing source checkout |
| Focused red proof | Before source change, native configured-meta caption has 30.546875px box and zero end margin versus intact role's 39.986875px occupied box; following baseline differs by 18.875px after two figures. Test exits 1 |
| Build and `check:types` | Pass |
| `npm test` | Pass: 19,122 static checks; 332 component reports / 5,466 checks, zero failures; full behavior runner passes including the initial 512-case caption matrix |
| Final focused proof | Pass: 768 Chrome cases, comprising 256 stock direct/shared cases and 512 configured-meta direct/shared cases. The later test-only stock expansion was run separately; the full suite used the initial 512 version. Production code did not change afterward |
| `qa:components` | Pass: 86 captures and 332 baseline reports, zero failures |
| Figure catalog in Chrome | 16 states across 390px/1440px, four tiers, light/dark; no page overflow or runtime errors; native italic and explicit body-role normal style preserved. Screenshots under `tmp/caption-demo/`; phone Editorial/light and desktop OS/dark inspected visually |
| Consumer real-font source proof | Portfolio's temporary build through this source's public build API restores actual Plex Italic caption to 40px occupied (24px line +6px nudge +10px end margin), following body baseline 904px on the 8px grid. Consumer owns durable receipt and subsequent artifact proof |
| Diff integrity | `git diff --check` passes |

## Independent adversarial review

Runtime reviewer: `gpt-6-sol`, read-only child `caption_review`. The reviewer
inspected source/API, static assertion, focused fixture and demo, and found no
source/API regression. Its P2 evidence finding was that the initial 512 cases
all added `meta: body`, so they did not prove stock tier bundles. The final
fixture adds 256 genuine stock cases and retains the configured-meta cases;
the reviewer rechecked that change and marked the concern resolved, with no
new finding. It also requested correction of the stale 32px/888px expectation;
the spec now records the governed 40px/904px outcome.

## Limits and integration boundary

Stock tiers omit meta, so native stock captions inherit body typography
without a generated caption-role nudge. The stock demo's explicit body-role
caption exercises the repaired metric path; configured-meta native italic
wrapping is exercised in the focused fixture. Explicit visual-role style/color
precedence is retained, not redesigned.

Focused proof and demo use installed Chrome; existing full-suite browser
helpers use their configured Chromium build. This repair claims neither
cross-engine generator accuracy nor owner visual acceptance. Portfolio's
H3/H4 discrepancy and CP2/CP3/CP4 remain open. No extra upstream owner gate was
introduced; the user-requested handoff permits isolated candidate consumption
after this technical review. No merge, source push, registry publication or
deployment is authorized or performed. Existing root/worktrees remain intact.
