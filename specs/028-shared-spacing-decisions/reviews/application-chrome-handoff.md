# Mobile prerequisite handoff and existing Opus checkpoint

The ApplicationLayout mobile prerequisite is implemented at `6f7f4683979746f1fbf96f6de77f6767560cec00` and
passes root types/full tests/component QA/provenance. Its complete
[integration findings](application-chrome-integration-review.md) and
[independent review](application-chrome-adversarial-review.md) disclose the
remaining wider-layout Pin pointer overlaps. The new evidence manifest is
`H:/WSL_dev_projects/temp/bf-028-application-chrome-20261009/application-chrome-evidence-manifest.json`,
192 files, SHA-256 `a42f3bcfcf840fddd50b536e325f2d2acc46378e1d29831f4e81c234e9a24fc5`. Earlier sealed evidence and actual local
untracked review receipts remain unchanged.

Following the [sequence audit](application-chrome-sequencing-audit.md), the
next mandatory external Opus request is the existing
[Spec 024 popup-correction request](https://github.com/lyubomir-popov/specs/blob/17ba0c431af1a18fb954b92d7cb0994db2250aec/specs/024-semantic-spacing-token-schema/opus-overlay-popup-correction-review-request.md).
That request and its evidence are unchanged. Review that diagnostic correction
and return its verdict; this handoff does not relabel this engineering review
as Opus or create another R1/ApplicationLayout external review requirement.

Owner visual decisions use the real sandbox pages at port 4176:
[ApplicationLayout](http://127.0.0.1:4176/demo/components/application-layout.html),
[vertical spacing](http://127.0.0.1:4176/demo/spec/spacing-vertical.html) and
[Tooltip](http://127.0.0.1:4176/demo/components/tooltip.html). These are local
running demos, not hosted GitHub previews. Close mobile drawers to reach shared
Before/After, tier, theme and grid controls.

T011h owner visual sign-off and N2's forced-colors outline fallback decision
remain open. The spec's execution order places token contribution after that
sign-off and Pragma work behind its planning/governing activation gates.
Equivalent governing-main activation/full-SHA repin and a green dependency
audit are still required. Neither existing draft PR may be merged through
these gates. Four persistent Pin pointer cases need follow-up before all-width
ApplicationLayout approval. No merge, release, token publication or owner
decision is recorded by this handoff.

Published worker, independent and sequence report copies normalize Markdown
whitespace only. The sealed originals retain their exact bytes and hashes.
