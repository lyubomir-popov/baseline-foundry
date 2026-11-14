# Plan: Figure-caption compensation

Replace the caption's `margin-block` shorthand with `margin-block-start: 0` in
`src/css-components/cta-figure-aspect.ts`. The typography layer already emits
the role's measured `margin-block-end`; leave it in control. Correct the stale
figure comment to describe its existing grid gap.

Extend `scripts/validate-build.ts` with a component rule assertion. Add a
focused browser module under `scripts/behavior/`, invoked by the full behavior
runner as well as directly. Compare captions against unmodified text-role
references and compare continuation against an occupied-grid block reference.
Exercise explicit body/meta roles without changing their existing specificity.
Use Chrome for the focused proof. Existing repository suites retain their
configured Chromium harness; report that distinction.

Extend only the Figure catalog demo with wrapped caption/continuation examples.
Use the exact existing consumer source base; no cherry-pick or feature merge is
needed. Keep generated outputs untracked, record a reviewable source commit,
then let portfolio own isolated candidate packaging/repinning and its CP2
request. Technical review does not clear portfolio's owner gates.
