# Quickstart

Use the package-declared npm release:

```powershell
npx --yes npm@11.19.0 run setup:demo-font
npx --yes npm@11.19.0 run build
npx --yes npm@11.19.0 run test:build
npx --yes npm@11.19.0 run test:behavior
npx --yes npm@11.19.0 run test:components
npx --yes npm@11.19.0 run qa:components
```

Review `/demo/components/alignment-grid.html` in light/dark and all four tier
options. Confirm 58px intrinsic geometry at the default root, clear hover,
pressed, and keyboard-focus states, LTR/RTL Arrow behavior, and no overflow.

Review `/demo/components/application-layout.html` at 1024px and 1200px. The
wide-workspace specimen must use fixed drawer/overlay geometry at 1024px and
persistent navigation at the 75rem boundary, with matching aria state.

At 1440px, toggle `is-navigation-drawer-forced` on the specimen's
`bf-application`. It must immediately return to fixed drawer/overlay geometry;
opening must move focus into the drawer, Escape must close it, and removing the
modifier must restore persistent geometry and accessibility state.

Open both an application navigation drawer and a panel drawer from a toggle
inside a contextual-menu-like container, with each toggle declaring
`data-bf-focus-return` for a persistent button. Hide the toggle container after
activation. Escape, explicit Close, and overlay dismissal must each restore the
persistent button; removing the attribute or using an unresolved ID must retain
the trigger fallback.

At a desktop viewport, force application navigation into drawer mode and add
`is-collapsed` to a pinned application aside while the shell has fixed viewport
height. The aside must compute to `display: none` with a zero rect, the main
surface must retain positive height, `elementsFromPoint()` at a main command
must include that command, and a real pointer click must open its BF drawer.
