// Shared assertion primitive for the build validation suite.
//
// validate-build.ts and the helpers it composes (e.g. css-ast-helpers.ts)
// both call this `assert` so the same `checkCount` is incremented for every
// passing check. This keeps the per-invariant counts and the final
// "Build validation passed: N total checks" tally accurate regardless of
// where in the helper graph an assertion lives.

let checkCount = 0;

export function assert(condition: unknown, message: string): asserts condition {
  checkCount++;
  if (!condition) {
    throw new Error(message);
  }
}

export function getCheckCount(): number {
  return checkCount;
}
