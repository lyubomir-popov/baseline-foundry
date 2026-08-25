# Review: prose list spacing

**Status:** Ready for release

## Evidence

- Build validation passed 5,413 generated and static checks.
- Four-tier component baselines and the complete component behavior suite
  passed.
- The complete component capture and verification gate passed.
- Rendered editorial measurement: the final list and an ordinary paragraph
  both resolve `margin-bottom: 8px`; the following section begins exactly 8 px
  after the list border box.
- The selector keeps `:last-child` at class-level specificity and excludes
  `ul` and `ol` through zero-specificity `:where()` arguments.

Ready to release. Downstream Registry verification remains T005.
