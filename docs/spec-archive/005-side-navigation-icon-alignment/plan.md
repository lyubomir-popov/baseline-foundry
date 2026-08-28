# Implementation plan: side-navigation icon alignment

1. Reproduce and measure the wrapped-label defect in Diagram Registry.
2. Add a wrapped icon label to the BF application-layout pressure fixture.
3. Make icon-bearing side-navigation rows use first-baseline cross-axis
   alignment while leaving non-icon navigation unchanged.
4. Add generated CSS and rendered first-line geometry assertions.
5. Build, review at expanded and collapsed widths, release BF, and refresh the
   Registry dependency from the immutable release commit.
