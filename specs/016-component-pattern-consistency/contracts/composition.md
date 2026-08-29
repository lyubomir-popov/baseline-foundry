# Composition Contract

## Spacing levels

| Relationship | Required composition | Meaning |
|---|---|---|
| H1/H2 or equivalent title fragments read as one title | `bf-stack is-flush` | Zero semantic gap; metric compensation remains |
| Heading, copy, metadata, or actions within one pattern area | `bf-stack is-dense` | One tier baseline between direct children |
| Complete header/body/footer, copy/media, or other pattern areas | `bf-stack is-section-shallow` or an equivalent component-owned shallow gap | Larger pattern boundary |

No role-owned margin may substitute for these container relationships.

## Search occupied block

- Input border box is authoritative.
- Reset and search action block edges stay within the input block edges.
- The action separator cannot extend beyond the input border.
- Expanded popup top is at or after the complete input block end.
- Tolerance for rendered comparisons is 1px.

## Navigation alignment

- Every row in `.bf-side-navigation.is-icons` reserves one 1rem icon track and
  the shared `--bf-side-navigation-icon-gap` before its label.
- Omitting the icon element does not move the label edge.
- Status content remains at the logical end and wrapped labels remain usable.

## TOC hierarchy

- List gap: `0px`.
- Item gap: `0px`.
- Link block padding: body metric start/end only.
- Section heading: canonical H5 role, default text color.
- Section divider: one border width, attached to the following section level.
- Nested indentation: existing logical space token; no added vertical gap.

## Hero grid

- Wide default: two equal tracks with the title area in track 1 and supporting
  content in track 2.
- Title area: flush stack for H1/H2 fragments.
- Supporting area: dense stack.
- Full media: spans `1 / -1` after title/content.
- Narrow: one track in source order.

## Quote grid

- Wide outer grid: eight equal tracks using `--bf-grid-gap-inline`.
- Signpost: columns 1-2.
- Content: columns 3-8 and six-track subgrid.
- Quote/citation: 4/2 tracks within content.
- Header title/link: aligned to the same eight tracks.
- No-signpost content begins at column 3.
- Semantic blockquote: no rule, no inline indent, default text color.

## Demo shell

- `pc-content` composes `bf-page` on every shared-chrome route.
- Page inline padding is exactly `--bf-page-margin`; nested specimen page/fixed
  wrappers do not create a second gutter.
- The page-chrome baseline switch targets the body and is the only baseline
  switch on atlas pages.
- `bf-text-link` is the explicit body-metric box for standalone anchors;
  ordinary prose anchors remain inline.
- Sidebar order is category-first and alphabetic within ordinary categories.
  Previous/Next use the exact rendered order and accessible destination names.

## Stateful pattern geometry

- Content-card border-to-footer-content inset: `calc(0.5rem - 1px)` after the
  one-pixel border.
- Wide media object: eight shared columns, media `1 / span 2`, content `3 / -1`.
- Media slot sizes remain `--bf-space-6` and `--bf-space-12`, aligned to start.
- Compact notification: token-owned insets and extra-dense separate blocks.
- One-sentence notification lead: one body text run with `strong` plus regular
  continuation; no negative-gap utility.
- Sortable indicator: its inline track exists at `aria-sort='none'` with hidden
  paint, then becomes visible for ascending/descending without reflow.

## Page chrome and shared keylines

- Top left: public `bf-breadcrumbs`, body role metrics, current page announced
  with `aria-current="page"`.
- Top right: accessible `bf-button is-base is-icon` anchor controls containing
  only previous/next chevrons; visual paint remains white in both tones.
- Fixed bottom: theme switch, global baseline switch, and tier selector; its
  measured height is reserved so document content is never covered.
- A `bf-page` owns the sole inline gutter. Descendant `bf-fixed-width` keeps
  `max-inline-size`, width, and centering but contributes zero inline padding.
- Plain `hr`, `.bf-rule`, and prose rules share the same geometry and paint.
- Non-heading public UI consumes body-role size/line-height unless its compact
  containing geometry documents a smaller exception.
- A component that suppresses anchor decoration uses element-qualified normal
  and interaction selectors; generic prose anchor behavior remains unchanged.
