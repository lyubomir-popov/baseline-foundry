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
npm install https://github.com/lyubomir-popov/baseline-foundry/releases/download/v0.1.3/baseline-foundry-0.1.3.tgz
```

Do not install the Git tag or GitHub source archive. `dist/` is generated and
gitignored, so only the npm package and attached npm tarball contain the public
CSS, JSON, JavaScript, and type declarations.

## Release checklist

The initial `0.1.3` publication was bootstrapped interactively because npm can
only attach a trusted publisher after a package exists. Routine releases use
the OIDC workflow below. `npm publish` invokes the package's `prepublishOnly`
release gate, so the workflow does not duplicate that command.

1. Bump BF to the next unused version and regenerate `package-lock.json`.
2. Run `npm run release:check` and `npm pack --dry-run`; confirm the tarball
   contains `dist/`, `config/`, `docs/publishing.md`, `README.md`, `LICENSE`,
   and no source or local temporary files.
3. Commit and push the exact release candidate.
4. Publish from `.github/workflows/publish.yml`; npm trusted publishing uses a
   short-lived GitHub Actions OIDC credential, so no npm token is stored.
5. Verify `npm view baseline-foundry version`, then install the exact published
   version into an empty directory and smoke-test the root, `build`, CSS, token,
   surface, and four tier export paths.
6. Tag the same commit and publish the GitHub release with the npm tarball
   attached as a fallback artifact.

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
