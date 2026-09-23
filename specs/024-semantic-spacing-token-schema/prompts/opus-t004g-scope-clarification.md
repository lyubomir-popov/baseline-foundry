# Opus review request — pre-T004d1a-completion / T004d2 / T004g junction

Act as Claude Opus 5 performing an adversarial execution-scope review for Spec
024.
Read the current files rather than trusting this prompt, especially
`tasks.md`, `spec.md`, `contracts/semantic-spacing-schema.md`,
`implementation-handover.md`, `opus-pre-cp1-execution-review.md`, and
`opus-pre-t004d2-scope-review.md`, plus the isolated Pragma spike below. Inspect
the current diff and available test output. Do not redesign the settled model or
implement any change.

This is one junction review, but its permissions are not bundled: return
separate proceed/no-proceed decisions for T004d1a completion, the mechanical
T004d2 test correction, T004d2 implementation, and T004g.

## Verified current state

- Spec worktree:
  `H:\WSL_dev_projects\baseline-foundry-worktrees\feat-024-semantic-spacing-token-schema`,
  branch `feat/024-semantic-spacing-token-schema`, base HEAD
  `c97ae4fca21ee1e87d23b208951abe3ed61a223f`. The reviewed package is preserved
  at
  `refs/recovery/spec-024/baseline-foundry/pre-t004d2-opus-review-20260923`
  (`05ab8718f75cd99ecfea49a2f9ec21860cc40b23`).
- Pragma spike:
  `H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-inside-out-geometry`,
  branch `feat/bf-inside-out-geometry`, HEAD and exact branch base
  `313ee82c13a126b779b9bd75902da5af13c28505`. Accepted work through T004d is
  preserved at
  `refs/recovery/spec-024/pragma/bf-inside-out-geometry-20260922`
  (`f93281eac01b16257027161cf0841cd559f0cef1`).
- The spike currently has nine modified files and one untracked carrier:
  `packages/react/ds-global-form/tests/Form.spacing.pw.ts`,
  `packages/react/ds-global-form/tests/Select.spacing.pw.ts`,
  `packages/react/ds-global/tests/Button.spacing.pw.ts`,
  `packages/react/ds-global/tests/Chip.spacing.pw.ts`,
  `packages/react/ds-global/tests/SharedContracts.spacing.pw.ts`,
  `packages/styles/main/src/component-contract.css`,
  `packages/styles/main/test/component-contract.test.js`,
  `packages/styles/typography/src/alignment.css`,
  `packages/styles/typography/test/alignment.test.ts`, and untracked
  `packages/styles/main/src/_spike-geometry.css`.
- T004d0, T004d1b, and T004d are accepted context. The four new focused
  T004d1a test edits are reported green: 12 ds-global checks and 8 form checks.
  The available result directories identify Chromium DPR 1 and 2, not Firefox
  or WebKit.
- The carrier exposes `--ds-gap-element-block`, `--ds-gap-group-block`, and
  `--ds-gap-pattern-block` as Site `8/24/64`, Docs `4/16/32`, and App
  `4/16/32`. It supplies Site control block inset `0` and Docs/App one baseline
  unit per edge. Pragma declares no new `--spacing-*` property.

Implementation is stopped because the current T004d1a proof and the previous
review leave the following acceptance and scope questions underdetermined.

## 1. Bounded T004d1a control denominator

`tasks.md` T004d1a and the handover require measurement of **every control in
the denominator**, but `tasks.md` does not freeze the component-inventory
denominator until T005, followed by current-main reconciliation in T005a and a
non-React extension in T005b. The current tests choose four representatives:
Button, Chip, composite input chrome, and direct native Select chrome.
`config/react-spacing-inventory.ts` is substantial historical evidence, but is
not yet the T005-frozen, current-main, cross-framework denominator.

Choose one exact interpretation:

1. define a bounded pre-CP1 T004d1a denominator now, enumerating every included
   control family and variant by path, and state that T005 owns the later full
   component denominator; or
2. require T005/T005a/T005b denominator closure before T004d1a can complete.

Do not use “Button, Chip and input chrome” as an unenumerated shorthand. State
whether composite chrome and direct native chrome are separate denominator
members, which other control-row consumers are included or explicitly deferred,
and how product-specific and non-React Button forks are dispositioned.

## 2. Borderless acceptance and writable scope

The handover retains borderless-variant confirmation in T004d1a. The current
proof is uneven:

- ordinary Button importances always retain an actual 1px border, transparent
  when visually absent; the test's zero-border link variant also removes row
  padding and compensation and is not checked against 40/32;
- ordinary Chip retains an actual 1px border; nested Chip has a zero border but
  intentionally becomes an in-box line-height row with zero block padding and
  compensation, and is not checked against 40/32;
- composite input chrome uses the public `--form-input-border-width: 0px`
  input, checks both computed block-edge widths are zero, and checks occupied
  size remains on target;
- direct native Select is checked against the occupied target only and has no
  borderless case.

Decide separately for Button, Chip, composite chrome, and native Select whether
acceptance is:

- explicitly waived because no supported borderless external-row variant
  exists;
- satisfied by a named existing supported variant, with the exact expected
  geometry; or
- required through a supported variant/public input, in which case enumerate
  the exact production and fixture/test scope expansion.

Do not approve a test-only mutation of internal `--ds-row-*` channels as proof
of a supported component variant. The current production writable list does not
include Button or Chip stylesheets, so say explicitly whether it expands.

## 3. Actual inset-value assertion

The tests compare rendered occupied size and, where available,
`--ds-row-occupied-block-size` against fixed targets. Those checks are useful
and not merely comparisons of one contract output to another. However, Button
and Chip currently attach a calculated `insetTarget` without reading either
resolved `--ds-row-inset-block-start` or `--ds-row-inset-block-end`; Form and
Select do not read the inset at all. A compensating change in another ledger
term could therefore leave the target assertions green while the value T004d1a
purports to establish is wrong.

Confirm whether T004d1a completion must read, record, and assert both resolved
inset edges on every denominator member: Site `0/0`, Docs/App one product
baseline unit per edge. If not, state exactly what observation establishes the
block-inset value independently of final occupied size.

## 4. Form diagnostic lane versus FR-052 normative capture

Form and Select run through
`packages/react/ds-global-form/playwright.spacing.config.ts`, whose default port
is 6107. FR-052 and the previous review say Spec 024's normative capture uses
only `packages/react/ds-global/playwright.spacing.config.ts` on port 6106, adds
no collector/config/port, and that the 6106 ds-global Storybook is the source of
the recoverable packet. That Storybook does not load ds-global-form stories.

Choose an exact disposition:

1. authorise the existing 6107 form harness as a diagnostic supplement, define
   exactly how its results enter or accompany the FR-052 packet, and amend the
   “6106 only” language accordingly; or
2. keep 6106 as the sole admissible lane and prescribe an alternative that
   exercises production input chrome without duplicating CSS, reversing package
   dependencies, inventing a fake component, adding a config, or binding a new
   port.

Do not merely say that focused form tests may run: distinguish diagnostic green
from evidence admissible for T004d1a completion and T004h.

## 5. Recoverable measurement JSON

The four tests call `testInfo.attach` with measurement JSON, but the current
line-reporter result directories contain empty per-test attachment directories.
The assertions pass, but the promised measured values are not recoverable from
the output. Specify the exact authorised persistence mechanism and exact path.
Prefer a subdirectory beneath the already mandated external root
`H:\WSL_dev_projects\temp\spec-024-inside-out-evidence-20260922`; say whether the
JSON is emitted by the test, copied from Playwright output, or recorded in a
committed evidence table, and require the manifest to hash it. Do not authorise
a new collector implicitly.

## 6. Root scaling and engine coverage

The current tests interpret the owner-confirmed Site 40px and Docs/App 32px
targets at a 16px root as rem-scaled targets: 45px and 36px at an 18px root.
That follows the current rem primitives, but the spec does not state this
interpretation explicitly. Ratify either:

- `40/32 at root 16, scaling to 45/36 at root 18`; or
- fixed `40/32` at both supported roots, with the required implementation
  consequence.

Also decide whether Chromium at DPR 1 and 2 is sufficient for T004d1a, or
whether all configured Chromium/Firefox/WebKit × DPR 1/2 projects are required.
State the exact completion matrix; do not conflate DPR coverage with engine
coverage.

## 7. Exact Section inset mapping

`packages/react/ds-global/src/lib/_work_in_progress/Section/styles.css` currently
uses gap roles as padding inputs:

- shallow → `--spacing-gap-group-block`;
- default → illegal Pragma-owned `--spacing-gap-section-block`;
- deep → `--spacing-gap-pattern-block`;
- hero bottom → default;
- bordered start inset fallback → `--spacing-gap-field-block`.

The affected-scope sweep requires every one of these padding relationships to
leave the gap family, but the approved review does not say how shallow, default,
deep, and hero map onto the shipped block inset roles
`--spacing-inset-surface-block` and `--spacing-inset-strip-block`. Give the exact
property-to-property mapping, including any intentional variant collapse, and
confirm the bordered fallback.

## 8. Exact writable owner list for FR-043 activation

The prior review retains `packages/styles/main/src/spacing.css` as
**deletions-only**, yet that file owns `--container-gap-tight`,
`--container-gap-default`, and `--container-gap-loose`. Many legitimate gap
consumers also still read the old provider properties directly. The new carrier
scale therefore has no complete activation path unless the writable scope is
made explicit.

State exactly which files and declarations T004g may repoint to
`--ds-gap-element-block`, `--ds-gap-group-block`, and
`--ds-gap-pattern-block`. At minimum, disposition:

- the legitimate element gaps in the named Card, Tile, and Tooltip owners;
- `packages/react/ds-global-form/src/index.css:168`
  (`--form-group-gap-default`) and `:315`
  (`--form-field-block-gap-default`);
- the three `--container-gap-*` aliases in `spacing.css` despite its existing
  deletions-only rule;
- legitimate gap consumers outside the named T004g padding owners.

Say whether this spike activates FR-043 only in a bounded named-owner and
comparison-sheet slice, with full migration deferred to T007, or expands the
writable list now. Do not leave “apply the gap scale” broader than the files an
implementer may edit.

## 9. ColorInput separation

Confirm that the two ColorInput `--ds-box-inset-block` assignments at
`packages/react/ds-global-form/src/lib/subcomponent/ColorInput/styles.css:114`
and `:158` must be corrected at the call sites to an inset role.
`--form-group-gap-default` has real gap consumers in FileUpload, Choices,
Range, and Wrapper, so it must not be redefined as an inset. It may change only
if separately authorised as FR-043 gap-scale activation.

## 10. Mechanical `text-alignment.test.ts` correction

Ratify a narrow assertion-only scope correction for
`packages/styles/typography/test/text-alignment.test.ts`. The prior review both
authorised additive phase/closure application in `elements.css` and required
this test to remain green **unmodified**. Its assertions currently pin the old
applied declarations:

```text
padding-block-start: var(--_typography-text-nudge-start)
margin-block-end: var(--_typography-text-nudge-end)
```

Those assertions must mechanically follow the already-approved additive
application while retaining the per-role assertions that the published nudge
pair is unchanged. Confirm that only these application assertions and the new
phase/closure mapper assertions may change; no nudge value, selector ownership,
or production scope is reopened.

## Stop conditions

Until this review answers all ten questions:

- do not mark T004d1a complete;
- do not begin T004d2 production implementation or change
  `text-alignment.test.ts`;
- do not start T004g;
- do not invent a denominator, treat transparent paint as an absent border,
  manufacture a supported variant through internal test overrides, or infer an
  evidence-lane exception from the general focused-test allowance;
- do not guess the Section mapping, widen the T004g owner list implicitly, edit
  design-tokens or read-only references, declare a new `--spacing-*` property,
  change published nudge values, or soften the Svelte WPE Cards boundary; and
- do not push, publish, PR, merge, or rebase the evidence spike.

If any required decision remains underdetermined, give the affected lane a
no-proceed verdict rather than filling the gap by assumption. A yes for one lane
does not authorise another.

## Required response

Return findings by severity with exact file/line evidence, then provide:

1. an enumerated T004d1a denominator, or an explicit decision that T005 closure
   must precede completion;
2. a Button/Chip/composite-chrome/native-Select borderless disposition table,
   including every scope expansion or waiver;
3. `Actual inset assertion required: yes/no`, with the exact observation and
   fields;
4. an exact 6107 diagnostic / FR-052 6106 normative-lane disposition;
5. the authorised recoverable JSON mechanism, output path, and manifest rule;
6. the exact root-size target and browser-engine × DPR completion matrix;
7. a complete Section shallow/default/deep/hero/bordered mapping table;
8. an exhaustive writable file-and-declaration list for T004g gap activation,
   explicitly resolving the `spacing.css` deletions-only conflict;
9. `ColorInput call-site correction approved: yes/no`, with the permitted
   treatment of `--form-group-gap-default`;
10. `text-alignment.test.ts assertion-only correction approved: yes/no`, with
    the exact assertions that may change;
11. four separate final verdicts, each followed by any remaining blocker:
    - `May T004d1a be marked complete? yes/no`;
    - `May the mechanical T004d2 test correction proceed? yes/no`;
    - `May T004d2 implementation proceed? yes/no`;
    - `May T004g implementation proceed? yes/no`.
