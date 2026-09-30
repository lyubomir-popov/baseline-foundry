/** Structural/provenance checks only; not a semantic category approval. */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const assert=require('node:assert/strict');
const read=name=>JSON.parse(fs.readFileSync(path.join(__dirname,name),'utf8'));
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const catalog=read('catalog-witnesses.json'),browser=read('browser-measurements.json');
const variants=read('variant-measurements.json'),ledger=read('relationship-ledger.json');
const owners=read('owner-ledger.json');
const sourceManifest=read('source-manifest.json');
const pageReconciliation=read('page-witness-reconciliation.json');
const structureOnly=process.argv.includes('--structure-only');
const ownerMapNames=['global','form','app','styles'];
const ownerMaps=ownerMapNames.map(name=>read(`${name}-owners.json`));
const sourceRecords=ownerMaps.flatMap(map=>map.records);
const sourceExtras=ownerMaps.flatMap(map=>map.extras||[]);
const allSourceOwners=[...sourceRecords,...sourceExtras];
assert.equal(new Set(allSourceOwners.map(row=>row.id)).size,allSourceOwners.length,'Duplicate source owner IDs');
assert.deepEqual(owners.rows.map(row=>row.id),sourceRecords.map(row=>row.id),'Stale catalog owner ledger');
assert.deepEqual(owners.extras.map(row=>row.id),sourceExtras.map(row=>row.id),'Stale extra owner ledger');
assert.equal(ledger.catalogRelationshipCount,sourceRecords.reduce((sum,row)=>sum+row.relationships.length,0));
assert.equal(ledger.extraRelationshipCount,sourceExtras.reduce((sum,row)=>sum+row.relationships.length,0));
assert.equal(new Set(ledger.relationships.map(row=>row.id)).size,ledger.relationships.length,'Duplicate relationship IDs');
assert.equal(new Set(catalog.map(r=>r.id)).size,catalog.length);
assert.deepEqual([...catalog.map(row=>row.id)].sort(),[...sourceRecords.map(row=>row.id)].sort(),'Catalog and source owner identities differ');
// Resolve the current authored TypeScript registry with the repository's Bun
// runner. The saved capture catalog alone cannot detect a newly added page part.
const pageRegistryScript=`
  const m=await import(${JSON.stringify('./'+pageReconciliation.referenceModule)});
  const witnesses=[...new Map(m.REACT_ALIGNMENT_FAMILIES.flatMap(f=>['horizontal','vertical'].flatMap(axis=>m.reactAlignmentPartWitnessesFor(f,axis))).map(w=>[w.id,w])).values()];
  const specimens=[...new Set(m.REACT_ALIGNMENT_FAMILIES.flatMap(f=>Object.entries(m.selectionForReactAlignmentFamily(f)).flatMap(([catalog,ids])=>ids.map(id=>catalog+':'+id))))];
  console.log(JSON.stringify({witnesses,specimens}));
`;
const livePage=JSON.parse(execFileSync('bun',['-e',pageRegistryScript],{cwd:browser.reference,encoding:'utf8',maxBuffer:5e6}));
const pageById=new Map(livePage.witnesses.map(row=>[row.id,row]));
const catalogIds=new Set(catalog.map(row=>row.id));
assert.equal(new Set(pageReconciliation.aliases.map(row=>row.pageWitnessId)).size,pageReconciliation.aliases.length,'Duplicate page reconciliation aliases');
assert.deepEqual(livePage.witnesses.filter(row=>!catalogIds.has(row.id)).map(row=>row.id).sort(),pageReconciliation.aliases.map(row=>row.pageWitnessId).sort(),'Page-only witness IDs need an explicit owner reconciliation');
for(const row of catalog){
  const live=pageById.get(row.id);
  assert.ok(live,`${row.id}: captured witness is absent from the live page registry`);
  for(const key of ['catalog','specimen','outerSelector'])assert.equal(live[key],row[key],`${row.id}: live ${key} differs from saved catalog`);
}
for(const alias of pageReconciliation.aliases){
  const live=pageById.get(alias.pageWitnessId);
  const sourceOwner=sourceExtras.find(row=>row.id===alias.ownerId);
  assert.ok(sourceOwner,`${alias.pageWitnessId}: unknown extra owner ${alias.ownerId}`);
  assert.equal(live.catalog,alias.catalog);
  assert.equal(live.specimen,alias.specimen);
  assert.equal(live.outerSelector,alias.pageSelector);
  assert.equal(sourceOwner.specimen,alias.specimen);
  assert.equal(sourceOwner.selector,alias.ownerSelector);
  if(!structureOnly){
    for(const tier of variants.tiers){
      const ownerRelations=ledger.relationships.filter(row=>row.witnessId===alias.ownerId);
      assert.ok(ownerRelations.length>0,`${alias.pageWitnessId}: owner has no relationships`);
      const targets=ownerRelations.flatMap(row=>(row.measurementRefs?.[tier.tier]||[]).map(ref=>tier[ref.collection]?.find(capture=>capture.id===ref.captureId)?.elements[ref.targetIndex]));
      assert.ok(targets.some(target=>target?.tag===alias.targetTag),`${alias.pageWitnessId}: no ${tier.tier} captured ${alias.targetTag} target`);
    }
  }
}
assert.deepEqual(browser.tiers.map(t=>t.tier),['site','docs','app']);
assert.deepEqual(variants.tiers.map(t=>t.tier),['site','docs','app']);
if(!structureOnly){
  assert.equal(browser.provenance.collectorSha256,hash(fs.readFileSync(path.join(__dirname,'measure-spacing.cjs'))));
  assert.equal(variants.provenance.collectorSha256,hash(fs.readFileSync(path.join(__dirname,'measure-variants.cjs'))));
  assert.deepEqual(variants.provenance.sourceMismatch,[]);
  assert.equal(browser.provenance.sourceManifestSha256,variants.provenance.sourceManifestSha256);
  assert.equal(browser.provenance.sourceManifestSha256,hash(JSON.stringify(sourceManifest)),'Stale source-manifest artifact');
  const reference=browser.reference;
  const currentSourceFiles=execFileSync('rg',['--files','packages/react','packages/styles','config'],{cwd:reference,encoding:'utf8',maxBuffer:20e6})
    .trim().split(/\r?\n/).filter(file=>/\.(css|tsx?|json)$/.test(file)).map(file=>file.replaceAll('\\','/')).sort();
  assert.deepEqual(currentSourceFiles,sourceManifest.map(row=>row.path),'Current reference source-file set differs from captured manifest');
  for(const row of sourceManifest){
    const currentPath=path.join(reference,row.path);
    assert.ok(fs.existsSync(currentPath),`${row.path}: captured source no longer exists`);
    assert.equal(hash(fs.readFileSync(currentPath)),row.sha256,`${row.path}: current source differs from captured evidence`);
  }
}
for(const name of ownerMapNames){
  const expected=hash(fs.readFileSync(path.join(__dirname,`${name}-owners.json`)));
  assert.equal(owners.ownerMapSha256[name],expected,`${name}: stale joined owner map`);
  assert.equal(ledger.ownerMapSha256[name],expected,`${name}: stale relationship source map`);
  if(!structureOnly){
    assert.equal(browser.ownerMapSha256[name],expected,`${name}: stale catalog owner map`);
    assert.equal(variants.provenance.ownerMapSha256[name],expected,`${name}: stale variant owner map`);
  }
}
for(const tier of browser.tiers){
  assert.deepEqual(tier.pageErrors,[]);assert.deepEqual(tier.activationErrors,[]);
  if(!structureOnly)assert.equal(tier.measurements.length,catalog.length);
  for(const row of tier.measurements)assert.ok(catalogIds.has(row.id),`${tier.tier}: capture absent from current catalog ${row.id}`);
  for(const row of [...tier.measurements,...tier.ownerMeasurements]){
    assert.equal(row.status,'measured',`${tier.tier}: ${row.id}`);
    assert.ok(row.targets.length>0);
    for(const target of row.targets)assert.ok(target.rect.width>0 && target.rect.height>0);
  }
  const refs=new Set([...tier.measurements,...tier.ownerMeasurements].map(r=>r.id));
  for(const relation of ledger.relationships.filter(r=>r.measurementRef))assert.ok(refs.has(relation.measurementRef));
}
for(const tier of variants.tiers){
  assert.deepEqual(tier.pageErrors,[]);
  const variantRows=[...tier.ownerExtraProbes,...tier.captures];
  assert.equal(new Set(variantRows.map(row=>row.id)).size,variantRows.length,`${tier.tier}: duplicate variant capture IDs`);
  for(const id of ['badge-is-nested','chip-is-nested']){
    const row=tier.captures.find(r=>r.id===id);assert.equal(row.status,'measured');assert.equal(row.elements.length,1,`${id}: unchanged siblings leaked into variant`);
  }
  for(const probe of tier.fonts){assert.equal(probe.status,'measured');assert.ok(probe.fonts.some(f=>f.glyphCount>0));}
}
assert.deepEqual(owners.validation,{errors:[],sourcePathIssues:[]});
for(const row of ledger.relationships){
  assert.equal(row.categoryAssignment,null,'Do not approve categories via structural checks');
  assert.ok(row.ownerSelector);
  const sourceOwner=allSourceOwners.find(candidate=>candidate.id===row.witnessId);
  for(const status of Object.values(row.measurementStatuses)){
    assert.ok(status==='measured' || (status==='source-boundary-only' && row.disposition==='non-spacing-boundary' && sourceOwner?.capturePolicy==='source-only') || (structureOnly && (status==='missing' || status==='no-owner-probe')),`${row.id}: ${status}`);
  }
  if(row.measurementRefs){
    for(const [tierName,refs] of Object.entries(row.measurementRefs)){
      const tier=variants.tiers.find(candidate=>candidate.tier===tierName);
      assert.ok(tier,`${row.id}: unknown tier ${tierName}`);
      for(const ref of refs){
        assert.equal(ref.artifact,'variant-measurements.json',`${row.id}: unexpected artifact`);
        assert.ok(ref.collection==='captures' || ref.collection==='ownerExtraProbes',`${row.id}: missing variant collection`);
        const capture=tier[ref.collection].find(candidate=>candidate.id===ref.captureId);
        assert.ok(capture,`${row.id}: missing ${tierName}/${ref.collection}/${ref.captureId}`);
        assert.equal(capture.status,'measured',`${row.id}: referenced capture is not measured`);
        assert.ok(Number.isInteger(ref.targetIndex) && ref.targetIndex>=0 && ref.targetIndex<capture.elements.length,`${row.id}: invalid target index`);
        const relationshipIndex=Number(row.id.match(/relationship-(\d+)$/)?.[1])-1;
        assert.equal(capture.elements[ref.targetIndex].relationshipMatches?.[relationshipIndex],true,`${row.id}: referenced target does not match its owner selector`);
        assert.equal(ref.ownerPseudo,row.ownerPseudo||null,`${row.id}: pseudo reference does not match its owner selector`);
        const target=capture.elements[ref.targetIndex];
        assert.ok(target.rect.height>0 && (target.rect.width>0 || (sourceOwner?.captureVisibility==='zero-inline-size-owner' && capture.captureVisibility==='zero-inline-size-owner' && target.rect.width===0)),`${row.id}: invalid visible owner geometry`);
        if(ref.ownerPseudo){
          const pseudo=target.pseudos?.[ref.ownerPseudo];
          assert.ok(pseudo,`${row.id}: missing pseudo styles`);
          assert.ok(pseudo.content!=='none' && pseudo.content!=='normal' && pseudo.display!=='none',`${row.id}: pseudo does not generate visible content`);
        }
      }
    }
  }
}
console.log(JSON.stringify({mode:structureOnly?'structure-only; capture freshness and completion NOT verified':'full evidence structure/provenance',ownerMaps:ownerMapNames,pageSpecimens:livePage.specimens.length,pageWitnesses:livePage.witnesses.length,pageOnlyAliases:pageReconciliation.aliases.length,catalogWitnesses:catalog.length,catalogRelationships:ledger.catalogRelationshipCount,extraRelationships:ledger.extraRelationshipCount,sourceOnlyBoundaryRelationships:ledger.relationships.filter(r=>Object.values(r.measurementStatuses).includes('source-boundary-only')).length,openRelationships:ledger.relationships.filter(r=>Object.values(r.measurementStatuses).some(status=>status==='missing'||status==='no-owner-probe')).map(r=>r.id),evidenceComplete:!structureOnly,semanticApproval:false}));
