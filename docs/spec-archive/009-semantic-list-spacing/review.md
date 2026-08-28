# Review: semantic list spacing

**Status:** Released

## Contract evidence

- Generated CSS gives semantic `ul` and `ol` elements
  `var(--bf-body-margin-bottom)` under `.bf-theme`.
- `.bf-prose` retains indentation independently, and later tiered-list rules
  retain zero margin on structural `bf-tiered-list-items` containers.
- Four-tier rendered behavior measures the list inside a tiered-list copy slot
  against a paragraph and checks the structural container independently.

## Gates

- `npm test`: build validation (5,418 checks), component baselines, and rendered
  behavior passed after the specimen audit attributes were completed.
- `npm run qa:components`: captures and baseline verification passed.
- In-app browser, editorial tier at 1280 × 900: list margin after `8px`, paragraph
  margin after `8px`, structural list margin `0px`, measured list-to-rule gap
  `8px`, no horizontal overflow, and no console errors.

## Release and downstream evidence

- BF release merge: `be85d46a27d07794ec8f8057b35b557537e60a48`.
- Diagram Registry implementation: `6f7f65a`; evidence closeout: `aec3d47` on
  `feat/009-mentor-voice-and-fewer-pages`.
- Registry vendors the generated editorial CSS byte-for-byte at cache key
  `bf-be85d46` and enforces its LF-normalized SHA-256.
- Registry browser measurements at 1280 × 900 and 390 × 844: semantic list
  margin after `8px`, paragraph margin after `8px`, visible list-to-rule gap
  `8px`, and no horizontal overflow. Tiered-list headers independently measure
  their public shallow section boundary at `24px`.
- Registry validation, 3,450-word copy audit, pinned gallery check, 33 Python
  tests, 20 Node tests and the 28-check responsive browser matrix passed.
