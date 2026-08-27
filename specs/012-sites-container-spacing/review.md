# Review: Sites Container-Owned Spacing

## Outcome

Spec 012 implements the owner decision as a generated contract rather than a
consumer override. Production text keeps its real-metric top nudge, uses zero
bottom padding, and carries only the complementary baseline compensation in
`margin-block-end`. Semantic separation is owned by nested stacks:

- default `bf-stack`: `--bf-section-space-shallow` (24 px in Editorial);
- `bf-stack is-section`: `--bf-section-space` (64 px in Editorial);
- `bf-stack is-flush`: zero, for explicit no-gap composition.

Legacy `--bf-*-space-after` values remain serialized compatibility data but do
not participate in generated production geometry. The deferred 8 rem CTA
exception is not part of this package.

## Producer evidence

- Feature branch: `feat/012-sites-container-spacing`
- Worktree: `H:\WSL_dev_projects\baseline-foundry-sites-container-spacing`
- Generated producer commit: `c87eb42ff73139bbc028d62bf179a4a862077611`
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
- Commit: `5c226fd`
- Pinned BF commit: `c87eb42ff73139bbc028d62bf179a4a862077611`
- Editorial CSS SHA-256: `e8739a4c46d119eb6bc24dd3e92b5133b79dad7ee095f9437122b20877ebec45`
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
