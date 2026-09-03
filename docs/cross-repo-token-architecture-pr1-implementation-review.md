# PR 1 implementation review: exact typography token plumbing

Reviewer: adversarial implementation review. Read-only.
Date: 2026-09-03.

Subject: `design-tokens` commit `c6d4267` on `feat/exact-typography-token-plumbing`,
diffed from `5a7aca3`, against PR 1 in
[`cross-repo-token-architecture-spec.md`](cross-repo-token-architecture-spec.md) §9.

Method: the diff was read in full and the generated snapshot was analysed
directly rather than trusted. Custom-property declaration and usage sets were
extracted from
`packages/plugin/src/plugin/__snapshots__/build-snapshots.tests.ts.snap` and
compared programmatically. Nothing was edited, committed, pushed, merged,
published, or released.

---

## Verdict

**Do not land as-is. Three high-severity defects, all small fixes.**

The commit is substantially correct and several parts are better than the spec
required. The exact-line-height mechanism works end to end, including through
the `$ref` inheritance chain that I expected to fail. The source-role
classification is a genuine improvement over prefix matching. No spacing IDs
leaked.

The three blockers are all *delivery* defects rather than schema defects, and
all three break the one known consumer. Fix H1–H3 and M1, then land.

---

## Independently verified as correct

Each of these was checked against the generated artefact, not the commit
message.

| Claim | Result |
| --- | --- |
| No spacing IDs landed | Confirmed. Zero `--spacing-*` occurrences in generated output. |
| Every generated `var()` resolves | Confirmed **bundle-wide**: 941 declared properties, 295 referenced, 0 unresolved. See H2 for the per-file caveat. |
| Responsive root-font policy removed | Confirmed. `rootFontSize` removed from `small.tokens.json` and `xLarge.tokens.json`; zero occurrences in output. |
| Site display is 84px/96px | Confirmed exactly. `--typography-heading-display-line-height: var(--dimension-1200)` = 6rem = 96px, snapshot line 1324. |
| Display bold inherits the exact value | Confirmed, line 1330. The `$ref` chain through `#/typography/heading/display/$root/$extensions/…/lineHeightDimension` resolves before `exactLineHeight` runs, so the bold variant gets the dimension rather than falling back to the 1.1429 multiplier. This was the most likely silent failure and it does not occur. |
| Site 14px/20px preserved | Confirmed. `--typography-text-secondary-line-height: var(--dimension-250)` = 1.25rem = 20px, in **all four** product blocks (lines 831, 980, 1128, 1277). Not snapped to 24px. |
| Number tokens emitted | Confirmed. `--number-line-height-300: 1.4286` and siblings now emit (line 1785ff). The `if (t.id.startsWith("number.")) continue` guard is gone. This unblocks deleting Pragma's seven hardcoded ratios. |
| Lowercase-kebab conversion | Correct on every hard case: `xLarge` → `x-large`, `sansSerif` → `sans-serif`, `semiBold` → `semi-bold`, `fontSize` → `font-size`, `lineHeightDimension` → `line-height-dimension`, numeric segments preserved (`dimension-1200`, `font-size-950`). The acronym rule `([A-Z]+)([A-Z][a-z])` is present and correct. |
| Context-only ID collisions | Genuinely handled. `assertUniqueCssVarNames` is called over `Object.keys(tokens)` **plus** `sourceCatalog.ids()`, and the catalog walks every modifier context document — so an ID that exists only under `product: site` is covered. This is the detail that makes the guard meaningful rather than decorative. See M2 for what it still misses. |
| Source-role classification | Correct and well-guarded. `loadSourceCatalog` reads the resolver's own set and modifier declarations, and throws when one ID is claimed by both a primitive and a semantic document. The filename fallback in `classifySourceRole` is a reasonable second line given Terrazzo normalises `source.loc`. |
| Exact line height beyond the two named roles | Better than specified. The `+81` lines added to each of `global`, `apps` and `docs` typography documents give **every** role a `lineHeightDimension`, so the whole scale is now exact rather than only display and secondary. This closes sign-off finding S1 for the entire scale. Credit where due. |

Not verified here: the 239 / 121 / 42 test counts and the claim that the LSP
suite's 61 Windows/POSIX path failures are pre-existing. The review request
correctly conditions that on reproduction at `5a7aca3`; that reproduction must
be run and its output attached before landing. I did not run either suite.

---

## H1 — The `.os` block duplicates `:root` and silently resets nested products

**Severity: high. Cascade defect, not cosmetics.**

`canonical.resolver.json` gives the new `os` context a single source:

```json
"os": [
  { "$ref": "global/semantic/modifier/typography/global.tokens.json" }
]
```

That is the same document the default `global` context uses. The generated
`modifiers.typography.css` therefore contains:

| Selector | Snapshot line | Declarations |
| --- | ---: | ---: |
| `:root` | 727 | 148 |
| `.app` | 876 | 148 |
| `.docs` | 1025 | 147 |
| `.site` | 1173 | 159 |
| `.os` | 1333 | 148 |

A set comparison of the `:root` and `.os` blocks returns **no differences**.
`.os` is a byte-identical 148-declaration copy of `:root`.

Two consequences. The trivial one is roughly 4KB of dead CSS.

The serious one is the cascade. `.site` opens at line 1173 and `.os` at 1333,
both plain class selectors at equal specificity, so the later block wins
wherever both apply. Markup like this loses Site typography entirely:

```html
<div class="site">
  <section class="os"><!-- display reverts to the global 92px pairing --></section>
</div>
```

OS is a first-class product tier in the governing architecture, so nesting an
OS region inside a Site or Docs shell is a normal thing to do, not a contrived
case. The block promises product-specific typography and delivers a reset.

**Smallest correction.** Do not emit a product block whose resolved declaration
set is identical to the default pass. That is a few lines in `buildTypography`,
it is self-maintaining when OS eventually gets real values, and it removes the
reset hazard rather than documenting it. Emitting an empty `.os` is not
sufficient — `.os { }` is harmless, but the current 148 declarations are not.

---

## H2 — A cross-file reference was introduced that the consumer's import list does not satisfy

**Severity: high. The "zero unresolved `var()`" check does not cover it.**

`buildSetsSemantic` changed from a comment-only placeholder to a real emitter.
`sets.semantic.css` now carries five declarations (snapshot lines 1820–1826):

```css
:root {
  --dimension-size-height-baseline: var(--dimension-100);
  --typography-font-family-code: var(--typography-font-family-monospace);
  --typography-fontFamily-code: var(--typography-font-family-code);
  --typography-font-family-default: var(--typography-font-family-sans-serif);
  --typography-fontFamily-default: var(--typography-font-family-default);
}
```

Under the old prefix classifier these three tokens were primitives and were
emitted into `sets.primitive.css`. The reclassification is correct — they are
semantic aliases — but it **relocates published properties between output
files**, and `modifiers.typography.css` references one of them heavily:

```css
--typography-heading-display-font-family: var(--typography-font-family-default);
```

Pragma imports `dist/sets.primitive.css` (`main/src/index.css:17`) and
`dist/modifiers.typography.css` (`typography/src/baseline-cap.css:17`,
`baseline-metrics.css:22`, `baseline-trim.css:17`). It does **not** import
`sets.semantic.css`, and no barrel or index file in `packages/tokens` imports
one stylesheet from another.

So after this commit Pragma resolves `var(--typography-font-family-default)` to
nothing, and every typography role loses its font family.

The reason this passed review is worth stating plainly: **the unresolved-`var()`
check is whole-bundle, but delivery is per-file.** Concatenating all outputs
before checking hides exactly this class of defect.

**Smallest correction.** Two parts, both small:

1. Add a per-file resolution test — for each generated stylesheet, every
   `var()` it references must be declared in that file or in a file it declares
   as a dependency. Whole-bundle resolution is necessary but not sufficient.
2. Either emit these three into `sets.primitive.css` as before, or publish an
   index stylesheet that imports the set files in order and update the
   consumer's import list in the same coordinated release.

---

## H3 — Primitive camelCase properties were removed with no compatibility alias

**Severity: high. Asymmetric implementation of §9 item 2.**

Compatibility aliases are emitted for colour (34 of them, lines 629ff) and for
semantic typography via `emitCompatibilityAlias` in `emitTypographyDecls.ts`.
`buildSetsPrimitive` emits none — the diff adds no alias call to it.

Measured against the properties Pragma's `mapper.css` shim block actually
references:

| Property | Present after PR 1 |
| --- | --- |
| `--typography-fontFamily-default` | yes — semantic alias, line 1825 |
| `--typography-fontFamily-code` | yes — semantic alias, line 1823 |
| `--typography-fontFamily-sansSerif` | **no** |
| `--typography-weight-semiBold` | **no** |
| `--typography-weight-extraBold` | **no** |
| `--dimension-size-fontSize-300` | **no** |
| `--dimension-letterSpacing-default` | **no** |
| `--number-lineHeight-300` | **no** |

`mapper.css:40-57` will therefore resolve half its shims to nothing.

The eventual destination is right — those shims are on the PR 4 removal list
and exist only because the canonical names were camelCase. But `design-tokens`
publishes independently of Pragma, and §9 item 2 asks for "a bounded
compatibility map for existing camelCase properties" without restricting it to
semantic tokens.

**Smallest correction.** Extend `emitCompatibilityAlias` to
`buildSetsPrimitive`, with the same `legacyCssVarForToken` guard that already
suppresses no-op aliases. That makes the release non-breaking, and PR 4 removes
both the shims and the aliases together. If instead the break is intentional,
say so explicitly, gate it behind a major version, and record the coordinated
Pragma release in the handoff — do not let it land as an unlabelled break.

---

## M1 — Every primitive is now declared `internal`, including ones Pragma consumes

**Severity: medium. A policy decided by a default parameter.**

`makeArtifactToken.ts`:

```ts
visibility: params.visibility ?? (params.tier === "semantic" ? "public" : "internal"),
```

No call site in the diff passes `visibility` explicitly, so this default decides
the classification for the entire primitive set: every `--dimension-*`,
`--number-*`, `--typography-font-family-*` and `--typography-weight-*` is
`internal`, and the LSP now hides all of them from completion and workspace
symbols.

Those same properties are still published in `sets.primitive.css` and are
directly consumed today — `pragma/packages/styles/main/src/spacing.css:31-40`
aliases `--dimension-025` through `--dimension-800` one by one.

So the artifact asserts "internal" about properties the package publishes and
the only known consumer uses. Both positions are defensible; what is not
defensible is choosing between them with a `??` in a factory function. The
internal marker the architecture actually agreed on is the `--_` prefix
convention, which is a much narrower claim than "all primitives".

**Smallest correction.** Make visibility explicit at each call site, and decide
the primitive question deliberately. If primitives are internal, Pragma's direct
consumption is migration debt and belongs on the PR 4 list. If they are public
API, invert the default.

---

## M2 — The collision guard does not cover the names it emits

**Severity: medium. No collision exists today; the guard covers the wrong set.**

`assertUniqueCssVarNames` is checked over token IDs and catalog IDs. It is not
checked over the names actually written to CSS, which include two synthesized
families:

- composite sub-properties, `${cssVar}-${suffix}` in `emitTypographyDecls` and
  `buildSetsPrimitive`;
- legacy aliases, `${legacyBase}-${suffix}`.

A composite `typography.text.secondary` emits
`--typography-text-secondary-font-size`; a sibling token ID
`typography.text.secondary.fontSize` would emit the same property, and the
guard would not see it. No such pair exists in the current source, so this is
latent rather than live — but the guard exists precisely to catch what review
cannot, and it currently inspects the input space rather than the output space.

**Smallest correction.** Collect emitted property names during the build and
assert uniqueness over that set, at the point of writing. That subsumes the
current check.

---

## M3 — Nothing asserts the numeric projection agrees with the exact dimension

**Severity: medium.**

`number.lineHeight.975` is `1.1429`, described as a "compatibility projection
only". Against the 84px display size it yields **96.0036px**, while
`dimension.1200` yields exactly 96px. The design is right — the multiplier is a
DTCG-conformance projection and the extension carries the truth — but the two
representations are independent values in independent files with no test tying
them together.

The same applies to `number.lineHeight.300` at `1.4286` against
`dimension.250`: 20.0004px versus 20px.

**Smallest correction.** Assert, for every role carrying a
`lineHeightDimension`, that `fontSize × lineHeight` is within a stated tolerance
of the dimension. At four decimals the current worst error is 0.0036px, so a
0.01px tolerance is ample and cannot mask a real authoring change. Without this,
a later edit to either side drifts silently and only the exact value is tested.

---

## Low-severity notes

**L1 — `modifiers.typography.css` keeps its name after the axis rename.**
Preserving the filename is the right compatibility call and prevents an import
break, but the file now emits product contexts from an axis named `product`.
Add a line to the generated header saying so, or the next reader will assume the
rename was incomplete.

**L2 — `provideCompletions` filters internal tokens twice.** The loop that
builds `scopedVars` already excludes them, so the in-loop
`token.visibility === "internal"` check is unreachable for artifact tokens.
Harmless; delete one.

**L3 — the legacy resolver fallback has an untested context.**
`resolveProductAxis` returns `"typography"` when a consumer supplies the old
resolver, but `PRODUCT_CONTEXTS` includes `os`, which no legacy resolver
defines. The behaviour of `resolver.apply({ typography: "os" })` against a
legacy resolver is unasserted. Add a test, or skip contexts the resolver does
not declare.

**L4 — the resolver rename is unaliased at the resolver level.** The
compatibility path lives in the plugin. A downstream tool calling
`resolver.apply({ typography: "site" })` directly against the new resolver now
receives the default set with no error. That is a silent behaviour change for
any consumer of the resolver JSON rather than of the plugin. Worth one sentence
in the release note.

**L5 — the second baseline token survives, as planned.**
`--dimension-size-height-baseline: var(--dimension-100)` (8px) is still
published on the breakpoint axis. Sign-off finding S4 assigns its retirement to
PR 2, so this is correct scoping — but note it has now *moved output files*
(H2), so PR 2's retirement work must handle two import paths, not one.

---

## Landing recommendation

**Not ready to land.** Fix H1, H2, H3 and M1; they are each a small, local
change and together they are the difference between a clean plumbing release
and one that breaks the only consumer in three separate ways.

M2 and M3 may land in the same commit or immediately after; both are test
additions rather than behaviour changes.

Before landing, also attach the reproduction the review request asks for: run
the full LSP suite at `5a7aca3` and at `c6d4267` and show that the 61
Windows/POSIX path failures are identical in both. A count match is not
sufficient — compare the failing test names.

Once those are done the commit is a good foundation for PR 2. Nothing found
here affects the spacing schema, and the exact-line-height mechanism it
establishes is exactly what PR 2's lattice gate needs.
