# Implementation plan: prose list spacing

1. Exclude `ul` and `ol` from the existing `.bf-prose` final-child trim while
   preserving the selector's class-level specificity.
2. Extend generated CSS assertions and rendered four-tier behavior checks.
3. Build and inspect the prose specimen in the browser.
4. Release the generated bundle and refresh Diagram Registry from an immutable
   commit.

