/**
 * Capture variant-only browser evidence from the existing React pilot catalog.
 *
 * Run with Node, not Bun: Bun's Playwright transport hangs on this Windows
 * environment. The only mutations below are temporary DOM fixture mutations;
 * every mutation is restored before the next capture and no source/CSS file is
 * written. The generated JSON makes that distinction explicit.
 */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { createRequire } = require("node:module");
const { execFileSync } = require("node:child_process");

const reference =
	process.env.SPACING_REFERENCE ||
	"H:/WSL_dev_projects/pragma/.claude/worktrees/feat-bf-shared-alignment";
const requireReference = createRequire(
	path.join(reference, "packages/react/ds-global-form/package.json"),
);
const { chromium } = requireReference("@playwright/test");
const tiers = process.argv
	.slice(2)
	.filter((tier) => ["site", "docs", "app"].includes(tier));
const selectedTiers = tiers.length ? tiers : ["site", "docs", "app"];
const outputPath = path.join(__dirname, "variant-measurements.json");
const screenshotDirectory = path.join(__dirname, "variant-screenshots");

function ownerArtifact(filename) {
	try {
		const artifact = JSON.parse(
			fs.readFileSync(path.join(__dirname, filename), "utf8"),
		);
		return {
			status: "loaded",
			records: artifact.records?.length ?? 0,
			extras: artifact.extras?.length ?? 0,
			structuredVariantFields: [
				...(artifact.records || []),
				...(artifact.extras || []),
			]
				.filter((record) => record.variants || record.additionalOwners)
				.map((record) => record.id),
		};
	} catch (error) {
		return {
			status: "unavailable",
			reason:
				error.code === "ENOENT"
					? "Artifact was not present when this collector ran."
					: error.message,
		};
	}
}

const ownerMapNames = ['global','form','app','styles'];
const ownerExtraProbes = ownerMapNames.map(name=>`${name}-owners.json`).flatMap(filename => {
  const artifact = JSON.parse(fs.readFileSync(path.join(__dirname, filename), "utf8"));
  return (artifact.extras || []).filter(row=>row.capturePolicy!=='source-only').map(row => [filename, row.id, `[data-catalog-specimen="${row.specimen}"] ${row.selector}`, row.activation || "default"]);
});
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const sourceManifest=JSON.parse(fs.readFileSync(path.join(__dirname,'source-manifest.json'),'utf8'));
const provenance={collectorSha256:digest(fs.readFileSync(__filename)),ownerMapSha256:Object.fromEntries(ownerMapNames.map(name=>[name,digest(fs.readFileSync(path.join(__dirname,`${name}-owners.json`)))])),sourceManifestSha256:digest(JSON.stringify(sourceManifest)),sourceMismatch:sourceManifest.filter(row=>!fs.existsSync(path.join(reference,row.path)) || digest(fs.readFileSync(path.join(reference,row.path)))!==row.sha256).map(row=>row.path)};
const output = {
	provenance,
	capturedAt: new Date().toISOString(),
	reference,
	referenceCommit: execFileSync("git", ["rev-parse", "HEAD"], {
		cwd: reference,
		encoding: "utf8",
	}).trim(),
	referenceDiffSha256: crypto
		.createHash("sha256")
		.update(
			execFileSync("git", ["diff", "HEAD"], {
				cwd: reference,
				maxBuffer: 30e6,
				stdio: ["ignore", "pipe", "ignore"],
			}),
		)
		.digest("hex"),
	viewport: { width: 1600, height: 1000 },
	method:
		"Existing Site/Docs/App React pilot inventory. Computed styles and geometry are read from real rendered components. Variant states marked fixture-mutation temporarily alter only live DOM classes or placement and are restored in the same evaluate call; they are not supported public APIs.",
	ownerArtifactInventory: Object.fromEntries(
		ownerMapNames.map(name=>`${name}-owners.json`).map(
			(filename) => [filename, ownerArtifact(filename)],
		),
	),
	directProbeStatus:
		"Each owner extra below is queried without mutation first. A missing result means that exact state is absent from the current inventory; it does not claim the CSS owner is absent. The requested temporary fixture states are captured separately.",
	sourceFixtureModifications: [
		{
			id: "badge-is-nested",
			exactMutation:
				"Add is-nested to the existing catalog .ds.badge, measure, then restore its original class attribute.",
			kind: "temporary live-DOM fixture mutation; not a Badge API",
		},
		{
			id: "chip-is-nested",
			exactMutation:
				"Add is-nested to the existing catalog .ds.chip, measure, then restore its original class attribute.",
			kind: "temporary live-DOM fixture mutation; not a Chip API",
		},
		{
			id: "badge/chip-nested-real-cell",
			exactMutation:
				"Move an existing Badge or Chip with is-nested into a real TokenTable td, measure child and host, then restore original placement and class. This tests inherited line geometry, not approval of that host.",
			kind: "temporary live-DOM fixture mutation; not a TokenTable API",
		},
		{
			id: "markdown-borderless",
			exactMutation:
				"Remove bordered from the existing catalog .ds.markdown-editor, measure its existing .editor-content, then restore its original class attribute.",
			kind: "temporary live-DOM fixture mutation; not a MarkdownEditor API",
		},
	],
	tiers: [],
};

function route(tier) {
	return `http://127.0.0.1:6114/iframe.html?id=documentation-react-pilot--inventory&viewMode=story&globals=context:${tier};scheme:light;baseline:!false;baselineFoundry:!true`;
}

async function platformFonts(page, selector) {
	const client = await page.context().newCDPSession(page);
	try {
		await client.send("DOM.enable");
		await client.send("CSS.enable");
		const document = await client.send("DOM.getDocument");
		const result = await client.send("DOM.querySelector", {
			nodeId: document.root.nodeId,
			selector,
		});
		if (!result.nodeId) return { selector, status: "missing" };
		return {
			selector,
			status: "measured",
			fonts: (
				await client.send("CSS.getPlatformFontsForNode", {
					nodeId: result.nodeId,
				})
			).fonts,
		};
	} catch (error) {
		return { selector, status: "error", error: error.message };
	} finally {
		await client.detach();
	}
}

async function capture(page, id, selector, provenance, extra = {}) {
  const aliases={'badge-is-nested':'extra-badge-nested-variant','chip-is-nested':'extra-chip-nested-variant','markdown-borderless':'extra-markdown-editor-borderless-content'};
  const ownerId=extra.ownerEvidenceId || aliases[id] || id;
  const owners=ownerMapNames.flatMap(name=>JSON.parse(fs.readFileSync(path.join(__dirname,`${name}-owners.json`),'utf8')).extras || []);
  const owner=owners.find(row=>row.id===ownerId);
  if(owner) extra={...extra,ownerEvidenceId:ownerId,captureVisibility:owner.captureVisibility||'positive-area-owner',ownerRelationships:owner.relationships.map((r,index)=>({index,ownerSelector:r.ownerSelector||owner.selector}))};
  return page.evaluate(({selector,id,provenance,extra}) => {
    const all = [...document.querySelectorAll(selector)];
    const visible = all.filter(el => { const r=el.getBoundingClientRect(); const widthVisible=r.width>0 || (extra.captureVisibility==='zero-inline-size-owner' && r.width===0); return widthVisible && r.height>0 && el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}); });
    const fields = ["top","bottom","left","right","insetInlineStart","insetInlineEnd","insetBlockStart","insetBlockEnd","gridAutoRows","gridTemplateRows","gridTemplateColumns","gridColumn","gridRow","translate","transform","content","display","position","direction","boxSizing","fontFamily","fontSize","lineHeight","paddingInlineStart","paddingInlineEnd","paddingBlockStart","paddingBlockEnd","marginInlineStart","marginInlineEnd","marginBlockStart","marginBlockEnd","marginLeft","marginRight","marginBottom","borderInlineStartWidth","borderInlineEndWidth","borderBlockStartWidth","borderBlockEndWidth","borderSpacing","borderCollapse","gap","columnGap","rowGap","inlineSize","blockSize","minInlineSize","minBlockSize"];
    const geometry = el => { const style=getComputedStyle(el),r=el.getBoundingClientRect(); return {tag:el.tagName.toLowerCase(),className:el.getAttribute("class"),text:el.textContent.trim().replace(/\s+/g," ").slice(0,160),rect:{x:r.x,y:r.y,width:r.width,height:r.height},style:Object.fromEntries(fields.map(field=>[field,style[field]])),relationshipMatches:Object.fromEntries((extra.ownerRelationships||[]).map(rel=>[rel.index,el.matches(rel.ownerSelector.replaceAll('::before','').replaceAll('::after',''))])),pseudos:Object.fromEntries(['::before','::after'].map(pseudo=>{const s=getComputedStyle(el,pseudo);return [pseudo,Object.fromEntries(fields.map(field=>[field,s[field]]))];}))}; };
    return {id,selector,provenance,status:visible.length?"measured":"missing-or-hidden",matched:all.length,visible:visible.length,
      missingReason:visible.length?undefined:"No visible match in this activated fixture state.",
      element:visible[0]?geometry(visible[0]):undefined,elements:visible.map(geometry),
      host:extra.hostProbe && visible[0]?.parentElement ? geometry(visible[0].parentElement):undefined,...extra};
  },{selector,id,provenance,extra});
}
async function mutateAndCapture(
	page,
	id,
	selector,
	provenance,
	mutation,
	mutate,
) {
	const preparation = await page.evaluate(mutate);
	if (!preparation.ok)
		return {
			id,
			selector,
			provenance,
			status: "missing",
			missingReason: preparation.reason,
			fixtureMutation: mutation,
		};
	try {
		return await capture(page, id, selector, provenance, {
			fixtureMutation: mutation,
		});
	} finally {
		await page.evaluate(
			({ restore }) => {
				const state = window.__pragmaVariantState;
				if (!state?.[restore]) return;
				state[restore]();
				delete state[restore];
			},
			{ restore: id },
		);
	}
}

async function screenshot(page, tier, name, selector, screenshots) {
	const locator = page.locator(selector).first();
	if (!(await locator.count())) return;
	fs.mkdirSync(screenshotDirectory, { recursive: true });
	const relative = path
		.join("variant-screenshots", `${tier}-${name}.png`)
		.replace(/\\/g, "/");
	await locator.screenshot({ path: path.join(__dirname, relative) });
	screenshots.push(relative);
}

(async () => {
	const browser = await chromium.launch({ headless: true, timeout: 20_000 });
	output.engine = await browser.version();
	try {
		for (const tier of selectedTiers) {
			const page = await browser.newPage({
				viewport: output.viewport,
				deviceScaleFactor: 1,
			});
			page.setDefaultTimeout(10_000);
			await page.addInitScript(()=>performance.setResourceTimingBufferSize(10000));
			const evidence = {
				tier,
				route: route(tier),
				pageErrors: [],
				captures: [],
				ownerExtraProbes: [],
				screenshots: [],
				fonts: [],
			};
			page.on("pageerror", (error) => evidence.pageErrors.push(error.message));
			await page.goto(evidence.route);
			await page
				.locator("[data-testid='react-pilot-catalog']")
				.waitFor({ timeout: 45_000 });
			await page.evaluate(() => document.fonts.ready);

			evidence.fonts.push(
				await platformFonts(
					page,
					"[data-catalog-specimen='description-section'] .payload p",
				),
			);
			evidence.fonts.push(
				await platformFonts(
					page,
					"[data-catalog-specimen='icon-inline-code'] code",
				),
			);
			// Activate only the extra's documented state; do not count a hidden match.
			await page.locator('[data-catalog-specimen="file"] input[type=file]').setInputFiles([
				{name:'spacing.svg',mimeType:'image/svg+xml',buffer:Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"/>')},
				{name:'spacing.pdf',mimeType:'application/pdf',buffer:Buffer.alloc(2048)}
			]);
			for (const [ownerArtifactFile, ownerId, selector, activation] of ownerExtraProbes) {
				let restoreActivatedFixture;
				if (activation && /hover/.test(activation)) {
					const row=page.locator('[data-catalog-specimen="git-diff"] .ds.diff-line.interactive:not(.diff-line-hunk)').first();
					if(await row.count()) await row.hover();
				}
				if (activation && /preview containing (fenced code|task-list checkboxes)/.test(activation)) {
					const specimen=page.locator('[data-catalog-specimen="markdown-editor"]');
					const editor=specimen.locator('textarea').first();
					const before=await editor.inputValue();
					const taskList=activation.includes('task-list');
					await editor.fill(taskList?'- [x] Completed task\n- [ ] Pending task':'```js\nconst spacing = "foundational";\n```');
					await specimen.getByRole('tab',{name:'Preview'}).click();
					await specimen.locator(taskList?'ul.contains-task-list input[type="checkbox"]':'pre code.hljs').first().waitFor();
					restoreActivatedFixture=async()=>{
						await specimen.getByRole('tab',{name:'Write'}).click();
						await editor.fill(before);
					};
				}
				try {
					evidence.ownerExtraProbes.push(
						await capture(
							page,
							`direct-probe:${ownerId}`,
							selector,
							"actual inventory; public interaction activated where requested",
							{
								ownerEvidenceId: ownerId,
								ownerArtifact: ownerArtifactFile,
								activation,
								probeStatus: "direct; no DOM/class fixture mutation",
							},
						),
					);
				} finally {
					await restoreActivatedFixture?.();
				}
			}
			for (const kind of ['badge','chip']) {
				const selector=`[data-spacing-host-probe="${kind}"]`;
				const prepared=await page.evaluate(kind=>{
					const el=document.querySelector(`[data-catalog-specimen="${kind}"] .ds.${kind}`);
					const host=document.querySelector('[data-catalog-specimen="tokens"] .grid tbody tr.row td:nth-child(2)');
					if(!el || !host) return false;
					const parent=el.parentNode,next=el.nextSibling,cls=el.getAttribute('class');
					window.__pragmaHostRestore=()=>{parent.insertBefore(el,next);el.setAttribute('class',cls);el.removeAttribute('data-spacing-host-probe');};
					el.classList.add('is-nested');el.setAttribute('data-spacing-host-probe',kind);host.appendChild(el);return true;
				},kind);
				try { evidence.captures.push(await capture(page,`${kind}-nested-real-cell`,selector,'fixture mutation: existing nested component moved into actual TokenTable td; not an approved host-fit contract',{hostProbe:true,prepared})); }
				finally {await page.evaluate(()=>{window.__pragmaHostRestore?.();delete window.__pragmaHostRestore;});}
			}
			// Compare the same icon Button in both directions, not different controls.
			const fixtureCases=[
				{ id:'extra-select-multiple-no-artwork-variant',base:'[data-catalog-specimen="select"] select.ds.input.select',setAttribute:['multiple',''],description:'native multiple attribute on existing Select; tests CSS/native geometry only'},
				{ id:'extra-section-hero',base:'[data-catalog-specimen="section"] .ds.section',className:'ds section hero',description:'existing Section temporarily takes hero class'},
				{ id:'extra-section-deep-unbordered',base:'[data-catalog-specimen="section"] .ds.section',className:'ds section deep',description:'existing Section temporarily takes deep unbordered class'},
				...['bottom','left','right'].map(placement=>({id:`extra-tooltip-caret-other-placements:${placement}`,base:'[data-catalog-specimen="tooltip"] .ds.tooltip',className:`ds tooltip contrasted ${placement}`,description:`existing Tooltip ${placement} CSS paint state; no positioning-engine assertion`}))
			];
			for(const state of fixtureCases){
				const before=await page.locator(state.base).first().evaluate((el,state)=>{
					const before={className:el.getAttribute('class'),attribute:state.setAttribute?el.getAttribute(state.setAttribute[0]):null};
					if(state.className)el.setAttribute('class',state.className);
					if(state.setAttribute)el.setAttribute(...state.setAttribute);
					return before;
				},state);
				try{evidence.captures.push(await capture(page,state.id,state.base,`temporary fixture mutation: ${state.description}`,{ownerEvidenceId:state.id.split(':')[0]}));}
				finally{await page.locator(state.base).first().evaluate((el,{before,state})=>{
					el.setAttribute('class',before.className);
					if(state.setAttribute)before.attribute===null?el.removeAttribute(state.setAttribute[0]):el.setAttribute(state.setAttribute[0],before.attribute);
				},{before,state});}
			}
			const tokenSearch=page.locator('[data-catalog-specimen="tokens"] .token-table .search');
			if(await tokenSearch.count()){
				const prior=await tokenSearch.inputValue();
				try{await tokenSearch.fill('no-spacing-token-matches-this-probe');evidence.captures.push(await capture(page,'extra-token-table-empty-inset','[data-catalog-specimen="tokens"] .token-table .empty','actual TokenTable search interaction; restored',{ownerEvidenceId:'extra-token-table-empty-inset'}));}
				finally{await tokenSearch.fill(prior);}
			}
			// Mount actual exported components for prop-dependent owner graphs that
			// cannot be represented faithfully by toggling an existing CSS class.
			for(const fixture of [
				{id:'extra-color-inline-hex-row-variant',specimen:'color',file:'packages/react/ds-global-form/src/lib/subcomponent/ColorInput/ColorInput.tsx',exportName:'ColorInput',props:{id:'spacing-inline-color',swatches:[],value:'#000000'},selector:'.ds.input.color.inline > .hex-input-row'},
				{id:'extra-markdown-editor-preview-switch',specimen:'markdown-editor',file:'packages/react/ds-app-launchpad/src/lib/MarkdownEditor/MarkdownEditor.tsx',exportName:'default',props:{id:'spacing-preview-editor',previewSwitchMode:'checkbox',defaultValue:'Spacing probe'},selector:'.ds.markdown-editor > .top-bar > .preview-switch'},
				{id:'extra-git-diff-comment-icon',specimen:'git-diff',file:'packages/react/ds-app-launchpad/src/lib/GitDiffViewer/index.ts',exportName:'GitDiffViewer',props:{diff:{oldPath:'probe.txt',newPath:'probe.txt',fileChangeState:'modified',hunks:[{header:'@@ -1 +1 @@',positions:{old:{start:1,end:1},new:{start:1,end:1},diff:{start:1,end:1}},lines:[{type:'context',content:'Spacing probe'}]}]}},selector:'.ds.diff-line.interactive:not(.diff-line-hunk) .comment-icon',kind:'interactive-diff'}
			]){
				try{
					await page.evaluate(async ({fixture,reference})=>{
						const resources=performance.getEntriesByType('resource').map(r=>r.name);
						const reactUrl=resources.find(url=>/\/react\.js\?/.test(url));
						const domUrl='/@id/react-dom/client';
						if(!reactUrl)throw new Error('Loaded React runtime URL not found');
						const React=(await import(reactUrl)).default;
						const dom=await import(domUrl),component=await import(`/@fs/${reference}/${fixture.file}`);
						const mount=document.createElement('div');mount.dataset.spacingExtraFixture=fixture.id;
						document.querySelector(`[data-catalog-specimen="${fixture.specimen}"] .react-pilot-catalog__stage`).appendChild(mount);
						const root=(dom.createRoot || dom.default.createRoot)(mount);
						window.__pragmaMountedFixture={root,mount};
						const child=fixture.kind==='interactive-diff'?React.createElement(component[fixture.exportName].CodeDiffViewer,{onLineClick:()=>{}}):undefined;
						root.render(React.createElement(component[fixture.exportName],fixture.props,child));
						await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
					},{fixture,reference});
					if(fixture.kind==='interactive-diff')await page.locator(`[data-spacing-extra-fixture="${fixture.id}"] .ds.diff-line.interactive:not(.diff-line-hunk)`).hover();
					evidence.captures.push(await capture(page,fixture.id,`[data-spacing-extra-fixture="${fixture.id}"] ${fixture.selector}`,'real exported React component mounted with public props; ephemeral fixture',{ownerEvidenceId:fixture.id,publicProps:fixture.props}));
				}catch(error){evidence.captures.push({id:fixture.id,status:'missing',error:error.message});}
				finally{await page.evaluate(()=>{window.__pragmaMountedFixture?.root.unmount();window.__pragmaMountedFixture?.mount.remove();delete window.__pragmaMountedFixture;});}
			}
			// Compare the same icon Button in both directions, not different controls.
			const rtlSelector='[data-catalog-specimen="button"] .ds.button:has(> .icon)';
			evidence.captures.push(await capture(page,'icon-button-ltr',rtlSelector,'actual catalog'));
			const oldDir=await page.locator(rtlSelector).getAttribute('dir');
			try {
				await page.locator(rtlSelector).evaluate(el=>el.setAttribute('dir','rtl'));
				evidence.captures.push(await capture(page,'icon-button-rtl',rtlSelector,'temporary dir=rtl on same real icon Button'));
			} finally {await page.locator(rtlSelector).evaluate((el,oldDir)=>oldDir===null?el.removeAttribute('dir'):el.setAttribute('dir',oldDir),oldDir);}

			evidence.captures.push(
				await capture(
					page,
					"button-link-catalog",
					"[data-catalog-specimen='button'] .ds.button.link",
					"actual catalog state; no mutation",
					{ ownerEvidenceId: "extra-button-link-variant" },
				),
			);
			evidence.captures.push(
				await capture(
					page,
					"rtl-phone-input",
					"[data-catalog-specimen='phone'] .ds.input.phone",
					"actual catalog RTL state; logical padding comparison",
				),
			);
			evidence.captures.push(
				await capture(
					page,
					"ltr-text-input",
					"[data-catalog-specimen='text'] .ds.input.text",
					"actual catalog LTR counterpart; logical padding comparison",
				),
			);

			evidence.captures.push(
				await mutateAndCapture(
					page,
					"badge-is-nested",
					"[data-catalog-specimen='badge'] .ds.badge.is-nested",
					"fixture mutation only",
					"add is-nested and restore original class",
					() => {
						const el = document.querySelector(
							"[data-catalog-specimen='badge'] .ds.badge",
						);
						if (!el)
							return { ok: false, reason: "Catalog Badge was not available." };
						const before = el.getAttribute("class");
						window.__pragmaVariantState ||= {};
						window.__pragmaVariantState["badge-is-nested"] = () =>
							el.setAttribute("class", before);
						el.classList.add("is-nested");
						return { ok: true };
					},
				),
			);

			evidence.captures.push(
				await mutateAndCapture(
					page,
					"chip-is-nested",
					"[data-catalog-specimen='chip'] .ds.chip.is-nested",
					"fixture mutation only",
					"add is-nested and restore original class",
					() => {
						const el = document.querySelector(
							"[data-catalog-specimen='chip'] .ds.chip",
						);
						if (!el)
							return { ok: false, reason: "Catalog Chip was not available." };
						const before = el.getAttribute("class");
						window.__pragmaVariantState ||= {};
						window.__pragmaVariantState["chip-is-nested"] = () =>
							el.setAttribute("class", before);
						el.classList.add("is-nested");
						return { ok: true };
					},
				),
			);

			evidence.captures.push(
				await mutateAndCapture(
					page,
					"markdown-borderless",
					"[data-catalog-specimen='markdown-editor'] .ds.markdown-editor > textarea.ds-framed-box.editor-content",
					"fixture mutation only",
					"remove bordered and restore original class",
					() => {
						const editor = document.querySelector(
							"[data-catalog-specimen='markdown-editor'] .ds.markdown-editor.bordered",
						);
						if (!editor)
							return {
								ok: false,
								reason: "Bordered MarkdownEditor was not available.",
							};
						const before = editor.getAttribute("class");
						window.__pragmaVariantState ||= {};
						window.__pragmaVariantState["markdown-borderless"] = () =>
							editor.setAttribute("class", before);
						editor.classList.remove("bordered");
						return { ok: true };
					},
				),
			);

			await screenshot(
				page,
				tier,
				"card",
				"[data-catalog-specimen='card']",
				evidence.screenshots,
			);
			await screenshot(
				page,
				tier,
				"chip-badge",
				"[data-catalog-specimen='chip']",
				evidence.screenshots,
			);
			await screenshot(
				page,
				tier,
				"markdown",
				"[data-catalog-specimen='markdown-editor']",
				evidence.screenshots,
			);
			output.tiers.push(evidence);
			fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
			console.log(
				JSON.stringify({
					tier,
					measured: evidence.captures.filter(
						(capture) => capture.status === "measured",
					).length,
					missing: evidence.captures
						.filter((capture) => capture.status !== "measured")
						.map((capture) => capture.id),
				}),
			);
			await page.close();
		}
	} finally {
		await browser.close();
	}
})().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
