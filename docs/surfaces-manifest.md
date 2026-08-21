# Surfaces manifest (`surfaces.json`)

Every Baseline Foundry build emits a `surfaces.json` artifact alongside its
`styles.css` and `tokens.json`. The manifest is the machine-readable contract
between the build and any downstream consumer that needs to read the runtime
tokens, swap surfaces at runtime, regenerate CSS off the same metric inputs,
or wire fonts up at the consumer end.

This document describes the schema, locations, stability guarantees, and
intended consumption patterns. The TypeScript types in
[src/types.ts](../src/types.ts) (`ThemeSurfaceManifest`,
`ThemeSurfaceManifestEntry`, `ThemeTokens`, `BaselineGeneratorTokens`,
`ThemeFontFile`) are normative — this doc is a human-readable mirror.

## File locations

The build emits one manifest per surface bundle. Locations relative to the
published package root:

| Path | Bundle |
|------|--------|
| `surfaces.json` | Default editorial surface (root bundle) |
| `tiers/editorial.surfaces.json` | Editorial tier |
| `tiers/documentation.surfaces.json` | Documentation tier |
| `tiers/app.surfaces.json` | App tier |
| `tiers/os.surfaces.json` | OS tier |
| `presets/prose.surfaces.json` | Legacy alias → editorial |
| `presets/app-tier.surfaces.json` | Legacy alias → app |
| `experiments/<name>/surfaces.json` | Engine-smoke and exploratory bundles |

Each path is exposed through `package.json` exports (see the `Static assets`
list in [README.md](../README.md)).

## Top-level shape

```jsonc
{
  "defaultSurface": "editorial",
  "surfaces": {
    "editorial": { /* ThemeSurfaceManifestEntry */ },
    "documentation": { /* ThemeSurfaceManifestEntry */ },
    "app": { /* ... */ },
    "os": { /* ... */ }
  }
}
```

| Field | Type | Notes |
|-------|------|-------|
| `defaultSurface` | `string` | Key into `surfaces` that the bundle treats as its default. Validation fails if the key is missing. |
| `surfaces` | `Record<string, ThemeSurfaceManifestEntry>` | At least one entry. Each key is a stable surface name. |

Bundles scoped to a single tier still publish a `surfaces` map (with one
entry). This keeps every consumer reading the same shape regardless of which
artifact path they import from.

## Surface entry (`ThemeSurfaceManifestEntry`)

```jsonc
{
  "className": "bf-tier-editorial",
  "engine": "metrics-compensated",
  "label": "Editorial",          // optional
  "tokens": { /* ThemeTokens */ },
  "metrics": { /* BaselineGeneratorTokens */ }
}
```

| Field | Type | Purpose |
|-------|------|---------|
| `className` | `string?` | The CSS class that scopes this surface inside a `.bf-theme` container. Apply alongside `bf-theme` to switch surfaces at runtime. |
| `engine` | `string` | Machine-readable identifier of the alignment pipeline that produced the surface. See [Engine values](#engine-values). |
| `label` | `string?` | Optional human-readable name used by demo UIs and surface pickers. Not part of the runtime contract. |
| `tokens` | `ThemeTokens` | The runtime token set the CSS bundle was generated from. Safe to read at runtime to drive surface swatches, debug overlays, or downstream component layout. |
| `metrics` | `BaselineGeneratorTokens` | The font-metric inputs the build measured to derive `tokens`. Lets a downstream consumer regenerate equivalent CSS, run drift checks, or skip re-measuring fonts they already trust. |

### Engine values

`engine` is a stable enum that downstream tooling can switch on:

| Value | Meaning |
|-------|---------|
| `metrics-compensated` | Production default. Per-element nudges are derived from the actual font metrics extracted from the source TTF via `@lyubomir-popov/baseline-nudge-generator`. |
| `cap-formula` | Demo-only overlay (`.bf-engine-cap`). Uses the CSS `cap` unit instead of measured metrics. **Never appears in shipped manifests** — it exists only as a runtime debug overlay. |

The enum is intentionally narrow. New values are added only when a new engine
ships as a buildable surface output, not for experiments.

## `tokens` — `ThemeTokens`

The full runtime token set that produced the bundle's CSS.

| Field | Type | Notes |
|-------|------|-------|
| `baselineUnit` | `string` (CSS length) | The half-baseline grid unit, e.g. `"0.5rem"`. Doubled for the visible grid. |
| `fontFiles` | `ThemeFontFile[]` | See [Font asset contract](#font-asset-contract). |
| `fontStacks` | `Record<string, string>` | Font-family CSS stack per declared family. |
| `roles` | `Record<string, TypographyToken>` | Semantic role tokens (`body`, `h1` … `h6`). The values components actually consume. |
| `elements` | `Record<string, TypographyToken>` | Element-keyed mirror of the same data, keyed by the source element identifier. |
| `layout` | `LayoutTokens` | Container widths, gutters, gaps, and section rhythm. |
| `components` | `ComponentTokens` | Shared component density tokens (control padding, panel padding, border width, radius, etc.). |

### `TypographyToken`

```jsonc
{
  "fontSize": "1rem",
  "lineHeight": "1.5rem",
  "fontFamily": "ubuntu-sans",
  "fontWeight": 400,
  "fontStyle": "normal",
  "spaceAfter": "1rem",
  "nudgeTop": "0.41rem",
  "marginBottom": "0.59rem",
  "fontStack": "\"Ubuntu Sans\", \"Segoe UI\", system-ui, sans-serif",
  "identifier": "body",
  "fontVariantCaps": "all-small-caps"   // optional, h5-style roles
}
```

`nudgeTop` is the measured start compensation. `marginBottom` is the semantic
margin emitted by CSS: `spaceAfter - baselineUnit`. The complementary
`padding-block-end` is `baselineUnit - nudgeTop`, so the complete occupied
block remains baseline-aligned while semantic spacing has one meaning in JSON
and CSS.

### `LayoutTokens`

```jsonc
{
  "contentMaxWidth": "90rem",
  "contentPaddingInline": "1rem",
  "measure": "40rem",
  "sectionSpace": "4rem",
  "sectionSpaceShallow": "1.5rem",
  "sectionSpaceDeep": "8rem",
  "stripSpace": "4rem",
  "gridGapInline": "1rem",
  "gridGapBlock": "1rem",
  "pageMargin": "1rem"
}
```

### `ComponentTokens`

```jsonc
{
  "borderWidth": "1px",
  "barThickness": "0.1875rem",
  "radius": "0.125rem",
  "controlBlockPadding": "0.41rem",
  "controlCompactBlockPadding": "0rem",
  "controlInlinePadding": "0.5rem",
  "controlVisualSize": "1rem",
  "fieldGap": "0.5rem",
  "panelPaddingInline": "1rem",
  "panelPaddingBlock": "1rem",
  "accordionIndent": "1.5rem"
}
```

## `metrics` — `BaselineGeneratorTokens`

The minimal subset of inputs the baseline generator needs to reproduce the
surface. Strictly a subset of `tokens`:

```jsonc
{
  "baselineUnit": "0.5rem",
  "fontFiles": [ /* ThemeFontFile[] */ ],
  "elements": {
    "body": {
      "fontSize": "1rem",
      "lineHeight": "1.5rem",
      "fontFamily": "ubuntu-sans",
      "fontWeight": 400,
      "fontStyle": "normal",
      "spaceAfter": "1rem",
      "nudgeTop": "0.41rem"
    }
    /* ... one entry per declared element */
  }
}
```

Notable differences from `tokens.elements`:

- `metrics.elements[*]` omits derived fields (`marginBottom`, `fontStack`,
  `identifier`, `fontVariantCaps`).
- `metrics.fontFiles` is the same shape as `tokens.fontFiles` and stays the
  authoritative font dependency list.

All four tiers, including `app`, use the metrics block as their runtime source
of alignment data.

## Font asset contract

`tokens.fontFiles[*]` and `metrics.fontFiles[*]` share the `ThemeFontFile`
shape:

```jsonc
{
  "family": "ubuntu-sans",
  "path": "../assets/fonts/UbuntuSans[wdth,wght].ttf",
  "cssFamily": "Ubuntu Sans",
  "fontStyle": "normal",
  "fontWeight": "100 800",
  "fontStretch": "75% 100%",
  "fontDisplay": "swap",
  "emitFontFace": false,
  "runtimeOnly": false
}
```

Important consumer expectations:

- **Font files are not bundled** in the npm package. The portable relative
  `path` records the source asset the metric generator measured. Treat it as
  an audit trail, not a package runtime URL.
- **The published manifest never contains absolute build-machine paths.** The
  validator strips local config/baseline paths from `ThemeSurface` before it
  is serialised into the manifest entry, so shipped JSON stays portable.
- Consumers must serve the matching font themselves (self-hosted, system
  font, or third-party CDN) and declare a matching `@font-face` so
  `cssFamily` resolves.
- Built-in tiers set `emitFontFace: false`; their CSS does not emit a broken
  URL to an asset absent from the package. Consumer-owned custom configs may
  omit that flag or set it to `true` when the generated CSS can reach the
  declared asset.
- `fontDisplay`, `fontWeight`, `fontStyle` mirror what the build expects to
  see at runtime. If the consumer ships a different variant, baseline
  alignment will drift.
- `runtimeOnly: true` marks an entry that exists only to declare runtime
  font-family expectations (e.g. system fallbacks measured at build time but
  not loaded). Most surfaces leave it `false`/absent.

## Stability guarantees

The manifest is part of the package's public surface. Within a major
version:

- Top-level keys (`defaultSurface`, `surfaces`) are stable.
- Surface keys (`editorial`, `documentation`, `app`, `os` and the legacy
  preset aliases) are stable.
- `engine` values are stable; new values are added, never renamed.
- `tokens.*` and `metrics.*` field names are stable. Numeric values may
  change with each build because they are derived from the live configs.
- New optional fields may be added; consumers must ignore unknown keys.

Breaking shape changes (renames, removals, type changes) require a major
version bump.

## Consumer recipes

### Read the runtime tokens

```ts
import surfaces from "@lyubomir-popov/baseline-foundry/surfaces.json"
  with { type: "json" };

const editorial = surfaces.surfaces[surfaces.defaultSurface];
const baselineUnit = editorial.tokens.baselineUnit;
const bodyLine = editorial.tokens.roles.body.lineHeight;
```

### Switch surfaces at runtime

```ts
const target = surfaces.surfaces.app;
container.classList.add("bf-theme", target.className!);
```

### Verify baseline contract

```ts
for (const [name, surface] of Object.entries(surfaces.surfaces)) {
  for (const [role, token] of Object.entries(surface.tokens.roles)) {
    const expected = parseFloat(token.spaceAfter) - parseFloat(surface.tokens.baselineUnit);
    if (Math.abs(parseFloat(token.marginBottom) - expected) > 0.001) {
      throw new Error(`${name}/${role} drifted off the baseline contract`);
    }
  }
}
```

### Regenerate CSS from the same metrics

`metrics` is the same shape that
`@lyubomir-popov/baseline-nudge-generator` consumes, so a downstream
generator can reproduce the surface without re-measuring the font:

```ts
import { generate } from "@lyubomir-popov/baseline-nudge-generator";

const surface = surfaces.surfaces.documentation;
const reproduced = generate(surface.metrics);
```

## See also

- [README.md](../README.md) — surface model overview, theme tiers, and the
  full list of static assets exposed via `package.json#exports`.
- [src/types.ts](../src/types.ts) — normative TypeScript type definitions.
- [scripts/validate-build.ts](../scripts/validate-build.ts) — invariant
  checks that gate manifest emission.
