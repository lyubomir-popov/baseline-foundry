# Contract: Responsive Split Inventory

This inventory distinguishes a readable content split from density, navigation,
or fixed-mark geometry. A balanced content split has one shared transition:
the pattern's own query container is 45rem (720px) wide. The viewport is not a
proxy for that allocation.

## Shared balanced split

| Pattern | Source owner | Split | Threshold | Status |
|---|---|---|---:|---|
| Hero | `sites-editorial-ports.ts` | title/content, including named proportion variants | 45rem | Already present; named variants no longer create an earlier split |
| Basic section | `sites-foundation.ts` | header/content 50/50 | 45rem | Corrected from the old default 64.75rem switch |
| Divided section | `static-content-ports.ts` | header/content 50/50 | 45rem | Corrected; obsolete earlier modifier removed |
| Tiered list | `tiered-list-equal-height-row.ts` | header title/description 50/50 | 45rem | Corrected from 64.75rem |
| Rich list, horizontal `is-50-50` | `sites-rich-lists.ts` | header/support | 45rem | Corrected from 64.75rem |
| Rich list, vertical | `sites-rich-lists.ts` | content/media 50/50 | 45rem | Corrected from 64.75rem |
| Tab section | `tab-section.ts` | heading/intro or heading/tabs 50/50 | 45rem | Corrected from 64.75rem |
| Linked-logo section `is-50-50` | `linked-logo-site-layout.ts` | heading/logo area 50/50 | 45rem | Corrected from 64.75rem; card density is separate |

## Deliberate non-equivalences

| Family | Threshold(s) | Why it does not use the balanced-split rule |
|---|---:|---|
| CTA section and text spotlight | 64.75rem | These are 25/75 offset rails. At 45rem their one-quarter rail is about 10rem before a gutter, which is not a readable text column. |
| Linked-logo `is-25-75`, four-card density | 64.75rem | The 25/75 rail has the same minimum-rail constraint; four cards are a card-density decision, not content split. |
| Quote wrapper | 38.75rem / 64.75rem | A small signpost can take the 1/3 visual rail at the medium threshold; the later 8-column quote/citation alignment is grid anatomy. Neither is a default 50/50 text split. |
| Media object | 38.75rem | Its fixed-size pictogram occupies the first two of eight columns and content takes six; it is not two comparable reading columns. |
| Data spotlight, logo grids, equal-height rows | 38.75rem / 64.75rem | These are repeated-item density and alignment transitions, not a single content split. |
| Content-card anatomy | 28.75rem / 60rem | Card media/content arrangements require their own minimum card width. |
| Page/grid/navigation/table thresholds | 38.75rem / 64.75rem | Shell hierarchy, outer gutters, control/navigation affordances, and table overflow are separate responsive contracts. |

## Verification

- Static contract: `scripts/validation/renewal-component-contracts.ts` asserts
  the shared 45rem source surface.
- Browser behavior: use the component routes in the table, both immediately
  below and at a 45rem allocated container width, for all four tiers.
- Visual review on 2026-08-29: a 697px tiered-list allocation remained one
  column and a 737px allocation became two columns; no reviewed pattern had
  inline overflow at the expanded state.
