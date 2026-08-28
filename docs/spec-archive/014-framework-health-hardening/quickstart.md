# Quickstart: Framework Health Hardening

## 1. Repository guards

```powershell
git status --short
git worktree list --porcelain
git branch --no-merged main
git diff --ignore-space-at-eol --check
```

Confirm exact cleanup targets against `contracts/repository-health.md` before
removing any worktree or ref.

## 2. Refactor equivalence

```powershell
npm run build
npm run check:types
npm run test:build
npm run test:behavior
```

Record generated hashes before extraction and compare them after extraction,
before changing dependency versions.

## 3. Browser evidence

```powershell
npm run demo:serve -- --host 127.0.0.1
```

Use the in-app browser to review Pattern Atlas and representative component
states across Editorial, Documentation, App and OS at desktop and constrained
widths. Check console output, overflow, keyboard focus and RTL where relevant.

## 4. Toolchain and package validation

```powershell
npm ci
npm run release:preflight -- --allow-existing-version
npm run release:check
npm pack --dry-run
```

The local preflight override exists only to exercise package/ref checks for the
already released development version; the publish workflow never uses it.

## 5. Closeout

```powershell
npm test
npm run qa:components
npm audit
```

After merge and a maintenance version bump, dispatch `publish.yml`. Verify the
registry package, Git tag, GitHub release target, tarball and checksum record all
agree before archiving Spec 014.
