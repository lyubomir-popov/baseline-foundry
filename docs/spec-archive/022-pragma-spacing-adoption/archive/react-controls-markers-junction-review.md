# React controls and markers junction review

Date: 2026-09-12

## Verdict

**GO for the bounded React pilot waves 3–4.** The reviewed range is
`530c1aaf0..cb6f8cb84`. It closes the current Button/Tabs/Icon control cleanup,
the ContextualMenu portal regression, the four preserved Chip/Badge facts and
the Checkbox/Radio/Choices/Switch marker geometry. It does not close T073 or
authorize Lit/Svelte work.

## Plain composition decision

- Checkbox, Radio, Choices and Switch are marker-led rows: one shared marker
  canvas plus ordinary wrapping text on the established row keyline.
- Chip's empty dismiss action and Badge's nested compact circle are fixed paint
  canvases inside a larger intrinsic row. Their six declarations remain exact,
  named classifications; they are not reusable height rules.
- Tabs and ContextualMenu remain attached-edge rows because their active bar or
  continuous fill must stay joined to the row.
- No new component spacing formula or target row height was introduced.

## Independent evidence

- `c79bff687` contains exactly two policy files, the scanner negatives and the
  Chip browser evidence. `git show --check` is clean.
- Root rerun: scanner unit suite 84/84 (224 assertions) and scoped
  `react-ds-global` scan `55 / 11 / 42 / 2 / 0`.
- Root fresh Chromium DPR1 Badge/Chip run: 5/5 at 16px and 18px roots.
- `e23234d75` contains exactly the two policy files and six marker source/test
  files. Eight temporary transition identities were removed; six exact fixed
  paint facts were classified.
- Root fresh Chromium DPR1 public marker run: 4/4, covering 16px/18px roots,
  checked/disabled/focus states and forced colours. The implementation agent's
  wider matrix passed in Chromium, Firefox and WebKit at DPR1/2.
- Root focused source tests: 11/11 after `cb6f8cb84` corrected one stale
  RichChoices assertion to the already accepted border-aware shared insets.

## Review finding closed

The first independent source-suite run found that an older RichChoices test
still expected direct Surface padding even though the accepted implementation
uses `--ds-box-padding-block` and `--ds-box-padding-inline` so its border is
counted inside the outside-edge inset. `cb6f8cb84` updates only that test and
adds the negative assertion against restoring direct Surface padding.

## Remaining boundary

The React pilot still needs the remaining form and composite components, the
current Color/FileUpload/Combobox accessibility correction, complete catalog
validation and the final external review. The repository-wide transition list
and all deferred framework entries remain active.
