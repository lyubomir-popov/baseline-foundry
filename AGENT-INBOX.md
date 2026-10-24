# Agent inbox – spacing buckets; BF is the sandbox worker

Date: 2026-10-20
Branch: `feat/028-shared-spacing-decisions` (draft PR #5, unpushed commits ahead)

The owner reset the spacing work on 2026-10-10. The deliverables live in the
canonical spacing spec repository (Spec 024): the spacing article, the Pragma
token spec and the semantic tokens; the owner's Pragma restyle PR is a stretch
goal. BF is the sandbox where values are decided on real components. The
pre-reset state of this inbox is in git history. The owner has approved the D1
article and illustrations, approved D2 including OS dense 0, and accepted the
exact private D3 implementation. Product adoption, publication and component
visual approval remain separate.

## Current dispatch

### 2026-10-20 owner directions — dispatched once and completed

- **Spec 024 token adoption is done.** It was implemented once in the isolated
  `feat/spacing-token-adoption` worktree and accepted at exact commit
  `0521fb7054036f5048b513251f381eb69cb78ae2`. Do not start a second worker for
  this dispatch.
- **The unsupported Reset pair is removed** from the density page together
  with its Reset-context absolute-phase check. Product roots remain supported
  at page and section boundaries.
- **Every table cell remains a density placement**, whatever the table is for;
  `.bf-table :is(td, th)` remains universal.
- No push or merge without the owner.

The table-repair receipt below predates this completed dispatch. Its retained
Reset/open Reset-phase statements are superseded by the intentional Reset
removal above.

The continuation completes bounded context-comparison proof from fb403ff.
Every original specimen stays visible and in order; a plain inner table row
inside a fresh product root now independently references the retained Reset
control. Separate guide segments use declared context references, while the
original outer delta and absolute page-grid phase remain recorded. Textarea
first-line paint matches its natural plain reference in all four tiers; native
CSS baseline export is explicitly separate, and the configured viewport,
scrolling and resize remain preserved. Full tests, final focused behavior,
types and component QA pass. Canonical Spec 024 owns the final qualified
receipt. Reset-context absolute phase and mobile shared-header global-grid drift
stay open; this is not global alignment or owner bucket visual approval. Nav
remains deferred.

Use the active brief08 in the canonical workspace above, not the former
docs-bottom-compensation-spec worktree. The accepted R3 receipt permits the
bounded table-density repair. Spec024 tasks own execution and owner sign-off;
the existing D2/R4 checkpoint and OS dense 0 are approved, with no new R3
review. Generated OS table seats now bind that approved 0 inset. This does not
turn the historical Site Table/Chip proof into family/placement completion.
Compound Search/Color, segmented/pagination and Nav/Tabs remain coverage gaps.
The owner reported Nav double indentation and a flush-left tag; investigation
is deferred and must not expand this table repair. No push or merge.

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
