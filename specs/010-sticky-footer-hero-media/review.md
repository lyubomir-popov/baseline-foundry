# Review: Resilient Sticky Footer and Hero Media

**Status**: Ready for review

## Contract evidence

- The direct site-main child of an opted-in site shell resolves to `flex: 0 0 auto`, so a composed `bf-panel-content` role cannot shrink long document content underneath the footer.
- A site shell nested directly in `bf-application > bf-main` resolves its minimum block size to the application main's available size; document-level shells retain `100dvb`.
- The application main remains the sole scroll owner. Short shells fill it; long shells grow beyond it and keep the complete footer reachable.
- `bf-hero-lead bf-section is-shallow` owns the internal lead-to-media boundary. A direct final `bf-hero-media is-full` remains fluid and has only its generic trailing figure margin trimmed, leaving the hero root's existing exit padding as the sole post-media boundary.
- Existing paired, proportioned, split-medium, and fallback hero contracts remain unchanged.

## Gates

- `npm test`: passed. Static build validation completed 5,459 checks; component baselines and the full real-browser behavior suite passed.
- `npm run qa:components`: passed. All component screenshots were captured and all component baseline checks passed.
- Four-tier browser behavior covers 360 × 844 and 1280 × 900. Short nested shells fill their application main within 1px; long site main flex shrink is `0`; long footers follow content and remain within the scroll extent; both shells have no inline overflow.
- Manual browser review, Editorial at 1280 × 900: closing hero lead-to-media gap `24px`, media-to-hero-end `64px`, final figure margin `0px`, full-width delta `0px`, and no overflow.
- Manual browser review, Editorial at 360 × 844: closing hero lead-to-media gap `24px`, media-to-hero-end `32px`, full-width delta `0px`, and no overflow. The short footer followed content and filled its application main with sub-pixel delta only.
- Existing hero paired-column browser assertion passed after targeting the established `bf-hero-layout` composition explicitly.

## Release readiness

The feature branch is ready to push and review. It must be merged to `main` before its immutable merge commit can be treated as the BF release and vendored downstream.
