# Feature specification: navigation-brand panel alignment

**Feature branch:** `feat/007-navigation-brand-panel-alignment`

**Created:** 2026-08-25

**Status:** In progress

## Problem

The application navigation brand touches the viewport's leading edge while the
opposing main content begins at the panel inset. Its title text also sits 4 px
above the first breadcrumb text, so the two product-context regions do not
share a visual baseline.

## Requirements

- **FR-001:** A navigation-brand panel header MUST retain zero block padding so
  the Canonical tag remains attached to the panel top.
- **FR-002:** The tag MUST begin at `--bf-panel-padding-inline`, matching the
  opposing panel-content inset.
- **FR-003:** The navigation-brand title MUST move down by a shared 4 px optical
  offset, closing the measured editorial-tier title/breadcrumb delta.
- **FR-004:** The 22 by 38 px tag, collapsed rail, ordinary panel headers and
  consumer no-override boundary MUST remain intact.

## Acceptance

At 1280 px in the BF application-layout fixture, the tag's leading offset
equals the panel inline padding, the tag top still equals the panel top, and
the title consumes the exact 4 px transform. The downstream editorial fixture
verifies the resulting title/breadcrumb alignment.
