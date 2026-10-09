# October 9 correction-review follow-ups

The October 7 external Opus receipt accepts the bounded Spec 028 corrections.
Its original bytes remain at `../opus-028-corrections-review.md`, SHA-256
`f3f0dc8b3409eeb3773e951b1b2ad62ce1b5bef837bd236601d65692493d4183`.
That receipt is local and untracked; this document records its follow-ups,
not a new external verdict or a substitute for the full report.

## N1: shared mobile catalog chrome

The Pages toggle overlaps the visible brand on the SideNavigation component
demo at 390px, in both Before and After. Fix the shared demo chrome before the
owner's visual pass. Do not change component spacing, hide the brand, replace
the real specimen, or alter the frozen Before CSS. The new follow-up evidence
and independent review must establish geometry, visibility, pointer and
keyboard behavior, and isolation from the specimen's own drawer.

## N2: accessible native-boundary fallback requires an owner decision

Bare native fields and raw native table cells use an inset all-sided outline
in forced-colors mode. Their normal one-sided boundary becomes a field box
or a full table-cell grid. This differs from the shared rule requiring a
one-sided accessible fallback for a one-sided stroke.

The owner must explicitly accept that narrow exception or request a changed
construction. An acceptance must be recorded through the governing ruling
process before claiming full conformance. This slice does not infer a waiver,
edit the governing ruling, or label this issue resolved. Wrapped fields and
owned BF table cells retain their separately verified paint constructions.

## N3: untyped inputs receive the full field treatment

An `input` without a `type` attribute now joins BF's native field selectors.
Previously it retained the browser's default 2px border; After applies the BF
field styling, zero layout border, and paint-only boundary. This is a
consumer-visible scope change, even though HTML treats an untyped input as a
text input. Include it in owner review and eventual release communication;
do not describe the change as stroke replacement alone.

## N4: prose literals in artifact validation

The provenance validator checks entire explanatory sentences for `baseRole`,
`origin`, `status`, and `regenerationGuard`. Copy changes can therefore fail
validation. Defer a schema change in this chrome-only slice so the accepted
artifact and regeneration guard remain intact. Revisit stable codes and
separate notes when the artifact schema next changes, with migration and
negative-control checks. This is a minor robustness finding, not a claim
that canonical-main activation is complete.

## N5: forced-colors leaf containing blocks

Leaf paint uses `position: relative` in forced-colors mode only. Absolutely
positioned descendants can therefore acquire a different containing block
in that mode. Preserve the accepted construction in this slice and disclose
the limitation. Before extending any such leaf to contain positioned content,
verify both normal and forced-colors geometry or implement a separately
reviewed construction. Browser emulation is not native Windows contrast-theme
approval.

## Separate gates remain open

- Owner visual sign-off on real BF component pages, including N2/N3.
- B2: owner activation of equivalent governing rulings on canonical main and
  a resulting full-main-SHA BF artifact re-pin, or an explicit owner exception.
- Spec 024 T011g's external popup diagnostic review. The accepted BF
  correction receipt does not supply that missing verdict.
- Full Firefox interaction coverage, Safari, native Windows contrast themes
  and display scaling; the disclosed fractional long-stack drift.

The new bounded Opus follow-up examines the new chrome delta and these
dispositions at the user's requested checkpoint. It does not reopen already
accepted repairs or authorize Pragma implementation, merge, or release.
