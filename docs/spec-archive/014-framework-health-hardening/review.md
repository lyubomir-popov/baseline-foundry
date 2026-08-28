# Review: Framework Health Hardening

**Reviewed**: in progress, 2026-08-28

**Disposition**: Merged and archived; 0.1.4 publication pending.

## Pre-change baseline

- Branch: `feat/014-framework-health-hardening` from clean `main` at `1da365d`.
- Latest `main` CI: run `33185728799`, passed on the same commit.
- Generated baseline: 134 files under `dist/`; deterministic path/hash aggregate
  SHA-256 `747849ce5895a116fc93adb335b60dc6a4fefc934810dda25b13fc8dc7c86dca`.
- Refactor equivalence baseline: 24 generated CSS, JSON and font contract files;
  deterministic path/hash aggregate SHA-256
  `4107d7a885155c878d6e76be0552b2b3e8647f30aa88bfe1d78dbb4b5aac3e51`.
  Compiled internal JavaScript/declaration bytes are excluded because module
  extraction intentionally changes their layout while preserving exports.
- Hotspot owners: `src/css-components.ts` 2,724 lines,
  `scripts/validate-build.ts` 2,141 lines, and
  `scripts/verify-component-behavior.ts` 3,827 lines.
- Cleanup inventory: 26 inactive local branches and 18 non-main remote branches
  were ancestors of `main`; `git branch --no-merged main` returned no refs.
- Duplicate worktree: exact path
  `H:/WSL_dev_projects/diagram-registry/.worktrees/baseline-foundry-h6`, branch
  `fix/typography-role-class-precedence`, with three reported source changes.
  `git diff --ignore-space-at-eol --quiet` returned 0 and the branch commit was
  an ancestor of `main`, proving the state was line-ending-only and fully merged.

## Specification analysis

Spec Kit prerequisite discovery resolved the package and all required artifacts.
All 14 functional requirements map to one or more of 26 dependency-ordered
tasks. No placeholder, clarification, duplicate requirement, unmapped task or
constitution conflict remains. The initial closeout order incorrectly placed
archive before merge; it was corrected so merge precedes archive in accordance
with the repository workflow.

## Repository hygiene

- Added repository-owned LF normalization with explicit binary exclusions in
  `.gitattributes`. The policy changed no tracked source status and `git
  diff --check` found no content defect.
- Immediately before removal, the duplicate worktree passed exact-path,
  unstaged semantic-diff, staged-diff and merged-ancestry guards. It and
  `fix/typography-role-class-precedence` were removed.
- Deleted 26 inactive local branches in total, including the duplicate branch,
  only through `git branch -d` after ancestry verification.
- Deleted 18 exact non-main remote branches after a fresh fetch and individual
  ancestry verification. `origin/main`, `main`, the active Spec 014 branch,
  tags and all named user `tmp/` directories remain.
- Final inventory contains one worktree, two local branches (`main` and the
  active feature), and only `origin/main` plus its `origin/HEAD` alias.

## Historical browser evidence

- The current demo started successfully at `http://127.0.0.1:4173/` after a
  clean lockfile install repaired missing local executable links.
- Browser runtime discovery again exposed Chrome only; the in-app backend was
  unavailable. In accordance with Spec 001, Chrome was not substituted.
- The accepted 2026-08-21 owner disposition was made explicit as the T102/T105
  waiver. Both tasks now state the missing surface and today's retry instead of
  appearing to be unfinished implementation work.
- All 13 archived task lists now contain zero unexplained unchecked tasks.

## Modular extraction

- `src/css-components.ts` fell from 2,724 to 1,973 lines (27.6 percent). Its
  contiguous side/top-navigation family now lives in the 780-line
  `src/css-components/legacy-navigation.ts` module at the original output slot.
- `scripts/validate-build.ts` fell from 2,141 to 1,397 lines (34.8 percent).
  Renewal assertions (438 lines), demo/atlas assertions (326 lines), and the
  shared duplicate-class helper (7 lines) have focused owners with unchanged
  invocation order and diagnostic strings.
- `scripts/verify-component-behavior.ts` fell from 3,827 to 2,511 lines (34.4
  percent). Later ported component contracts occupy a 1,297-line module and the
  shared browser lifecycle occupies 32 lines.
- No extracted module exceeds its reduced orchestrator. `npm run check:types`
  and `npm run build` pass.
- The 24 generated CSS, JSON and font files reproduce the exact pre-refactor
  aggregate `4107d7a885155c878d6e76be0552b2b3e8647f30aa88bfe1d78dbb4b5aac3e51`.
- `npm run test:build` passes all 5,661 assertions with the same per-group
  counts, and `npm run test:behavior` passes the complete interaction/geometry
  suite.

## Release and toolchain

- Release preflight now validates package/lock version equality, semantic
  version shape, clean expected ref and exact `origin/main`, unused local/remote
  tag, unused npm version, and the package allowlist before publication.
- Negative fixtures prove an existing registry version and a ref mismatch are
  rejected before `npm publish`.
- Local preflight passes against 0.1.3 with the explicit development-only
  existing-version/dirty overrides.
- Empty-consumer verification passes for a freshly packed local tarball: 30
  root exports and all 21 root/tier/preset CSS, token and surface entry points.
- `publish.yml` pins npm 11.19, retains OIDC without a write token, adds exact
  registry verification, checksums, tarball attachment and matching GitHub
  release creation, and supports post-publish resumption without republishing.
- README, operator guidance and publishing docs state the supported command
  path and the npm limitation that private source repositories do not expose
  public provenance attestations.
- Package metadata now declares Node `>=22.14.0`, npm `>=11.19.0`, and
  `packageManager: npm@11.19.0`. CI covers Node 22.14 and 24 with the same pinned
  npm/release gate; publication remains on Node 24.
- TypeScript 7.0.2 and Vite 8.2.2 are adopted. TypeScript 7 required an explicit
  `types: ["node"]` compiler contract; after that strict checking and library
  compilation pass. Vite 8 serves the Pattern Atlas route with HTTP 200.
- npm 11 clean install passes with zero advisories and no unreviewed lifecycle
  scripts. `esbuild` is explicitly denied an install hook because the clean
  Vite 8, tsx, build and browser paths pass without it.
- `@types/node` remains on the current Node 24 line intentionally rather than
  adopting Node 26 declarations outside the supported runtime matrix.
- Post-upgrade component baseline verification reports zero failures, the full
  browser behavior suite passes, local package verification still reports 30
  root exports and 21 asset entry points, and generated-contract hashes remain
  identical to the pre-refactor baseline.

## Closeout gates

- The exact 0.1.4 candidate passed `npm run release:check` with exit code 0 on
  2026-08-28: strict type checking, build, all 5,661 static assertions, full
  interaction/geometry behavior, 87 refreshed component captures, four-tier
  component baselines, and both full and production audits. Every reported
  browser contract had zero failures and both audits reported zero
  vulnerabilities.
- A subsequent npm 11.19 clean install added 43 locked packages with zero
  advisories. Strict type checking, negative release fixtures, unused-version
  candidate preflight, `git diff --check`, dry-run package inspection and local
  clean-consumer verification all passed. The packed 0.1.4 candidate contains
  147 files; the consumer resolved 30 root exports and all 21 asset entry
  points with no forbidden source, script, demo, spec or temporary paths.
- Rendered review covered the application shell, canonical tagged top
  navigation, form atlas and responsive mobile-card table. Baseline rows,
  occupied blocks, focus/control affordances, overflow and narrow-card
  conversion remained coherent; no visual regression was found.
- Adversarial review found and resolved two Medium release flaws before merge:
  registry/network failures now fail closed instead of being treated as an
  unused version, and the GitHub release tarball SHA-1 must equal npm's recorded
  `dist.shasum`. The existing-version fixture now discovers the latest
  published version, so it remains valid after the candidate version changes.
  No unresolved Critical, High or Medium finding remains.
- PR #1 merged the exact reviewed feature commit `9c146d5` to `main` at
  `181d64d`. Push and pull-request GitHub runs `33195228211` and `33195244095`
  both passed the Node 22.14 and Node 24 release-check matrix before merge.
- Merged-main run `33195836948` passed both supported Node jobs at archive
  commit `e34a2ad`. The first publish attempt, run `33196344358`, stopped before
  preflight or publication because the package-version output step over-escaped
  its shell expression. npm still returned E404 for 0.1.4. The output command
  was reduced to one directly executable Node expression before retry.
- Corrected-commit CI run `33196489826` passed both supported Node jobs. Publish
  retry `33197008574` then stopped at preflight, again before npm mutation,
  because clean checkout correctly had no gitignored `dist/index.js`. Local
  validation had inherited build outputs. The workflow now performs the
  deterministic build before package-content preflight; that output is also the
  input to post-publish tarball checksum comparison.
- Clean-output fix CI run `33197161932` passed both supported Node jobs. Publish
  run `33197656449` then exposed the final clean-checkout prerequisite before
  preflight: the ignored IBM Plex experiment font had not been bootstrapped.
  npm still returned E404 for 0.1.4. The publish workflow now mirrors
  `release:check` by running the pinned font setup before its preflight build.
