# Review: side-navigation icon alignment

**Status:** Released and verified downstream

## Required evidence

| Gate | Result |
|---|---|
| Wrapped label fixture | Passed; two rendered text lines at 240 px navigation width |
| Icon occupies first line box | Passed; icon center 629.59 px within first line 624.26–640.93 px |
| Collapsed row regression | Passed; row and icon centers both 303.64 px, row height 32 px |
| Generated validation | Passed; 5,396 checks |
| Responsive browser review | Passed for expanded and collapsed application-layout states |
| Registry consumer verification | Passed on `feat/008-application-left-navigation` at `33674ba` |

## Outcome

Icon-bearing side-navigation links, text rows, and accordion buttons use flex
first-baseline alignment. The 16 px icon therefore follows the first label
line instead of centering against a multi-line label block. The collapsed
application-navigation contract explicitly restores center alignment, so its
compact icon-only rows do not shift.

Focused Playwright review found the icon top at 621.59 px against a wrapped
label top at 622.93 px. The icon bottom at 637.59 px remains above the second
line top at 644.26 px. The application-layout capture showed no status-slot,
active-row, indentation, or overflow regression.

Released from `feat/005-side-navigation-icon-alignment` to BF `main` at
`8728d685a3a0aa227d760f82b36ae08acd998a5c`. Diagram Registry vendors that
immutable editorial CSS under `bf-8728d68`. Its wrapped Mermaid route measures
the icon center at 260.61 px inside the first text line 253.28–272.61 px, with
the icon ending before the second line begins. Collapsed Registry rows remain
32 px with matching icon/row centers, and the browser console is clean.
