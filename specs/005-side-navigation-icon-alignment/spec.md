# Feature specification: side-navigation icon alignment

**Feature branch:** `feat/005-side-navigation-icon-alignment`

**Created:** 2026-08-24

**Status:** In progress

## Problem

Icon-bearing side-navigation links vertically center their icon against the
entire label block. When a label wraps, the icon falls between text lines
instead of identifying the first line.

## Requirements

- **FR-001:** In an icon-bearing side-navigation row, the icon MUST align to
  the first text-line baseline.
- **FR-002:** A label wrapping to two or more lines MUST NOT move the icon
  between lines or vertically center it against the complete label block.
- **FR-003:** Single-line rows, compact collapsed rows, nested indentation,
  status slots, active treatment, and accessible names MUST remain intact.
- **FR-004:** The contract MUST be implemented and released in Baseline
  Foundry; consumers MUST NOT add `.bf-*` overrides.

## Acceptance

At an expanded 240 px application navigation width, a deliberately wrapped
icon label exposes at least two line rectangles and the 16 px icon occupies the
first line box. Collapsed rows remain 32 px and accessible by link name.
