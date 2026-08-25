# Implementation plan: semantic list spacing

1. Move semantic list space-after ownership from the `.bf-prose` composition
   selector to the zero-specificity global `ul`/`ol` role selector.
2. Keep prose indentation in its existing `.bf-prose` selector and rely on
   later component rules to reset structural list containers explicitly.
3. Extend static validation and four-tier rendered behavior with a consumer-
   shaped tiered-list copy-slot fixture.
4. Build and inspect the prose specimen and Diagram Registry consumer route.
5. Release the generated bundle from an immutable BF commit and vendor that
   exact commit downstream.
