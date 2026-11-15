# Verified immutable comparison candidate

Packed from clean `f99b319` on `feat/030-image-comparison`; product source is
reviewed `2524b24`. Node 22.21.1/npm 11.19.0, explicit successful build/full tests/
QA followed by `npm pack --ignore-scripts`. No registry publication or merge.

- File: `baseline-foundry-0.2.1.tgz` (content-addressed downstream).
- SHA256: `7561a221347ea4f8953e331ae89fce48e9cfad12b951f671e0379b2380f29277`.
- Integrity: `sha512-ad4XMSlSNaA8xE3XzNAo5f7Djh5TmEQI8kUaob6qFhWO/GM2u7A+Z+ffaGkYS7wqjU0Vp0IWmPkayiZe56Dyig==`.
- 638,382 bytes; 175 entries; internal version 0.2.1 identifies no registry release.

The existing clean-package verifier first rejected its obsolete 30-export
expectation. The narrow correction expects 31 and explicitly checks public
setupImageComparison. Re-running against this exact tarball passes: 31 root
exports, 21 assets. That verifier's script-disabled/no-audit install is package
qualification, not normal consumer lifecycle or security proof. The script is
not packaged, so its correction changes no candidate bytes.

[Astra's packaging addendum](review.md) independently checks hash/integrity, every
packaged file against accepted output, exported targets and absence of private
source/demo/spec paths. Portfolio `399eba8` then pins the immutable file and
uses public runtime/build exports; root and detached consumer normal ci/lint/
build succeed with zero audit findings and clean regenerated tracked output.
Adapter final acceptance remains portfolio-owned, separately from BF's source/
package acceptance. Current owner CP4 and visual/media/AT/zoom/heading decisions
are not cleared by this candidate.
