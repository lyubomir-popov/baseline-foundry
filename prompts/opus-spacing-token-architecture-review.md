# Opus review request: cross-framework spacing-token architecture

Act as a principal design-systems architect and senior TypeScript/CSS platform
reviewer. Perform an adversarial architecture review. Do not implement changes.

Your goal is to decide whether the proposed token model is durable enough to:

1. enter Canonical's `design-tokens` repository;
2. replace Baseline Foundry's bespoke spacing configuration without losing its
   rendered baseline and component geometry; and
3. be consumed by Pragma even though Pragma uses a `1cap` approximation while
   BF uses extracted font metrics.

## Repositories

- `H:\WSL_dev_projects\baseline-foundry`
- `H:\WSL_dev_projects\pragma`
- `H:\WSL_dev_projects\design-tokens`
- `H:\WSL_dev_projects\baseline-nudge-generator`
- supporting draft: `H:\WSL_dev_projects\canonical-spacing-spec`

Preserve all dirty/untracked work. This is a read-only review.

## Read first

1. `baseline-foundry/AGENTS.md`
2. `baseline-foundry/AGENT-INBOX.md`
3. `baseline-foundry/docs/cross-repo-token-architecture-audit.md`
4. `baseline-foundry/docs/spacing-architecture-proposal.md`
5. `baseline-foundry/specs/019-tier-responsive-action-insets/spec.md`
6. `baseline-foundry/specs/020-tier-horizontal-gradient/spec.md`
7. `baseline-foundry/specs/020-tier-horizontal-gradient/contracts/horizontal-gradient-matrix.md`
8. `baseline-foundry/src/types.ts`, `src/build.ts`, `src/css.ts`,
   `src/css-grid.ts`, and `src/css-component-contracts.ts`
9. `pragma/AGENTS.md` and `pragma/CONSTITUTION.md`
10. `pragma/packages/styles/main/src/spacing.css`
11. `pragma/packages/styles/main/src/modifiers.density.css`
12. `pragma/packages/styles/typography/src/mapper.css`
13. `pragma/packages/styles/typography/src/baseline-cap.css`
14. `design-tokens/README.md`
15. `design-tokens/packages/tokens/tokens/canonical/canonical.resolver.json`
16. all primitive dimension/number/typography source documents and semantic
    dimension/typography source documents under that resolver
17. representative semantic colour and modifier documents, especially surface,
    anticipation, criticality, emphasis, and placeholder importance contexts
18. `design-tokens/packages/plugin/src/plugin/canonicalPlugin.ts`
19. `design-tokens/packages/plugin/src/build/builders/buildSetsPrimitive.ts`
20. `design-tokens/packages/plugin/src/build/builders/buildModifierFamily.ts`
21. `design-tokens/packages/plugin/src/build/builders/buildTypography.ts`
22. `baseline-nudge-generator/README.md`, `src/nudge-generator.js`, and
    `specs/001-baseline-drift-compensation/spec.md`
23. `canonical-spacing-spec/specs/spacing/draft.md` and
    `canonical-spacing-spec/specs/grid/draft.md`

## Facts you must account for

- BF has four first-class tiers: Editorial, Documentation, App, and OS.
- Pragma currently has site/docs/app product classes plus comfortable/dense
  density classes.
- Density is intended to be governed contextual inheritance, not a free design
  choice. Only a small allow-list of tight hosts (initially side-navigation
  items, table cells, and tab items) may establish dense. Enrolled descendants
  such as a badge in a tab or an input in a table cell adapt automatically;
  unrelated descendants must not change.
- BF's semantic vertical spacing is container-owned in every tier. Font nudge
  and complementary compensation are non-semantic typography corrections.
- BF uses extracted font metrics. Pragma's accepted/default engine uses `1cap`.
  The token architecture must permit both without forking semantic spacing.
- BF has three proven inline inset roles: field, action, and continuation.
- Horizontal spacing must not derive from the vertical baseline. Fixed geometry,
  content-derived geometry, and deliberately block-derived square/circle minima
  are separate categories.
- Canonical source documents are DTCG 2025.10 documents, but the current plugin
  has special builders only for colour/theme and typography. Its generic
  modifier builder assumes colour channels.
- Current semantic dimension documents are placeholders except for root size
  and baseline. The plugin classifies all `dimension.*` IDs as primitive.
- Pragma currently needs naming and line-height shims for canonical output.
- The colour source has 354 semantic tokens per theme, including 246 foreground
  tokens and a large state/surface/intent cross-product. Schema validation and
  snapshots exist; an executable accessibility contrast matrix was not found.
- Canonical's spacing and grid drafts currently disagree about horizontal
  values and responsiveness.

## Proposal under review

The proposal is not "put spacing in dimensions." It is:

- raw lengths stay in primitive `dimension.*`;
- semantic decisions live under `spacing.*` with DTCG `$type: "dimension"`;
- tier and breakpoint are independent global resolver axes; density remains a
  build-time value axis but is exposed at runtime only through allow-listed
  inherited providers and enrolled subscribers;
- public names describe relationships/owners rather than size labels;
- a private profile/reference layer can represent tier × breakpoint decisions;
- a dedicated spacing builder resolves each point and emits only generic public
  semantic CSS variables under class/media selectors;
- nudge/compensation live under typography alignment and may be generated by
  metrics or `1cap`; and
- BF retains `--bf-*` aliases for a migration window while Pragma replaces its
  provisional handwritten spacing values.

The proposed public roles are:

```text
spacing.rhythm.baseline
spacing.gap.field.block
spacing.gap.iconLabel.inline
spacing.gap.pattern.block
spacing.gap.section.block
spacing.gap.sectionMajor.block
spacing.inset.field.inline
spacing.inset.action.inline
spacing.inset.continuation.inline
spacing.inset.surface.inline
spacing.inset.surface.block
spacing.layout.page.margin.inline
spacing.layout.grid.gutter.inline
spacing.layout.grid.gutter.block
spacing.layout.content.padding.inline
spacing.layout.strip.padding.block
```

## Review questions

Answer all of these explicitly.

1. Is semantic `spacing.*` plus `$type: dimension` the correct DTCG boundary?
   If not, give a better source taxonomy and explain its consumer consequences.
2. Is `tier` the right resolver axis name and are `site/docs/app/os` coherent
   contexts? Challenge whether OS belongs here and whether Editorial should be
   called Site.
3. Can tier, breakpoint, and governed contextual density be factorised without
   hidden precedence bugs? Walk at least two concrete permutations through
   DTCG flattening and runtime CSS cascade resolution, including a badge in a
   dense tab and an input in a dense table cell.
4. Is the private profile/reference layer legitimate, or an internal Cartesian
   product disguised as indirection? Give a lower-complexity alternative if one
   exists.
5. Are the proposed public token names semantic, complete, and minimal? Mark
   any name that is visual, ambiguous, component-specific, or likely to churn.
6. Should an independent authored inline quantum be a published token, a build-
   time validation input, or omitted entirely from the consumer API?
7. Is a machine-readable provider/subscriber allow-list the right enforcement
   boundary for density? Specify how to prevent arbitrary `.dense` use, how a
   nested comfortable reset works, and how portals or detached overlays carry
   (or intentionally do not carry) the logical context.
8. Which BF values are suitable as canonical policy and which are only sandbox
   evidence? Do not infer Canonical adoption from BF polish.
9. Does the migration preserve BF's occupied-block and nested-row invariants?
   Identify any way a format-only refactor could change computed geometry.
10. Is the proposed alignment-engine boundary sufficient for exact metrics and
   `1cap` to coexist? Specify the smallest shared contract, if any.
11. Should the nudge generator emit a DTCG overlay, remain a pure numeric
    library, or be absorbed into BF? Consider versioning and reproducibility.
12. Assess the canonical colour architecture separately from the palette
    values. Is "defensive and bureaucratic" accurate? Identify which complexity
    is essential and which should be removed or generated.
13. Assess typography values, taxonomy, modifier design, extensions, and
    delivery. Distinguish visual-policy issues from broken output plumbing.
14. Identify any accessibility, internationalisation, forced-colour, zoom,
    writing-mode, container-query, or browser-support risks the proposal misses.
15. Is the phased contribution order viable under Pragma's monorepo and public
    package constraints? Find circular dependencies or rollout dead ends.
16. State whether Spec 020 should supersede Spec 019, be absorbed into a new
    cross-repo spec, or remain separate.

## Required review method

- Verify claims against source; do not accept the audit's conclusions on trust.
- Separate fatal architecture flaws from naming preferences.
- Treat current Canonical implementation as evidence, not automatically as a
  compatibility mandate.
- Prefer the smallest contract that covers proven consumers.
- Reject tokens that merely rename a literal without establishing ownership.
- Check generated-delivery feasibility, not only source JSON elegance.
- Make every proposed alternative concrete enough to implement and test.

## Required output

1. **Verdict:** accept, accept with required changes, or reject.
2. **Fatal findings:** numbered `A1`, `A2`, ... with source evidence and a
   required correction.
3. **Important findings:** numbered `B1`, `B2`, ... with trade-offs.
4. **Answers to all 16 review questions.**
5. **Revised schema:** exact token IDs, resolver axes/order, source-file layout,
   generated CSS shape, and public/internal artifact rules.
6. **Two worked permutations:** one site/docs responsive case and one app/OS
   density case, comparing DTCG flattening to runtime cascade output.
7. **Migration critique:** corrected sequence across design-tokens, BF, Pragma,
   and the generator.
8. **Acceptance gates:** executable checks sufficient for senior architecture
   sign-off.
9. **Decision log:** decisions that need owner approval before implementation.

Be concise where the proposal is sound and exhaustive where it is not. The
most useful outcome is a smaller, clearer architecture with explicit failure
modes, not agreement with the draft.
