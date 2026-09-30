# Opus request: final Pragma React pilot adversarial review

Perform a read-only, adversarial review of the complete Pragma React spacing
pilot. This is the final external gate before lead-engineer review. Do not trust
the internal GO verdict or quoted counts without reproducing the smallest
sufficient evidence.

Read every applicable `AGENTS.md`, then read:

- `H:\WSL_dev_projects\baseline-foundry\AGENT-INBOX.md`
- `H:\WSL_dev_projects\baseline-foundry\docs\specs.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\spec.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\implementation-plan.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\contracts\baseline-alignment.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\tasks.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\react-pilot-inventory.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\react-pilot-coverage-audit.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\react-pilot-closeout-review.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\react-border-foundation-junction-review.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\react-card-page-grid-junction-review.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\rich-choices-border-junction-review.md`

Review this state:

```text
repository: H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-shared-alignment
branch:     feat/bf-shared-alignment
pilot base: 971d8f85a
tip:        362eeae1e
range:      971d8f85a..362eeae1e
```

Do not edit implementation or spec files, stage, commit, push, merge, publish,
release, switch worktrees, or restart the stable demos. You may write only the
requested review file. Preserve the four known unstaged line-ending-only files
in Pragma:

- `packages/react/ds-app-launchpad/src/lib/GitDiffViewer/common/CodeDiffViewer/common/DiffLine/DiffLine.tsx`
- `packages/react/ds-global-form/src/lib/component/RatingField/RatingField.stories.tsx`
- `packages/react/ds-global-form/src/lib/subcomponent/RatingInput/RatingInput.stories.tsx`
- `packages/storybook/addon-msw/public/mockServiceWorker.js`

Port 6114 is the stable React Storybook.

## Required questions

1. Does source discovery prove exactly 142 production React render sources,
   with no omitted visual package, work-in-progress renderer, unexported CSS
   owner or story-bearing component? Are the 12 non-renderer exclusions exact?
2. Does the composed Storybook render exactly 143 rows: all 142 production
   sources plus Heading, while keeping the two Token documentation artworks as
   audited but non-rendered records? Can a new/removed/duplicated source or
   catalog row fail closed?
3. Are all 315 production React border declarations across 62 CSS paths bound
   exactly once to shared per-edge accounting, shared framed-box accounting,
   fixed internal artwork or zero-layout paint? Probe a changed selector,
   value, occurrence and newly added CSS owner.
4. Do the shared border rules cover no edge, every single edge, all edges,
   asymmetric edges and the tier 3px emphasis stroke without copied component
   arithmetic? Do active Tabs and SideNavigation keep text position and outside
   size stable in inactive/active, LTR/RTL and wrapped states?
5. Do Field controls, Choice cards, Tables, Cards, navigation/marker rows,
   overlays and Launchpad code/file/editor parts use the intended composite
   parts without target heights or private baseline formulas? Concentrate on
   narrow/multiline and 16px/18px tier cases rather than visual taste.
6. Does the global contract scan report `240/64/169/7/0`, with zero React
   transition entries and no growth in deferred Lit/Svelte debt?
7. Reproduce the composed catalog in Chromium, Firefox and WebKit at DPR1.
   Confirm the exact row counts, relevant interaction states, 320px pressure
   case, console cleanliness and whole-document accessibility result.
8. Does `qa:react-release-shape` authenticate the exact nine React packages,
   build them, resolve bare package imports to `dist`, compare complete public
   exports, verify all declared entries, recursively validate emitted type/CSS/
   asset graphs, and reject bare internal `lib/...`/`src/...` type aliases?
9. Are the five built-output SSR-to-hydration cases genuine and clean, with
   DOM-node reuse and zero recoverable/console errors? Confirm the corrected
   Launchpad SimpleChangeMarker declaration is usable by a package consumer.
10. Is the stable demo still available at:
    `http://127.0.0.1:6114/?path=/story/documentation-react-pilot--inventory&globals=baseline:!true;context:site`?
11. Can T073 and T074 remain complete and may the pilot proceed to lead review?
    Keep T019/T070/T071 open: React validates the shared model, but it is not
    production proof for Lit/Svelte markup, style loading, state or browser
    behavior.

## Output

Write the review to:

`H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\react-pilot-final-opus-review.md`

Use:

1. **Verdict:** `GO`, `GO with required corrections`, or `NO-GO`.
2. **Findings:** P0/P1/P2, or `none`.
3. **Answers to questions 1-11.**
4. **Reproduced evidence and exact commands/results.**
5. **Boundaries and next authorized work.**

Do not authorize Lit/Svelte implementation, merge, push, publication or release.
