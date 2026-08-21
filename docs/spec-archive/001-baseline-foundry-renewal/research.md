# Research: Baseline Foundry renewal

## Spec Kit and repository structure

The sibling `spec-kit` repository establishes a specification-first sequence:
specification, technical plan, task breakdown, implementation, cross-artifact
analysis, and validation. Durable intent lives under `specs/<id>-<slug>/`.

`diagram-generator` is the cleaner local operating model. It has the full
Spec Kit scaffold, keeps active packages under `specs/`, archives closed
packages under `docs/spec-archive/`, and has no root `ROADMAP.md`, `STATUS.md`,
or `HISTORY.md`. Its single-owner map separates invariants, live state,
operational guidance, cross-spec order, catalog/status, and per-spec detail.

`diagram-generator-planning` remains useful as a Spec Kit reference but still
uses the older multi-document state model, so it is not the cleanup target.

**Decision**: adopt the `diagram-generator` single-owner structure, using one
programme spec/branch because the user explicitly requested coordinated
parallel execution of tightly related changes.

## Diagram Registry consumer audit

Diagram Registry uses BF extensively but carries a vendored navigation fork,
direct BF overrides, hard-coded responsive grid placement, and missing-token
fallbacks. The confirmed upstream contracts, in priority order, are:

1. Tagged/grid-aligned top navigation.
2. Responsive documentation and side-navigation composition.
3. Flush and triple tiered-list variants.
4. Flush tabs active-rule geometry.
5. 4:3 and contained aspect variants.
6. Content notice/callout.
7. Article previous/next pagination.
8. Full-bleed page chrome.
9. Compact form/filter control row.
10. Eyebrow/kicker role.

The crowding report is real but does not mean stack section modifiers are
broken. The current non-app stack is gapless, while `bf-section` owns explicit
editorial/documentation section boundaries. This spec retains that distinction
and makes it uniform across app too.

## Spacing policy

The existing BF peer review recommends element-owned semantic spacing for
editorial/documentation and container-owned spacing for app. The current user
decision supersedes that split for this project: element-owned semantic spacing
is the BF-wide policy. Pragma's container-owned-all-tiers outcome is a separate
organizational product decision and is not a BF authority.

**Decision**: retain element-owned baseline compensation and semantic trailing
spacing for all four tiers. Containers compose layout but do not erase semantic
child rhythm or become the default content-spacing owner. `bf-section` remains
the explicit page-section boundary; stack density modifiers must not silently
stand in for it.

## Vanilla article pagination

Vanilla's `_patterns_article-pagination.scss` uses direct previous/next anchors
with direction labels and destination titles. Wide layouts use opposing halves.
Its narrow rule hides previous-link text below 460px and its CSS uses physical
directions with no RTL contract.

**Original decision**: port the useful information hierarchy but not the narrow
hiding, physical directions, Sass coupling, or unlabelled landmark. BF uses a
separate API, logical properties, `rel`, and RTL.

### 2026-08-16 rendered correction

The first BF port used `auto-fit` with a 20rem track floor. At a normal 900px
browser viewport the component receives about 597–612px and therefore stacks
previous and next into two rows. The behaviour suite explicitly encoded that
regression at 19rem, 20rem, and 21rem.

Latest Vanilla `main` at `0add9c6d` keeps the pair in one flex row. At 612px and
640px, compiled Vanilla produces two equal links separated by 16px. Below its
460px threshold it still keeps the row, collapses the paired previous copy,
and leaves the next destination in the remaining width. Wide boundary links
occupy their logical 50% half. Label and title text share one edge.

Vanilla's spacing maps cleanly to BF's baseline tokens:

| Vanilla | Value | BF equivalent |
|---|---:|---|
| `$sp-x-small` | 0.25rem | `--bf-space-half` |
| `$sp-small` | 0.5rem | `--bf-space-1` |
| `$sp-medium` | 1rem | `--bf-space-2` |
| `$sp-xx-large` | 2.5rem | `--bf-space-4 + --bf-space-1` |

Vanilla's raw occupied block is not baseline-safe. BF preserves these semantic
insets while adding only tier metric/grid and border compensation. Direction
text uses the body role; the destination is a real title slot and uses the
closest local h5 role rather than copying raw `1.125em/1.25em` sizes.

The amended decision is to keep the pair in one row at all supported widths,
including a compact previous control below the Vanilla threshold. Hidden
compact copy remains in the accessible name, and complete long-copy specimens
remain available in wide and boundary states.

## Latest Vanilla and Sites inventory

The sibling Vanilla checkout was 85 commits behind and had a locally modified
`yarn.lock` that also changed upstream. A direct pull was unsafe. `origin/main`
was fetched and mounted at `tmp/vanilla-main/` on
`0add9c6d829aba0c311674d617491a032f8393b7`; the dirty checkout was preserved.

The current root contains 66 `_patterns_*.scss` entries. `content-card` is new
since the retired 65-row BF roadmap. More importantly, Vanilla publishes named
Sites compositions through documentation and Jinja macros without dedicated
same-named root SCSS: basic section, CTA section, hero, linked-logo section,
quote wrapper, rich horizontal and vertical lists, tab section, text spotlight,
equal-heights, and tiered list. `empty-state` is a standalone composition.

The old filename inventory therefore understated parity. It could call a leaf
such as `section` superseded while hiding several named compositions built from
it. Current Sites docs mark these macros WIP, so BF compares rendered
composition and semantics but owns smaller stable APIs. Existing
`bf-equal-height-row`, `bf-tiered-list`, and BF primitives already cover their
respective leaf contracts; `empty-state` needs a recipe/demo, not a mega
component.

Relevant non-pattern layouts omitted by the old table are `site` and
`fluid-breakout`. BF application and documentation layouts are already
covered; Vanilla `full-width` is deprecated. Exact dispositions and sources
live in the parity contract.

## OS parity audit

OS is mechanically registered and has exact direct-artifact selector/token
shape parity: 193 token object paths, seven roles, 724 rules, and 715 unique
selectors in each direct tier bundle. It is not yet support-equivalent because:

- shared class-switching omits much of each tier's component token set, leaving
  `.bf-tier-os` with editorial inline padding, visual sizes, field gaps, panel
  padding, and accordion indent;
- saved OS browser QA contains failures and app is largely excluded from the
  tier matrix;
- current terminology alternates between first-class tier and non-canonical
  addendum;
- app's zero-nudge/container-owned policy conflicts with this spec;
- manifest `marginBottom` and emitted CSS encode different formulas;
- OS declares a narrower weight range for the same Ubuntu font asset, producing
  overlapping duplicate faces in shared bundles;
- package font-loading claims and shipped assets do not agree;
- tier registry and manifest types are not all available through supported
  public entry points;
- stale demo copy still references the removed panel preset and a three-tier
  scale.

**Decision**: promote OS to a first-class fourth tier by fixing system-wide
parity, not by flattening its intentional dense values into another tier.

## Architecture decisions

- Add focused CSS modules for new component families rather than growing the
  `css-components.ts` monolith.
- Keep numbered pagination and article pagination separate.
- Prefer component/container queries for intrinsically responsive compositions.
- Use logical properties for every new directional contract.
- Keep page reset scoped to `.bf-theme` or an explicit BF shell.
- Make tier/property parity data-driven from the built-in tier registry.
- Preserve consumer product features locally; upstream only reusable contracts.
