# Checkable Chip proof

Use `/demo/components/chip.html` in the isolated branch. Test both ordinary
pressed Chips and the new checkable mode in editorial/documentation/app/OS,
direct/shared CSS, light/dark/forced colors, LTR/RTL and root16/20. Capture actual
selected/unselected/hover/keyboard-focus states, compare paint and occupied box,
and verify the decorative icon does not enter the button name or add a focus stop.
Use realistic long labels/constrained widths and actual keyboard activation.

Before closeout: `npm run check:types`, `npm test`, `npm run qa:components`.
Independent Astra must inspect fresh screenshots and actual control behavior.
Do not conflate Chrome emulation with physical devices/AT or owner visual signoff.
