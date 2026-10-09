# Quickstart

```powershell
npm install
npm run check:types
npm test
npm run qa:components
npm run demo:serve -- --host 127.0.0.1 --port 4176 --strictPort
```

Use BF's existing pages:

- [Vertical spacing](http://127.0.0.1:4176/demo/spec/spacing-vertical.html)
- [Tooltip](http://127.0.0.1:4176/demo/components/tooltip.html)
- [Cards](http://127.0.0.1:4176/demo/components/cards.html)

Use the shared controls in BF's fixed footer: Before/After, tier, tone and
baseline grid. The comparison keeps the real specimen nodes and BF component
initializers. The old `demo/spec-028/index.html` route redirects to the real
vertical-spacing page; its bespoke CSS and script have been removed.
The immutable Before source remains
`6deca99776f35b85afde01b68bb0fffe817e29aa`.

Exercise both versions, all four tiers,
light/dark and BF's baseline grid. Mobile review must use an actual narrow
browser viewport, not a desktop canvas made narrower by a control. Verify real
Tooltip, menu and navigation behavior through BF's initializers.

Before is the archived CSS comparison. Matching Before token JSON was not
preserved, so token diagnostics and token-file links are explicitly unavailable
in that mode. After shows the current generated values. Bundle provenance is
linked from BF's shared chrome. The page's own BF layout legitimately follows
the selected BF stylesheet.

Current source pins, checks and the correction-review handoff live in
[tasks](tasks.md) and the [inbox](../../AGENT-INBOX.md). The original request and
sealed evidence remain historical. Exact browser coverage is recorded in the
correction request; Safari, real Windows contrast themes and display scaling
still require explicit platform coverage.

The October 7 review accepted the spacing repairs. The October 9 follow-up
requested R1 changes for obscured-but-focusable shared footer controls and
accepted N2–N5 dispositions. Opus accepted R1 in response to the
[correction request](reviews/opus-028-r1-correction-review-request.md), with
[root findings](reviews/r1-integration-review.md) and explicit limitations.
The initially expanded SideNavigation specimen hides shared catalog/header/footer
on narrow viewports; Escape closes it to recover shared review controls. A
keyboard-reopened drawer restores trigger focus; the initial markup-open drawer
has no recorded trigger. Verify full Tab cycles and both bundles, not only
programmatic focus. ApplicationLayout still has a pre-existing mobile overlap;
do not read the SideNavigation claim as applying to every drawer page.
The R1 external review gate is satisfied. Owner sign-off, N2 fallback decision,
governing-main activation and the dependency audit remain open.
