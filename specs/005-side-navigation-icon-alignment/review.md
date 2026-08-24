# Review: side-navigation icon alignment

**Status:** Verified; ready for release

## Required evidence

| Gate | Result |
|---|---|
| Wrapped label fixture | Passed; two rendered text lines at 240 px navigation width |
| Icon occupies first line box | Passed; icon center 629.59 px within first line 624.26–640.93 px |
| Collapsed row regression | Passed; row and icon centers both 303.64 px, row height 32 px |
| Generated validation | Passed; 5,396 checks |
| Responsive browser review | Passed for expanded and collapsed application-layout states |
| Registry consumer verification | Pending |

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
