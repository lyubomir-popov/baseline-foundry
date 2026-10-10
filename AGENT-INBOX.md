# Agent inbox – spacing buckets; BF is the sandbox worker

Date: 2026-10-10
Branch: `feat/028-shared-spacing-decisions` (draft PR #5, unpushed commits ahead)

The owner reset the spacing work on 2026-10-10. The deliverables live in the
canonical spacing spec repository (Spec 024): the spacing article, the Pragma
token spec and the semantic tokens; the owner's Pragma restyle PR is a stretch
goal. BF is the sandbox where values are decided on real components. The
pre-reset state of this inbox is in git history.

## Three repositories, three roles

| Folder | Role | The agent there |
|---|---|---|
| `H:/WSL_dev_projects/canonical-spacing-spec-worktrees/docs-bottom-compensation-spec` | **Orchestrator** and source of truth | Writes the bucket briefs, records owner decisions and sign-offs, requests reviews, writes the token spec and the article |
| This worktree | **Sandbox worker** | Implements each bucket brief on real BF components and builds its bucket page under `demo/spec/buckets/` |
| `H:/WSL_dev_projects/pragma`, in `.claude/worktrees/feat-spacing-bucket-preview` | **Preview worker** | Applies the same brief on Pragma's unpushed preview branch and adds a Storybook story per bucket |

## If you are the agent in this folder

You are the BF worker. Take your instructions from the BF worker prompt in
`H:/WSL_dev_projects/canonical-spacing-spec-worktrees/docs-bottom-compensation-spec/specs/024-semantic-spacing-token-schema/buckets/README.md`
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
