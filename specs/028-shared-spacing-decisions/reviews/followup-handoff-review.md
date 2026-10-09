# Follow-up handoff claim review

Date: 2026-10-09  
Reviewed handoff SHA-256: `cf4a5e1fb25efe2059e171688e7102ecfb2b30c64d82bba8cc91111995917139`

## Verdict

Changes requested for one inaccurate sentence before the documentation carrier
is committed. The pins, evidence counts and hashes, gate results, N2–N5
dispositions, open-gate list and stated platform limits otherwise agree with the
sealed reports and manifests I inspected.

## H1 — The handoff states the inverse of the N1 catalog behavior

Severity: medium documentation accuracy issue.

At `reviews/opus-028-followup-review-request.md:54`, the sentence says:

> The fix yields shared navigation while that specimen is open ...

Read normally, this claims the fix provides or displays shared navigation while
the specimen is open. The implemented and independently verified behavior is the
opposite: the shared `.pc-nav` yields the viewport and has `display: none` while
the specimen drawer is expanded, then returns when the specimen closes. This
sentence is in the external review's central problem statement, so it can send
the reviewer toward the wrong expected state even though the surrounding text
and reports are accurate.

Replace it with an unambiguous statement such as:

> The fix makes shared navigation yield while that specimen is open and paints
> the shared header/footer beneath it.

No runtime, test, evidence or disposition change is needed.

## Resolution and final claim verdict

Resolved before the documentation carrier commit. The handoff now states:

> The fix hides shared catalog navigation while that specimen is open and paints
> the shared header/footer beneath it.

The corrected request hashes to
`b91395eedd5284c907cfd7f67cf6323fa385b666de86aaa2aaceb6b157220b0b`.
This wording matches the runtime and independent browser evidence. **Accept the
corrected handoff for the bounded external checkpoint.** No remaining claim
accuracy finding was identified. The request is outside the 207-file evidence
manifest, so this prose correction does not change that seal.
