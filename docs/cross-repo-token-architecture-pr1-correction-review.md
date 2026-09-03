# PR 1 correction review: exact typography token plumbing

Reviewer: adversarial correction review. Read-only.
Date: 2026-09-03.

Subject: `design-tokens` `5a7aca3..c8e7424` on
`feat/exact-typography-token-plumbing`, regression-focused on
`c6d4267..c8e7424`; and `pragma` `7fa3e67e3..67d93d372` on
`feat/exact-typography-adoption`.

Method: every correction was reproduced from the generated artefact rather than
inferred from the diff. The snapshot was parsed into its thirteen output files
and analysed programmatically for per-file resolution, property ownership,
visibility classification, and line-height projection error. Nothing was
edited, committed, pushed, merged, published, or released.

---

## Verdict

**Design tokens: ready to land.** All four findings from the previous review
are fixed, and the fixes are better than the minimum I asked for. One
medium-severity follow-up (N1) should land with it or immediately after; it is
a missing test, not a defect.

**Pragma: safe to retain independently.** The change is forward- and
backward-compatible with both design-tokens 0.8.1 and the new build, and it is
type-stable for all three alignment engines.

One item cannot be verified from the artefacts and must be attached before
landing: the LSP failure-name hash.

---

## Original corrections — all four reproduced

### H1 — identical product blocks omitted ✓

`.os` does not appear anywhere in the generated output — zero occurrences of
`.os` across all thirteen files. The emitted product selectors are now:

| Selector | Snapshot line |
| --- | ---: |
| `:root` | 728 |
| `.app` | 908 |
| `.docs` | 1084 |
| `.site` | 1259 |

An OS-classed element inherits `:root` and no longer resets a nested `.site`,
`.docs` or `.app` subtree at equal specificity. The hazard is removed at its
source rather than documented.

### H2 — `modifiers.typography.css` is self-contained ✓

The file now opens with its own dependency declarations and says so:

```css
/* Product-context typography; includes its semantic font-family dependencies. */
@layer ds.modifiers {
  :root {
    --typography-font-family-code: var(--typography-font-family-monospace);
    --typography-fontFamily-code: var(--typography-font-family-monospace);
    --typography-font-family-default: var(--typography-font-family-sans-serif);
    --typography-fontFamily-default: var(--typography-font-family-sans-serif);
```

Reproduced by per-file analysis, resolving each file against its own
declarations first and then against `sets.primitive.css`:

| Output | External refs | Satisfied by primitive | Still missing |
| --- | ---: | ---: | ---: |
| `modifiers.typography.css` | 34 | 34 | **0** |
| `sets.semantic.css` | 1 | 1 | **0** |
| `sets.primitive.css` | 0 | — | **0** |
| `modifiers.theme.css` | 61 | 61 | **0** |

Pragma's import list (`main/src/index.css:17` for `sets.primitive.css`,
`typography/src/baseline-cap.css:17` and peers for
`modifiers.typography.css`) is now sufficient. The break I found is gone.

### H3 — bounded primitive aliases restored, without cycles ✓

Every camelCase property Pragma's shim block references is present again:

| Property | Snapshot line |
| --- | ---: |
| `--typography-fontFamily-sansSerif` | 1936 |
| `--typography-fontFamily-monospace` | 1934 |
| `--typography-weight-semiBold` | 1946 |
| `--typography-weight-extraBold` | 1939 |
| `--typography-weight-extraLight` | 1941 |
| `--dimension-size-fontSize-300` | 1607 |
| `--dimension-letterSpacing-default` | 1594 |
| `--number-lineHeight-300` | 1901 |

The important detail is *how*. `emitCompatibilityAlias` now emits the resolved
**value**, not `var(canonical)`:

```ts
- if (legacy) decls.push(createDeclaration(legacy, `var(${cssVar})`));
+ if (legacy) { emittedProperties.register(legacy, `${id}::legacy`);
+               decls.push(createDeclaration(legacy, value)); }
```

That is what prevents a cycle with Pragma's reverse shims. Traced end to end
for the worst case, `--typography-font-family-default`:

```text
canonical  --typography-fontFamily-default : var(--typography-font-family-sans-serif)
canonical  --typography-font-family-default : var(--typography-font-family-sans-serif)
canonical  --typography-fontFamily-sansSerif: "Ubuntu Sans", … (literal)
pragma     --typography-font-family-default : var(--typography-fontFamily-default)
pragma     --typography-font-family-sans-serif: var(--typography-fontFamily-sansSerif)
```

No edge returns to its origin, and both orderings resolve to the same literal.
Had the alias pointed at the kebab semantic property, Pragma's shim would have
closed the loop and both properties would have become invalid at computed-value
time. The chosen target — always a property Pragma does not re-declare — is
principled rather than incidental.

### M1 — visibility is now compiler-enforced and correctly classified ✓

The implicit default is gone from both factories, and `visibility` became a
**required** field in `ArtifactTokenInit` and `DerivedArtifactTokenInit`. Every
call site must now decide, and the type checker enforces it.

Reproduced from the emitted `tokens.json`: 936 tokens, every one carrying an
explicit visibility, no omissions.

| Property family | public | internal |
| --- | ---: | ---: |
| source-derived | 866 | 0 |
| `--modifier-*` | 0 | 8 |
| `--surface-*` | 0 | 16 |
| `--delta-*` | 0 | 16 |
| `--hover--` / `--active--` / `--disabled--` | 0 | 30 |

Exactly the intended split: generated channels internal, source-derived
properties public. Primitives are public again, so Pragma's direct
`--dimension-*` consumption in `main/src/spacing.css:31-40` is legitimate API
rather than accidental reliance on something the artifact calls internal.

---

## Additional hardening — verified

**Shared emitted-property registry.** `canonicalPlugin` constructs one
`EmittedPropertyRegistry` and threads it through all eight builders —
`buildSetsPrimitive`, `buildSetsSemantic`, `buildTheme`, `buildTypography`,
`buildModifierFamily`, `buildSurfaces`, `buildStates`, and the delta path. It
registers three name families with distinct owner keys — canonical (`t.id`),
sub-property (`${t.id}/${suffix}`), and legacy (`${t.id}::legacy`) — and throws
when one property has two owners. Re-emitting the same property for another
product context keeps the same owner and is correctly permitted. This closes
M2: the guard now inspects the output space, not the input space.

**Legacy resolvers cannot invent an OS context.** `productContexts()` reads the
contexts the resolver actually declares and intersects them with
`PRODUCT_CONTEXTS`, falling back to the full list only when a resolver exposes
no context map. `resolver.apply({ typography: "os" })` can no longer be
constructed against a legacy resolver. Closes L3.

**Projection tolerance — independently computed.** For every role in every
product block I resolved the font-size, numeric line-height and
line-height-dimension through `sets.primitive.css` and compared
`fontSize × ratio` against the exact dimension:

```text
roles carrying a dimension: 110
roles exceeding 0.01 CSS px: 0
roles missing a dimension:   0
```

Every emitted pair agrees within tolerance, and no role was left without an
exact value. This closes M3 for the emitted side.

**Numeric and exact properties are separate, as required.** Confirmed at
snapshot lines 736 and 738:

```css
--typography-heading-1-line-height: var(--number-line-height-700);
--typography-heading-1-line-height-dimension: var(--dimension-600);
```

The standard property stays a unitless number, so Pragma's 0.8.1 fallback
evaluates `calc(length × number)` and never `length × length`. Had the exact
value been written onto `-line-height`, that fallback would have become invalid
in every 0.8.1 consumer. The parallel property is the right shape.

---

## Original acceptance checks — retained

| Check | Result |
| --- | --- |
| No spacing IDs | 0 occurrences of `--spacing-` |
| Inactive `rootFontSize` absent | 0 occurrences in source and output |
| Unscoped root typography stays global | `:root` block at 728 carries the global scale; product blocks only override |
| Shared `product` axis, bounded legacy support | `canonical.resolver.json` declares `product`; `resolveProductAxis` falls back to `typography` only when `product` is absent |
| Site display 84px/96px including bold | `--typography-heading-display-line-height-dimension: var(--dimension-1200)` = 6rem = 96px on both `display` and `display-bold` |
| Site secondary 14px/20px | `var(--dimension-250)` = 1.25rem = 20px on **five** variants: root, bold, code, prose, prose-bold |

The five secondary variants are worth noting: the `$ref` inheritance carries
the exception further than the two roles the spec names, and all five resolve
exactly rather than through the 20.0004px projection.

**Not verified here.** The LSP suite's 61 Windows/POSIX failures and the
sorted-name SHA-256
`8d5da958b91278b5266d2a359222d6a3065af5894f4f65335ae2db9f1bb866ad`. I did not
run either suite. Attach the two runs and the two hashes before landing; a
count match is not sufficient and the review request is right to say so.

---

## Pragma range `7fa3e67e3..67d93d372`

One commit, one file, 85 insertions. All eight governed roles adopt the exact
property with the previous calculation as fallback:

```css
--line-height: var(
  --typography-heading-1-line-height-dimension,
  round(up, calc(var(--typography-heading-1-font-size) *
                 var(--typography-heading-1-line-height)),
        var(--baseline-height))
);
```

Coverage is complete for what the mapper governs: `h1`–`h6`, `p`/`.p`, and
`.code` — eight `-line-height-dimension` fallbacks against eight numeric
references, one per role, with no bare `round()` line-height path left.

Three correctness points, all sound:

- **Fallback semantics.** `var(--A, fallback)` substitutes the fallback only
  when `--A` is undeclared or guaranteed-invalid. Against 0.8.1 the property
  does not exist and the old calculation runs; against this build the exact
  length wins. Correct.
- **Comma parsing.** The commas inside `round(…)` sit within a function's
  parentheses and do not split the `var()` fallback. Valid.
- **Type stability.** Both branches produce a length, so `--line-height` has
  the same type as before for `baseline-cap.css`, `baseline-metrics.css` and
  `baseline-trim.css`, all of which consume it through
  `var(--line-height, calc(baseline × multiplier))`.

Safe to retain independently of the design-tokens merge, in either order.

---

## Remaining findings

None blocking.

**N1 — medium. Legacy aliases are independent literals with no equality test.**
The cycle fix is right, but `--typography-weight-semiBold: 600` is now a
duplicated literal rather than a reference to `--typography-weight-semi-bold`.
If a primitive's value changes, nothing forces the alias to follow, and the
snapshot will happily record the drift. Add one test asserting that every
`legacyCssVarForToken` property resolves to the same value as its canonical
counterpart. This is the one item I would land with the PR.

**N2 — low. The Site 14/20 exception is not provable through Pragma's mapper.**
`mapper.css` binds only heading 1–6, `text.primary` and `text.primary.code`.
`typography.text.secondary` — the sole half-step family — has no element or
class binding there, so spec acceptance gate 3 is currently demonstrable at the
token layer only. Either add a rendered fixture that consumes the secondary
role, or state explicitly that gate 3 is a token-layer gate until Pragma binds
it.

**N3 — low. The registry parameter defaults to a fresh instance.**
`emitTypographyDecls(..., emittedProperties = new EmittedPropertyRegistry())`.
The production call site passes the shared registry, so behaviour is correct
today, but the default silently disables cross-builder collision detection for
any future caller that omits it. Make the parameter required; the compiler then
enforces what the design intends.

**N4 — low. The delivery dependency graph is implicit beyond typography.**
`modifiers.typography.css` and `sets.semantic.css` are now self-sufficient
against `sets.primitive.css`, but the colour outputs still depend on
`modifiers.theme.css` — 18, 22, 9, 12, 12, 61 and 47 unresolved-in-isolation
references for anticipation, criticality, emphasis, lifecycle, release,
surfaces and states respectively, none satisfiable from primitives. That
structure is pre-existing and correct, and Pragma imports theme. The point is
that the new per-file validator must encode this graph explicitly rather than
exempting colour, or it will not catch the next relocation the way it would now
catch a typography one.

**N5 — low. Same drift class as N1, one level up.**
`--typography-fontFamily-code` now resolves to `--typography-font-family-monospace`
rather than to `--typography-font-family-code`. The computed value is identical
and the cycle avoidance is correct, but the alias has stopped tracking the
semantic indirection: if `typography.fontFamily.code` is ever re-pointed away
from monospace, the legacy name keeps the old target. Covered by the same test
N1 asks for, provided that test compares resolved values rather than
declarations.

---

## Landing recommendation

**Land the design-token PR** once N1 is added and the two LSP runs are
attached with matching failure-name hashes. Everything else on this list is a
follow-up.

**Retain the Pragma branch** as prepared. It is safe against both token
versions and does not depend on merge order.

Nothing found here affects the spacing schema. The parallel exact/numeric
line-height mechanism this PR establishes is precisely what PR 2's lattice gate
needs, and the 110-role tolerance check gives that gate a working precedent to
extend.
