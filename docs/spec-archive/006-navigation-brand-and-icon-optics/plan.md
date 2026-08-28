# Implementation plan: navigation brand and icon optics

1. Add an opt-in panel-header modifier that composes the existing Canonical
   tagged logo without changing ordinary panel padding.
2. Dogfood the brand composition in the BF application-layout drawer.
3. Add a shared 3 px expanded side-navigation icon optical offset and reset it
   for collapsed application navigation.
4. Add generated CSS, markup, and rendered geometry assertions.
5. Build, review expanded/collapsed and mobile behavior with Playwright, release
   BF, and refresh Diagram Registry from the immutable release commit.
