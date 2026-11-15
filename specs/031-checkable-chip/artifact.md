# Qualified immutable checkable-Chip candidate

Packed source: `90d905323ac1c7fa54c0cdd4b07b74272d2a8ba6` on
`feat/031-checkable-chip`; independently accepted Chip product:
`08fe52c32e7e700f1bc0063d41961d39af484e58`. This lineage preserves comparison
product `2524b24`, caption repair `28422a9` and the Tab/Breadcrumb corrections.
Node 22.21.1/npm 11.19.0 normal installation/font setup, build and required
full validation preceded `npm pack --ignore-scripts`. This is a development
candidate with internal version `0.2.1`, not a registry release.

## Immutable identity and public qualification

- Local archive: `tmp/package-031/baseline-foundry-0.2.1.tgz`.
- Downstream file: `vendor/baseline-foundry/baseline-foundry-4ff2dd114dcb379f4ae6c0dca82d32136d5b047849deec605aa701bcd9bdbbd9.tgz`.
- SHA256: `4ff2dd114dcb379f4ae6c0dca82d32136d5b047849deec605aa701bcd9bdbbd9`.
- npm integrity: `sha512-aiMt+YQJpmJ77uMJIbyNUZPEphMUePVEMuLzPfNmNnG18Euq+BKOwfTjZjm1bwhtwkp/uVQU15Tfkhzdyr8vCA==`.
- Size: 640,442 bytes; 175 file entries. Preserve prior candidates unchanged.

The clean-package `release:verify` passes against this archive: 31 public root
exports and 21 assets. Its script-disabled/no-audit verification install proves
the package boundary, separately from normal consumer lifecycle/security proof.
BF's [validation](validation.md) and [independent Astra source/rendered review](review.md)
record the accepted source and full-suite evidence: 19,577 static checks,
5,506 component checks across 336 reports, 960 focused Chip cases, 1,161
comparison cases, 768 caption cases and the existing navigation/indicator
regressions. Component QA passes with 87 captures. Astra independently passes
966 Chip assertions, compares 48 direct/shared pairs and inspects fresh captures.

## Archive provenance and preserved comparison

The [consumer Astra provenance audit](../../../../portfolio/specs/001-portfolio-renewal/reviews/evidence/chip-consumption/astra/provenance.json)
compares every archive file against the built package files at packed source
`90d9053`: all 175 entries match, with no mismatch. A fresh read-only hash/entry
comparison during this documentation closeout confirms the same result before
any qualification-document edits. No product build/test suite was repeated.

Relative to the previous accepted 175-entry comparison archive, no files are
added or removed. Changed bytes comprise eight CSS bundles, the compiled Chip
CSS generator, README and two other compiled CSS modules. The latter,
`dist/css-components.js` and `dist/css-components/image-comparison.js`, differ
only by CRLF-to-LF normalization inside template literals: normalizing line
endings makes each equal. They are not byte-identical, although their CSS
semantics are unchanged. The actual downstream generated CSS diff adds only the
accepted 25-line checkable-Chip extension.

The comparison runtime `dist/image-comparison.js` is byte-identical across the
new archive, previous accepted archive, root consumer install and clean detached
consumer install, with SHA256
`cd42f2fbe49b3788e80979881a5f075a753dc24921de802ade242f18faa49478`.
Fonts, token/manifest/package metadata files and all remaining runtime modules
are byte-identical to the prior candidate. The immutable hash and lock integrity
identify this candidate; its version string alone does not.

## Completed consumer handoff and acceptance boundary

Portfolio adopts the public modifier/mark and exact package at
`75b5d6a821fbf7572d9609039f4bc0ddc0eef9a4`, retaining its filtering state/handlers,
native names/pressed semantics and semantic colors. No private paint override
or comparison-source change is introduced. [Vendor provenance](../../../../portfolio/vendor/baseline-foundry/README.md)
owns the downstream pin/integrity. The normal root and separate Git-clean
detached consumer installations pass ci/lint/build; audit reports zero
vulnerabilities. Home proof passes 529 assertions over 24 combinations, with
adapter35/stage106/focus56/endpoints778 and route/filter/history/bounded
accessibility regressions also passing.

The final [independent consumer Astra report](../../../../portfolio/specs/001-portfolio-renewal/reviews/2026-11-15-chip-consumption-astra-review.md)
exists and explicitly accepts `75b5d6a`: 95/95 independent assertions, zero
errors/page errors and eight fresh screenshot inspections. Its bounded verdict
covers actual Home filtering/keyboard/paint and preserved comparison behavior;
it is separate from the BF source/rendered verdict and supporting integrator
receipts. This completes T006's package qualification and consumer handoff.

Owner CP4, whole-site visual/reference acceptance, final media, H3/H4 disposition,
native AT speech/native 200% browser UI zoom and broader device/engine coverage
remain portfolio-owned. Emulated root size/forced colors do not replace those
checks. No merge, push, publication, deployment or owner gate clearance follows
from these technical acceptances; preserve this branch and all other worktrees.
