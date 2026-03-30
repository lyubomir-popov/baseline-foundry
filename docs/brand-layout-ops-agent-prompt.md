# Brand Layout Ops Agent Prompt

Use this prompt in the `brand-layout-ops` repo when the goal is to swap from `portable-vertical-rhythm` to `baseline-foundry` and keep pushing the component port forward.

```text
Work in the current brand-layout-ops repo.

Context:
- Replace the existing portable-vertical-rhythm dependency with baseline-foundry.
- Use baseline-foundry as the new source for panel/app styling.
- Use the dense panel preset for this repo.
- Keep the main stage area largely untouched for now. Focus on the inspector/panel side.
- Avoid local one-off styling that is neither Vanilla nor PVR. If panel controls need styling, the right home is baseline-foundry, not ad hoc app CSS.

Reference repos:
- baseline-foundry: C:\Users\lyubo\work\repos\baseline-foundry
- portable-vertical-rhythm: C:\Users\lyubo\work\repos\portable-vertical-rhythm

Start by reading in baseline-foundry:
- llm-handoff-context.md
- docs/rebuild-plan.md
- README.md

Key baseline-foundry files:
- config/presets/panel.json
- src/css-components.ts
- src/build.ts
- src/types.ts
- demo/components/controls.html
- demo/components/panel-pressure.html
- demo/components/brand-layout-ops-sample.html

Key PVR files to compare against for parity:
- src/types.ts
- src/css-theme.ts
- src/css-forms.ts
- src/css-buttons.ts
- src/css-panel-surfaces.ts
- src/css-accordion.ts
- src/css-navigation-adjacent.ts

Your goals:
1. Update brand-layout-ops to consume baseline-foundry instead of portable-vertical-rhythm.
2. Use the dense panel preset as the active styling source.
3. Make the panel/inspector UI visually denser and closer to the established Vanilla/PVR direction.
4. Continue porting missing panel-relevant components from PVR into baseline-foundry until we have parity in component families/count for the parts brand-layout-ops actually uses.
5. Keep vertical rhythm visibly correct everywhere and use the existing baseline QA gate in baseline-foundry as the authority.

Important notes:
- baseline-foundry already fixed a regression inherited from PVR where checkbox/radio glyphs and slider thumbs were incorrectly tied to the baseline unit. Do not reintroduce that bug.
- Prefer principled token-driven changes in baseline-foundry over app-side CSS patches.
- If a component is missing, port it into baseline-foundry cleanly, using the panel preset JSON as the source of truth where applicable.
- Keep the panel preset dense. Buttons, fields, tabs, accordion rows, modal actions, and other controls should feel tight and app-oriented.
- Do not stop at analysis. Keep going autonomously.
- Commit after each meaningful validated chunk.

Working style:
- Make small checkpoint commits.
- After each substantive chunk, verify the app and baseline-foundry.
- Continue until you either achieve a clean swap or hit a real blocker.

Verification:
- In baseline-foundry, run npm test after component/style changes.
- Use the component demos, especially controls, panel-pressure, and brand-layout-ops-sample.
- In brand-layout-ops, run the app and confirm the panel side is using baseline-foundry cleanly.
- Treat visual regressions in density, rhythm, or control styling as real failures.

Definition of done for this pass:
- brand-layout-ops is updated to baseline-foundry for the panel path
- panel-side components used by the app are either already present in baseline-foundry or have been ported from PVR
- component parity is materially closer to PVR, with no obvious missing panel component families
- the panel UI looks denser, cleaner, and closer to Vanilla/PVR
- baseline-foundry tests pass
- leave a concise summary of what was switched, what was ported, what remains, and the commit sequence
```
