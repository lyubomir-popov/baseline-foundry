# React pilot internal closeout review

Date: 2026-09-12  
Pragma pilot commit: `362eeae1e`  
Pragma visualizer follow-up: `e26c650c0`  
Verdict: **GO for lead-engineer review**

## What is complete

The approval milestone is a production-quality React pilot, not a disposable
spike and not a claim that Lit or Svelte are already verified. Every React
design-system renderer is represented in the source inventory and the composed
Storybook. The smaller horizontal and vertical pages remain teaching views.

The border rule is also complete for the React scope. A real border must do one
of four things: use the shared per-edge calculation, use the same calculation
through the framed-box part, remain fixed internal artwork, or paint without
affecting layout. Normal and 3px emphasis stroke widths are tier facts. Active
paint may not move text or change the component's outside size.

## Exact inventory and border evidence

- 145 audited records: 142 production render sources plus Heading, Tokens and
  Typography as three explicit story-only specimens.
- 143 rendered catalog rows: 49 Global, 55 Form and 39 application-side rows.
  Heading is the one rendered story-only specimen. Tokens and Typography are
  documentation artwork and are deliberately not presented as components.
- 315/315 border declarations across 62 authenticated CSS paths have a closed
  decision: 48 shared framed-box, 65 shared per-edge, 90 fixed internal
  artwork and 112 zero-layout paint.
- Zero React transition-allowlist entries remain. The repository-wide scan is
  `240 raw / 64 sanctioned / 169 deferred non-React transitions / 7 advisory / 0 legacy`.
- The former 95 React transition identities split into 57 actual migrations
  and 38 exact reviewed classifications. Global is 39/11, Global Form 10/18,
  Launchpad 8/8 and App 0/1 (migrated/classified). Zero transition debt therefore
  means every item has a reviewed disposition, not that all 95 were rewritten.
- SideNavigation's 3px active edge keeps active and inactive outer size,
  painted size and label inset identical, including RTL and wrapping.

## Reproduced checks

- CSS, inventory, catalog and release-gate tests: 148/148, 2,228 assertions.
- Exact inventory CLI: 145 records, 142 sources, 315/315 borders, zero outside
  the audited set.
- Full composed catalog: 27/27 across Chromium, Firefox and WebKit at DPR1,
  including 143-row reconciliation, relevant interaction states, a 320px
  viewport and whole-document accessibility checks.
- Launchpad Git/FileHeader matrix: 36/36 across Site/Docs/App, 16px/18px,
  LTR/RTL and all three engines.
- Nine visual React packages pass TypeScript/build checks. The release gate
  imports all nine by public package name from `dist`, compares complete public
  export sets, follows 427 emitted type declarations and 114 emitted CSS/assets,
  and verifies declared entry files.
- Built-output server rendering and hydration: 5/5 for Launchpad and the four
  product Button packages, with the original DOM node reused and zero
  recoverable or console errors.
- Default Storybook remains available on port 6114; it was not restarted by
  the release gate.

## Adversarial corrections made before GO

1. The catalog initially included two source-only token documentation records.
   It now renders exactly the 142 production modules plus Heading and has an
   explicit negative assertion for the two documentation sheets.
2. The first release gate authenticated only a count of nine packages. It now
   authenticates the exact nine names and directories and rejects paths outside
   `packages/react/<package>`.
3. The first artifact check stopped at top-level entry files. It now follows
   nested declaration, CSS import and local asset references.
4. That stronger check found a real Launchpad declaration defect:
   SimpleChangeMarker used a source-only `lib/...` alias. Production now uses
   `../../types.js`, and the checker rejects bare `lib/...` or `src/...` aliases
   even when a similarly named emitted file exists.

Each correction has a falsifiable negative test. The final independent
re-review returned GO with no remaining P0/P1/P2 finding.

## Dual visualizer follow-up

Pragma `e26c650c0` preserves the existing orange stepped-band visualizer
byte-for-byte and adds a second, separately controlled BF visualizer made from
low-opacity pink `0.0625rem` rules. Both read the live product baseline and can
be enabled alone or together.

Focused evidence is 12/12 across Chromium, Firefox and WebKit at DPR1 and DPR2.
It covers neither, orange-only, both and BF-only states; authenticates both
pseudo-element paints and their 5x/1x live intervals; checks Site 8px and
Docs/App 4px; verifies pointer transparency; and proves unchanged root and
visible Button geometry. Addon unit coverage is 9/9 and includes parameter
fallback, explicit-global precedence and class cleanup. The stable Storybook on
6114 was not restarted.

Handoff links must set both globals explicitly because the orange overlay
defaults on. Use `baseline:!false;baselineFoundry:!true` for pink-only,
`baseline:!true;baselineFoundry:!false` for orange-only, and
`baseline:!true;baselineFoundry:!true` for both.

Independent review returned GO with no P0/P1. It recorded two non-blocking P2
limits. Either overlay establishes the same relative positioning context, so
the intentionally hidden absolute SkipLink moves 16px before focus; its visible
focused state is fixed-position and invariant, as is all measured in-flow
content. The preview decorator's parameter/global precedence is unit-tested,
while the manager button's equivalent pressed-state fallback remains verified
by inspection and explicit-global browser behavior.

## Boundary and next gate

T073, T074, T079 and T080 are complete. The external Opus review and the
visualizer junction review have both returned GO. T078 remains open only until
the corrected packet is presented to and approved by the lead. T019, T070 and
T071 remain open:
React proves the shared arithmetic and design decisions, but Lit/Svelte still
need framework-specific markup, style-loading, state and browser checks after
lead-engineer approval. No merge, push, publication or release is authorized.

The final external review returned GO with three documentation corrections and
no code finding. Besides the migration/classification split above, the inventory
now calls the 12 exclusions non-spacing-owning (four return JSX), and records the
measurement-irrelevant manager-shell `fonts.css` 404 separately from the clean,
font-authenticated preview iframe. The subsequent dual-visualizer follow-up is
complete and recorded above.
