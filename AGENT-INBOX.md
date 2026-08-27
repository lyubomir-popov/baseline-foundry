# Agent inbox

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
