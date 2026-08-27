# Agent inbox

Spec 012 is released on `main` at `4d1b914`. Linked section titles remain semantic blue with no
resting underline and underline on hover. Heroes own their entry divider by
default with a rhythm-preserving `is-borderless` opt-out.

Spec 012 is implemented and ready for owner review at
`specs/012-sites-container-spacing/` on
`feat/012-sites-container-spacing` in
`H:\WSL_dev_projects\baseline-foundry-sites-container-spacing`. The owner
decision replaces semantic role space-after with nested stack gaps while
retaining top-nudge/bottom-margin baseline compensation. Generated code is at
`c87eb42`; the Diagram Registry proof is at `5c226fd` on
`feat/013-sites-container-spacing-proof`. Focused, generated, downstream, and
browser gates are green. The full legacy component catalogue still reports
old occupied-border-box assumptions; exact evidence is in `review.md`. Preserve
both dirty main checkouts and do not merge or publish before owner approval.

Spec 011 is released on `main` at `1293bcc`. Start-aligned fixed rows, aligned
pinned panel footers, quiet linked section titles, scrollable tables and
light-inset figures passed the full BF test, capture and browser gates. Spec
012 preserves those contracts while changing spacing ownership.

Spec 009 remains released at `be85d46a27d07794ec8f8057b35b557537e60a48`
and verified in Diagram Registry at `aec3d47`.

Preserve `tmp/chevron-audit/`, `tmp/chevron-harness/`, `tmp/vanilla-main/`, and
the duplicate `fix/typography-role-class-precedence` worktree. The sibling
Vanilla checkout has user changes in `yarn.lock`; do not clean or update it.
