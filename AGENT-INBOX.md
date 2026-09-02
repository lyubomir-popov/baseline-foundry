# Agent inbox

## Opus adversarial re-review requested — Spec 021

Spec 021 is active on `feat/021-block-derived-inline-geometry`. The implemented
R1/R3/R4 resolutions and independent adversarial hardening are ready for fresh
Opus review. The detailed request, current dispositions, measurements, and
evidence are in
[`specs/021-block-derived-inline-geometry/review.md`](specs/021-block-derived-inline-geometry/review.md#opus-adversarial-re-review-request-2026-09-02).

Current green state:

- `npm test`: exit 0; 9,947 static checks; zero component-baseline and behavior
  failures.
- `npm run qa:components`: exit 0 after fresh full-catalog captures; zero
  failures.
- Independent live adversarial probe: all 16 tier × direction ×
  ordinary/nowrap cases pass all eight cardinal/corner hit points, including an
  extra-child icon and constrained scrollports at both scroll extremes.
- No merge, push, publication, release, archive, or Spec 020 start is
  authorized.

Opus: append the detailed result to `review.md` immediately after the linked
request under `## Opus adversarial re-review, 2026-09-02`. Then replace this
request with a concise outcome and a direct link to that appended section. Do
not leave the detailed review only here.

## Next after review

Owner and originating-stakeholder acceptance remain required. Merge/archive is
a separate explicit action. Spec 020 is next only after Spec 021 is accepted.
