# Independent Astra review — portable image comparison

Reviewer: `gpt-6-astra`, independent of runtime and CSS implementers
Reviewed revision: 2524b24e54a8f10dc938bf76fb111d6ae8b7dbd6
Verdict: accept
Date: 2026-11-15

**Accept the bounded BF source/API and rendered component at `2524b24`.** All three product findings below are independently rechecked and resolved; the required final `npm test` and `qa:components` runs pass on that unchanged revision. No blocking technical finding remains. This satisfies Spec 030's independent BF technical review and permits the already authorized immutable candidate preparation. It does not accept an unexamined tarball or downstream adapter, grant owner visual acceptance, clear portfolio CP4, or authorize merge/push/publication. Astra is the actual reviewer under the owner's personal-project substitution; this is not an Opus review.

## Scope and evidence identity

Read BF instructions/index/inboxes/catalog/constitution and Spec 030 spec, plan, tasks, quickstart, request and public README. Reviewed source/API/CSS/demo/proof changes against caption-preserving base `df966ac`. The initial rendered examination used a fresh Chrome context against `http://127.0.0.1:58656` only after the coordinator confirmed rebuilt `b320266` runtime. Its compiled runtime SHA-256 is `9e6aabbce9b62902e481a599369c08675a4c938f203eab0992500d17ace618c3`. No reviewer build, install, product edit or service cleanup occurred.

The earlier full `npm test` pass belongs to compiled `7a6123f`, not the revised naming source; it is not used as the final validation receipt. Final acceptance relies on the repaired source/build and completed final suites recorded below. Portfolio's earlier local technical acceptance is a prerequisite, not proof of this BF implementation.

The repaired source `2524b24` was then reviewed against `b320266` and independently exercised after the coordinator's rebuild notification, using fresh pages/contexts. Both final independent runtime and naming receipts record compiled runtime SHA-256 `cd42f2fbe49b3788e80979881a5f075a753dc24921de802ade242f18faa49478`; the generated editorial CSS in the repaired endpoint reproduction hashes to `378225f35294851017d32cb9ad4672b20b51c92dc27cff02d7d3db323ab2c410`.

## Ranked findings

### P2 — raw textContent is not a native accessible-name validator

**Observed on b320266.** `authorLabelName()` treats nonempty raw `textContent` as a meaningful native label. `<label for="value"><span aria-hidden="true">Ignored decorative text</span></label>` passes setup while the browser exposes an unnamed slider. Conversely, labels containing an image's valid alternative text, a label's `aria-label`, or an `aria-labelledby` target's alternative name are actually named in Chrome but setup throws `Image comparison requires a named native range.`

Reproduce using [probe.mjs](reviews/evidence/astra/probe.mjs); [naming-probe.json](reviews/evidence/astra/naming-probe.json) records actual `ariaSnapshot()` results and unchanged invalid-setup markup. The prior empty-label repair is effective for its seven fixtures, but does not establish the more general name-inference policy.

**Requested disposition:** stop accepting unnamed controls/rejecting legitimately named controls based on raw text. The coordinator's explicit ownership correction is sound for this unreleased API: remove the optional `accessibleName` API and all runtime accessible-name inference/writes; make valid native labelling a consumer precondition, with actual positive browser name tests. The public contract must expressly say setup does not compute/validate the Accessible Name algorithm. Update types, docs, spec/plan and tests consistently; preserve externally edited native name/association through update/destroy. This is a narrowed responsibility, not an assertion that unnamed markup is accessible.

**Resolved at 2524b24.** Public types, README and governing spec/plan now consistently remove `accessibleName` and assign native naming to consumer HTML/ARIA. Runtime no longer reads textContent or writes/restores aria-label; it retains percentage value text and endpoint metadata. The documentation explicitly identifies unnamed markup as an undetected consumer accessibility error. [Independent final naming proof](reviews/evidence/astra/naming-final.json) passes eight cases covering text, image-alt labels, label/labelledby ARIA names, native aria-label/title, and the intentionally invalid hidden-only label. Live external name edits and unrelated consumer color survive update/destroy. A valid title-only fixture must omit an empty associated HTML label: the reviewer initially retained one, causing the browser itself to suppress the title. That fixture correction is recorded in [the initial final-probe result](reviews/evidence/astra/naming-final-initial-fixture.json); it was not a runtime defect. The final source/API import and emitted types were inspected. No actual AT announcement claim is made.

### P2 — transparent letterboxing leaks the opposite image at full first reveal

**Observed on b320266 generated CSS.** With the documented unpainted slot markup, a contained landscape first image over a portrait second image leaves the second visible above/below the first at value 100. `.bf-image-comparison-layer` has no background. The demo's explicit slot backgrounds conceal the defect, so its endpoints alone do not prove the generic contain-image contract.

Reproduce with [opaque-endpoint.mjs](reviews/evidence/astra/opaque-endpoint.mjs): a red 320×160 first image in a picture element, blue 80×160 second image, 300px host/200px stage, initialValue 100. [Fresh screenshot](reviews/evidence/astra/unequal-ratio-before.png) visibly shows blue outside red; [raw state](reviews/evidence/astra/unequal-ratio-before.json) records both transparent backgrounds and the fully open first mask. This contradicts the specified complete opposite-slot reveal.

**Requested disposition:** provide a neutral opaque theme canvas for each slot, or change the public contract explicitly. The default theme-canvas repair addresses the cause without adding a stage frame; the generated output needed the same unequal-ratio fixture, including actual screenshot inspection, before acceptance.

**Resolved at 2524b24.** Each layer now defaults to `background: var(--bf-color-bg)`. The same independent fixture has both backgrounds `rgb(255, 255, 255)` and its [fresh after screenshot](reviews/evidence/astra/unequal-ratio-after.png) shows only the red first image and neutral letterboxing at 100; the blue opposite image is absent. The screenshot was viewed, not merely generated. [After receipt](reviews/evidence/astra/unequal-ratio-after.json) records the generated CSS hash, full mask and loaded contain-fitted picture/image assets. README/spec make an intentional transparent background override an explicit opt-out from opaque full reveal. No image frame or layout border was added.

### P3 — destroy leaves a runtime-created empty style attribute

**Observed on b320266.** Setup on a valid host with no initial style attribute sets the position custom property. Destroy removes the property but leaves `style=""`, so the specified snapshot restoration is not exact. The existing snapshot fixture already has a style attribute and misses this case.

The `No-style initial host snapshot restored byte-for-byte` record in [independent-runtime.json](reviews/evidence/astra/independent-runtime.json) contains exact before/after markup. Preserve whether the style attribute existed, remove a runtime-created empty attribute on destroy, and retain any consumer styles added while live. Recheck idempotence and live consumer-style preservation.

**Resolved at 2524b24.** `hadStyle` records original attribute presence; destroy removes only a runtime-created attribute that is still empty. The [final independent runtime proof](reviews/evidence/astra/independent-runtime-final.json) now passes all 144 checks, including exact no-style snapshot restoration, with no runtime errors. The naming proof independently retains a live consumer color declaration through repeated destroy/stale-handle operations. Root's focused fixtures additionally distinguish authored-empty, authored-nonempty and live-added styles.

## Independent behavior and rendered review

The [independent runtime script](reviews/evidence/astra/independent-runtime.mjs) records 144 checks, 143 passing and only P3 failing, with no page errors. It covers all four direct/shared tiers × LTR/RTL × root16/root20, constrained 240px/wide 960px hosts, real stage drags, native arrow direction, both endpoint focus/runway geometry, and configurable grip/focus inputs. First-slot mask, native value, seam and grip remain synchronized. All tiers preserve the 1.5rem width/fixed 80px decorative height. Forced colors retain zero layout border and independent stroke/focus paint.

Lifecycle probes pass idempotent setup, silent API normalization, same-value echo preserving capture, changed API interruption winning over release, synchronous setValue and destroy/remount from input/change/cancel phases, disabled/inert behavior, injected nested-host rejection, and a direction change during capture that leaves the normalized value unchanged. The replacement controller survives old handler completion. The public root ESM import exposes `setupImageComparison`; no consumer/private import was used by the tests.

The actual catalog demo was operated and captured on all four direct/shared paths. [Demo/touch evidence](reviews/evidence/astra/demo-touch.json) records named native controls, complete endpoint grip/focus, contained landscape/portrait assets, no content transforms, horizontal touch to 78, touch-cancel restoration to 78, a two-point pinch preserving 78 while viewport scale becomes 1.5552, and disabling the control mid-gesture restoring 50. This is emulated Chrome touch evidence, not physical-device proof. The initially short demo could not scroll; [separate tall-framing follow-up](reviews/evidence/astra/content-touch-followup.json) proves native vertical scroll 0→174 while value 1 remains unchanged. Broken image → consumer fallback preserves 37; zero stage width preserves 37; restored-stage input reaches 66.

Fresh screenshots were actually viewed: independent RTL captures in every shared tier, custom forced-color geometry, actual editorial/app light and documentation/OS dark demo endpoints, and both unequal-ratio reproductions. The final rerun repeats the full 144-check matrix on the repaired source, with no failures or page errors; its `*-final.png` tier/forced-color captures were also viewed. Actual name snapshots do not establish spoken endpoint value text; the separately demonstrated Chrome CDP limitation remains.

## Required validation receipts

The coordinator's final `npm test` at `2524b24` exits 0. Its [complete saved log](reviews/evidence/validation/npm-test.txt) records 19,471 static checks, 5,494 component checks across 336 reports with zero failures (comparison seven checks per tier), 1,161 focused Chrome comparison checks within the full behavior runner, caption compensation 768 cases, Breadcrumb paragraph leading 48 cases, and the full component behavior pass. The reviewer inspected the final log; execution belongs to the coordinator. This supersedes the earlier `7a6123f` run for final validation.

Final `npm run qa:components` also exits 0 on unchanged `2524b24`: **87 captures, 5,494 baseline checks across 336 reports, zero failures**. The [complete QA log](reviews/evidence/validation/qa-components.txt) was inspected. Source identity was rechecked after completion; Git status contains only the new review/evidence documents. Types compile as part of the required rebuilt product, and the emitted public interface omits the removed naming convenience API. No reviewer claim substitutes generated screenshot counts for the actual focused screenshot inspection described above.

## Boundaries

No React dependency, portfolio media state, snapping algorithm or source loader is introduced. Consumer content/ratio policy remains outside BF; CSS uses flat classes/logical position and the shared stroke helper with paint-only borders. The component is assembled into all direct/shared bundles and catalog baseline/capture tooling. Caption/Tab/Breadcrumb source is untouched, with final full-suite regression receipts retained. Packaging file/export declarations include generated runtime/types/CSS. The later bounded packaging addendum below extends review to one identified candidate; downstream public-consumption proof remains separate.

Actual screen-reader output, physical touch hardware, native browser UI zoom and non-Chrome engines remain unverified. No CUA/native UI input was attempted. The owner retains visual approval, portfolio CP4 and every merge/push/publication decision. Subsequent product changes require an appropriate review recheck; this acceptance is bound to the recorded revision.

## Bounded packaging and verifier follow-up

**Disposition: accept the identified immutable candidate and the bounded verifier correction for package preparation/consumer qualification.** This adds no portfolio-adapter, normal consumer-install/build, owner visual, CP4 or publication acceptance.

The candidate was packed from `f99b3191db00cddbd089b76f5b2e56f9a76cb74a`, whose changes after reviewed product `2524b24` are review/workflow records. Independent `git diff` confirms no changes to `src`, README, package manifest/lock or config across those commits. The candidate remains internal version `0.2.1`; its immutable bytes, not that version alone, identify it:

- Archive: `tmp/package-030/baseline-foundry-0.2.1.tgz`.
- SHA-256: `7561a221347ea4f8953e331ae89fce48e9cfad12b951f671e0379b2380f29277`.
- Integrity: `sha512-ad4XMSlSNaA8xE3XzNAo5f7Djh5TmEQI8kUaob6qFhWO/GM2u7A+Z+ffaGkYS7wqjU0Vp0IWmPkayiZe56Dyig==`.
- Size: 638,382 bytes; 175 file entries, matching the adjacent npm pack report.

[Independent in-memory tar inspection](reviews/evidence/astra/package-inspection.json), produced by [the saved inspection script](reviews/evidence/astra/package-inspection.mjs), recomputes both hashes, checks every packed file byte-for-byte against the current package outputs, confirms every declared export target exists, and finds no packaged `src`, `scripts`, `demo`, `specs`, `tmp` or nested `node_modules`. The packaged comparison runtime hash is the already reviewed `cd42f2fbe49b3788e80979881a5f075a753dc24921de802ade242f18faa49478`; generated editorial CSS also matches the reviewed repaired output. The packaged declarations expose endpoint metadata and omit the removed accessible-name convenience API.

The checkout's public self-reference import, whose packaged file bytes were all matched, has 31 root exports and `setupImageComparison` is a function. Separately, the coordinator reports the actual tarball passed the clean temporary-package verifier with 31 root exports and 21 asset entry points. The reviewer inspected the full verifier implementation and exact two-line repair: change the stale expected root count from 30 to 31 and add an explicit `typeof root.setupImageComparison === "function"` assertion. Existing version, forbidden-path, build API, tier registry, types-module and asset-resolution checks remain intact. This is a correction for the deliberately added public export, not suppression of a missing/broken export.

That verifier uses `npm install --ignore-scripts --no-audit --no-fund` in its temporary package. Its green result is therefore public package install/import/asset smoke evidence; it is not normal lifecycle-script execution, a security audit or proof of the downstream portfolio adapter. No reviewer reinstall or full-suite rerun was needed for this verifier-only edit. The helper is not packed, so its repair changes no candidate bytes. `git diff --check` passes. The portfolio must still pin these exact bytes and prove its own normal install/build, adapter lifecycle and route/font/caption behavior.
