# Review: prose list spacing

**Status:** Released and verified downstream

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

Released on `main` at `6d203e5884548aabf615ba484403380fb21320e5`.
Diagram Registry vendors that immutable release and passed its copy, link,
schema, Python, Node, and responsive browser gates. Its final prose list
resolves the same 8 px bottom margin as an ordinary paragraph.
