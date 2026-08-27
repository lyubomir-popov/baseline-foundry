# Research: Resilient Sticky Footer and Hero Media

## Sticky-footer failure ownership

**Decision**: Preserve `.bf-main` as the application scroll owner, prevent the direct `.bf-site-main` flex child from shrinking, and make a direct nested site shell fill the application main region rather than a second dynamic viewport.

**Rationale**: The existing site shell is a column flex container, but `.bf-panel-content` applies `flex: 1 1 auto`. When the site main uses that reusable content-region role, a long main can shrink to the available shell height while its visible descendants overflow. The auto-margin footer then follows the shrunken flex box and appears over that content. Separately, `100dvb` is correct for a document-level shell but overstates the available size when the shell sits beneath application navigation. Direct-child sizing resolves both cases at their structural owner.

**Alternatives considered**:

- Give the footer fixed or sticky positioning: rejected because it guarantees overlay risk and removes the footer from document flow.
- Add bottom padding or a minimum height in Diagram Registry: rejected as consumer-specific compensation that cannot adapt to wrapped footers or tier metrics.
- Remove `.bf-panel-content` behavior globally: rejected because fill panels legitimately need flexible content regions.
- Move scrolling from `.bf-main` into the nested page shell: rejected because it would create a second scroll owner and break the existing application contract.

## Hero composition ownership

**Decision**: Add `.bf-hero-lead` as a structural slot and require it to compose the existing `.bf-section.is-shallow` boundary before a direct final `.bf-hero-media.is-full` figure. As an explicit pattern boundary, the hero trims only that final figure's generic trailing margin and keeps the root hero's established exit padding after the media.

**Rationale**: The visual is associated hero content, so it belongs before the hero closes. The existing shallow section token already expresses the requested 24px Editorial gap and remains tier-aware. A named lead slot documents hierarchy and provides safe intrinsic sizing without inventing another spacing token. The existing hero root already owns compact and wide exit padding, which naturally falls after the final media.

**Alternatives considered**:

- Place a standalone figure after the hero: rejected because the normal hero exit gap would occur before associated media.
- Add a hard-coded 24px margin to the media: rejected because it would not preserve four-tier spacing intent.
- Add an `is-shallow` modifier directly to the hero root: rejected because it would change the pattern's exit boundary rather than the internal lead-to-media relationship.
- Re-purpose `.bf-hero-layout` for a stacked full-width row: rejected because the existing layout owns paired grid tracks and would make a one-item lead occupy an unintended partial track at wide widths.

## Verification strategy

**Decision**: Add exact consumer-shaped demo fixtures and assert computed rectangles/tokens in all four tiers at narrow and wide viewport sizes, alongside static selector/markup checks and the full screenshot/baseline suite.

**Rationale**: Both defects are relational geometry failures that static source checks alone cannot prove. Tier switching catches shared/direct bundle parity, while the existing component catalog provides durable visual evidence.

**Alternatives considered**:

- Unit-test CSS strings only: rejected because cascade order and flex sizing caused the footer defect.
- Screenshot-only review: rejected because exact overlap and token ownership are more reliably asserted from computed geometry.
