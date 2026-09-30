# Revised-plan junction review — 2026-09-09

Status: foundation execution needs a narrow owner decision. This is a review,
not an amendment to the governing spec or acceptance of implementation.

## Decision preserved

Pragma uses shared CSS `1cap` alignment for all roles, including headings.
BF retains its baseline-nudge generator. Font authentication and the official
Ubuntu Sans Mono v1.006 repair remain required. Ordinary rows and text lists
use trailing margin; only Tabs Item and ContextualMenu Item absorb compensation
inside their painted boxes, for the reasons in the revised contract.

## Actual working state

- BF: `feat/022-pragma-spacing-adoption`, with existing owner and agent changes.
- Pragma accepted spacing baseline: `feat/bf-spacing-model` at `533ae3e1b`.
- Pragma previous implementation: `feat/bf-metric-nudge` at `533ae3e1b`, under
  `.claude/worktrees/feat-bf-metric-nudge`, with a substantial uncommitted diff.
  The claim that this worktree is untouched is incorrect. Preserve it.
- BF port 4173 and Pragma port 4174 both returned HTTP 200 during this review;
  neither server was restarted. No BF build or production CSS edit was run.
- Earlier green matrices in `review.md` tested the generator implementation;
  they do not accept the revised plan. T046-T051 and T053 remain open.

## Foundation blockers and proposed resolutions

### 1. Root-only row outputs cannot consume component-local border inputs

Stage 2 and the alignment contract scope derived outputs to product roots,
but instruct components to set their border inputs locally. Custom properties
substitute their variable dependencies before inheritance. A descendant border
override therefore cannot alter a row expression already resolved on its
ancestor. This follows the
[CSS custom-property computed-value contract](https://www.w3.org/TR/css-variables-1/#defining-variables)
and was independently identified by the foundation and consumer reviewers.
The separate adversarial reviewer also returned NO-GO. Its isolated browser
probe did not complete because the browser surface rejected the data-URL
fixture; this review claims standards/source evidence, not a new browser pass.

Proposed owner correction: keep one formula owner and the product roots as
token owners, but explicitly permit the shared row/lane formulas and default
paint inputs to be instantiated on a generic consuming host. Components set
inputs and consume outputs; no component-specific formula or selector belongs
in the shared file. Validate descendant, nested-host and product-mutation cases.

Do not blindly copy the current `.ds` ledger: it derives both padding edges
from the start border. FR6 requires separate start/end subtraction and a sum
of the two independent paddings, including underlined and unequal-border cases.

### 2. Enforcement conflicts with required provider strokes

Stage 4 bans every `var(--dimension-*)` in component CSS; Stage 6 explicitly
requires ContextualMenu to use the provider medium/large stroke properties.
Proposed resolution: publish semantic stroke aliases in the shared contract
and consume those in the component, preserving provider propagation. This
needs explicit reconciliation, not a silent lint exception.

### 3. The foundation gate says merged, while merge is out of scope

The plan prohibits further restyling until stages 1-4 are merged; the spec
excludes merges. Proposed resolution for local work: independent review and
green foundation checks form the local implementation gate, while actual
merge/PR authorization remains separate. Do not infer merge authority.

### 4. Bound enforcement without hiding legacy violations

Stage 4's package-wide rules reach legacy components beyond the named retrofit.
The affected-package/file scope and explicit classification must be approved
before enabling them; do not silently grandfather violations or expand this
slice into a repository-wide restyle. The token inspector exemption, legitimate
heading/code roles and floating-surface bounds must be represented as data.
The adversarial source sweep found 78 component CSS files matching primitive
uses, 12 matching prohibited font declarations/roles and 23 matching block-size
constraints. These are audit matches, not individually adjudicated violations.
Consequently, a zero-violation gate cannot precede the planned cleanup as written.
Choose either a reviewed temporary legacy allowlist that rejects new violations
and shrinks during migration, or move the full enforcement gate after cleanup.

### 5. Make the single-cap occurrence rule executable

The role template repeats `1cap` if expanded literally, while acceptance asks
for exactly one occurrence. A single unregistered shared cap-unit property can
hold that occurrence and be referenced by the role formulas. Prove that it
resolves against each consuming heading/body/code face and size; do not replace
it with a root-measured pixel value or remove headings from scope.

## Reusable work and remaining gaps

Keep the authenticated font loading and repaired Mono assets, removal of
competing font faces, provider authentication, independent inline markers,
intrinsic component geometry and interaction coverage. Extract font/provider
checks from generation; Pragma must lose its generator dependency, generation
scripts, nudge config, generated outputs and exports. BF's generator stays.

The old private `--_ds-occupied-block-*` consumers still need migration to the
new semantic row/lane contract. Provider strokes, independent per-edge padding,
horizontal helpers and lane-propagation tests remain work. Stage 4 enforcement
and its deliberate-violation tests are absent. Stage 7 still includes Launchpad
typography defects, the Tooltip bound and the text-only measure token. Existing
browser tests need contract-consumption assertions and a reviewed per-engine
envelope; do not reuse BF nudge equality or fit a tolerance to a failing result.

The body-role entry still omits weight and letter spacing; the global reset
still needs the planned native-control `font: inherit` correction. Moving the
ledger from typography to main requires an import-topology check: direct
component entries must reach it without creating a typography-to-main cycle.
Normal/italic metric-equality evidence remains required by FR5d even though
those metrics no longer generate Pragma nudges.

## Orchestration after approval

Use one coordinating chat and isolated runtimes. A second editor window may
display Pragma but should not become a separately directed implementation owner.

1. Foundation agent: alignment, font/provider authentication and dependency
   removal; coordinator owns cross-package import topology and lockfile writes.
2. Enforcement agent: package-local rules, explicit classification and negative
   controls, using an agreed contract fixture without touching component CSS.
3. Independent reviewer: browser substitution/propagation, font and packed-entry
   checks. Gate stages 1-4 before releasing consumer edits.
4. Then split disjoint React and Svelte retrofit/test lanes, with coordinator
   integration and an independent review at each component-family junction.
5. Run affected and root gates, rendered review and final adversarial review.
   T012 native zoom remains separate; no publication, push or merge is implied.

## Stale guidance

The revised `spec.md`, `contracts/baseline-alignment.md` and
`implementation-plan.md` govern. `plan.md`, `quickstart.md`, live portions of
`research.md`, cross-repository architecture/handoff documents and the older
executive summary contain conflicting or superseded clauses. Report these for
reconciliation; do not edit the spec to fit old implementation. Operational
status in `AGENT-INBOX.md`, `TODO.md` and `docs/specs.md` has been corrected.
Historical reviews and their test evidence are preserved.
