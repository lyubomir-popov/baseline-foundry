# npm publication and downstream migration

Baseline Foundry is prepared as a public npm package named
`baseline-foundry`. The GitHub repository may remain private: npm publishes
only the allowlisted package contents (`dist/`, `config/`, this publishing
guide, `README.md`, `LICENSE`, and package metadata), not the source, demos,
specs, or tests.

A private npm package would still require account or organisation access and
would not solve the collaborator problem. Publication therefore uses the
public registry explicitly.

## Current installation

Before the first registry publication, install the verified GitHub release
artifact:

```bash
npm install https://github.com/lyubomir-popov/baseline-foundry/releases/download/v0.1.2/baseline-foundry-0.1.2.tgz
```

Do not install the Git tag or GitHub source archive. `dist/` is generated and
gitignored, so only the attached npm tarball contains the public CSS, JSON,
JavaScript, and type declarations.

After registry publication:

```bash
npm install baseline-foundry
```

## First-publication checklist

1. Authenticate this machine with an npm account that can publish public
   packages (`npm adduser`) and satisfy that account's two-factor policy.
2. Publish `@lyubomir-popov/baseline-nudge-generator@1.5.1` first, then change
   BF's dependency from the temporary GitHub-tag URL to the registry range
   `^1.5.1` and regenerate `package-lock.json`.
3. Bump BF to the next unused version. `v0.1.2` already exists as a GitHub
   release, so the registry-ready documentation/metadata slice should publish
   as `0.1.3` or later.
4. Run `npm run release:check` and `npm pack --dry-run`; confirm the tarball
   contains `dist/`, `config/`, `docs/publishing.md`, `README.md`, `LICENSE`,
   and no source or local temporary files.
5. Run `npm publish --access public`.
6. Verify `npm view baseline-foundry version`, then install the exact published
   version into an empty directory and smoke-test the root, `build`, CSS, token,
   surface, and four tier export paths.
7. Tag the same commit, publish the GitHub release, and change the README so the
   registry command is the primary installation path and the attached tarball
   is the fallback.

The unscoped `baseline-foundry` name returned no registry package on
2026-08-28. Availability is only guaranteed once the first publication claims
the name.

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

The current Portfolio checkout needs a small migration before switching from
`file:../baseline-foundry`: it reaches into BF's unpublished `src/build.ts` and
nested development copy of `tsx`. A registry install intentionally contains
neither. Portfolio should add `tsx` as its own development dependency, run
`tsx scripts/build-bf-theme.ts`, and import `buildThemeFromConfig` from the
public `baseline-foundry/build` export. This removes reliance on BF internals;
its CSS and runtime imports already use stable public paths.

Diagram Registry currently vendors generated CSS/tokens from a sibling
checkout, so publishing does not alter its present build. It can adopt the npm
artifact later as a separate, lockfile-visible migration.
