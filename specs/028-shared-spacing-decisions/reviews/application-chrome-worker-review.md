# Spec 028 ApplicationLayout shared-chrome repair — worker report

Date: 2026-10-09
Worker start tip: `9d23de59d02582039c07f644a48c2617af13613d`
Root-created runtime commit after frozen-file handoff: `914c5540b2a1470f84e4bd8452638d9e14156179`
Branch: `feat/028-shared-spacing-decisions`

## Scope and custody

The worker changed only:

- `demo/page-chrome.css`
- `scripts/verify-component-behavior.ts`

The root agent committed those two frozen files at `914c5540b2a1470f84e4bd8452638d9e14156179` while the worker's final behavior attempt was running. The current dirty tracked spec/inbox files are root-owned documentation work. The three untracked Opus receipts were preserved unchanged. No product CSS, runtime, values, Before/After bundles, provenance, dependencies, Pragma source, release state, or owner decision was changed.

## Reproduction before repair

The original 390×844 Chromium probe used a real pointer-open of ApplicationLayout. It recorded:

- product drawer brand center hit the shared `.pc-header` breadcrumb instead of the brand;
- product Pin center hit the shared bundle-version select;
- product Close center hit the shared tier select;
- shared `.pc-nav`, `.pc-header`, and `.pc-footer` remained rendered;
- no page or console errors.

Raw evidence:

- `old-overlap-probe.log` — SHA-256 `d16cf804fbb91ad5f0911729111d7a6aa336bf10f91ab46c4e4b26746ae0eae5`
- `old-overlap-390x844.png` — SHA-256 `833d46ec9cf9c80544ef9ee2ed78b375c537828e8eb9e9e22b28349b6da0888f`
- `probe-old-overlap.mjs` — SHA-256 `aa9e31a3d53ee0b930cf5498bb653eef60d7847796fd32c548ab9c928d942939`

## Implemented repair

The demo-only CSS uses ApplicationLayout's actual direct anatomy and product breakpoint:

```css
@media (width < 48rem) {
  body:has(> .pc-content > .bf-application > .bf-navigation:not(.is-collapsed)) > .pc-nav {
    display: none;
  }

  body:has(> .pc-content > .bf-application > .bf-navigation:not(.is-collapsed)) > :is(.pc-header, .pc-footer) {
    visibility: hidden;
  }
}
```

`display: none` is intentionally retained for the shared rail because its SideNavigation drawer has an explicit visible descendant state. Header/footer use `visibility: hidden` so their layout boxes remain while rendering, pointer targeting, and focus stops disappear. At and above 48rem, including expanded and pinned desktop navigation between 768px and the shared chrome's 64.75rem breakpoint, the rule does not apply.

The behavior harness now covers:

- a real, non-forced product opener click at 390px;
- product brand, Pin, and Close center hits;
- no rendered shared-rail/header/footer focus descendants while open;
- full forward and reverse Tab cycles from the real in-drawer Close, excluding shared chrome;
- real Pin, unpin, and Close pointer behavior;
- full forward and reverse restoration after product Close and product Escape, distinguishing Pages, tone, baseline, version, and tier and checking each focused control's actual center/label-owner hit;
- real Pages pointer open and Escape close after both product-closing paths;
- an adversarial pre-expanded shared catalog with a visible drawer descendant, which still has zero rendered descendants because `.pc-nav` is `display:none`;
- exact 767/768px product boundary plus 1035/1036px shared-chrome boundary checks;
- pinned desktop shared-chrome retention at 768px;
- all eight Before/After × tier states at 390px.

## Green focused evidence

`npx --yes npm@11.19.0 run check:types` passed after the final harness edit. The final worker log is:

- `check-types-attempt-3.log` — SHA-256 `315ddf78ae96d26254506037f4909ac94e140b75754d9fd7fd7e604ef854d68c`

The focused repaired-state probe passed real open, Pin/unpin, Close, Escape, focus restoration, all five shared-control hits after closing, and clean runtime errors:

- `after-repair-probe.log` — SHA-256 `42cecc8142358fc8127ac1783a1fc92586a7184a8ef6aa274580b7a676c99bde`
- `after-open-390x844.png` — SHA-256 `459fc93c1a7cffe3f91dd87a21c220833d4eb18ede8a798c2df2dce24849c84b`
- `probe-after-repair.mjs` — SHA-256 `300f7cb1bd2739c3c2ed7d4a62d205c54633715a780d4aa91787107f97f9cb74`

The separate all-eight matrix passed brand/Pin/Close center ownership and `none/hidden/hidden` shared chrome in every Before/After × editorial/documentation/app/OS state:

- `all8-matrix-probe.log` — SHA-256 `2b897033416cec2669038df48f6d1909145e1aa717838aa9aa86a87dbc90a1d1`
- `probe-all8-matrix.mjs` — SHA-256 `65796608eb93d1cb4bc3f73f3f77c5b00db38061818678f40df6e70ffe9554bb`

## Preserved failed full-behavior attempts

All failed attempts remain separate:

1. `test-behavior-attempt-1.log`, SHA-256 `610356e8c5e1293aed467004765a9b9f83503f06f53f9a7d29eba6abf63becf5`: new browser evaluation used a TSX-named helper and failed with `__name is not defined`. The helper was replaced with directly serialized callbacks.
2. `test-behavior-attempt-2.log`, SHA-256 `4a749c91722ce797838dc45da02dd59eeff2c36242e4d887d0bae03c18f2ab3a`: an overstrong immediate Pages center-hit assertion ran after a full focus cycle had scrolled the static rail offscreen. The final test checks each control while focus scrolls it into view, then separately scrolls Pages into view and performs a real pointer open/Escape close.
3. `test-behavior-attempt-3.log`, SHA-256 `3c0816d1db1ec2a84a31a92489113b8116636534f0669a076e8f273bee913544`: the all-eight matrix sampled the first Before/editorial drawer before its 160ms product transition settled. The focused 220ms all-eight probe passed; the committed harness currently uses 180ms.
4. `test-behavior-attempt-4.log`, SHA-256 `f6662c68ccfe774e40c5d16dde8481953c2ab24b70ea8e1ace5c9ab394e9bf78`: every new ApplicationLayout check passed, then the much later existing R1 SideNavigation keyboard-reopen check sampled its visible brand before pointer ownership settled (`brandHit:false`). Its shared rail/header/footer suppression and expanded state were correct. This is outside the new ApplicationLayout selector and remains for root's exact-pin full test to confirm or reject as a transient readiness race.

The independent reviewer reproduced item 4 across Before/After × four tiers at 390px. Immediate samples found the SideNavigation drawer still translated by -210px to -384px; seven states owned the brand center by 16ms, After/OS by 50ms, and all states by 100ms. At 180ms and 250ms every drawer transform was settled and every brand center hit. The new ApplicationLayout selector matched zero during that probe. Reviewer raw evidence is `H:/WSL_dev_projects/temp/bf-028-application-chrome-20261009/reviewer/side-navigation-reopen-timing-attempt2-results.json`; the reviewer's failed first probe is separately preserved.

## Review needs and limits

- Root owns the required full root test, component QA, provenance, documentation, and final gate record at `914c5540b2a1470f84e4bd8452638d9e14156179`.
- The committed all-eight harness has a fixed 180ms settlement after a 160ms product transition. A state-based wait for all three product center hits would be more durable and would remain a valid old-CSS negative control. No further source edit was made after root froze and committed the files.
- The final worker full behavior run did not finish green because of the later pre-existing SideNavigation reopen timing check described above. Do not cite the worker run as a full behavior pass.
- Product non-modal background focus behavior was not changed or claimed corrected. DrawerPanel shared chrome was not changed. The accepted R1 SideNavigation CSS was not changed.
- This delta has not received a new Opus review and does not create or require a new BF/R1 checkpoint. Owner mobile ApplicationLayout visual approval remains outstanding. The separate existing T011g popup diagnostic request remains the next mandated Opus checkpoint.

## Scratch inventory

All worker evidence is under `H:/WSL_dev_projects/temp/bf-028-application-chrome-20261009/worker/`. No previous scratch evidence or sealed repository evidence was overwritten.
