# Independent Astra review — uniform checkmarked Chips

Reviewer: gpt-6-astra, independent of the source/test implementer; authorized personal-project substitution for Opus.
Reviewed revision: 08fe52c32e7e700f1bc0063d41961d39af484e58
Verdict: accept
Date: 2026-11-15

## Scope and source review

This review covers Spec 031's opt-in `bf-chip is-checkable` and decorative `bf-chip-mark`, against planning base `79e8055`/preserved base `0b026be`. It is separate from accepted comparison Spec 030 and from the future immutable package/portfolio adoption. I read the BF instructions, inboxes, operational index/catalog, constitution, active spec/plan/tasks, [review request](reviews/astra-request.md), README contract and complete implementation/test diff. I did not implement or modify the product, build/install it, change services or clear owner gates.

The product change is 25 added lines in `src/css-components/chip-badge-status.ts`; existing rules are retained. The new modifier reserves an existing governed icon width/height and leading-mark gap. The mark is non-shrinking, centered and pointer-transparent; `visibility: hidden` retains its space while unselected. Selection visibility follows `aria-pressed=true` or the documented `is-selected` modifier, not pointer `:active`. The override removes only selection-bar paint and its forced-color bottom width. Existing stroke, semantic fill and independent focus rules remain in force. No target block height, font metric compensation, token/config value or consumer-private override was introduced.

README and actual demo use native buttons, truthful `aria-pressed`, a decorative `aria-hidden=true`/`focusable=false` SVG and one value slot. The three demo wiring lines toggle the pressed attribute on native click, allowing browser Space/Enter activation. They are demo consumer behavior, not a new library filter engine. Authoring a contradictory `is-selected`/`aria-pressed` state is still the consumer's responsibility; CSS does not validate semantics. The new CSS is scoped to the opt-in modifier and does not change ordinary Chips, Badge, StatusLabel, public runtime exports or package metadata. Comparison, caption, Tab, Breadcrumb, font/manifest/config source is unchanged in this revision.

## Independent rendered investigation

I used the actual served Chip demo at `http://127.0.0.1:64528/demo/components/chip.html`, with Chrome automation and fresh screenshots. The [independent reproduction](reviews/evidence/astra/independent.mjs) and [raw results](reviews/evidence/astra/independent.json) record **966 passing checks, zero failures and zero page errors**, bound to the exact reviewed HEAD and SHA256 hashes of Chip source, actual demo/wiring and served shared CSS.

The first six checks exercise the unmodified demo: initial native Brand/Design names and pressed states, pointer click, Space, Enter, and keyboard traversal between buttons without an SVG focus stop. The remaining 960 checks operate the real demo's existing handlers across 96 combinations: editorial/documentation/app/OS × direct/shared CSS × root 16/root 20 × light/dark/forced colors × LTR/RTL. Fixture-only constraints cap the long-label group at 180px; a clone in an existing table provider tests dense metrics without adding production CSS. I did not replace the actual toggle logic with a test-owned handler.

- Idle and pointer-down unselected states keep the mark hidden. Pointer down alone does not announce or paint selection, and produces no bottom selection bar. Click selects; Space deselects.
- Selected mark visibility, all-sided paint and the separate keyboard focus layer coexist. Forced colors retains an inset system outline and native keyboard outline with zero bottom-selection width and zero layout border.
- Selection/active/focus preserve width, height, occupied height including compensation, value x/y/width, and mark dimensions/position within 0.05px. The reserved mark does not create a keyline jump.
- Dense table Chips retain the same painted and occupied height as ordinary Chips in that provider, and selection remains geometry-neutral. Governed density is inherited rather than patched locally.
- Long labels remain confined to the constrained group, retain their full native accessible name, and visibly ellipsize. RTL moves the mark to the logical leading side without changing anatomy.
- Chips without `is-checkable` retain their ordinary selected bar, including the forced-color bottom paint. The opt-in rule does not globally flatten selection.

I also compared all 48 direct/shared pairs from those raw measurements. [Parity results](reviews/evidence/astra/parity.json) show exact equality for measured geometry, gap, border/stroke/selection, background and foreground in every pair.

I opened and visually inspected these fresh images: [actual demo](reviews/evidence/astra/actual-demo.png), [long light label](reviews/evidence/astra/long-light.png), [long dark label](reviews/evidence/astra/long-dark.png), [forced colors](reviews/evidence/astra/long-forced.png), and [OS RTL](reviews/evidence/astra/os-rtl.png). The checkmark is plainly visible, selected/unselected text placement is stable, and the outline has no extra bottom bar. The selected keyboard-focus image has its distinct focus treatment; it is not presented as an idle stroke measurement. The hidden mark slot is intentionally reserved in the unselected Design Chip. Baseline-grid lines visible in the original demo image belong to its existing demo overlay.

## Findings and acceptance boundary

No blocking or nonblocking product defect was found in the reviewed source and rendered investigation. The opt-in BF Chip presentation is technically accepted at the exact revision above after both required suites completed successfully. This is an adversarial bounded result, not a claim that all consumers or assistive technologies have been tested. It does not accept an unqualified package or a downstream implementation.

The supplied focused 960/static 19,577/types/build results are supporting implementer evidence, distinct from the 966 independent checks above. Required `npm run qa:components` has a coordinator-confirmed exit 0: 87 captures and 5,506 checks across 336 reports with zero failures. I inspected its [closed log](reviews/evidence/validation/qa-components.txt) and independently verified that the detached QA worktree is Git-clean at the same full 08fe52c revision. Separate worktrees avoided concurrent generated writes.

The full `npm test` also has a coordinator-confirmed exit 0 on unchanged 08fe52c. I inspected its [closed log](reviews/evidence/validation/npm-test.txt): 19,577 static checks, 5,506 component-baseline checks across 336 reports with zero failures, comparison 1,161, checkable Chips 960, captions 768 and full component behavior pass. Breadcrumb, navigation indicators and indicator-fit checks also complete successfully. These are coordinator-executed required suites; I did not run another build or relabel their counts as independent investigation. Test counts alone do not substitute for the rendered review above.

Native screen-reader speech, physical device input, other browser engines and native browser UI zoom were not exercised. Root-size/forced-color browser emulation does not replace those checks. This CSS/semantic review does not prove downstream filter state/results, immutable package identity or portfolio Home integration. The owner's final visual/CP4 decision, final media and heading dispositions, package/release approval and any merge/push/publication remain separate. No such gate is cleared here.

Report checks: all relative evidence links resolve and `git diff --check` passes. Product HEAD remains exactly 08fe52c; reviewer writes are limited to this report and `reviews/evidence/astra/`.
