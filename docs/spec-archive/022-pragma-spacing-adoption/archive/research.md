# Research: Pragma spacing-model adoption

## Repository state

The BF audit was performed on clean `main` at `b83396c`. Its completed token
work is distributed across the accepted Specs 017 (spacing/occupied-block
audit), 018 (nested density), 020a (final horizontal token adoption) and 021
(block-derived inline geometry), with the cross-repository contract and
implementation handoff as the governing sources.

Pragma was clean on `main` and one commit behind its remote tracking branch.
`git pull --ff-only origin main` advanced it from `964f6f129` to `7193fe082`.
No Pragma files were changed by this planning pass.

## Provider findings

Pragma pins `@canonical/design-tokens` 0.8.1 in 13 current package manifests;
the lockfile also retains three Svelte uses of `0.6.2-contrasted.0`.
`@canonical/design-tokens` 0.9.0 is the latest registry version observed during
the audit.

The inspected 0.9.0 tarball contains:

- `dist/modifiers.spacing.css` with all 12 spacing properties under root/Site,
  Site, Docs, App and OS contexts (OS exists upstream but is out of this Pragma scope);
- exact `--typography-*-line-height-dimension` properties; and
- no file or policy matching a governed density artifact.

Therefore the spacing migration can consume published provider output. Because
the requested adoption does not introduce a new density API, the absent density
artifact is recorded as a future-feature boundary rather than a blocker.

## Settled reference model

- Baselines in Pragma scope: Site `.5rem`; Docs and App `.25rem`.
- Inline unit: `.25rem`, independent of the vertical baseline.
- Field insets: `.5rem`, `.5rem`, `.25rem`.
- Action insets: `1rem`, `.75rem`, `.75rem`.
- Continuation insets: `2rem`, `1.5rem`, `1.5rem`.
- Mark gaps: `.5rem`, `.5rem`, `.25rem`.
- Surface inline: `1rem`, `1rem`, `.75rem`.
- Site secondary: 14px/20px, intentionally on the half phase.
- Controls: automatic block size; symmetric nudge-derived padding; trailing
  compensation snaps the occupied block to the baseline.
- Text: start nudge plus trailing-margin compensation; semantic spacing is
  container-owned.

## Pragma implementation findings

`packages/styles/main/src/index.css` and `tokens.css` do not import the
provider spacing modifier. Local `spacing.css` declares a universal `.25rem`
baseline, magnitude aliases, element-owned `--spaceAfter-button`, generic
container gaps and component padding. `modifiers.density.css` combines product
and density in unrestricted `.site/.docs/.app` crossed with
`.comfortable/.dense`. It exposes line-height and inline aliases,
a target baseline and a control-seat model.

The typography package already imports provider typography modifiers but still
keeps a local baseline fallback, hard-coded ratio shims, runtime rounding and
computed-line-height multiplication. Its metric files use `baseline - modulo`
without an exact-zero tie and place end compensation in padding or semantic
role margins.

The debug baseline grid intentionally uses its own `.25rem` default. React form
density consumes target cells; several direct date/time paths retain fixed
block sizes. React global Button and Svelte WPE Button use the current density
seat. React Accordion also subscribes broadly. React Tabs and side navigation
derive dimensions from baseline multiples; SideNavigation Item/Header and
NavTree contain fixed block sizes.

Current density documentation teaches public wrapper classes, including
`.site .dense`. The main `.content-flow` helper suppresses last-child margin
but does not yet act as a true gap-owning stack.

## Metric-nudge correction findings

BF's production path uses `@lyubomir-popov/baseline-nudge-generator` and emits
metric-derived `nudgeTop` values through its theme-token build. BF's cap engine
is intentionally emitted only under `.bf-engine-cap` comparison selectors and
is labelled demo-only because cap height is not the font's ascender/descender
baseline geometry. The generator also includes BF's empirical browser
compensation, so Pragma's existing raw-metrics laboratory engine is not by
itself equivalent to the BF production result.

The current Pragma feature worktree contains eleven production component
stylesheets with a `1cap` baseline-position formula:

1. React global Button;
2. React global Chip;
3. React global Tabs Item;
4. React global Accordion Item;
5. React global Form shared density/ledger;
6. React app SideNavigation;
7. Svelte WPE Button;
8. Svelte Launchpad Button;
9. Svelte Launchpad InputPrimitive;
10. Svelte Launchpad Select; and
11. Svelte Launchpad NavigationItem.

ContextualMenu, the twelfth migrated component ledger, instead copies
`0.0775rem` for Docs/App and `0.41rem` for Site. Those are current generated BF
body-role values, but in component CSS they have no generator, font/config or
freshness linkage. They are therefore copied literals, not a generated
contract.

Pragma's public/default typography sources also retain cap-derived paths in
`baseline-cap.css` and `baseline-trim.css`. Multiple Playwright suites create a
hidden `1cap` box when constructing expected baseline geometry. Such a probe is
not independent evidence for code built from the same cap approximation. A
zero-size inline baseline marker provides a browser-layout measurement without
using cap height.

### Complete source classification (T045)

The 2026-09-09 source sweep used `rg` with `node_modules`, `.git` and generated
`dist` directories separated from authored sources. Generated Pragma output had
no additional match. Every authored match belongs to one of these buckets:

| Bucket | Locations | Required disposition |
|---|---|---|
| Pragma production component geometry | The eleven component stylesheets listed above, plus ContextualMenu's `0.0775rem` and `0.41rem` copies | Replace through the generated shared occupied-block contract in T049. |
| Pragma production typography engines | `packages/styles/typography/src/baseline-cap.css`, `baseline-trim.css`, their package exports/imports and the main style composition | Delete the cap paths and make the generated metric artifact the default in T046-T048. |
| Pragma self-confirming browser oracles | React global Button, Chip, Tabs and Accordion; React Form; React app SideNavigation | Replace the hidden `block-size: 1cap` probes with zero-size inline baseline markers in T050. |
| Pragma story/test fixtures coupled to cap geometry | The Button, Chip, Tabs, Accordion and Form Storybook spacing contracts; SideNavigation's inline Playwright fixture; Badge's static cap expectation | Rebase fixtures on the inherited body role and shared contract, and turn static expectations into rejection checks. |
| Pragma live guidance and examples | Typography README/example, main README and Form `BaselineGrid.mdx` | Rewrite for the generated default engine in T051; no cap engine remains consumer-facing. |
| BF comparison demo | `src/css.ts`, the `.bf-engine-cap` branch in `src/css-components.ts`, engine demo pages and their catalogue copy | Retain only behind the visibly labelled demo-only engine selector. It is not import-reachable production geometry. |
| BF cap-relative icon optics | `src/css-components/icon.ts`, its build assertion and the independent cap/optical browser measurement in `verify-component-behavior.ts` | Review separately in T052. It may remain only if proven isolated from baseline nudge, padding, compensation and occupied height. |
| BF live cross-repository guidance | The active architecture/spec/handoff documents returned by the sweep | Correct obsolete permission for Pragma production `1cap` in T051. |
| Historical evidence | Prompts, review records and archived specs | Preserve unchanged as dated evidence; do not rewrite history to hide the superseded decision. |

This classification also distinguishes the six self-confirming browser probes
from BF's icon-optics measurement: both happen to measure `1cap`, but only the
former is being used as an oracle for the same production approximation it is
supposed to test.

The present exception was enabled by BF's own live cross-repository documents,
which say Pragma may retain `1cap` inside a 0.25 CSS px body-control envelope.
That envelope established proximity, not equivalence, and it allowed the less
precise engine to become the production source. The owner has withdrawn that
decision. This is a requirements correction, not an attribution of motive to
Pragma engineers.

The generator's output is sensitive to the font asset, font instance, baseline,
font size, line height, generator version and its browser-compensation
algorithm. A safe downstream artifact must record and authenticate all of those
inputs. Equality to today's two literals alone is insufficient because stale
output can remain numerically plausible after an upstream change.

## Delivery decision

Maintain one cross-repository adoption spec in BF because BF owns the normative
geometry and its Spec Kit records the durable intent. This correction extends
active Spec 022 rather than creating a competing active package. Execute code in
the existing Pragma feature worktree and eventual PR under Pragma's contribution
rules.
Retire the old wrapper-wide density geometry as part of the intrinsic-component
work. The absent upstream artifact remains visible and cannot be replaced by
another Pragma-local global mechanism; any future governed density feature gets
its own spec.

Until Canonical publishes an authenticated typography-alignment artifact,
Pragma owns a build-time adapter around the pinned baseline nudge generator. It
emits shared semantic nudge properties and a provenance manifest from inputs
validated against the installed provider. This avoids both a BF runtime
dependency and handwritten component constants.

## Rejected approaches

- **Copy BF CSS into Pragma**: duplicates the contract and bypasses provider
  integrity.
- **Keep a 4px universal fallback**: makes Site wrong and hides missing product
  context.
- **Rename `.dense` without changing scope**: preserves unrestricted descendant
  mutation.
- **Keep target cells for compatibility**: conflicts with intrinsic occupied
  blocks and fixed-height removal.
- **Snap every text role to whole baselines**: breaks the accepted Site 14/20
  half-step.
- **Depend on unpublished BF runtime code**: couples repositories and makes the
  production path non-reproducible outside BF. Use the same published generator
  algorithm with authenticated inputs instead.
- **Retain `1cap` within the old 0.25px envelope**: proves only that the
  approximation happens to be close for the current body role and font; it does
  not satisfy metric truth or protect future fonts and roles.
- **Copy BF's current `0.0775rem` and `0.41rem` values**: preserves today's
  geometry but loses source, generator and freshness provenance.
- **Use Pragma's raw font-metrics laboratory formula**: improves on cap height
  but omits the empirical browser compensation that is part of BF's production
  generator contract.
- **Publish metric nudges as spacing tokens**: confuses font alignment with
  semantic spacing. Alignment remains typography-owned.
- **Fall back to `1cap` when generation or the font fails**: hides a broken
  production asset/configuration and silently changes geometry. Fail closed.
