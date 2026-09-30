# Launchpad Log in-box adversarial review

## Verdict

**GO.** Pragma commits `b5a3016e3`, `307e375ca`, and correction
`f7d80a70d` satisfy T060-T062. Independent T063 review found no remaining
P0/P1/P2 issue and authorized the status-only activation in `f863acceb`.
SideNavigation remains future.

## Accepted implementation

- `.ds.log-line.code` is the zero-border code-ledger host; raw `th`/`td`
  inherit the shared in-box pair and all five governed code longhands.
- Cells use `font-weight: inherit`, so neither component CSS nor the UA's bold
  `th` default detaches them from the code role.
- Five provider primitives moved to existing Surface/Field lanes.
- `tbody { min-width: fit-content }` was deleted. The terminal content cells
  now own the live Surface end inset, preserving logical far-edge framing and
  scroll reachability without a new minimum or formula.
- Normal and `:target` fills, sticky line numbers, optional timestamps, links,
  table semantics, wrapping, and LTR/RTL behavior remain intact.

## Adversarial corrections

The first review found that zeroing both cell block paddings could leave the
original multiple-and-delta geometry checks green. `f7d80a70d` added three
independent oracles for shared-padding consumption, absolute occupied height,
and the actual first baseline through a zero-size inline marker. A deliberate
zero-padding mutation must fail all three and restoration must pass.

The same review found a stale foundation test that still expected Log's in-box
use to fail. The correction now proves the two axes separately: Log's exact
active code-role and in-box uses pass, while an unregistered Log selector and
future navigation consumers fail.

## Reproduced evidence

- Focused Log browser matrix: 51/51 in Chromium, Firefox, and WebKit at genuine
  16px and 18px roots.
- Existing Log browser regressions: 81/81.
- Direct-entry/code-row foundation: 45/45.
- Launchpad SSR: 402/402; typography: 20/20.
- Combined scanner tests: 107/107, 272 assertions.
- Global scanner: `320 raw / 27 sanctioned / 286 transition / 7 advisory /
  0 legacy`.
- Exactly six allowlist identities were deleted: `1c3c5119`, `3a5dba8e`,
  `4fbff02c`, `55a031b6`, `68475aa8`, and `a7a0bed1`. No entry was added and
  no classification changed.
- TypeScript, package architecture, and packed-export gates passed.
- Fresh Storybook 6116 renders both intrinsic Log stories. The earlier 6115
  process retains stale Vite resolver state and is not acceptance evidence.

The package-wide formatting command still reports its pre-existing CRLF
diagnostics; scoped formatting for every changed file passes. The unrelated
MSW line-ending artifact remains untouched.
