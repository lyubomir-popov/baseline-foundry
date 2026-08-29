# Spec catalog

This file owns package status and governing-source relationships. Execution
order lives in `TODO.md`; per-feature detail lives in the package.

## Current package

| Spec | Package | Status |
|---|---|---|
| 017 Spacing system audit | [`017-spacing-system-audit/`](../specs/017-spacing-system-audit/) | Active on `feat/017-spacing-system-audit`; removing historical diagnostic pages and specifying the exhaustive horizontal/vertical adjacency audit. |

## Archive

Completed and retired packages live under [`docs/spec-archive/`](spec-archive/).

| Spec | Package | Disposition |
|---|---|---|
| 016 Component and pattern consistency | [`016-component-pattern-consistency/`](spec-archive/016-component-pattern-consistency/) | Accepted and merged to `main` from implementation commit `3956294` on 2026-08-29; all four implementation/adversarial passes, 6,052 static checks, browser behavior, baseline captures, and component screenshot QA passed. |
| 015 Tier geometry hardening | [`015-tier-geometry-hardening/`](spec-archive/015-tier-geometry-hardening/) | Merged to `main` at `338f3cb`; Spec 016 supersedes its TOC row-gap and muted-H6 hierarchy after owner visual review. |
| 001 Baseline Foundry renewal | [`001-baseline-foundry-renewal/`](spec-archive/001-baseline-foundry-renewal/) | Accepted and merged 2026-08-21; automated closeout green, with the unavailable in-app-browser pass recorded in `review.md`. |
| 002 Element-owned typography selectors | [`002-element-owned-typography/`](spec-archive/002-element-owned-typography/) | Accepted and merged 2026-08-24; full build, browser behavior, and component-capture gates green. |
| 003 Flush side-navigation composition | [`003-flush-side-navigation/`](spec-archive/003-flush-side-navigation/) | Accepted and merged 2026-08-24; downstream Registry feature branch verified without local BF overrides. |
| 004 Application navigation geometry | [`004-application-navigation-geometry/`](spec-archive/004-application-navigation-geometry/) | Released at `f249a8a`; BF and downstream desktop/mobile navigation geometry verified. |
| 005 Side-navigation icon alignment | [`005-side-navigation-icon-alignment/`](spec-archive/005-side-navigation-icon-alignment/) | Released at `8728d68`; downstream Registry geometry verified. |
| 006 Navigation brand and icon optics | [`006-navigation-brand-and-icon-optics/`](spec-archive/006-navigation-brand-and-icon-optics/) | Released at `800a68e`; downstream Registry geometry verified. |
| 007 Navigation-brand panel alignment | [`007-navigation-brand-panel-alignment/`](spec-archive/007-navigation-brand-panel-alignment/) | Released at `454c7ae`; downstream editorial alignment verified. |
| 008 Prose list spacing | [`008-prose-list-spacing/`](spec-archive/008-prose-list-spacing/) | Released at `6d203e5`; downstream Registry spacing and responsive gates verified. |
| 009 Semantic list spacing | [`009-semantic-list-spacing/`](spec-archive/009-semantic-list-spacing/) | Released at `be85d46`; downstream Registry spacing, integrity and responsive gates verified. |
| 010 Sticky footer and hero media | [`010-sticky-footer-hero-media/`](spec-archive/010-sticky-footer-hero-media/) | Released at `636eff6` on 2026-08-27; full BF gates and downstream Registry responsive geometry passed. |
| 011 Site shell primitives | [`011-site-shell-primitives/`](spec-archive/011-site-shell-primitives/) | Released at `1293bcc` on 2026-08-27; full BF tests, capture QA, browser behavior and visual review passed. |
| 012 Hero divider and quiet linked titles | [`012-hero-link-contracts/`](spec-archive/012-hero-link-contracts/) | Released at `4d1b914` on 2026-08-27; linked titles remain blue and heroes own a rhythm-preserving default divider. |
| 013 Sites container-owned spacing | [`013-sites-container-spacing/`](spec-archive/013-sites-container-spacing/) | Released at `2c5587d` on 2026-08-27; renumbered after archive to resolve the duplicate 012 identifier. All Sites rhythm is composed with nested stacks, with downstream Registry proof at `b388f85`. |
| 014 Framework health hardening | [`014-framework-health-hardening/`](spec-archive/014-framework-health-hardening/) | Released as 0.1.4 from `d8746e4` on 2026-08-28; both supported Node gates, OIDC publication, clean registry install, tag, tarball and checksum reconciliation passed. |

## Candidate specifications

Candidates have no number, package, or active branch. Promote exactly one when
its evidence trigger is satisfied; until then they are boundaries, not promised
features.

| Candidate | Evidence trigger | Intended outcome | Explicit boundary |
|---|---|---|---|
| Shared authoring shell and document frame | Two consumers repeat the same top-navigation, stage, pinned-aside, or document-frame composition | A small intrinsic composition shared by authoring tools | Do not make consumer workflow state or chroma a built-in tier |
| Product-specific credential orchestration | A consumer repeats workflow state beyond the shipped BF password reveal and validation/help composition | Promote only the repeated orchestration over the existing accessible field contracts | Do not relabel existing form support as absent or port an application workflow wholesale |
| Framework-specific interactive-table orchestration | A consumer needs data-source or framework state beyond the shipped sortable, expandable and mobile-card contracts | Keep reusable BF presentation/ARIA seams separate from application data behavior | Basic and interactive `bf-table` contracts remain complete; framework state stays downstream |
| Media-object breakpoint retuning | A second consumer proves that the shipped media-object composition's intrinsic threshold fails | Adjust only the measured shared threshold | No speculative tier-specific breakpoint fork |
| Workflow state-model reconciliation | An explicit owner decision after Spec 002 chooses whether to preserve Spec 001 SC-006 or adopt the external workflow kit | One coherent cold-start/status model with every router and audit updated together | No partial migration or duplicate status owners |

## Design references

| Source | Role |
|---|---|
| `../canonical-spacing-spec/specs/type scale/draft.md` | Type-scale and metric reference |
| `../canonical-spacing-spec/specs/spacing/draft.md` | Governing spacing reference for container-owned semantic gaps and text-local metric compensation, adopted locally by Spec 013 |
| `../canonical-spacing-spec/specs/grid/draft.md` | Grid reference |
| `../canonical-spacing-spec/specs/typography-article/draft.md` | Supporting editorial reference |
| `../vanilla-framework/` | Ancestor pattern evidence, not a compatibility mandate |
| `../diagram-registry/` | Active consumer evidence for Spec 001 |
| `../diagram-generator/` | Lean Spec Kit operating-model reference |
| `../diagram-generator-planning/` | Broader planning reference; not the target global-state model |
| `../canonical-specs/` | Legacy snapshot only |

## Precedence

Current user direction and the active local spec come first, followed by the BF
constitution, `AGENTS.md`, durable local architecture, accepted archived specs,
and then external references. Implementation drift never silently rewrites a
higher-level decision.
