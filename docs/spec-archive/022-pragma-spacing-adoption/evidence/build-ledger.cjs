/** Join source ownership and measured observations without treating either as a classifier. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const read = name => JSON.parse(fs.readFileSync(path.join(__dirname,name),'utf8'));
const catalog = read('catalog-witnesses.json');
const browser = read('browser-measurements.json');
const variants = fs.existsSync(path.join(__dirname,'variant-measurements.json'))?read('variant-measurements.json'):null;
const ownerMapNames = ['global','form','app','styles'];
const maps = ownerMapNames.map(name=>read(`${name}-owners.json`));
const ownerMapSha256=Object.fromEntries(ownerMapNames.map(name=>[name,crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,`${name}-owners.json`))).digest('hex')]));
const records = maps.flatMap(map=>map.records);
const extras = maps.flatMap(map=>map.extras || []);
const ids = new Set(records.map(row=>row.id));
const errors = [];
if(ids.size!==records.length) errors.push('Duplicate catalog disposition IDs');
if(new Set([...records,...extras].map(row=>row.id)).size!==records.length+extras.length) errors.push('Duplicate owner IDs across catalog and extra maps');
for(const row of catalog) if(!ids.has(row.id)) errors.push(`Missing disposition: ${row.id}`);
for(const row of records) if(!catalog.some(w=>w.id===row.id)) errors.push(`Unknown disposition: ${row.id}`);
const sourcePathIssues = [];
for(const row of [...records,...extras]) {
  for(const file of (row.ownerSource || '').match(/packages\/[\w./-]+\.(?:css|tsx?|json)/g) || []) {
    if(!fs.existsSync(path.join(browser.reference,file))) sourcePathIssues.push({id:row.id,file});
  }
}
const n = value => Number.parseFloat(value) || 0;
const round = value => Math.round(value*1000)/1000;
const compact = target => {
  const s=target.style;
  return {className:target.className,tag:target.tag,attributes:target.attributes,
    lineHeight:s.lineHeight,font:s.fontFamily,
    padding:[s.paddingInlineStart,s.paddingInlineEnd,s.paddingBlockStart,s.paddingBlockEnd].map(n),
    borders:[s.borderInlineStartWidth,s.borderInlineEndWidth,s.borderBlockStartWidth,s.borderBlockEndWidth].map(n),
    outside:[['paddingInlineStart','borderInlineStartWidth'],['paddingInlineEnd','borderInlineEndWidth'],['paddingBlockStart','borderBlockStartWidth'],['paddingBlockEnd','borderBlockEndWidth']].map(([a,b])=>round(n(s[a])+n(s[b]))),
    margins:[s.marginInlineStart,s.marginInlineEnd,s.marginBlockStart,s.marginBlockEnd].map(n),
    gaps:[s.columnGap,s.rowGap],direction:s.direction,
    size:[target.rect.width,target.rect.height].map(round)};
};
const measurements = new Map();
for(const tier of browser.tiers) for(const row of [...tier.measurements,...(tier.ownerMeasurements||[])]) {
  const current=measurements.get(row.id)||{};
  current[tier.tier]={status:row.status,matched:row.matched,visible:row.visible,stage:row.stage,
    targets:row.targets.map(target=>({...compact(target),pseudo:target.pseudo,children:Object.fromEntries(['content','marker','textTarget'].filter(k=>target[k]).map(k=>[k,compact(target[k])]))}))};
  measurements.set(row.id,current);
}
const rows=records.map(record=>({...record,measurements:measurements.get(record.id),closure:'Source disposition drafted; measured catalog state; variant/equivalence review pending'}));
const alias={'extra-badge-nested-variant':'badge-is-nested','extra-chip-nested-variant':'chip-is-nested','extra-markdown-editor-borderless-content':'markdown-borderless'};
const extraEvidence=extras.map(row=>({...row,measurements:Object.fromEntries((variants?.tiers||[]).map(tier=>{
  const captures=(row.capturePolicy==='source-only'?[]:[
    ...tier.ownerExtraProbes.map(capture=>({...capture,collection:'ownerExtraProbes'})),
    ...tier.captures.map(capture=>({...capture,collection:'captures'})),
  ]).filter(capture=>capture.id===row.id || capture.ownerEvidenceId===row.id || capture.id===alias[row.id]);
  return [tier.tier,{status:captures.some(c=>c.status==='measured')?'observed':'not-observed',captures:captures.map(c=>({id:c.id,collection:c.collection,status:c.status,provenance:c.provenance,selector:c.selector,elements:c.elements||[],host:c.host}))}];
}))}));
const relationships=records.flatMap(record=>record.relationships.map((relationship,index)=>{
  const probe=browser.relationshipProbeMap?.find(p=>p.witnessId===record.id && p.relationshipIndex===index);
  return {id:`${record.id}/relationship-${index+1}`,witnessId:record.id,specimen:record.specimen,disposition:record.disposition,source:record.ownerSource,...relationship,ownerSelector:probe?.ownerSelector||relationship.ownerSelector||record.selector,ownerPseudo:probe?.ownerPseudo||null,measurementRef:probe?.probeId||null,measurementStatuses:Object.fromEntries(browser.tiers.map(tier=>[tier.tier,probe?measurements.get(probe.probeId)?.[tier.tier]?.status||'missing':'no-owner-probe'])),categoryAssignment:null};
}));
const extraRelationships=extraEvidence.flatMap(record=>record.relationships.map((relationship,index)=>{
  const ownerPseudo=relationship.ownerSelector?.match(/::(before|after)$/)?.[0]||null;
  const measurementRefs=Object.fromEntries(browser.tiers.map(tier=>[tier.tier,(record.measurements[tier.tier]?.captures||[]).filter(c=>c.status==='measured').flatMap(capture=>capture.elements.flatMap((element,targetIndex)=>element.relationshipMatches?.[index]?[{artifact:'variant-measurements.json',collection:capture.collection,captureId:capture.id,targetIndex,ownerPseudo}]:[]))]));
  return {id:`${record.id}/relationship-${index+1}`,witnessId:record.id,specimen:record.specimen,disposition:record.disposition,source:record.ownerSource,...relationship,ownerSelector:relationship.ownerSelector||record.selector,ownerPseudo,measurementRefs,measurementStatuses:Object.fromEntries(Object.entries(measurementRefs).map(([tier,refs])=>[tier,refs.length?'measured':record.capturePolicy==='source-only' && record.disposition==='non-spacing-boundary'?'source-boundary-only':'missing'])),categoryAssignment:null};
}));
const counts=Object.fromEntries(maps.map((map,i)=>[ownerMapNames[i],{
  witnesses:map.records.length,dispositions:Object.fromEntries(['token-owner','supporting-evidence','non-spacing-boundary'].map(d=>[d,map.records.filter(r=>r.disposition===d).length])),extras:(map.extras||[]).length,extraRelationships:(map.extras||[]).reduce((sum,row)=>sum+row.relationships.length,0),sourceOnlyExtras:(map.extras||[]).filter(row=>row.capturePolicy==='source-only').length
}]));
const result={method:'A witness is a relationship observation, not necessarily a unique owner. Source dispositions are reviewable hypotheses. Raw values are not category assignments.',ownerMapSha256,counts,validation:{errors,sourcePathIssues},rows,ownerProbeMeasurements:Object.fromEntries([...measurements].filter(([id])=>id.startsWith('owner-probe-'))),extras:extraEvidence};
fs.writeFileSync(path.join(__dirname,'owner-ledger.json'),JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(path.join(__dirname,'relationship-ledger.json'),JSON.stringify({method:'Catalog and extra relationships have owner selectors and capture references. Measured means that owner was observed with the recorded property set, not that every declared state/branch or source formula has been validated. categoryAssignment stays null until semantic minimisation and review; source contract labels are hypotheses, not tokens.',ownerMapSha256,catalogRelationshipCount:relationships.length,extraRelationshipCount:extraRelationships.length,relationships:[...relationships,...extraRelationships]},null,2)+'\n');
const esc=s=>String(s??'').replaceAll('|','\\|').replace(/\r?\n/g,' ');
const signatures=measurement=>{
  if(!measurement) return 'missing';
  const variants=[...new Set(measurement.targets.map(t=>`H ${t.outside.slice(0,2).join('/')} V ${t.outside.slice(2).join('/')} g ${t.gaps.join('/')} m ${t.margins.join('/')}`))];
  return variants.join('; ');
};
const lines=['# Measured catalog relationship ledger','',
  'Generated by `node evidence/build-ledger.cjs`. All values are CSS pixels unless explicitly shown otherwise. **Draft ownership, not a closed taxonomy.**','',
  'H/V = outer target padding + its real border, logical start/end; g = column/row gap; m = inline-start/end/block-start/end margins. Multiple signatures preserve distinct target geometries. A border-only frame is not automatically a padded owner. Child-owned edges must use the child observations in `owner-ledger.json`, not the wrapper values shown here.','',
  'The complete JSON preserves each target, captured child, source relationship, state, class and tier. These observations supersede the old seed where they disagree. Supporting evidence still requires a proven equivalence; zero outer padding does not exclude owned gaps.','',
  '| Witness | Actual outer selector | Draft disposition | Site | Docs | App |','|---|---|---|---|---|---|'];
for(const row of rows) lines.push(`| ${esc(row.id)} | \`${esc(row.selector)}\` | ${esc(row.disposition)} | ${esc(signatures(row.measurements?.site))} | ${esc(signatures(row.measurements?.docs))} | ${esc(signatures(row.measurements?.app))} |`);
lines.push('','## Additional owners and variants','', 'Observed means a direct capture or explicitly documented variant fixture exists, not that the contract is approved. Unsupported dormant CSS and external layout boundaries may legitimately remain unobserved; each still needs its source rationale.','', '| ID | Selector | Draft disposition | Site / Docs / App | Reason |','|---|---|---|---|---|');
for(const row of extraEvidence) lines.push(`| ${esc(row.id)} | \`${esc(row.selector)}\` | ${esc(row.disposition)} | ${['site','docs','app'].map(t=>row.measurements[t]?.status||'missing').join(' / ')} | ${esc(row.reason)} |`);
fs.writeFileSync(path.join(__dirname,'measured-relationships.md'),lines.join('\n')+'\n');
console.log(JSON.stringify({counts,errors,sourcePathIssues,observations:browser.tiers.reduce((sum,t)=>sum+t.measurements.length,0),catalogRelationships:relationships.length,extraRelationships:extraRelationships.length,unmeasuredRelationships:[...relationships,...extraRelationships].filter(r=>Object.values(r.measurementStatuses).some(status=>status!=='measured')).map(r=>({id:r.id,owner:r.ownerSelector,disposition:r.disposition})),unobservedExtras:extraEvidence.filter(r=>Object.values(r.measurements).some(m=>m.status!=='observed')).map(r=>({id:r.id,disposition:r.disposition}))}));
if(errors.length || sourcePathIssues.length) process.exitCode=1;
