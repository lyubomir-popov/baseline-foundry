# CSS contract policy-junction adversarial review

**Reviewed:** Pragma `1564bacc0` with forward test correction `c3ee988f2`  
**Verdict:** GO for further local React migrations

## Defect reproduced

The former gate selected one comparison base from overall worktree dirt. An
invalid classification already committed in `HEAD` could therefore escape its
required parent-to-HEAD check when any unrelated scanner input was dirty,
staged or untracked.

## Accepted correction

The gate now authenticates three independent snapshots:

1. committed parent to `HEAD`;
2. `HEAD` to the exact Git index when scanner inputs are staged; and
3. index to working tree, or `HEAD` to working tree when the index is unchanged.

CSS, TS, TSX and Svelte inputs use the same production scope in every snapshot.
Global classification and allowlist cardinality is retained even when a package
invokes the check. The separate governed code-role registry is also evaluated
at each junction, so a safe unstaged replacement cannot hide a bad committed or
staged marker.

The bounded remediation path accepts only homogeneous one-to-one conversions
of existing transition debt. It preserves rule, file and selector; permits only
physical-to-logical size spelling and/or a direct provider primitive moving to
an already protected shared output; requires exactly one old and one new raw
fact; removes the old allowlist identity; and forbids policy growth or a mixed
promotion transaction. The protected output must exist exactly once with the
same selector and value before and after the change.

Hidden `.storybook` CSS remains outside the existing Bun glob scope. That is a
recorded T072/T073 coverage gap, not a silent diagnostic-basis change in this
security commit.

## Evidence

- Root independently reproduced scanner tests: 103/103, 305 assertions.
- Root independently reproduced the unqualified governed-code suite after the
  Git-fixture correction: 39/39, 111 assertions.
- Biome and staged diff checks passed.
- Adversarial fixtures reject committed invalid promotions despite unrelated
  dirty/staged/untracked source; staged policy borrowing unstaged source;
  partial selector relocation; staged cap-oracle/code-role violations; changed
  protected outputs; and mixed cross-package promotion/remediation.
- One-off snapshot audits reproduce `c79bff687` as four unchanged promotions
  and `e23234d75` as six valid homogeneous remediations.

The live global CLI currently reports one stale Range transition because later
Wave 5 work remains deliberately unstaged. That is expected working-state debt,
not evidence carried into this accepted policy commit.
