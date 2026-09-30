# Opus request: final Pragma shared-alignment and RichChoices review

Perform a read-only, adversarial final review of Pragma's shared-alignment
implementation, concentrating on the RichChoices correction that closes T053.
Do not trust prior GO verdicts or green counts without reproducing the smallest
sufficient evidence.

Read every applicable `AGENTS.md`, then read:

- `H:\WSL_dev_projects\baseline-foundry\AGENT-INBOX.md`
- `H:\WSL_dev_projects\baseline-foundry\docs\specs.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\spec.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\implementation-plan.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\contracts\baseline-alignment.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\tasks.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\shared-alignment-t053-junction-review.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\rich-choices-card-adversarial-review.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\table-in-box-adversarial-review.md`
- `H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\log-in-box-adversarial-review.md`

Review this implementation:

```text
repository: H:\WSL_dev_projects\pragma\.claude\worktrees\feat-bf-shared-alignment
branch:     feat/bf-shared-alignment
base:       d186c422c
tip:        a8441f45d
range:      d186c422c..a8441f45d
```

The intended RichChoices model is deliberately simple:

1. The selectable card owns border/background/radius and equal padding from
   the existing Surface block/inline inset tokens.
2. Its content column owns child gaps using the existing Field gap.
3. Normal text spans own their existing typography alignment.

It is not a single-line row, must not consume either shared row-padding family,
must not own a private alignment formula, and must not gain a target height.
Scalar string/number labels should receive one normal text span; arbitrary rich
React content should remain intact and provide its own text spans.

Do not edit implementation or spec files, commit, stage, push, merge, publish,
release, switch branches, or restart the stable demos on ports 4173, 6114,
6115 or 6116. You may write only the requested review file. Preserve the known
unrelated `mockServiceWorker.js` line-ending change.

## Required questions

1. Does production RichChoices exactly implement the three-part card model
   above, without hidden row-family consumption, border subtraction, target
   height or new spacing formula?
2. Are scalar labels wrapped exactly once and rich nodes preserved, with valid
   label markup and native input/label semantics?
3. Does the source gate reject exact definitions and real `var()` references
   to `--start-nudge` and `--end-nudge`, including aliases, nested fallbacks,
   strings beside tokens, comments, escaped function/property names, Unicode
   names, escaped punctuation and CRLF-terminated escapes?
4. Does that gate avoid false positives for strings, comments, longer names,
   `myvar`, hash/at-keyword tokens and escaped names that decode to a different
   custom property? Does it leave raw diagnostics and allowlist identities
   unchanged?
5. Do browser tests authenticate the actual Site/Docs/App tier, 16px/18px root,
   DPR, exact leading Ubuntu Sans family and a loaded real face? Does removing
   the real font rules in a disposable page make the same card assertion fail?
6. Do tests prove equal card padding, the exact existing Field gap, real text
   wrapping, unequal-content neighbors with equal heights, scalar and rich text
   leaves, RTL, keyboard focus independent of selection, a real Space selection
   transition, disabled clicks, native semantics and restored negative probes?
7. Reproduce the scanner unit result and global count. Run the focused
   component/source/SSR tests and at least the final Chromium DPR1 RichChoices
   browser suite. Expand to all engines only if evidence is inconsistent.
8. Based on the accepted earlier Table/Log/import/package/browser evidence and
   this slice, can T053, T066 and T067 remain closed? Do not reopen Table or Log
   unless this range actually regresses them.
9. Confirm that the unavailable Vanilla adapter, native zoom T012 and wider
   inventory T019 remain explicit boundaries, and that no merge, publication
   or release is authorized.

## Output

Write the review to:

`H:\WSL_dev_projects\baseline-foundry\specs\022-pragma-spacing-adoption\shared-alignment-final-opus-review.md`

Use:

1. **Verdict:** `GO`, `GO with required corrections`, or `NO-GO`.
2. **Findings:** P0/P1/P2, or `none`.
3. **Answers to questions 1-9.**
4. **Reproduced evidence and exact commands/results.**
5. **Boundaries and next authorized work.**

State explicitly whether T053, T066 and T067 can remain complete. Do not merge,
push, publish or release anything.
