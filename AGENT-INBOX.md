# Agent inbox

The latest product release is on `main` at `5b5356e`. Grouped content now uses
the existing `bf-stack is-flush` composition; the narrow
`bf-paragraph-stack` API has been removed. Stacks resist track stretching,
list-like components contain metric compensation, side-navigation headings use
matching body-role nudges and margins, and the demo cap engine replaces rather
than duplicates production compensation.

`npm test` and `npm run qa:components` were run for closeout on 2026-08-27 and
both pass. The strict catalogue verifier is green across all four built-in
tiers and both font-engine surfaces with no accepted baseline failures. Static
validation passes 5,530 checks, behavior passes, regenerated captures pass, and
adversarial desktop/constrained browser review found no overflow or visual
regression in the affected compositions.

Tiered lists own their internal shallow rhythm as of released commit `155c2dc`.
Their focused baseline checks pass across all four built-in tiers, and their
static and responsive behavior contracts are covered.

Spec 012 is released on `main` at `4d1b914`. Linked section titles remain semantic blue with no
resting underline and underline on hover. Heroes own their entry divider by
default with a rhythm-preserving `is-borderless` opt-out.

Sites container-owned spacing is released on `main` at `2c5587d`. The owner
decision replaces semantic role space-after with nested stack gaps while
retaining top-nudge/bottom-margin baseline compensation. The complete stack
density API is restored in producer commit `454dc4d`; Diagram Registry vendors
that build and merges its downstream proof at `b388f85`. Static, browser,
downstream, and responsive gates are green. Durable evidence is archived at
`docs/spec-archive/012-sites-container-spacing/`.

Spec 011 is released on `main` at `1293bcc`. Start-aligned fixed rows, aligned
pinned panel footers, quiet linked section titles, scrollable tables and
light-inset figures passed the full BF test, capture and browser gates. Spec
012 preserves those contracts while changing spacing ownership.

Spec 009 remains released at `be85d46a27d07794ec8f8057b35b557537e60a48`
and verified in Diagram Registry at `aec3d47`.

Preserve `tmp/chevron-audit/`, `tmp/chevron-harness/`, `tmp/vanilla-main/`, and
the duplicate `fix/typography-role-class-precedence` worktree. The sibling
Vanilla checkout has user changes in `yarn.lock`; do not clean or update it.
