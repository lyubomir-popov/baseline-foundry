# Comparing Baseline Alignment Techniques

This repo now contains a useful pressure test for a question that keeps coming back in typography systems: how should web text be aligned to a baseline grid when CSS does not expose the same typographic controls as a layout tool such as InDesign?

The short answer is that there is no single technique. There is a lineage of techniques, each with a different tradeoff:

1. empirical nudges measured per role and breakpoint
2. cap-unit alignment using the browser's native `1cap` metric
3. extracted font-metrics alignment using ascender and descender data
4. extracted font-metrics alignment with an additional empirical browser-compensation patch

This article compares those techniques, explains where they appear in Vanilla, Pragma, and this repo, and clarifies what the current engine smoke page is actually testing.

## The Problem

To align text to a baseline grid, you need to know where the first baseline sits inside the line box. On the web, that is awkward because line boxes are influenced by font metrics, browser layout behavior, rounding, and the way CSS exposes typography.

The core problem is always the same:

- the baseline must land on the grid
- the block must still occupy a predictable amount of space
- multi-line text must keep stepping on the same rhythm
- the surrounding spacing model must remain usable in real layout systems

Different systems solve that with different sources of truth.

## Technique 1: Empirical Nudges

This is the old Vanilla-style lineage. A nudge is measured by inspection, then stored as a token and applied as `padding-top`, while `margin-bottom` is reduced by the same amount so the total occupied block still lands on the grid.

In the current Vanilla repo, the historical description is still visible in [../../vanilla-framework/templates/docs/settings/spacing-settings.md](../../vanilla-framework/templates/docs/settings/spacing-settings.md). The implementation shape is visible in [../../vanilla-framework/scss/_base_typography-definitions.scss](../../vanilla-framework/scss/_base_typography-definitions.scss), where `padding-top` and `margin-bottom` are driven by precomputed values from settings maps.

Strengths:

- can be very accurate when carefully tuned
- easy to ship once the numbers are known
- works even when CSS cannot access useful runtime font metrics

Weaknesses:

- difficult to maintain across font changes and breakpoints
- every new size or line-height pair can require a new measurement
- the values are not self-explanatory; they are data, not a derivation

This is the origin of the "reach" or "nudge" way of thinking: move the first baseline into place, then compensate the block spacing around it.

## Technique 2: Cap-Unit Alignment

Pragma's current default typography engine is the cap-unit engine in [../../pragma/packages/styles/typography/src/baseline-cap.css](../../pragma/packages/styles/typography/src/baseline-cap.css). Its key step is:

`baseline-position = (line-height + 1cap) / 2`

That baseline position is then snapped to the next baseline-grid unit with `mod()`, and the result is applied as start and end padding.

Pragma documents that directly in [../../pragma/packages/styles/typography/README.md](../../pragma/packages/styles/typography/README.md): the baseline position formula is `(line-height + 1cap) / 2`.

Strengths:

- no JavaScript font extraction
- no per-font metrics variables
- automatically updates when `font-family` changes
- elegant and compact

Weaknesses:

- it uses cap height as a proxy for the full ascender/descender geometry
- it is therefore an approximation, not a true font-metrics solution
- its error varies by font, size, and line-height

This matters because cap height is not the same thing as the baseline position implied by the actual ascent and descent of the font.

## Technique 3: Extracted Font Metrics

Pragma also ships a laboratory metrics engine in [../../pragma/packages/styles/typography/src/baseline-metrics.css](../../pragma/packages/styles/typography/src/baseline-metrics.css). That engine uses extracted font variables such as `--ascender`, `--descender`, and `--units-per-em`.

Its baseline position is:

`baseline-position = ((line-height - line-height-scale) / 2) + ascender-scale`

If you want the descender term written explicitly instead of hidden inside `line-height-scale`, the same relationship is:

`baseline-position = ((line-height - (ascender-scale + descender-scale)) / 2) + ascender-scale`

where:

- `ascender-scale = (ascender / units-per-em) * font-size`
- `descender-scale = (abs(descender) / units-per-em) * font-size`

The extraction script for those metrics is in [../../pragma/packages/styles/typography/src/scripts/extractFontData.ts](../../pragma/packages/styles/typography/src/scripts/extractFontData.ts).

Strengths:

- it is based on actual font geometry rather than a cap-height shortcut
- it is explicit and explainable
- it can be used as a laboratory or reference implementation

Weaknesses:

- it is more verbose than the cap engine
- it requires extraction or injected metrics variables
- browser rendering and rounding can still leave visible drift even when the math is typographically sound

That last point is important. A mathematically "correct" metrics engine can still be a little visually wrong once browsers rasterize the result.

## Technique 4: Extracted Metrics with Browser Compensation

This repo uses `@lyubomir-popov/baseline-nudge-generator` to derive nudges from font metrics. The package computes a metrics-based baseline offset and then adds an extra empirical correction for browser inaccuracy.

The relevant implementation is in [../node_modules/@lyubomir-popov/baseline-nudge-generator/src/nudge-generator.js](../node_modules/@lyubomir-popov/baseline-nudge-generator/src/nudge-generator.js).

The package does two things:

1. compute a raw metrics nudge from ascent, descent, line gap, and baseline unit
2. reduce that nudge by a size-scaled compensation factor based on an approximately one-pixel correction

The compensation is not unbounded. It grows with font size but tends toward about `1px`, converted into `rem`. At larger display sizes it becomes more visible because smaller roles receive little or no extra correction while larger roles approach that full-pixel adjustment.

Strengths:

- starts from real font metrics
- fixes the practical browser drift seen in screenshots
- is much closer to a production baseline system than pure laboratory metrics

Weaknesses:

- the final correction is empirical rather than purely typographic
- the package is intentionally tuning for browser output, not just mathematical elegance
- the last step is therefore part font science and part production calibration

This is the right way to describe the package: a metrics-derived engine with an empirical browser-compensation patch.

## What The Current Engine Smoke Page Is Actually Testing

The current engine smoke page in [../demo/components/engine-smoke.html](../demo/components/engine-smoke.html) compares two things:

- the cap formula as re-expressed inside Baseline Foundry's `.bf-engine-cap` demo overlay
- the compensated output of `@lyubomir-popov/baseline-nudge-generator`

It does **not** compare against Pragma's full typography package end to end.

That distinction matters.

The cap formula itself is faithfully mirrored:

- text-role cap overlay in [../src/css.ts](../src/css.ts)
- component cap variables in [../src/css-components.ts](../src/css-components.ts)

But the surrounding block/spacing model is still Foundry's own system. Pragma's cap engine owns its own element contract, mapper, and alternate metrics engine; the current smoke page isolates the cap-formula question, not the entire Pragma package contract.

So the honest claim is:

The smoke page is a fair test of the cap-unit approximation against the compensated metrics path used in this repo. It is not a full end-to-end reproduction of Pragma's typography package.

## IBM Plex Sans vs Ubuntu Sans

The current experiment is useful precisely because the two fonts behave differently at the same large roles.

Using the current smoke scales:

- H1 `8rem / 9rem`
- H2 `4rem / 5rem`

the following values appear in the repo's current calculations.

| Font | Role | Raw metrics nudge | Compensated metrics nudge | Cap nudge | Cap vs compensated |
|---|---|---:|---:|---:|---:|
| IBM Plex Sans | H1 | `0rem` | `0rem` | `0.208rem` | `0.208rem` |
| IBM Plex Sans | H2 | `0rem` | `0rem` | `0.104rem` | `0.104rem` |
| Ubuntu Sans | H1 | `0.28rem` | `0.22531rem` | `0.228rem` | `0.00269rem` |
| Ubuntu Sans | H2 | `0.14rem` | `0.09313rem` | `0.114rem` | `0.02087rem` |

Those numbers explain the current visual outcome:

- IBM Plex Sans exposes the cap drift immediately because the cap approximation is far from the compensated metrics answer at H1 and H2.
- Ubuntu Sans looks much better because the cap approximation happens to land very close to the compensated metrics answer, especially at H1.

This supports a practical conclusion: cap-based alignment is much more sensitive for some fonts than others.

## Is The "Cap vs Ascender Difference" Intuition Plausible?

Yes, broadly, but with one refinement.

The intuition is correct that a bigger mismatch between cap-based geometry and ascender-based geometry tends to produce larger cap-engine error. IBM Plex Sans is clearly more sensitive than Ubuntu Sans in the current smoke page.

The refinement is that the metrics engine is not comparing cap height to ascender alone. The real metrics position depends on ascender, descender, line height, and grid snapping. So the cap-engine error is not just a property of `capHeight / ascent`; it is a property of the whole font geometry inside the chosen line box.

That is why percentage claims such as "5%", "10%", "3%", or "0.1%" can be plausible as empirical screenshot claims but are not universal constants. They depend on what is being normalized:

- font size
- line height
- baseline unit
- pixel error in screenshots
- or some other visual metric

The repo evidence supports the **ordering** more strongly than the absolute percentages:

1. compensated metrics is the most production-accurate path here
2. raw metrics is a useful laboratory reference but still leaves browser drift
3. cap alignment can be close for some fonts and noticeably wrong for others

That ordering is consistent with the behavior seen in the current IBM/Ubuntu experiment.

## Practical Recommendation

If the goal is a production typography system rather than a research demo:

- use compensated metrics when precision matters most
- keep raw metrics as the laboratory reference for understanding the font geometry
- treat cap alignment as a lightweight approximation, not the canonical answer
- do not assume cap behavior generalizes across fonts just because it looks good in one family

If the goal is a clean article or talk:

- present empirical nudges as the historical baseline
- present cap-unit alignment as the elegant browser-native approximation
- present raw metrics as the typographically rigorous reference
- present compensated metrics as the practical production answer when browser output, not just algebra, is the target

## Source Notes In This Workspace

- Vanilla empirical nudge docs: [../../vanilla-framework/templates/docs/settings/spacing-settings.md](../../vanilla-framework/templates/docs/settings/spacing-settings.md)
- Vanilla typography nudge application: [../../vanilla-framework/scss/_base_typography-definitions.scss](../../vanilla-framework/scss/_base_typography-definitions.scss)
- Pragma cap engine: [../../pragma/packages/styles/typography/src/baseline-cap.css](../../pragma/packages/styles/typography/src/baseline-cap.css)
- Pragma metrics engine: [../../pragma/packages/styles/typography/src/baseline-metrics.css](../../pragma/packages/styles/typography/src/baseline-metrics.css)
- Pragma metrics extraction: [../../pragma/packages/styles/typography/src/scripts/extractFontData.ts](../../pragma/packages/styles/typography/src/scripts/extractFontData.ts)
- Baseline nudge generator: [../node_modules/@lyubomir-popov/baseline-nudge-generator/src/nudge-generator.js](../node_modules/@lyubomir-popov/baseline-nudge-generator/src/nudge-generator.js)
- Current smoke specimen: [../demo/components/engine-smoke.html](../demo/components/engine-smoke.html)

## Visual Companion

That three-way specimen now lives at [../demo/components/engine-illustration.html](../demo/components/engine-illustration.html). It keeps the generated IBM Plex Sans and Ubuntu Sans experiment bundle, then adds a page-local raw-metrics lane so the article can show all three padding models side by side without pretending raw metrics is a shipped surface mode.

## Suggested Next Step

If this article becomes decision material rather than a blog post, the next extension should be a four-way specimen that adds empirical nudges and body-scale rows to the current H1 and H2 comparison.