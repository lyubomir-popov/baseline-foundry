# Baseline Foundry Constitution

## Core principles

### I. Owner-led design authority

Baseline Foundry is independent design-led internal tooling. Explicit owner
decisions and local accepted specs govern product behavior. External Canonical,
Pragma, Vanilla, and consumer repositories are evidence and ancestry, not an
automatic override of BF intent.

### II. Container-owned semantic spacing (NON-NEGOTIABLE)

Editorial, documentation, app, and OS containers own semantic spacing between
their direct children. Metric-aligned text elements own only their measured
top nudge and complementary bottom-margin compensation; role space-after does
not participate in production layout. Nested `bf-stack` containers express
changes in density, and explicit section stacks own page-pattern boundaries.

### III. Metric truth

Production alignment is derived from real font files and recorded in published
surface evidence. A font may not be swapped onto nudges derived from another
face. Demo engines must not be described as production contracts.

### IV. Four first-class tiers

Editorial, documentation, app, and OS share one public surface shape and support
standard. Intentional value differences express context; missing entry points,
tokens, selectors, tests, or documentation are parity defects.

### V. Small, earned primitives

Public APIs use small composable `bf-*` structures and `is-*` modifiers. A new
primitive requires a reusable user scenario and independently testable demo.
Consumer product features stay local. Compatibility aliases and one-off
selector patches are rejected.

### VI. Accessible, intrinsic composition

Components use semantic HTML, complete visible names, keyboard-visible focus,
logical properties, safe wrapping, and intrinsic/container-responsive layout.
Directional contracts cover LTR and RTL. Unavailable actions are omitted or
semantically disabled as appropriate, never made into misleading live controls.

### VII. Generated contracts and public evidence

Config/source are authoritative; generated artifacts are outputs. Every public
surface change has static assertions, relevant browser behavior/baseline
coverage, and a reviewable demo. Direct and class-scoped tier paths are compared
for equality.

### VIII. Lean specification-owned state

Durable feature intent, decisions, tasks, and evidence live in one active Spec
Kit package. Global files each have one narrow owner. Git and archived packages
hold history; the repo does not maintain parallel roadmap/status/history
narratives.

## Technology and quality constraints

- TypeScript and generated CSS/JSON are the product path.
- No styled `data-*` selectors, `ui-*` roles, `p-*` compatibility layer, BEM
  public API, or `!important` fixes.
- Controls use the occupied-block baseline model; no arbitrary target heights.
- New directional CSS uses logical properties.
- Generated `dist/` files are never hand-authored.
- Relevant tests run during implementation; `npm test` and
  `npm run qa:components` are closeout gates for component/tier programmes.

## Development workflow

- Work from a matching `feat/<id>-<slug>` branch and one active
  `specs/<id>-<slug>/` package.
- Define independently testable user stories before implementation.
- Split parallel tasks by file ownership and integrate centrally.
- Preserve unrelated dirty work.
- Close only after an adversarial source/API review and rendered demo review.

## Governance

This constitution supersedes older root planning narratives and conflicting
repository prose. Amendments require an explicit owner decision, an updated
active spec when behavior changes, migration notes, and a version change.

**Version**: 3.0.0 | **Ratified**: 2026-08-13 | **Last amended**: 2026-08-27
