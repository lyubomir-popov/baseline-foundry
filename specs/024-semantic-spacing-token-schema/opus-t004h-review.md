# Opus T004h independent adversarial review

**Reviewer:** GitHub Copilot on Claude Opus 5.5

**Date:** 2026-09-28

**Snapshot:** Pragma `b10c4d541`, range `313ee82c1..b10c4d541`

**Verdict:** reject pending bounded P1 corrections

The reviewer stated that it produced none of the work, edited neither
repository and independently matched the packet manifest SHA-256. It
revalidated all 40 source paths, 16 measurement paths, 16 comparison paths and
3 supporting paths, then reproduced the six-hit affected-scope sweep.

The formulas and the 2026-09-28 owner rulings were accepted as implemented.
T004h remains open for these P1 dispositions:

1. T004g deleted Section's bordered inset hook but left the static and rendered
   `SurfaceFrames` contracts expecting it. Amend the scope and update those
   checks to the accepted surface-inset inheritance; do not restore the deleted
   local override silently.
2. ColorInput's trigger, inline hex row and popover hex input can resolve either
   row nudge alone or framed-surface inset after the local overrides were
   deleted. Render both configurations and route control chrome through the row
   inset/padding contract.
3. The one-line heading check derives its baseline from the same formula it is
   testing and never measures the body sibling. Replace it with rendered
   zero-height baseline probes in both heading and body for all 18 pairs.
4. Bare `ul`/`ol` retain the browser's `1em` block margins. In Docs/App those
   margins beat the accepted closure during collapse and drift by about 1.15px
   per edge. Reset the list container margins, restore list evidence to the
   text-stack story and render it once.
5. The T004g sheet shows token bars rather than the material owners. Add actual
   Card, Tooltip and Form-field rows with body-line guides and recapture. The
   two established 6106/6107 lanes may split this evidence to preserve the
   repository dependency direction.

The limited re-review also receives these record/evidence corrections:

- do not claim Timeline is the only full-suite failure: Timeline and Accordion
  predate the range; SurfaceFrames is the new T004g failure being corrected;
- add reproducible Git blob IDs to the manifest rather than relying only on
  checkout-byte hashes under `core.autocrlf=true`;
- prove carrier isolation from its first appearance, `f93281eac`, not only the
  later recovery commit;
- include the passing T004d1b no-movement result, persisted T004d2 measurements
  and the closure ledger with list evidence.

The following findings are recorded downstream rather than expanded into the
bounded correction:

- **T007 / CP1:** classify inline-axis uses reached through block-gap aliases;
  the affected examples include Tooltip icon-to-text, Tile Header, Card Footer,
  RangeControl, swatch columns and popover anchoring. Follow alias chains rather
  than relying only on the existing literal sweep.
- **T007 / CP1:** Card header/content separation currently composes two surface
  insets rather than a group gap; correct the stale Content comment and resolve
  the semantic ownership before recut.
- **T010:** record that `deep` equals `default`, hero's bottom equals default,
  and Svelte WPE Section still uses the old primitives, alongside the existing
  Svelte Cards boundary.
- **CP2:** add the deferred stacked-row check; T004d1a occupied heights are
  0.006–0.026px under target and the 18px-root Site case uses 83% of the 1/32px
  tolerance.
- **Phase 3:** deleting `_spike-geometry.css` must move all five private-to-DS
  bindings in the same change or consumers without fallbacks resolve to
  nothing.
- Remove stale comments and unused `--_typography-text-nudge-end` aliases during
  the recut, not during this evidence correction.

The reviewer explicitly ruled that the pre-existing Timeline mismatch does not
block T004h. Re-review may be limited to the P1 dispositions above.
