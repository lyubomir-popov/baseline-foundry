# Review: Sites Container-Owned Spacing

## Outcome

Spec 013 implements the owner decision as a generated contract rather than a
consumer override. Production text keeps its real-metric top nudge, uses zero
bottom padding, and carries only the complementary baseline compensation in
`margin-block-end`. Semantic separation is owned by nested stacks:

- default `bf-stack`: `--bf-section-space-shallow` (24 px in Editorial);
- `bf-stack is-section`: `--bf-section-space` (64 px in Editorial);
- `bf-stack is-flush`: zero, for explicit no-gap composition.

Owner review restored the complete token-driven density family for smaller and
larger relationships: `is-extra-dense` (4 px), `is-dense` (8 px), `is-loose`
(16 px), `is-section-shallow` (24 px), and `is-section-deep` (128 px) in
Editorial. The default remains the 24 px shallow pattern gap and `is-section`
remains the 64 px complete-pattern boundary.

Legacy `--bf-*-space-after` values remain serialized compatibility data but do
not participate in generated production geometry. The deferred 8 rem CTA
exception is not part of this package.

## Producer evidence

- Feature branch: `feat/012-sites-container-spacing`
- Worktree: `H:\WSL_dev_projects\baseline-foundry-sites-container-spacing`
- Generated producer commit: `aaee1f23880d26ac0e17108791de0210834d135e`
- `npm run build`: pass.
- `npm run test:build`: pass, 5,459 assertions.
- `npm run test:behavior`: pass. The real-browser probe checks all four built-in
  tiers, confirms positive default gaps, confirms section gaps exceed internal
  gaps, checks exact Editorial 24/64 px values, and changes
  `--bf-body-space-after` to `99rem` with no geometry change.
- Direct element and visual role-class parity remains covered by the generated
  selector-ownership and four-tier parity assertions.

The representative Editorial tiered-list browser specimen measured a 24 px
pattern gap and 24 px header-to-list separation. Its body text measured 6.56 px
top padding, 0 px bottom padding, and 1.44 px bottom margin: exactly one 8 px
baseline of metric compensation. Desktop and 360 px probes reported zero
document overflow and no console warnings or errors.

## Downstream evidence

Diagram Registry consumes the generated artifacts in an isolated worktree:

- Branch: `feat/013-sites-container-spacing-proof`
- Worktree: `H:\WSL_dev_projects\diagram-registry-sites-container-spacing`
- Commits: `5c226fd` (initial proof), `df84ba4` (intrinsic-spacing correction)
- Pinned BF commit: `aaee1f23880d26ac0e17108791de0210834d135e`
- Editorial CSS SHA-256: `4f7f3ee5710c309f465ed536c25812b29da4314272d8103b53badfe2e1afa837`
- Tokens SHA-256: `069740045de7dd4fec0f21452757be78f87a70957797b85737a6a2ee63bab163`

The Registry contract audit rejects local BF replacements and now requires
neutral list roots, a shallow default stack, a regular section stack, top
nudge plus bottom-margin compensation, and zero text bottom padding. Its full
static gate passes: contract audit, copy audit, 41 Python tests, 9 Markdown
security tests, and 2 theme tests. The existing unresolved immutable gallery
source warning remains informational and unrelated.

In-app browser measurements on `pages/visual-language.html` were exact at both
1280 px and 360 px:

| Relationship | Desktop | Narrow |
|---|---:|---:|
| hero lead to media | 24 px | 24 px |
| tiered-list header to items | 24 px | 24 px |
| hero to tiered-list pattern | 64 px | 64 px |
| tiered-list to basic-section pattern | 64 px | 64 px |
| horizontal overflow | 0 px | 0 px |

The downstream paragraph used the same 6.56/0/1.44 px compensation split and
an 8 px baseline. The responsive navigation was closed after a narrow reload,
the page remained usable, and the browser warning/error log was empty. The
reviewed spacing is block-directional, so no separate RTL geometry claim is
applicable.

## Owner-review regression corrections

Owner review found two over-broad effects from making `bf-stack` a real grid:

- `bf-basic-section-layout bf-stack` added the default 24 px row gap after its
  horizontal rule, on top of the rule's existing `calc(.5rem - 1px)` margin.
  The component's structural grid now fixes `row-gap: 0`, leaving the measured
  rule-to-header distance at exactly 7 px.
- Direct chip children were blockified grid items and therefore stretched on
  the inline axis despite `display: inline-flex`. Chips now use
  `inline-size: fit-content` and `justify-self: start`. Registry measured a
  97.49 px direct chip inside a 640 px stack and a 132.33 px chip inside a
  312.67 px content rail.

Static assertions and the four-tier browser behavior probe cover both cases.
Registry's vendored-contract audit also requires both corrections. The narrow
and wide pages retained zero inline overflow and empty warning/error logs.

## Full catalogue gate

The required closeout commands were run. `npm test` and
`npm run qa:components` both reach the legacy component baseline verifier and
fail there. The failures are concentrated in older composite specimens such as
application layout, credential validation, vertical rich list, tab section,
media object, divided section, side navigation, and the engine smoke page.
Those specimens still encode occupied-border-box expectations from the former
bottom-padding model and therefore need a separate catalogue migration to the
new margin-compensation contract.

This is not hidden by widening tolerances: the new focused geometry verifier,
all four target Sites specimens in Editorial (tiered list, basic section, hero,
and data spotlight), the generated 5,459-check contract, and the downstream
Registry gate are green. The owner can inspect the completed feature without
merging either worktree; no dirty primary checkout was changed.
