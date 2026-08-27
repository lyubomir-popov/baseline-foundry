# Plan: Site shell primitives

1. Extend focused BF owners: grid, panel, table, Sites foundation and figure.
2. Dogfood the contracts in component demos without consumer CSS.
3. Add static and real-browser behavior assertions across tiers and widths.
4. Run full BF gates, release the immutable build, then verify Registry as the
   first consumer.

No runtime API is required. All public styling remains flat `bf-*` classes and
`is-*` modifiers; generated `dist/` files are build outputs only.
