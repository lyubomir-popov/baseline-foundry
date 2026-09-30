/** Reproduce the spike's read-only browser evidence. Run with Node (Bun's
 * Playwright transport hangs on this Windows environment). Output is data only.
 * No source files or component styles are modified. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const { execFileSync } = require('node:child_process');
const reference = process.env.SPACING_REFERENCE || 'H:/WSL_dev_projects/pragma/.claude/worktrees/feat-bf-shared-alignment';
const requireReference = createRequire(path.join(reference, 'packages/react/ds-global-form/package.json'));
const { chromium } = requireReference('@playwright/test');
const witnesses = JSON.parse(fs.readFileSync(path.join(__dirname, 'catalog-witnesses.json'), 'utf8'));
const ownerMaps=['global','form','app','styles'].map(name=>({name,data:JSON.parse(fs.readFileSync(path.join(__dirname,`${name}-owners.json`),'utf8'))}));
const probeKey=w=>[w.catalog,w.specimen,w.activation||'',w.outerSelector,w.markerPseudo||''].join('|');
const probeIndex=new Map(witnesses.map(w=>[probeKey(w),w.id]));
const ownerProbes=[],relationshipProbeMap=[];
for(const {name,data} of ownerMaps) for(const record of data.records){
  const witness=witnesses.find(w=>w.id===record.id);
  record.relationships.forEach((relationship,index)=>{
    const ownerSelector=relationship.ownerSelector||record.selector;
    const pseudo=ownerSelector.match(/::(before|after)$/)?.[0];
    const probe={id:`owner-probe-${ownerProbes.length+1}`,catalog:name,specimen:record.specimen,activation:witness.activation,outerSelector:pseudo?ownerSelector.replaceAll(pseudo,''):ownerSelector,...(pseudo?{markerPseudo:pseudo}:{})};
    const key=probeKey(probe);
    if(!probeIndex.has(key)){ownerProbes.push(probe);probeIndex.set(key,probe.id);}
    relationshipProbeMap.push({witnessId:record.id,relationshipIndex:index,ownerSelector,ownerPseudo:pseudo||null,probeId:probeIndex.get(key),selectorBasis:relationship.ownerSelector?'explicit source owner':'outer owner per source disposition; still reviewable'});
  });
}
const tiers = process.argv.slice(2).filter(x => ['site','docs','app'].includes(x));
const selectedTiers = tiers.length ? tiers : ['site','docs','app'];
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const sourceFiles = execFileSync('rg',['--files','packages/react','packages/styles','config'],{cwd:reference,encoding:'utf8',maxBuffer:20e6}).trim().split(/\r?\n/).filter(file=>/\.(css|tsx?|json)$/.test(file)).sort();
const sourceManifest = sourceFiles.map(file=>({path:file.replaceAll('\\','/'),sha256:hash(fs.readFileSync(path.join(reference,file)))}));
const output = { capturedAt: new Date().toISOString(), reference, referenceCommit: execFileSync('git',['rev-parse','HEAD'],{cwd:reference,encoding:'utf8'}).trim(), referenceDiffSha256: crypto.createHash('sha256').update(execFileSync('git',['diff','HEAD'],{cwd:reference,maxBuffer:30e6,stdio:['ignore','pipe','ignore']})).digest('hex'), engine: '', viewport:{width:1600,height:1000}, method:'Existing React inventory story; computed geometry on visible real component parts. Interactive states activated in sequence. No component CSS overrides.', tiers:[] };
output.relationshipProbeMap=relationshipProbeMap;
output.ownerMapSha256=Object.fromEntries(ownerMaps.map(({name})=>[name,hash(fs.readFileSync(path.join(__dirname,`${name}-owners.json`)))]));
output.provenance = {collectorSha256:hash(fs.readFileSync(__filename)),witnessSha256:hash(fs.readFileSync(path.join(__dirname,'catalog-witnesses.json'))),sourceManifestFile:'source-manifest.json',sourceManifestSha256:hash(JSON.stringify(sourceManifest)),sourceFileCount:sourceManifest.length,scope:'All non-ignored CSS/TS/TSX/JSON under reference packages/react, packages/styles and config, including untracked catalog fixtures.'};
output.limitations = ['Catalog CSS imposes sizing and pressure fixtures; no collector sizing overrides.', 'A successful witness capture is not proof that every owner or spacing-changing variant is covered.', 'Loaded font declarations do not authenticate the rendered glyph font; see separate variant evidence.', 'Padding plus a real border is an outside-edge observation, not automatically a spacing token.'];
fs.writeFileSync(path.join(__dirname,'source-manifest.json'),JSON.stringify(sourceManifest,null,2)+'\n');

async function snapshot(page, items, stage) {
  return page.evaluate(({items,stage}) => {
    const props = ['top','bottom','left','right','insetInlineStart','insetInlineEnd','insetBlockStart','insetBlockEnd','gridAutoRows','gridTemplateRows','gridTemplateColumns','gridColumn','gridRow','borderSpacing','content','display','position','boxSizing','direction','fontFamily','fontSize','lineHeight','fontWeight','paddingInlineStart','paddingInlineEnd','paddingBlockStart','paddingBlockEnd','borderInlineStartWidth','borderInlineEndWidth','borderBlockStartWidth','borderBlockEndWidth','marginInlineStart','marginInlineEnd','marginBlockStart','marginBlockEnd','columnGap','rowGap','inlineSize','blockSize','minInlineSize','minBlockSize','alignItems','alignSelf','flexDirection','flexWrap','textIndent','transform'];
    const rect = el => { const r=el.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; };
    const geometry = el => {const s=getComputedStyle(el);return {tag:el.tagName.toLowerCase(),className:el.className?.baseVal ?? el.className,style:Object.fromEntries(props.map(p=>[p,s[p]])),rect:rect(el),attributes:Object.fromEntries(['aria-selected','aria-expanded','aria-disabled','disabled','data-active','type','checked'].filter(a=>el.hasAttribute(a)).map(a=>[a,el.getAttribute(a)])),text:el.textContent?.trim().replace(/\s+/g,' ').slice(0,80),tokens:Object.fromEntries(['--spacing-baseline','--ds-inline-inset-field','--ds-inline-inset-action','--ds-inline-inset-continuation','--ds-leading-mark-canvas','--ds-leading-mark-gap','--spacing-inset-surface-inline','--spacing-inset-surface-block','--spacing-gap-field-block'].map(p=>[p,s.getPropertyValue(p).trim()]))};};
    const visible = el => { const r=el.getBoundingClientRect(),s=getComputedStyle(el); return r.width>0 && r.height>0 && s.display!=='none' && s.visibility!=='hidden' && Number(s.opacity)>0 && el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}); };
    return items.map(item=>{
      const specimen=document.querySelector(`[data-catalog-specimen="${item.specimen}"]`);
      let root=specimen;
      if(item.activation==='open-menu') root=document.querySelector('.contextual-menu__surface[role="menu"][aria-label="Catalog commands"]');
      if(item.activation==='open-submenu') root=document.querySelector('.contextual-menu__surface.submenu[role="menu"]');
      const all=root ? [...(root.matches(item.outerSelector)?[root]:[]),...root.querySelectorAll(item.outerSelector)] : [];
      const targets=all.filter(visible).map((el,index)=>{
        const result={index,...geometry(el)};
        for(const [key,selector] of Object.entries({marker:item.markerSelector,content:item.contentSelector,textTarget:item.textSelector})) {
          if(!selector) continue;
          const child=selector===':scope'?el:el.querySelector(selector);
          if(child && visible(child)) result[key]=geometry(child);
        }
        if(item.markerPseudo) {const s=getComputedStyle(el,item.markerPseudo);result.pseudo={name:item.markerPseudo,style:Object.fromEntries(props.map(p=>[p,s[p]])),content:s.content};}
        if(item.nativeRangePaint) result.nativePaintEvidence='visual-only: Chromium pseudo geometry is not independently reliable';
        return result;
      });
      return {id:item.id,catalog:item.catalog,specimen:item.specimen,selector:item.outerSelector,activation:item.activation||null,stage,matched:all.length,visible:targets.length,status:targets.length?'measured':'missing-or-hidden',targets};
    });
  },{items,stage});
}

(async()=>{
  const browser=await chromium.launch({headless:true,timeout:20000});
  output.engine=await browser.version();
  try {
    for(const tier of selectedTiers) {
      const page=await browser.newPage({viewport:output.viewport,deviceScaleFactor:1});
      page.setDefaultTimeout(6000);
      const evidence={tier,route:`http://127.0.0.1:6114/iframe.html?id=documentation-react-pilot--inventory&viewMode=story&globals=context:${tier};scheme:light;baseline:!false;baselineFoundry:!true`,pageErrors:[],activationErrors:[],measurements:[],ownerMeasurements:[]};
      page.on('pageerror',e=>evidence.pageErrors.push(e.message));
      await page.goto(evidence.route);
      await page.locator('[data-testid="react-pilot-catalog"]').waitFor({timeout:45000});
      await page.evaluate(()=>document.fonts.ready);
      evidence.fonts=await page.evaluate(()=>({status:document.fonts.status,loaded:[...document.fonts].filter(f=>f.status==='loaded').map(f=>({family:f.family,style:f.style,weight:f.weight,status:f.status})),body:getComputedStyle(document.querySelector('[data-testid="react-pilot-catalog"]')).font}));
      evidence.measurements.push(...await snapshot(page,witnesses.filter(w=>!w.activation),'default'));
      evidence.ownerMeasurements.push(...await snapshot(page,ownerProbes.filter(w=>!w.activation),'default'));
      const actions = [
        ['select-file',async()=>{await page.locator('[data-catalog-specimen="file"] input[type=file]').setInputFiles([{name:'alignment-preview.svg',mimeType:'image/svg+xml',buffer:Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"/>')},{name:'alignment-evidence.pdf',mimeType:'application/pdf',buffer:Buffer.alloc(2048)}]);await page.locator('[data-catalog-specimen="file"] .file-item').first().waitFor();}],
        ['submit-form',async()=>{await page.locator('[data-catalog-specimen="text"] form').evaluate(f=>f.requestSubmit());await page.locator('[data-catalog-specimen="text"] .field-error').waitFor();}],
        ['focus',async()=>{await page.locator('[data-catalog-specimen="skip-link"] a.ds.skip-link').focus();}],
        ['open-menu',async()=>{await page.locator('[data-catalog-specimen="contextual-menu"] button[aria-haspopup=menu]').click();await page.locator('[role=menu][aria-label="Catalog commands"]').waitFor();}],
        ['open-submenu',async()=>{const root=page.locator('[role=menu][aria-label="Catalog commands"]');await root.press('ArrowDown');await root.press('ArrowRight');await page.locator('.contextual-menu__surface.submenu').waitFor();}],
        ['open-color',async()=>{await page.keyboard.press('Escape');await page.keyboard.press('Escape');await page.locator('[data-catalog-specimen="color"] button').first().click();await page.locator('[data-catalog-specimen="color"] .color-popover').waitFor();}],
        ['open-color-focus-selected',async()=>{await page.keyboard.press('Tab');await page.locator('[data-catalog-specimen="color"] button[aria-label="#000000"]').focus();}],
        ['open-combobox',async()=>{await page.keyboard.press('Escape');const input=page.locator('[data-catalog-specimen="combobox"] input[role=combobox]');await input.fill('u');await input.press('ArrowDown');await page.locator('[data-catalog-specimen="combobox"] .combobox-list').waitFor();}]
      ];
      for(const [activation,activate] of actions) {
        try {await activate();await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));} catch(e) {evidence.activationErrors.push({activation,error:e.message.split('\n')[0]});}
        evidence.measurements.push(...await snapshot(page,witnesses.filter(w=>w.activation===activation),activation));
        evidence.ownerMeasurements.push(...await snapshot(page,ownerProbes.filter(w=>w.activation===activation),activation));
      }
      output.tiers.push(evidence);
      fs.writeFileSync(path.join(__dirname,'browser-measurements.json'),JSON.stringify(output,null,2)+'\n');
      console.log(JSON.stringify({tier,rows:evidence.measurements.length,measured:evidence.measurements.filter(x=>x.status==='measured').length,missing:evidence.measurements.filter(x=>x.status!=='measured').map(x=>x.id),ownerProbes:evidence.ownerMeasurements.length,missingOwnerProbes:evidence.ownerMeasurements.filter(x=>x.status!=='measured').map(x=>({id:x.id,selector:x.selector})),activationErrors:evidence.activationErrors}));
      await page.close();
    }
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
