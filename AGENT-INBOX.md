# Agent inbox – spacing buckets; BF is the sandbox worker

Date: 2026-10-21
Integration: owner-authorized local `main` merge of accepted spacing work and
review fixes; publication and pushes remain separate.

The owner reset the spacing work on 2026-10-10. The roadmap deliverables live
in the canonical spacing spec repository (Spec 024): the spacing article, the
Pragma token spec, the semantic tokens and the required all-existing-component
Pragma React token demo. Owner bucket sign-off gates completion. BF is the
sandbox where values are decided on real components. The pre-reset state of
this inbox is in git history. The owner has approved the D1 article and
illustrations, approved D2 including OS dense 0, and accepted the exact private
D3 implementation. Later production adoption and the restyle PR, publication,
Svelte/Lit parity and component visual approval remain separate.

## Owner-requested control follow-up (2026-10-22)

The Diagram Generator owner explicitly requested upstream inset focus and
visibly bordered buttons, an upstream Git source push, then downstream adoption.
Main was clean at a668f531 before this work. Current BF already supplies inset
field/select focus; the bounded repair restores the is-base button's paint-only
stroke and active feedback with zero layout border, and strengthens all-tier
focus/forced-colors/browser assertions. This source-push authorization supersedes
the earlier spacing no-push instruction for the requested latest BF checkpoint;
it does not authorize npm publication or close the remaining spacing work.
Generator Spec108 owns the downstream review package and qualification record.
Final source gates passed: npm test (19,044 static checks, 332 baseline reports,
full behavior) and qa:components (86 captures, 332 baseline reports). Forced-colors
focus specificity and the verifier''s stale initial-tier comparison are repaired.

## Current dispatch

Owner direction, October 21: review the latest BF spacing work, fix findings,
merge it into local main and consume freshly built main assets in the spacing
Pages site. This supersedes the earlier no-merge instructions for this bounded
integration. Preserve historical evidence worktrees and receipts. Review fixes
cover prose-link marker alignment, custom panel axes, desktop drawer elevation
and current architecture documentation; they do not complete the remaining
Spec 024 scope below.

The October 22 owner correction supersedes the earlier positive Chip-in-tab
construction: Chips are never tab children. Static Chips in SideNavigation
link or inert-text trailing status slots still use the generated dense member
through neutral wrappers and stop at product roots. Tabs support static Badge
indicators within their single action; Badge shares the label baseline without
growing the host. Existing selected and inward focus paint remains visible and
layout-neutral. Canonical Spec 024 `tasks.md` owns the qualified receipt and
owner sign-off.

Accepted token adoption `0521fb7` and invariant indicator fit `499ee5c` remain
preserved in history. Do not repeat adoption, Reset removal or their receipts.
Wider compound Search/Color and segmented/pagination coverage, interactive
navigation APIs, SideTab (absent in BF), Pragma work and owner visual sign-off
remain open in canonical Spec 024. This completed static placement does not
claim all Nav/Tab coverage. No push or merge.

## Three repositories, three roles

| Folder | Role | The agent there |
|---|---|---|
| `H:/WSL_dev_projects/canonical-spacing-spec` | **Orchestrator** and source of truth | Writes the bucket briefs, records owner decisions and sign-offs, requests reviews, writes the token spec and the article |
| This worktree | **Sandbox worker** | Implements each bucket brief on real BF components and builds its bucket page under `demo/spec/buckets/` |
| `H:/WSL_dev_projects/pragma`, in `.claude/worktrees/feat-spacing-bucket-preview` | **Preview worker** | Applies the same brief on Pragma's unpushed preview branch and adds a Storybook story per bucket |

## If you are the agent in this folder

You are the BF worker. Take your instructions from the BF worker prompt in
`H:/WSL_dev_projects/canonical-spacing-spec/specs/024-semantic-spacing-token-schema/buckets/README.md`
and the brief it names. Read nothing else from the spec repository.

- One commit and one bucket page per brief; reply with commit SHA, page URL
  and open questions.
- Gates: `npm run check:types` and `npm test`.
- Do not change demo chrome or composite example pages (ApplicationLayout,
  DrawerPanel, page shells) unless a bucket page cannot render.
- No evidence manifests, hash ledgers, provenance re-pins or audit work. They
  do not gate anything.
- Do not push or merge; the owner decides when.

If no brief is named yet, the orchestrator has not written the briefs. Say
so and stop.

## Still open in BF, outside the bucket work

Nothing gates the buckets. Spec 025 and the parked Spec 026 keep their entries
in `TODO.md`. The four ApplicationLayout Pin overlaps, the `source-map-js`
audit and BF Firefox/Safari coverage are dropped from the spacing work; BF may
pick them up on its own schedule.
