# npm publication and downstream migration

Baseline Foundry is a public npm package named `baseline-foundry`. The GitHub
repository may remain private: npm publishes
only the allowlisted package contents (`dist/`, `config/`, this publishing
guide, `README.md`, `LICENSE`, and package metadata), not the source, demos,
specs, or tests.

A private npm package would still require account or organisation access and
would not solve the collaborator problem. Publication therefore uses the
public registry explicitly.

## Installation

Install the registry package:

```bash
npm install baseline-foundry
```

The attached GitHub release tarball is the fallback:

```bash
npm install https://github.com/lyubomir-popov/baseline-foundry/releases/download/v0.1.4/baseline-foundry-0.1.4.tgz
```

Do not install the Git tag or GitHub source archive. `dist/` is generated and
gitignored, so only the npm package and attached npm tarball contain the public
CSS, JSON, JavaScript, and type declarations.

## Release checklist

The initial `0.1.3` publication was bootstrapped interactively because npm can
only attach a trusted publisher after a package exists. Routine releases use
the OIDC workflow below. `npm publish` invokes the package's `prepublishOnly`
release gate, so the workflow does not duplicate that command. The workflow
pins the supported npm CLI, and no npm write token or recovery code is used.

1. Bump BF to the next unused version and regenerate `package-lock.json`.
2. Run `npm run release:preflight:test`, `npm run release:check`, and
   `npm run release:verify -- --pack-current`. The negative fixtures prove used
   versions and ref mismatches fail before publication; the local tarball check
   exercises all runtime and asset entry points in an empty consumer.
3. Commit and push the exact release candidate to `main`.
4. Dispatch `.github/workflows/publish.yml` with
   `resume_after_publish=false`. The workflow bootstraps the pinned demo font
   and builds the gitignored package outputs before its preflight, which
   requires clean `main`, exact
   `origin/main`, matching lockfile metadata, an unused npm version and tag, and
   the allowlisted package contents.
5. `npm publish` obtains a short-lived OIDC credential and owns the sole
   `prepublishOnly` release gate. The workflow then installs the exact registry
   version into an empty directory, checks every public entry point, creates
   SHA-1/SHA-256 records, tags the source commit, and attaches the npm tarball
   and checksums to the matching GitHub release.
6. If npm publication succeeded but a later verification or GitHub release step
   failed, rerun the same workflow with `resume_after_publish=true`. Resume mode
   requires the registry version to exist, skips `npm publish`, verifies any
   existing tag targets the same commit, and creates or replaces release assets.

The GitHub repository is private. npm trusted publishing still removes the need
for a long-lived write token, but npm currently does not publish public
provenance attestations for packages whose source repository is private. The
tag, checksums, attached npm tarball and clean registry verification are BF's
durable release evidence; documentation must not claim public provenance.

## Compatibility

Keeping the package name means normal consumers do not change imports:

```js
import { setupBaselineGridToggle } from "baseline-foundry";
import { buildThemeFromConfig } from "baseline-foundry/build";
import "baseline-foundry/styles.css";
```

Consumers using the attached `.tgz` can switch their dependency value to a
semver range after publication; their JavaScript and CSS imports remain the
same. Lockfiles will record a registry tarball instead of a file or URL source.

Diagram Registry currently vendors generated CSS/tokens from a sibling
checkout, so publishing does not alter its present build. It can adopt the npm
artifact later as a separate, lockfile-visible migration.
