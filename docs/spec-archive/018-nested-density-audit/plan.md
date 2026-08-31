# Plan: Nested density audit

**Branch**: `feat/018-nested-density-audit`
**Spec**: [spec.md](spec.md)

## Design

The optional navigation brand is the existing `bf-panel-header
is-navigation-brand` plus `bf-top-navigation-logo is-canonical-tagged`
composition. The owning panel supplies the continuation inset, so the tag and
root navigation copy share one rail.

Nested auxiliary surfaces use an explicit `is-nested` modifier. Their line box
is the body line-height minus one active baseline, clamped to `1em`. Symmetric
block padding is capped at the lesser of the standalone padding and the space
that lets the complete nested border box fit inside the host body line. Block
margins are zero because the flex/grid host owns the row rhythm; therefore
margin collapse is not part of the model.

The vertical audit has three families only:

1. body-sized single-line hosts, including table cells and native controls;
2. unboxed text roles, whose height is owned by measured font metrics; and
3. auxiliary surfaces shown inside the real host that owns their row.

Controls may carry trailing compensation as margin. Repeated hosts such as
table cells and contextual-menu commands place the same compensation inside
their box. Both resolve through `--bf-single-line-row-block-size`; the ownership
mode does not create another density. The coverage ledger maps every catalog
entry to a visible primitive, real nesting, or content-driven disposition.

Native color input is the only replaced control without a body-text line box.
Its explicit `bf-color-control` wrapper supplies an invisible metric strut with
the same line, padding, rem border, and trailing compensation as textual
controls; the native swatch stretches inside that real row. A composite range
uses its numeric field as the row owner and stretches the track inside it.
Neither control uses a second nominal target that can diverge under zoom.

Grouped navigation separates spacing ownership explicitly. The groups
container retains the 1.5rem separation between complete heading/list pairs.
Each group owns a 0.5rem header-to-list gap. A nested
`bf-side-navigation-group-header` keeps its optional semantic rule and heading
at zero gap, while the rule retains the global half-rem occupied compensation
and uses the continuation inset only for its start edge.

The persistent demo rail composes `bf-panel bf-side-navigation`, not the
off-canvas `bf-side-navigation-drawer` state. Repeated list tracks use
`--bf-single-line-row-block-size` while each link keeps its natural paint at the
track start. This lets the track absorb rasterised rem-border remainder without
moving text or accumulating item-to-item baseline drift.

Page chrome and the canonical tagged brand share
`--bf-navigation-brand-line-center-block`. The derived 3rem brand block fixes
the breadcrumb line without translating the logo title, and adjacent-page
buttons inherit the current page tone rather than introducing a nested theme.

## Evidence

- Static source/output contracts for the modifier and optional brand markup.
- Browser measurements of standalone, nested, and host boxes across all tiers.
- Light/dark screenshots of shared demo chrome, side navigation, tabs, and the
  complete vertical audit.
- Static coverage assertions plus
  [`contracts/vertical-coverage.md`](contracts/vertical-coverage.md).
- Full behavior, build, baseline, and component-capture gates.
