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

The October 7 correction review accepted the bounded repairs. Its N1 mobile
chrome follow-up is verified and ready in the
[new bounded request](reviews/opus-028-followup-review-request.md), with a
[separate integration verdict](reviews/followup-integration-review.md).
The initially expanded SideNavigation specimen owns the mobile viewport; close
it to access shared catalog and Before/After controls. Implementation is stopped
at the requested review boundary. Owner sign-off, N2 accessibility disposition,
governing-main activation and the release dependency audit remain open.
