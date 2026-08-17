# Raw owner request: rendered component quality pass

Captured verbatim on 2026-08-13:

> use playwright to inspect the items you just did. for example, article pagination has the arrow to text positioning and spacing very different from a butto nwith icon - it should use the same tokens or variables. The top navigation's bf-top-navigation-row ads a couple of pixels of pading vertically - offsetting the botto mof the component, creating an ugly line under the bottom highlights; it should have none. The logo in the top navigation is very broken - run and screenshot it in the registry. pay particular attention to how the orange container is flexible, attaches to top edge, and extends as far as needed for the circle of friends (the ubunto logogram) to align visually with the text next to the logo. the color of the tag should be the ubuntu orange, not light teal. this is work that hasbeen done by guesswork, without verification and i know you can use playwright to do a thorough qa pass. big prompt, please capture it, break it down into specs, orchestrate subagagents, leave no stone unturned. verify the job is properly done, and the componenet actually look good

Additional owner follow-up, captured verbatim on 2026-08-13:

> the tiered list in diagram-registry is also broken - the lines above headings are missing. pls checkout another worktree from the previous commit there to use for the playwright screenshot comparisson

Owner correction after the 2026-08-15 adversarial-review remediation,
captured verbatim on 2026-08-15:

> H:\WSL_dev_projects\baseline-foundry\image.png this is a bad regression - the orange tag now spans the full height of the box, this was not the case before. we have a tag of aspect ratio 1.72 roughly, and we extend it upwards to reach the top edge. the circle of friends icon inside is aligned to the text, roughly centered in the cap height. but the bottom was previously a fixed offset from the circle of friends bottom. and the icon itself still isnt centered in the tag - its  a 16px icon isnt it? are we missing the bounding box, it is slihtly moved to the left to compensate for egative space in the original logo

The referenced screenshot is preserved as
[`evidence/canonical-tag-regression.png`](evidence/canonical-tag-regression.png).
