# Opus review request — Spec 024 pre-T004d2 scope junction

Act as Claude Opus 5 performing an independent execution-scope review. This is
a follow-up to your 2026-09-22 “Spec 024 pre-CP1 handover” review. Review the
current files, not this prompt's claims:

- the complete Spec 024 package, especially
  `opus-pre-cp1-execution-review.md`, `implementation-handover.md`, `spec.md`,
  `tasks.md` and `contracts/semantic-spacing-schema.md`;
- Pragma worktree
  `H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-inside-out-geometry`,
  based exactly on recovery commit
  `313ee82c13a126b779b9bd75902da5af13c28505`;
- the read-only Spec 022 worktrees only where needed to verify that their state
  and hashes were not changed.

Custody, the historical branch base and the settled model are not being
reopened. The spike is non-mergeable: no push, PR, publication or release.
T004d0, T004d1b and T004d are completed and independently accepted; treat the
per-edge T004d formula and rendered-border proof as context, not as a request to
reopen it absent a new contradiction. Review the completed T004d0 carrier and
T004d1b extraction adversarially, then answer the following narrow execution
questions before T004d2/T004g starts.

## 1. Typography application scope

Your permitted list names `packages/styles/typography/src/alignment.css`, but
the snapshot applies heading start/end geometry in
`packages/styles/typography/src/elements.css`. Confirm one of these outcomes:

1. authorise `elements.css` for T004d2, with `alignment.css` owning per-role
   first-baseline offset, rhythm-step, phase and closure calculations and
   `elements.css` mapping the selected role's private outputs to
   `padding-block-start` / `margin-block-end`; or
2. give an equally explicit implementation that changes only an already
   permitted file without redefining the existing
   `--typography-<role>-nudge-*` contract.

If outcome 1 is correct, fix the exact private phase/closure property names and
state how their application composes with the existing metric nudge. Controls
remain on the row closer in `component-contract.css`; their phase is zero and
their rhythm step is the product baseline.

## 2. T004g completeness versus reviewed file scope

Run or inspect this sweep in the isolated worktree:

```powershell
rg -n -U --glob '*.css' '(?:padding(?:-[\w-]+)?|--[\w-]*padding[\w-]*|--[\w-]*inset[\w-]*)\s*:\s*[^;]*var\(--(?:spacing-gap|ds-gap|container-gap|form-group-gap)-' .
```

It finds additional gap-derived padding outside the originally named owners:

- `packages/react/ds-global-form/src/lib/subcomponent/ColorInput/styles.css`;
- `packages/summon/application/src/application/react/templates/src/styles/app.css`;
- `apps/react/boilerplate-vite/src/styles/app.css`.

Decide whether to add all three to T004g's permitted owner list, give an
explicit non-padding/boundary disposition for any that should remain, or narrow
T004g's acceptance. Do not leave “completeness sweep remains authoritative”
beside a whitelist that makes completeness impossible.

## 3. Non-overwriting measurement lane

The accepted Spec 022 collectors hardcode port 6114 and write into their own
directory, and Spec 022 currently reserves 6114 for the read-only reference
Storybook. Choose the smaller valid lane, explicitly disposition the 6114
reservation, and make the result normative:

- copy the four unchanged collectors plus their six immutable JSON inputs to
  `H:\WSL_dev_projects\temp\spec-024-inside-out-evidence-20260922`, serve the
  spike on 6114, set `SPACING_REFERENCE` to the spike and keep all outputs
  external; or
- keep the reference on 6114, serve the spike on 6115 and author a focused
  spike-local Playwright capture with a manifest, control measurements and one
  Site/Docs/App comparison image.

The chosen lane must preserve both Spec 022 worktrees byte-for-byte, remain
recoverable for T004h, record OS as `null`, and avoid exploration infrastructure
that FR-046 does not justify.

## 4. Carrier and branch exception check

Confirm that these cold-start corrections faithfully implement your decision:

- candidate `spacing.inset.control.block` maps to both
  `--ds-row-inset-block-start` and `--ds-row-inset-block-end`;
- proposed `spacing.gap.element.block` (post-CP2 rename of shipped
  `spacing.gap.field.block`), plus group and pattern, map to matching
  `--ds-gap-*-block` contract inputs;
- `_spike-geometry.css` is imported only through `component-contract.css` and
  is not exported as a public subpath;
- the owner explicitly authorises this one non-mergeable recovery-snapshot
  exception to AGENTS.md's normal `origin/main` branch-base rule, while every
  other repository rule remains active.

## Required response

Return findings by severity with exact file/line evidence. End with:

- a verdict on T004d0;
- a verdict on T004d1b;
- exact approved wording/file scope for T004d2;
- exact approved wording/file scope for T004g;
- the selected capture lane;
- `May implementation resume past T004d1a? yes/no` and any remaining blocker.

Do not substitute a general design review, reopen settled role values without a
new contradiction, or implement changes yourself.
