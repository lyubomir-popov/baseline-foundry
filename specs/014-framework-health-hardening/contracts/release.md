# Contract: Trusted npm Release

## Preconditions

- The workflow runs from `main` at the exact release commit.
- `package.json` and `package-lock.json` contain the same unused version.
- The corresponding `v<version>` tag and npm version do not already exist.
- The release candidate passes the sole `prepublishOnly` gate and package
  allowlist inspection.
- Publication uses the configured npm trusted publisher, with no npm write
  token stored in the repository or workflow.

## Immutable transition

`prepared → preflighted → npm published`

No fallible ref/version/package check may be deferred until after the immutable
publish transition.

## Postconditions

- An empty-directory install of the exact registry version passes the root,
  build, preset, CSS, token, surface and four-tier import inventory.
- Registry and attached tarball checksums are recorded.
- `v<version>` and the GitHub release target the release commit.
- The exact package tarball is attached as the fallback artifact.
- Failures after npm publication remain visible and resumable; rerunning must
  not attempt to republish the immutable version.

## Known limitation

The repository is private. npm trusted publishing can authenticate publication,
but npm's current provenance service does not expose public provenance for a
public package built from a private repository. Documentation must state this
accurately.
