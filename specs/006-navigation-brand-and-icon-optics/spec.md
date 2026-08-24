# Feature specification: navigation brand and icon optics

**Feature branch:** `feat/006-navigation-brand-and-icon-optics`

**Created:** 2026-08-24

**Status:** In progress

## Problem

Application drawers cannot place the existing Canonical tagged logo flush
against the panel's top and leading edges without consumer CSS. Expanded
side-navigation icons also sit optically high after the first-line baseline
alignment fix, although collapsed icons are correctly centred.

## Requirements

- **FR-001:** A panel header MUST expose an opt-in navigation-brand composition
  that removes only the header-owned padding and lets a Canonical tagged logo
  occupy the full available inline size.
- **FR-002:** The composition MUST reuse the existing 22 by 38 px Canonical tag
  and Circle of Friends contract.
- **FR-003:** Expanded icon-bearing side-navigation rows MUST lower icons by a
  shared 3 px optical offset while retaining first-line baseline alignment.
- **FR-004:** Collapsed application-navigation icons MUST remain centred in
  their compact rows and MUST NOT inherit the expanded optical offset.
- **FR-005:** Consumers MUST be able to use both contracts without local
  `.bf-*` overrides.

## Acceptance

In the BF application-layout demo, the Canonical tag meets the panel's top and
leading edges, retains 22 by 38 px geometry, and the drawer title remains
visible. A wrapped expanded label lowers its icon by the shared 3 px optical
offset while keeping it on the first line; collapsed icon rows remain centred.
