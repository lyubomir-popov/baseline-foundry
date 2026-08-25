# Review: semantic list spacing

**Status:** Ready for release

## Contract evidence

- Generated CSS gives semantic `ul` and `ol` elements
  `var(--bf-body-margin-bottom)` under `.bf-theme`.
- `.bf-prose` retains indentation independently, and later tiered-list rules
  retain zero margin on structural `bf-tiered-list-items` containers.
- Four-tier rendered behavior measures the list inside a tiered-list copy slot
  against a paragraph and checks the structural container independently.

## Gates

- `npm test`: build validation (5,418 checks), component baselines, and rendered
  behavior passed after the specimen audit attributes were completed.
- `npm run qa:components`: captures and baseline verification passed.
- In-app browser, editorial tier at 1280 × 900: list margin after `8px`, paragraph
  margin after `8px`, structural list margin `0px`, measured list-to-rule gap
  `8px`, no horizontal overflow, and no console errors.

The immutable release commit and downstream Registry evidence will be added in
the closeout commit.
