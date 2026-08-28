# Research: Framework Health Hardening

## Decision 1: Enforce LF in Git, not through an editor mandate

**Decision**: Add `.gitattributes` with `* text=auto eol=lf` and explicit binary
exceptions. Verify with normalization inspection before staging any changes.

**Rationale**: The duplicate worktree is semantically clean under
`--ignore-space-at-eol`, while the host-wide Git configuration enables
`core.autocrlf=true`. A repository-owned Git rule fixes the demonstrated source
of ambiguity across editors and worktrees.

**Alternatives considered**: `.editorconfig` alone cannot govern Git index
normalization; disabling the user's global Git setting would affect unrelated
repositories; a formatter/linter would add unrelated policy and dependencies.

## Decision 2: Treat cleanup as a guarded state transition

**Decision**: Record exact worktree and branch targets, prove semantic-clean and
merged ancestry, exclude active/protected refs, then retire the duplicate
worktree and historical branches. Preserve tags and named user `tmp/` content.

**Rationale**: The owner approved destructive cleanup, but branch/worktree
state can change between discovery and removal. Rechecking immediately before
each mutation keeps the authorization bounded to the audited residue.

**Alternatives considered**: Leaving all refs preserves recovery at the cost of
ongoing ambiguity; deleting by wildcard cannot prove target safety.

## Decision 3: Finish the historical browser gate in the requested surface

**Decision**: Serve the existing demo and retry the in-app browser. If the
backend remains unavailable, do not substitute Chrome; convert T102/T105 to an
explicitly labelled waiver under the accepted 2026-08-21 owner disposition and
record the new discovery evidence in both reviews.

**Rationale**: Spec 001 intentionally kept the tasks open when only Chrome was
available. Spec 014 initially expected that backend to be available, but browser
discovery again exposed Chrome only. The accepted owner disposition already
closed implementation while preserving the missing surface honestly; an
explicit waiver is clearer than unexplained unchecked tasks.

**Alternatives considered**: Substituting Chrome would violate the original
acceptance instruction; leaving the tasks unchecked would continue the archive
ambiguity.

## Decision 4: Extract contiguous, cohesive owners before semantic cleanup

**Decision**: Extract legacy navigation CSS, renewal/demo static assertion
families, and the later ported behavior families. Keep orchestration entry
points, execution order and diagnostic strings stable. Compare generated hashes
before dependency upgrades.

**Rationale**: Contiguous extraction produces a reviewable move with minimal
behavioral risk and reduces each identified hotspot by at least 25 percent.
Semantic rewrites or a new abstraction framework would combine cleanup with
unnecessary behavior risk.

**Alternatives considered**: A wholesale CSS architecture rewrite; splitting
every function into one file; leaving the validated hotspots unchanged.

## Decision 5: Keep trusted publishing and add deterministic pre/post gates

**Decision**: Continue direct GitHub-hosted OIDC publication through
`publish.yml`, pin an npm 11 release that supports trusted publishing, reject
used versions/ref mismatches before `npm publish`, verify the exact registry
package in an empty directory, then create the matching GitHub release and
checksum assets.

**Rationale**: npm's official trusted-publisher guidance requires GitHub-hosted
runners, `id-token: write`, Node 22.14+ and npm 11.5.1+. It also confirms that a
private source repository cannot currently produce public npm provenance, so
the workflow must not make that claim. The current trusted relationship already
uses this workflow filename and needs no long-lived token.

**Alternatives considered**: Interactive recovery-code publication; stored
automation tokens; publishing on every tag without a negative preflight;
staged publishing, whose approval commands still require interactive proof of
presence.

**Primary evidence**:

- [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)
- [npm provenance limitations](https://docs.npmjs.com/generating-provenance-statements/)

## Decision 6: Support maintained Node release lines and adopt green stable majors

**Decision**: Declare Node `>=22.14.0` and npm `11.19.0`, exercise Node 22.14+
and Node 24 in CI, adopt stable TypeScript 7 and Vite 8 if all BF gates remain
green, and retain Node 24 for publication.

**Rationale**: Vite 8 officially requires Node 20.19+ or 22.12+; npm trusted
publishing requires Node 22.14+. Choosing the stronger release constraint gives
contributors and CI one coherent floor. TypeScript 7.0.2 and Vite 8.2.2 are the
registry `latest` releases at planning time.

**Alternatives considered**: Claiming support for untested older Node releases;
using current Node typings as a runtime policy; forcing a major upgrade after a
contract failure.

**Primary evidence**:

- [Vite 8 announcement and Node support](https://vite.dev/blog/announcing-vite8)
- [Vite 8 migration guide](https://vite.dev/guide/migration.html)
- [TypeScript documentation](https://www.typescriptlang.org/docs/)
