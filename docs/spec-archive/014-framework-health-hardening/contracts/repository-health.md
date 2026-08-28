# Contract: Repository Health

## Text policy

- Git owns tracked text normalization.
- Source, documentation, JSON, YAML, HTML, CSS, JavaScript, TypeScript and
  PowerShell are stored and checked out as LF.
- Fonts, images and packaged binary artifacts are explicitly non-text.
- Applying the policy to a semantically clean checkout produces no content diff.

## Cleanup guard

For every deletion target:

1. Resolve its exact path or ref.
2. Reject protected, active or unmerged targets.
3. For a worktree, compare the working copy semantically and reject any real
   edit.
4. Record successful ancestry and semantic checks in `review.md`.
5. Remove only the exact verified target.

## Archive evidence

- An accepted archived package has no unexplained unchecked task.
- A completed late gate receives a dated review amendment.
- A waived gate remains visibly labelled as waived with owner authority; it is
  not represented by an ordinary open implementation checkbox.
