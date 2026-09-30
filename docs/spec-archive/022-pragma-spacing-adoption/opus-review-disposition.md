# Disposition of the Opus evidence review

Date: 2026-09-19. Independent disposition of all 21 findings in
[opus-evidence-review.md](opus-evidence-review.md), against the current spec,
bucket table, captured evidence and imported reference-worktree source. This
document is not CP1, does not approve a final taxonomy, and changes no
implementation. Actions below remain work to do unless explicitly described as
already present. The source is the reference worktree; observations must not be
silently attributed to subsequent fixes in the active worktree.

Evidence shorthand: **B** = [browser measurements](evidence/browser-measurements.json);
**V** = [variant measurements](evidence/variant-measurements.json);
**R** = [relationship ledger](evidence/relationship-ledger.json). Source paths in
the table are relative to `feat-bf-shared-alignment`.

## Category decisions supported now

Keep Continuation as a text-keyline contract; its marker-group entry inset is a
derived output, not another bucket. Keep in-box compensation as a mode of the
row contract. Do not generate a Nested spacing family from the existing class
name: the current Chip does not implement the spec's reduced nested line, and
the Badge's reduced line is a role/host calculation. These decisions remove
unnecessary candidate families without claiming the implementations are done.

The fixed 8px block relationship is sourced from the field-gap token and can
provisionally be described as shared compact separation used at either a child
relationship or a container edge. Reusing that contract would avoid emitting a
second identical family solely because the CSS property is padding. That is a
semantic merge to demonstrate, not a deduction from the token's spelling. The
8/8/8 and 16/16/12 behaviours both still need representation. An invariant inset
is permitted; neither the spec nor the evidence requires all insets to change
with tier, or requires a constant start:end ratio.

Retain Field outside inset and Marker internal gap as distinct semantic jobs
unless a reviewed contract explicitly couples them. They currently share
8/8/4, but changing whitespace between an icon and its label need not change the
control's outside keyline. Shared values may use a common underlying value;
that does not itself eliminate either ownership contract.

There is no defensible final count yet. The review's A/B/C/D classification is
useful for locating legacy consumers, but **reject “Class A is the whole
question” as a closure rule**. The spec includes role-derived spacing,
invariants and currently unmatched owners. Existing token consumption cannot
decide which behaviours are necessary without making the old token set the
classifier. Legacy literals are a normalisation backlog, not automatic new
buckets; they also cannot disappear from the denominator while unresolved.
The 442/34 and subclass counts are review-reported extraction results, not
independently reproduced totals: the scratch extractor and exact reduction
rules were not supplied. Do not use them as a verified completion metric.

## Finding-by-finding disposition

“Blocker” identifies what must be resolved before the affected claim or final
semantic file can be accepted; it is not a severity ranking.

| Finding | Decision | Evidence and correction | Action | Blocker |
|---|---|---|---|---|
| F1 — Continuation keyline and residual | Accept, with count qualification | B and `packages/styles/main/src/component-contract.css` support 32/24/24 keylines and `max(0, continuation − canvas − gap)` entry padding of 8/0/4. The residual is real spacing, but not an independent design choice. Calling it “not a spacing value” overstates the distinction. The contract still has to represent the keyline. | Name the keyline and its derived group entry explicitly; do not emit an independent residual family. Do not claim a count reduction unless the previous count actually included both. Apply the user's Accordion text-keyline requirement using the appropriate keyline composition. | Keyline assignment and actual panel/header alignment remain to demonstrate. |
| F2 — Select trailing lane | Modify | B supports outside trailing 32/32/24. The source formula is **twice Field outside inset plus trailing canvas**, then subtract the end border. It does not read Marker gap. `Field + canvas + Marker gap` happens to agree while F3's values coincide. | Keep a derived trailing reservation, with the source's actual operands. Decide explicitly whether artwork-to-text clearance should follow Field or Marker semantics before changing the formula. No Select-specific end bucket. | Formula ownership decision; not a need for another scalar bucket. |
| F3 — Field inset equals Marker gap | Accept numeric observation; retain semantic distinction provisionally | Both vectors are 8/8/4. The spec expressly tests ownership as well as values. Outside-edge seating and internal canvas-to-copy separation are different relationships. Numeric equality cannot prove interchangeability. The reported 55 observations/37 owners are not independently reproduced here. | Record the independent-change counterexample above and a merge attempt. If merged later, make the intended coupling explicit rather than silently substituting aliases. | Semantic coupling decision before final token mapping. |
| F4 — Compact edge is the field gap | Modify; reject the forced-tiering conclusion | The alias provenance is correct. The claim that all listed components end with broad padding is false: B Tooltip and Announcement measure 8/8 on both block edges at every tier; Popover is 7/7 padding plus 1/1 borders, also 8/8 outside. Card/Tile/Accordion use 8 then 16/16/12. No evidence requires an inset to tier or a fixed ratio. | Test one compact-separation contract used as gap or edge, avoiding a duplicate family if semantics agree. Preserve the measured symmetric and asymmetric compositions. Correct the review's member-level overgeneralisation; do not change App padding merely because an alias says “gap.” | Compact-gap/edge interchangeability must be decided, not assumed. |
| F5 — App block-gap inversion | Accept defect under the documented ordering; modify count inference | Field/group/section/pattern vectors are 8/8/8, 24/24/8, 32/32/32, 64/48/16. `packages/styles/main/src/spacing.css` explicitly says a section sits between group and pattern; its fixed `dimension-400` violates that in App. Equality of field/group in one tier does not merge their different full vectors or semantic jobs. | Resolve the section alias against the provider matrix and intended hierarchy; record affected consumers and measure any change. Alternatively revise the ordering contract with an explicit design reason. Do not choose a replacement number from this review alone. | Yes: inconsistent gap hierarchy before emitting the final semantic scale. |
| F6 — In-box compensation mode | Accept | B menu/tab outside end 9.544/2.851/2.851 includes their border; Combobox options reach the same values without that border. These equal regular outside inset plus compensation. The shared `--ds-in-box-row-*` formula proves the composition. | Keep one row contract with external-margin and in-box-end modes. Preserve distinct fill/paint obligations in consuming rows, without another spacing family. | No remaining count blocker from this distinction. |
| F7 — Border arithmetic vectors | Modify | Field-minus-border and row-minus-border are derived outputs. Phone's plus-border divider and TokenTable's 8px padding plus 1px bottom border are observed totals, not proof those nodes consume the shared outside-inset subtraction rule. TokenTable remains legacy geometry; its underlying 8px requires disposition. | Separate requested outside inset, applied padding and actual border at each owner. Do not mint buckets for subtraction outputs, but retain uncompensated legacy/divider differences in the mismatch backlog. | Underlying owner/target mismatch, not the arithmetic itself. |
| F8 — No Nested family | Modify | V gives nested Chip line 24/20/20 with zero block padding and compensation; Badge line16 with zero block padding. Badge derives body line minus baseline, not the marker canvas; equality to canvas is incidental. The measured short badge is 16×16, not every possible badge label. Chip does **not** meet the spec's nested line16/16/16. | Remove a speculative independent spacing family; retain a named host-participation mode and its typography/fit contract. Fix or explicitly reject Chip eligibility through the approved host mechanism, then measure the actual consuming specimen. Do not mark the user's regular-looking Chip resolved by a class-mutated probe. | Yes: actual nested behaviour, public host/child pairing and alignment remain open. |
| F9 — GitDiff em spacing | Modify | Source and B support header inset16/14/14 and gap8/7/7. The same file also defines gutter width7.5em, so the “only em spacing” claim depends on a narrower definition than stated. Nearness to Action does not establish that a header container owns an Action inset. | Put the header in the normalisation backlog. Compare its child-content ownership with Action, Surface and Marker relationships; choose the closest semantic contract and document deltas. Do not implement Action+Marker solely from proximity. | Semantic assignment before normalisation; no new bucket justified by em alone. |
| F10 — Markdown px literals | Modify | Markdown H8/V6 is real legacy geometry, but “only raw px” is false: DiffLine has 4px cell start and 8px pre insets; FileHeader collapse button has padding4px; FileTree has local px inputs. | Consolidate these into a bounded live-literal backlog with owner, proposed contract, delta and disposition. Do not create a bucket named for each component or treat an expiry alone as completing restyling. | Live unresolved owners still block the spec's all-owner completion. |
| F11 — Accordion baseline gap | Modify | `.ds.accordion` declares `gap: var(--spacing-baseline)`, yielding 8/4/4. That is a real singleton to explain. The spec allows a documented unavoidable singleton, so “one witness cannot be a category” is too absolute. | Determine whether direct-item rhythm intentionally tracks the baseline or should share a semantic child-gap contract. Normalising to current field gap changes Docs/App by4px; record that change rather than presenting it as a rename. | Singleton/normalisation decision; not automatic extra category. |
| F12 — Gap axis crossover | Accept audit; modify forced choice | Source shows nominal block aliases used for columns and nominal inline aliases used for rows. Axis-neutral relationships are possible, but the spec requires independent classification of axes; names do not prove every consumer shares an interchangeable job. | Decide naming and allowable axis-neutral primitives once, then verify each listed consumer against its owned relationship and wrapping state. Do not merge unrelated jobs just to eliminate suffixes. | Yes: axis/relationship contract before token generation. |
| F13 — Contract alias bypass | Accept tracing issue; modify minimisation argument | Direct upstream reads must be tracked during renames. A provider token plus a derived/component-facing alias is not automatically two semantic buckets; the existing source explicitly documents compatibility aliases. | Choose and document the intended consumer surface, migrate bypasses in the appropriate cut, and maintain one semantic source. Count semantic jobs, not CSS variable identifiers. | Consumer-surface consistency before claiming all parts consume one reviewed contract. |
| F14 — Chip→Badge dormant rule | Accept for supported React API | `Chip/types.ts` omits children; lead/value are strings, and `Chip.tsx` constructs its own children. The supported component cannot produce this descendant Badge. “Can never match” is broader than that API claim because hand-authored DOM can match CSS. | Mark as unsupported/dormant and exclude from required rendered React witnesses. Remove the unused rule in an authorised implementation slice; no deletion is performed by this disposition. | No category blocker; cleanup is not a reason to fabricate a fixture. |
| F15 — Text-only Cards tracks | Accept exclusion; refine criterion | Span/row assignments are intrinsic Card layout topology, not externally authored and not spacing lengths. Unitless alone is insufficient as a universal exclusion: unitless typography can still affect geometry. | Describe these four entries as structural grid placement with no independently owned inset/gap. Keep a source boundary if useful for denominator traceability, not four spacing owners. | No category blocker. |
| F16 — Extra-reference validation | Accept | The reviewed verifier follows scalar `measurementRef`, but not extra `measurementRefs` objects. The previous successful run did not validate those86 links. | Validate tier, collection, capture existence/status, target bounds, relationship match and requested pseudo for every extra ref. Scope earlier verification claims accurately. | Yes: evidence-reference integrity before relying on generated totals. |
| F17 — Duplicate capture IDs | Accept | V has seven repeated IDs per tier across `ownerExtraProbes` and `captures`, with absent default state versus observed activated/fixture state. These are different observations, not conflicting measurements of one state, but the references are ambiguous. | Namespace IDs or include collection plus tier in every reference; validate uniqueness at that scope and resolve each ref exactly once. Preserve absent-default evidence instead of overwriting it. | Yes: unambiguous evidence joins. |
| F18 — Direct-probe absence and fixture provenance | Modify | Fourteen direct probes are absent per tier. Some replacement observations use temporary DOM classes/placement; three mount actual exported React components with public props; empty state uses real search interaction. The assertion that all replacement evidence is DOM mutation is false. The stated short list also omits dormant Chip→Badge and text-only Cards. | Put provenance beside each table claim: unchanged catalog, public interaction, public-prop mount or DOM fixture. Describe unjoined Card as a controlled composition fixture. Do not claim DOM-only density probes prove supported host behaviour. | Provenance correction; actual host behaviour remains blocked under F8. |
| F19 — Alleged missing owners | Modify | `.ds.view-layout` owns a gap but already belongs to an explicit layout exclusion. `.token-table-container` is in the orphan stylesheet identified by F20, not a live owner. Tabs item zero padding is a boundary to reconcile. `.content-flow`/`.editorial` are shared layout utilities, not automatically React foundational components merely because they read in-scope tokens. | Apply one boundary rule consistently to ViewLayout, Cards composition and shared layout helpers; retain live intrinsic reusable component gaps. Add/prove Tabs item boundary. Reconcile the foundational source denominator independently; do not add dead selectors to inflate it. | Yes: denominator consistency; these four examples do not all prove live omissions. |
| F20 — Orphan TokenTable files | Accept orphan warning; reject claimed padding disagreement | Current `TokenTable.tsx` imports `styles.css` and `common/TokenSwatch`. Both legacy `TokenTable.css` and live `styles.css` define default0.625rem/0.75rem and dense0.5rem/0.625rem. The review compares default against dense, not conflicting old/new definitions. Hashing orphan sources is harmless provenance, not evidence they render. | Mark unimported files as source residue and keep them out of live owner/mismatch counts. Record cleanup separately; correct the alleged value conflict. | No new category or measurement blocker. |
| F21 — Link Button zero geometry | Modify | B confirms zero inset and zero compensation. Source explicitly implements an inline-looking link variant. Removing margin does not by itself prove baseline alignment impossible: parent baseline alignment and text layout decide that. | Keep explicit zero-inset/zero-compensation variant with inline-text rationale. If the comparison page promises alignment with framed siblings, measure baseline/text position in that actual host. Do not restore row padding merely to force equal height. | Host alignment claim only; zero boundary itself is evidenced. |

## User observations constrain closure

The user's visual observations are additional acceptance evidence, not answered
by these numeric classifications:

- **Chip in a cell still appears regular:** F8 remains unfinished until the
  actual named host admits the child and renders the intended compact line.
  A temporary `.is-nested` class capture demonstrates CSS behaviour only.
- **Accordion body should align with the header label after its icon:** the
  existing header keyline is 32/24/24 while panel inline inset is16/16/12, a
  start mismatch of16/8/12. Apply the Continuation/keyline relationship to that
  panel edge and verify the real text keyline, including paragraph alignment.
  This does not require an Accordion-specific horizontal bucket. Its opposite
  edge can retain an independently appropriate container inset.
- **The vertical page's vw padding disrupts the baseline:** use the requested
  panel padding on `.spacing-audit.surface.site.is-vertical` and verify the
  wrapper's phase against the active grid. A correct component isolated inside
  an unaligned wrapper is not a valid comparison. The same check must cover
  Docs/App and the horizontal page where they make corresponding claims.
- **Comprehensiveness means the base parts from which composites are built:**
  reuse of one component on both axis pages is legitimate, but does not prove
  coverage. Reconcile foundational parts and decomposed relationships against
  real page specimens, with explicit boundaries and equivalent consumers.
  Additional atlas infrastructure is not a substitute for valid, aligned
  comparison pages and is not required by this disposition.

No final semantic file should be generated from the review's proposed numeric
count. Complete these dispositions, the user's visible behaviour requirements,
and the spec's denominator/minimisation work before preparing the mandatory
CP1 taxonomy review.
