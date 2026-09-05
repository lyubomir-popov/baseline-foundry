# PR 3 correction review

Date: 2026-09-05

Reviewer: independent adversarial correction review

Range: `08db5ab..b1b0444` on `feat/dtcg-spacing-format-adapter`

Provider: design-tokens `18f57b95b1aa1dfe85a45746016b055c807d6628`

## 1. Verdict

**Accept with required corrections.**

All six findings from the first review (F0, F1, F3, F4, F5, F6) are genuinely
closed. I re-derived provenance from the provider working tree rather than
from BF's artifact, red/greened all 48 values through the exported production
validator, inspected every generated bundle, and co-loaded the provider's
**real** generated CSS with BF in both orders. Geometry is value-neutral,
integrity is now production-enforced, and the Canonical namespace is clean.

One required correction remains, and it is documentary rather than behavioural:
BF's co-loading contract and its browser fixture describe a provider surface
that does not exist at the pinned commit.

## 2. Blocking findings

### C1 — medium — the documented co-loading surface does not exist

`docs/spacing-token-adapter.md` tells consumers they "may load Canonical
`modifiers.spacing.css` before or after BF". `scripts/verify-component-behavior.ts`
asserts in a comment that its fixture "mirrors the generated design-tokens
`modifiers.spacing.css` contract: primitive references, `ds.modifiers` layer,
and exact selector order."

I built design-tokens at the pinned commit. Neither statement holds:

| Aspect | BF fixture and docs | Actual provider output at `18f57b9` |
|---|---|---|
| File | `dist/modifiers.spacing.css` | does not exist |
| Location | — | `dist/sets.semantic.css` |
| Layer | `@layer ds.modifiers` | `@layer ds.tokens` |
| Selectors | `:root`, `.app`, `.docs`, `.site`, `.os` | `:root` only |
| Product scopes | all four restate twelve values | none exist |
| Values | `var(--dimension-*)` | `var(--dimension-*)` (correct) |

The provider emits exactly twelve `--spacing-*` declarations, Site defaults
only, under `:root`. Canonical's own `documentation/product-spacing.md` makes
the same claim BF inherited, so the error originates upstream — but BF ships
it as consumer instruction.

**Consequence.** A consumer following BF's documentation cannot find the file.
More importantly, the fixture's `@layer` wrapper is load-bearing for the
result: BF's declarations are unlayered, and unlayered always outranks layered
regardless of specificity or order. A test that silently depends on that
wrapper while claiming to mirror the provider will keep passing if the
provider later emits product scopes unlayered.

**Smallest correction.** Point the documentation and the fixture comment at
`sets.semantic.css` plus `sets.primitive.css` and the `ds.tokens` layer, and
state plainly that the synthetic `.site`/`.docs`/`.app`/`.os` scopes model the
provider's *documented future* shape as a forward-compatibility guard rather
than its current output. No code change is required.

## 3. Answers to questions 1–12

### 1. Does production code authenticate all 48 records?

**Yes.** `validateCanonicalSpacingArtifact` in `src/dtcg-spacing.ts` computes a
SHA-256 over the ordered 4 × 12 records and compares it with the constant
`canonicalSpacingProductsSha256`, and separately requires the artifact to
declare that same digest. I mutated each of the 48 values by `+0.125` one at a
time and drove the exported production validator:

```text
Q1 single-value mutations rejected by production validator: 48/48
   overlaid points among the 48: 7; survivors: 0
```

All seven overlaid points are covered. The laundering attack also fails:

```text
wrong declared digest        -> rejected
missing integrity block      -> rejected
wrong algorithm              -> rejected
value change + stale digest  -> rejected
```

Critically, the digest is not self-referential. I resolved the matrix myself
from the provider working tree — `spacing/base.tokens.json` merged with each
product modifier file, aliases resolved against `primitive/dimension.tokens.json` —
and recomputed BF's digest formula over my own values:

```text
Digest computed from design-tokens source : 97cffe22691cebbe29d786d2fbe10d04d014d412ed35ccaca386ca41e73bd571
Digest declared in BF artifact           : 97cffe22691cebbe29d786d2fbe10d04d014d412ed35ccaca386ca41e73bd571
MATCH: true
Point-wise comparison: 48/48 match
```

This is real provenance, not a transcription checked against itself. F0 closed.

### 2. Does the build genuinely consume DTCG records?

**Yes.** `buildThemeSurface` reads the product record and passes it to
`buildThemeTokens`, which projects it into `baselineUnit`, `layout.sectionSpace*`,
`layout.stripSpace`, and every `components` inset and gap. The legacy config
values are now only a compatibility assertion. Removing them from the emission
path is visible in the `src/build.ts` diff: `toRem(config.components.*)` was
replaced by `spacingRem(spacing, ...)` at every spacing site.

### 3. Are post-overlay values exactly the pre-adapter 4 × 12 matrix?

**Yes.** `scripts/validation/dtcg-spacing-contracts.ts` re-derives the
pre-adapter matrix directly from `config/tiers/*.json` — not from a fixture —
and compares it point-wise with the post-overlay record, the built token
manifest, and both CSS surfaces. The invariant now runs 845 checks. The
browser probe independently measures computed pixels for all 24 properties
across four tiers in direct and class-switched form. No geometry changed.

### 4. Is the overlay exactly the seven approved points?

**Yes**, and it is structurally closed:

```text
changed removal condition    -> rejected
empty extra product          -> rejected
extra deferred point         -> rejected
removed deferred point       -> rejected
non-rem overlay value        -> rejected
empty reason                 -> rejected
```

The seven points match the governing contract's list in
`cross-repo-token-architecture-spec.md` §4 exactly: Docs action/continuation,
App mark/action/continuation, OS action/continuation.

### 5. Does every Canonical property carry the final provider value?

**Yes.** Across all nine generated bundles:

```text
canonical decls=60 duplicates=0 nonLiteralCanonical=0
ownership violations: 0
```

Every `--spacing-*` declaration is a bare `<n>rem` literal equal to the final
provider matrix, declared exactly once per selector. The seven retained values
appear only on `--bf-*` properties, as literals:

```css
:where(.bf-theme.bf-tier-os) {
  /* Resolved Canonical DTCG spacing; these names always retain the pinned final matrix. */
  --spacing-inset-action-inline: 0.5rem;
  --spacing-inset-continuation-inline: 1.25rem;
  /* Temporary BF compatibility properties. Seven retained literals preserve
     current geometry until BF 020a; equal points alias Canonical directly. */
  --bf-component-inline-inset-action: 1rem;
  --bf-component-inline-inset-continuation: 2rem;
}
```

At the 41 equal points the compatibility property is `var(--spacing-…)`. No
duplicates, no cycles, no unresolved references — a bundle-wide sweep found
four unresolved `var()` names, all Vanilla `--vf-*` with explicit fallbacks and
all pre-existing. F1 closed.

### 6. Are `canonicalSpacing`, `spacing`, and the legacy projections truthful?

**Yes**, and they are distinguishable in the public surface. `ThemeTokens`
gains optional `canonicalSpacing`; `docs/surfaces-manifest.md` documents both.
Verified in the built manifests:

```text
dist/tiers/os/tokens.json          canonicalSpacing: true   effective differs at 2 points
dist/tiers/editorial/tokens.json   canonicalSpacing: true   effective differs at 0 points
dist/experiments/…/tokens.json     canonicalSpacing: false
```

The OS deltas are exactly `spacing.inset.action.inline` and
`spacing.inset.continuation.inline`. They cannot diverge silently because the
digest fixes `canonicalSpacing` and `assertSpacingSetsEqual` fixes effective
`spacing` against config.

### 7. Does the OS path consume explicit product spacing?

**Yes.** The provider's `os` product has a full explicit spacing matrix; only
its *typography* block is omitted when identical to the default. BF reads the
OS spacing record point-wise and emits all twelve properties on
`.bf-tier-os`. The contract asserts the input is spacing-only and that the OS
class surface owns `--spacing-baseline` independently. Nothing infers or
depends on a `.os` typography reset. Confirmed in
`dist/tiers/os/styles.css` and in the class-switched bundle.

### 8. Provider CSS co-loaded with BF, both orders and nested scopes

I loaded the **real** provider output (`sets.primitive.css` +
`sets.semantic.css`) with BF's bundle, both orders, aligned classes:

```text
BF only, os tier                         --bf-*: 0.25,0.25,0.25,1.5,3,6,0.25,1,2,0.5,0.5,2
REAL provider BEFORE BF, os + .os        drift: none
REAL provider AFTER BF,  os + .os        drift: none
```

Both matrices are stable in both orders. Two independent reasons: the provider
only declares on `:root` (a different element from the `.bf-theme` host, so BF's
own declaration wins by proximity), and its declarations sit inside
`@layer ds.tokens` while BF is unlayered.

**Mismatched product classes.** The documentation calls this invalid consumer
configuration and says BF does not guess. That is accurate, but I measured the
consequence with a hypothetical *unlayered* provider emitting the documented
`.docs` block on a `bf-tier-os` host:

```text
unlayered provider .docs, MISMATCHED (bf-tier-os + .docs), either order:
  --bf-field-gap 0.25->0.5; --bf-leading-mark-gap 0.25->0.5;
  --bf-component-inline-inset-field 0.25->0.5; --bf-panel-padding-inline 0.5->1;
  --bf-panel-padding-block 0.5->1; --bf-strip-space 2->3
```

`.docs` is specificity `(0,1,0)`; BF's `:where(.bf-theme.bf-tier-os)` is
`(0,0,0)`. Six of twelve BF properties silently follow the provider. The seven
deferred literals are immune, which is the F1 fix paying off. This is latent,
not current — the provider emits no product scopes today and layers what it
does emit — but it is the precise behaviour, and it is worth recording rather
than leaving as "invalid configuration". See C1 and N2.

### 9. Do custom themes stay BF-namespaced?

**Yes.** `spacingVarDeclarations` branches on the absence of `canonicalSpacing`
and emits only `--bf-*` literals under the comment "Theme-config spacing
remains in BF's namespace; it does not claim Canonical provenance."

```text
dist/experiments/ibm-plex-engine-smoke/styles.css: --spacing- occurrences: 0
                                                    canonicalSpacing: false
```

Zero Canonical declarations and zero dangling `var(--spacing-…)` references in
custom-theme bundles. The built-in config edit path is now explicit — the
assertion message reads "update the pinned Canonical artifact and bounded
overlay contract, not `config/tiers`" — and the adapter doc repeats it. F4 and
F6 closed.

### 10. Do the checks establish no geometry regression?

**Yes.** Fresh local runs:

| Check | Result |
|---|---|
| `npm test` | pass; `Component behavior verification passed.` |
| `npm run test:build` | pass; **20,345** checks; `Canonical DTCG spacing adapter: 845 checks` |
| `npm run qa:components` | pass; all tier families, zero failures |
| bundle-wide `var()` resolution | 0 unresolved without fallback |
| CSS ownership sweep | 0 violations across 9 bundles |

Untested high-risk surface: the co-loading contract exercises a synthetic
provider fixture only. No test loads the provider's actual artifact, and
nothing covers a consumer that sets `--spacing-*` directly. See N1.

### 11. Scope audit

**Clean.** The diff is 19 files. A filter for `config/tiers`, `css-grid`,
`dist/`, `generated/`, `density`, and `page-margin` returns nothing. No 020a
value was adopted — the seven deferrals are intact and enforced. Pragma is
untouched at `964f6f129` with a clean tree. Publication and release paths are
unmodified. Generated outputs are not tracked and were not hand-edited.

### 12. Ready for a direct fast-forward into BF `main`?

**Yes, after C1.** `origin/main` at `08db5ab` is an ancestor of `b1b0444`, so
the fast-forward is clean. C1 is documentation-only and can land as a single
follow-up commit on the same branch without re-running the full suite.

## 4. Reproduced matrices and CSS ownership evidence

Resolved independently from the provider working tree (rem):

| Product | baseline | gap.field | gap.mark | gap.group | gap.pattern | gap.region | inset.field | inset.action | inset.cont | inset.surf.i | inset.surf.b | inset.strip |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| site | 0.5 | 0.5 | 0.5 | 1.5 | 4 | 8 | 0.5 | 1 | 2 | 1 | 1 | 4 |
| docs | 0.25 | 0.5 | 0.5 | 1.5 | 3 | 6 | 0.5 | 0.75 | 1.5 | 1 | 1 | 3 |
| app | 0.25 | 0.5 | 0.25 | 0.5 | 1 | 2 | 0.25 | 0.75 | 1.5 | 0.75 | 0.75 | 3 |
| os | 0.25 | 0.25 | 0.25 | 1.5 | 3 | 6 | 0.25 | 0.5 | 1.25 | 0.5 | 0.5 | 2 |

Identical to `config/canonical-spacing.resolved.json` at all 48 points and to
the provider's own `documentation/product-spacing.md` table.

BF's effective pre-020a matrix differs at exactly seven points, all carried on
`--bf-*` compatibility properties: Docs action `1` / continuation `2`; App mark
`0.5`, action `1`, continuation `2`; OS action `1` / continuation `2`.

Ownership across all nine bundles: 60 Canonical declarations each (12 tokens ×
5 selectors), 0 duplicates, 0 non-literal Canonical values, 7–10 literal
compatibility points per bundle depending on which tiers the bundle scopes.

## 5. Scope and OS-asymmetry audit

Scope: clean, as recorded under question 11.

OS asymmetry: the provider's omission is typography-only and deliberate. OS
spacing is explicit and complete in the provider source
(`modifier/spacing/os.tokens.json`, twelve entries). BF reads it directly and
emits all twelve on `.bf-tier-os`. The adapter contains no inference from the
absence of a `.os` typography block, and the static contract asserts the input
is spacing-only. Correct in both directions.

## 6. Validation gaps and non-blocking follow-ups

- **N1.** No test loads the provider's real generated CSS. Adding a check that
  reads `sets.semantic.css` from the pinned provider — or a checked-in copy —
  would make the co-loading claim self-verifying rather than fixture-shaped.
- **N2.** Consider recording in the adapter doc the measured consequence of a
  mismatched product-class pair: silent drift at up to six BF properties if a
  provider ever emits product scopes unlayered. "Invalid configuration" is
  correct but understates it.
- **N3.** `buildThemeSurface` now reads, parses, validates and digests the
  artifact twice per built-in surface — once with the overlay and once without.
  Harmless, but it is roughly sixteen redundant SHA-256 passes per build.
- **N4.** The recorded finding table in
  `cross-repo-token-architecture-pr3-adversarial-review.md` jumps F1 → F3. F2
  was folded into F0 during the second pass; a one-line note would keep the
  numbering traceable.
- **N5.** The digest pins the values but nothing binds it to
  `source.commit`. Both are source constants, so a future provider bump must
  update two places in lockstep. Deriving one from the other, or asserting the
  pair in a single place, would remove the possibility of a half-update.

## 7. Statement

The branch is ready for its owner-approved direct fast-forward into BF `main`
once C1 is corrected. Every prior finding is genuinely closed, and the
integrity, ownership, namespace, and scope claims all reproduce independently.

This review does not authorize publication, release, Pragma adoption, or 020a
value adoption.
