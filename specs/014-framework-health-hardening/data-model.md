# Data Model: Framework Health Hardening

This package has no application database. Its state-bearing entities are Git,
release and validation records.

## Cleanup Target

- **Identity**: exact worktree path or local/remote branch ref
- **Kind**: worktree, local branch, remote branch
- **Protected state**: `main`, active branch, tag, named user work, or unmerged
- **Evidence**: merge-base result, semantic diff result, current status
- **Transition**: discovered → guarded → retired, or discovered → preserved
- **Validation**: retirement is legal only when every applicable guard succeeds

## Validation Owner

- **Identity**: orchestration file and cohesive extracted module
- **Domain**: component CSS, static build contract, browser behavior contract
- **Baseline**: original line count, public/generated hashes, assertion result
- **Transition**: concentrated → extracted → equivalence-verified
- **Validation**: original owner shrinks by at least 25 percent; extracted module
  is smaller than the reduced owner; ordered output and checks remain equivalent

## Release Candidate

- **Identity**: package name plus semantic version
- **Source**: exact Git commit and expected `v<version>` tag
- **Artifact**: npm tarball filename, registry integrity/shasum, local checksums
- **State**: prepared → preflighted → published → registry-verified → released
- **Failure state**: rejected before publish or published-awaiting-closeout
- **Validation**: version unused, ref/version consistent, package gates green,
  empty consumer imports every public surface, GitHub release targets the source

## Toolchain Contract

- **Runtime floor**: minimum supported Node release
- **Release runtime**: Node release used for trusted publication
- **Package manager**: reproducible npm release
- **Development majors**: TypeScript and Vite dispositions
- **Validation**: every declared runtime appears in CI and satisfies the package
  and browser contracts
