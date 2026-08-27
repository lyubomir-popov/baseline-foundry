# Research: Site shell primitives

- `bf-fixed-width` is centered by BF. Registry's `.site-content-row` changes
  only logical alignment, proving a missing opt-in modifier.
- `bf-panel` already owns fixed-height header/content composition, but demos
  misuse `bf-panel-header` for footer content and no bottom-sticky footer class
  exists.
- `bf-tabs-link` already owns `cursor: pointer`; Registry's `.gallery-tab`
  declaration is redundant and should simply be deleted downstream.
- `bf-code-snippet-block.is-wrapped` already replaces Registry's request
  template overflow helper.
- Table overflow and light artwork inset are generic missing seams and belong
  beside BF's table and figure contracts.
- The link rule must target a named basic-section title link. A global
  no-underline link modifier would erase useful affordance from ordinary prose.
