# Shared-alignment T053 junction review

## Verdict

**GO at Pragma `a8441f45d`.** The previously accepted browser, visual,
source/import, package and packed-artifact evidence is now joined by the
accepted RichChoicesField card correction. T053 is complete.

Table and Log are accepted members of the closed in-box row family alongside
Tabs Item, ContextualMenu Item, and Combobox Option. React SideNavigation row
content and Launchpad NavigationItem remain future members. RichChoicesField
was corrected as an ordinary selectable card and was not added to either row
family.

## Browser and visual evidence

- Launchpad Log: 51/51 across Chromium, Firefox, and WebKit, Site/Docs/App,
  and genuine 16px/18px roots.
- Launchpad Table/direct-entry: 39/39 across the same engines, tiers, and
  roots. Launchpad has no DPR-2 project, so no Table/Log DPR-2 claim is made.
- React global: 186/186 across Chromium, Firefox, and WebKit, DPR 1/2, and
  16px/18px roots.
- React global-form: 108/108 across the same engine/DPR/root matrix.
- Fresh Storybook 6116 showed clean intrinsic and wrapped Log rows, intrinsic
  multiline/colspan Table cells, and the constrained sortable-header case.
  Scoped accessibility scans reported zero violations.

P0/P1 findings: none. The Launchpad Storybook preview emits a duplicated
internal `undefined.on` error from Storybook 10.3.3. It reproduces on an
unrelated existing Badge story, does not obscure rendering, and is recorded as
P2 environment/runtime debt rather than a Table or Log geometry defect.

Native 100%/125%/150% browser zoom remains T012. No native-zoom evidence is
claimed here.

## Static and package evidence

- The scanner remains `320 raw / 27 sanctioned / 286 transition / 7 advisory /
  0 legacy`; the post-seed allowlist has never grown.
- All 14 package-scoped scanner commands pass.
- Supported available import routes each contain exactly one alignment, fonts,
  code-role, and body-role contract where applicable. The unavailable Vanilla
  adapter remains an explicit boundary, not a universal-import claim.
- Authentication and packed-artifact gates pass.
- The ContextualMenu implementation was not regressed; three stale test
  expectations were refreshed in test-only Pragma commit `d186c422c`.
  Focused tests pass 5/5 and the full React-global Vitest suite passes 392 with
  5 skipped.

## Closed finding: RichChoicesField

Before the correction, `RichChoicesField/styles.css` computed private block
padding from `--start-nudge` and `--end-nudge`, although those inputs no longer
had production declarations. The result was a near-zero-padding bordered card
with mixed card/text ownership.

This is not an in-box row. It accepts arbitrary rich React content, uses a
flex-column card/panel, and participates in equal-height stretching. Replacing
the missing inputs with the shared row nudge would double-count alignment and
would silently broaden the closed registry.

The accepted correction through `a8441f45d` implements the owner's bounded
selectable box/card composition:

1. Let the card own its existing border, background and radius, plus equal
   padding from the existing Surface block/inline inset tokens; retain
   intrinsic/stretch behavior and add no new formula.
2. Keep its flex column as the content stack and let that stack own child gaps.
3. Remove `.p` from the outer label. Wrap only scalar string/number labels in
   an explicit text leaf; require rich content to provide its own text leaves.
4. Add a fail-closed parsed/decoded scanner rule for the retired
   `--start-nudge` and `--end-nudge` names without changing the current debt
   basis.
5. Correct the story's private `font-size: 0.85em` and add real geometry,
   interaction and font-authentication evidence without changing any allowlist
   identity.

Independent adversarial review closed every P0/P1/P2 finding. The final proof
includes 81 scanner tests with 186 assertions; a stable global count of
`320 / 27 / 286 / 7 / 0`; 29 focused component/source/SSR tests; 18/18
RichChoices browser cases across Chromium, Firefox and WebKit at DPR 1/2; and
a final 3/3 Chromium check after the checker-only CRLF correction. It also proves
equal card padding, exact inner gap, real wrapping, neighboring equal heights,
scalar and rich text content, keyboard focus/selection, disabled behavior and
failure when the real Ubuntu Sans face is removed in a disposable page.

Spec 022 now records that clarification. It is ordinary box/card composition,
not an in-box, Continuation, or Field row.

## Gate decision

Close T053, T066 and T067. Table, Log and the existing active in-box consumers
were not reopened. The unavailable Vanilla adapter remains an explicit
evidence boundary, native zoom remains T012, and the wider inventory remains
T019. The final external Opus review is still pending.
