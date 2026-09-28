# Opus T004h limited re-review

**Reviewer:** GitHub Copilot on Claude Opus 5.5. Did not produce the work or the corrections.

**Date:** 2026-09-28

**Snapshot:** Pragma `4325f1597`, correction range `b10c4d541..4325f1597`, full range `313ee82c1..4325f1597`

**Scope:** the five P1 dispositions in `opus-t004h-review.md`, plus the requested disposition of the corrected heading/body residual. Nothing in CP1, CP2 or the recorded downstream P2 items was reopened.

## Verdict: accept, conditional on F1

T004h passes once F1 lands and its probe result is recorded in the handover. F1 needs no further review round: the acceptance numbers are stated below and are mechanical. F2–F4 are record-only and must appear in the CP1 packet. T005 may start once F1 is recorded.

## Verification performed

- Manifest SHA-256 matches `b921f231…3d13`.
- All 45 source paths match their recorded Git blob IDs at HEAD, and the path list equals `git diff --name-only 313ee82c1..HEAD`.
- All 18 measurement, 18 comparison and 3 supporting files match their hashes.
- Both worktrees were clean before and after the review.
- Rendered, Chromium DPR 1, against the running 6106/6107 Storybooks (the serving checkout was not independently verified):
  - HeadingRhythm 3/3;
  - SurfaceFrames 9/9;
  - ColorInput 5/5 – run through an out-of-repo config, because the form config hard-codes `reuseExistingServer: false`.
- Static suites:
  - ds-global: two failures, both known (Timeline and Accordion) and predating the range;
  - ds-global-form: one failure, `ReactPilotCatalogFilter` – a text-matcher failure unrelated to spacing and not listed in the packet;
  - typography: 21/21.
- Two read-only probes were run and are kept outside both repositories: `H:\WSL_dev_projects\temp\rr-probe.mjs` and `rr-list-probe.mjs`.

## Disposition of the five P1 items

| # | Item | Result |
|---|---|---|
| 1 | Section SurfaceFrames contracts | **Resolved.** Static and rendered checks now enforce surface-inset inheritance and the 1px/3px height invariance; neither reads the deleted hook. |
| 2 | ColorInput control geometry | **Resolved for trigger, inline row and popover hex input.** Occupied is 39.98 Site and 31.97 Docs/App, each control inset is below the panel inset, and the panel is not reclassified. The popover separator row has a new per-edge defect – see F3. |
| 3 | Circular baseline check | **Resolved.** A zero-size baseline-aligned `inline-block` is a valid rendered baseline probe, and the heading is now compared with its body sibling. |
| 4 | List margins and evidence | **Resolved for bare prose.** List items land 0.031–0.078px from the body phase, and list evidence is restored. The global reset causes a regression inside components – see F1. |
| 5 | Material-owner evidence | **Resolved.** Actual Card, Tooltip and Form-field owners are shown with baseline-unit and body-line guides per product; splitting across lanes respects the dependency direction. |

## Findings

### F1 – P1, introduced by the correction: the list reset strips separation from lists inside components

`ul, ol { margin-block: 0 }` in `elements.css` is unscoped. List-item closure is scoped to `li:not(:where(.ds, .ds *))`. Inside any `.ds` host, a list therefore loses both its old `1em` browser-default margins and any closure.

Block-flow hosts with arbitrary prose include Section and the Accordion `.content` panel.

Probe, Docs, 16px root, `<p> <ul><li><li></ul> <p>`:

| Host | `ul` margins | Last `li` → next `p` | `li` advance |
|---|---|---:|---:|
| bare | 0 / 0 | 14.84px (closure) | 39.98px |
| inside `.ds` | 0 / 0 | **0px** | 20px |

At `b10c4d541` the inside-`.ds` case had a 16px browser-default margin. A following paragraph now sits flush against the list, and in flex hosts such as Card Content the list loses 16px on each side.

**Required:** scope the reset to the same selector boundary as the list-item closure, for example `:where(ul, ol):not(:where(.ds, .ds *))`.

**Acceptance:** the same probe shows:
- bare: `ul` margins `0/0`;
- inside `.ds`: `ul` margins `16px/16px` and last `li` → next `p` = `16px`;
- HeadingRhythm stays 3/3.

This restores the pre-correction behaviour inside components without reopening the `.ds` list exclusion.

### F2 – P2, record before the CP1 packet: body-line phase drifts 1/64px per closed text element

Chromium's layout units are 1/64px. They truncate the fractional padding (nudge + phase) and the fractional closure margin separately. Each closed element therefore advances 1/64px less than a whole body line, and the error accumulates without limit.

A 100-paragraph probe gave the same result in every product:

| Paragraph | 2 | 10 | 32 | 64 | 100 |
|---|---:|---:|---:|---:|---:|
| Drift from whole body lines (px) | −0.016 | −0.141 | −0.484 | −0.984 | −1.547 |

The packet already contains the signature: every pair height is 71.984375 or 59.984375, and each list item advances 47.984375 or 39.984375. The four-item list evidence is too short to expose it.

The same mechanism explains the systematic T004d1a undershoot recorded earlier (−0.006 to −0.026px) and ColorInput's occupied height sitting exactly at −1/32px against a 0.032 tolerance.

**Consequence:** full closure keeps the body-line phase only locally. Across long documents, and between adjacent columns with different element counts, phase drifts by about 1px every 64 elements.

This does not block T004h. The mechanism is engine precision, not the closure model. CP1 needs an owner decision on whether computed rhythm terms must be exact in layout units, and CP2's engine matrix must record it per engine. No typography change is prescribed here.

### F3 – P2, record or fix: the ColorInput popover separator row breaks per-edge border subtraction

The row `.color-popover > .hex-input-row` now inherits `--ds-row-padding-block-*` from the host, and those were computed against the host's row borders (1px on both edges). The row's own borders are 1px at the start and 0 at the end.

| Measured | Start | End |
|---|---:|---:|
| Border (Docs) | 1 | 0 |
| Padding (Docs) | 4.149 | 4.149 |
| Border + padding vs control inset 5.149 | ✓ | **−1px** |

This is a nominal-border subtraction of the kind FR-039d forbids. The same coupling is latent for the trigger, hex input and inline row: it is correct today only because the host's border hooks resolve to each element's own borders.

The row is also a panel section wrapped around a nested control, so treating it as a control row is a classification choice. That choice needs recording.

**Minimum:** record it as a T006 ColorInput exception; ColorInput is outside the four-member T004d1a denominator.

**Preferred at recut:** route these elements through their own box borders – set the control inset as `--ds-box-inset-block` and let the existing per-edge box formula subtract each element's actual borders – rather than inheriting the host's row padding.

### F4 – disposition of the corrected heading/body residual

**Does not block T004h.** It is the metric-authority debt already recorded, now measured correctly. The implementing side handled it properly: typography unchanged, the 1px limit labelled as a regression guard, and every value recorded.

Stated precisely for the CP1 packet: Site H5/H6 and App H5/H6 read 0 because they are formula controls with body-equal metrics, not cross-size evidence. The independent cross-size pairs are:

| Product | Pairs | Rendered delta |
|---|---|---:|
| Site | H1–H4 | 0.016–0.219px |
| Docs | H1–H6 | 0.531–0.766px |
| App | H1–H4 | 0.531–0.609px |

Every Docs and App cross-size pair exceeds 0.5px, so the 0.5px claim fails for those two products, not merely for some pairs.

The residual does not grow steadily with font size. That is consistent with the engine rounding font ascent and descent, which a formula based on `1cap` cannot predict – a hypothesis, not verified. If true, the 0.5px bound was never reachable by the current metric source at DPR 1, and other engines will round differently.

**Owner decisions required for CP1:**
- The acceptance bound for one-line heading/body baseline agreement:
  - keep ≤0.5px, which requires metric-authority work before provider tokens; or
  - adopt a device-pixel criterion, for example ≤1px at DPR 1.
- Whether metric authority belongs to CP1 or to the deferred CP2 engine matrix.

Neither `1px` guard may be cited as acceptance evidence.

### P3 notes

- The packet's full-suite statement covers ds-global only; add the ds-global-form `ReactPilotCatalogFilter` failure.
- ColorInput's occupied tolerance of 0.032 exceeds 1/32 by 0.00075 while Docs/App sit exactly at −1/32. Any further truncation will flip it; tie this to F2 rather than widening it.
