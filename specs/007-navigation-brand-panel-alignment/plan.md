# Implementation plan: navigation-brand panel alignment

1. Record the downstream 16 px inline and 4 px text-baseline deltas.
2. Correct the existing BF navigation-brand composition rather than adding a
   Registry override or consumer-specific modifier.
3. Extend generated and rendered geometry assertions.
4. Run the complete BF gates and focused Playwright review.
5. Release BF and refresh the Registry from the immutable generated bundle.
