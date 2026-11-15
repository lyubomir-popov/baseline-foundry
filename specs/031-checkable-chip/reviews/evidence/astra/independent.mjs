import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
const out='specs/031-checkable-chip/reviews/evidence/astra',base='http://127.0.0.1:64528';
await fs.mkdir(out,{recursive:true});
const r={head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),checks:[],errors:[],pageerrors:[],sourceHashes:{}};
for(const f of ['src/css-components/chip-badge-status.ts','demo/components/chip.html','demo/component-demo.js','dist/styles.css'])r.sourceHashes[f]=crypto.createHash('sha256').update(await fs.readFile(f)).digest('hex');
const check=(name,pass,detail)=>{r.checks.push({name,pass:!!pass,detail});if(!pass)r.errors.push(name)};
const b=await chromium.launch({channel:'chrome'});r.chrome=b.version();
const p=await b.newPage({viewport:{width:900,height:700},reducedMotion:'reduce'});p.on('pageerror',e=>r.pageerrors.push(String(e)));
const state=loc=>loc.evaluate(el=>{const c=getComputedStyle(el),z=el.getBoundingClientRect(),mark=el.querySelector('.bf-chip-mark'),m=mark?.getBoundingClientRect(),v=el.querySelector('.bf-chip-value').getBoundingClientRect(),a=getComputedStyle(el,'::after');return {w:z.width,h:z.height,occupied:z.height+parseFloat(c.marginBottom),valueX:v.x-z.x,valueY:v.y-z.y,valueW:v.width,markX:m?.x-z.x,markW:m?.width,markH:m?.height,visibility:mark?getComputedStyle(mark).visibility:null,pressed:el.getAttribute('aria-pressed'),border:c.borderWidth,stroke:c.getPropertyValue('--bf-overlay-stroke-layer').trim(),selection:c.getPropertyValue('--bf-overlay-selection-layer').trim(),end:a.borderBottomWidth,focus:c.getPropertyValue('--bf-overlay-focus-layer').trim(),outline:c.outlineStyle,outlineW:c.outlineWidth,pseudoOutline:a.outlineStyle,pseudoOutlineW:a.outlineWidth,background:c.backgroundColor,color:c.color,markColor:mark?getComputedStyle(mark).color:null,gap:c.columnGap,focusVisible:el.matches(':focus-visible')};});
const same=(a,b)=>['w','h','occupied','valueX','valueY','valueW','markX','markW','markH'].every(k=>Math.abs(a[k]-b[k])<.05);
try{
 await p.goto(base+'/demo/components/chip.html',{waitUntil:'networkidle'});
 const group=p.getByRole('group',{name:'Checkable filter chips'}),brand=group.getByRole('button',{name:'Brand',exact:true}),design=group.getByRole('button',{name:'Design',exact:true});
 check('Actual demo initially named selected Brand and unselected Design',(await brand.getAttribute('aria-pressed'))==='true'&&(await design.getAttribute('aria-pressed'))==='false',await group.ariaSnapshot());
 await brand.click();check('Actual demo click toggles selection',await brand.getAttribute('aria-pressed')==='false',await state(brand));
 await brand.press('Space');check('Actual demo Space selects',await brand.getAttribute('aria-pressed')==='true',await group.ariaSnapshot());
 await brand.press('Enter');check('Actual demo Enter deselects',await brand.getAttribute('aria-pressed')==='false',await state(brand));
 await brand.press('Tab');check('Mark adds no focus stop',await design.evaluate(el=>document.activeElement===el),{});
 await design.press('Shift+Tab');check('Actual keyboard focus returns to Brand',await brand.evaluate(el=>el.matches(':focus-visible')),await state(brand));
 await brand.press('Enter');await group.screenshot({path:out+'/actual-demo.png'});
 // Keep the real demo and its actual click handlers; only select public styles and fixture constraints.
 await p.evaluate(()=>{const group=document.querySelector('[aria-label="Checkable filter chips"]');group.id='review-group';group.style.maxWidth='180px';const dense=document.querySelector('[data-dense-chip-provider]');const ordinary=dense.querySelector('.bf-chip');ordinary.id='review-ordinary';const copy=document.querySelector('[data-checkable-chip]').cloneNode(true);copy.id='review-dense';copy.setAttribute('aria-pressed','false');copy.querySelector('.bf-chip-value').textContent='Chip';dense.append(copy);});
 const dense=p.locator('#review-dense'),ordinary=p.locator('#review-ordinary');
 for(const tier of ['editorial','documentation','app','os'])for(const shared of [false,true])for(const root of [16,20])for(const tone of ['light','dark','forced'])for(const dir of ['ltr','rtl']){
  const label=`${tier}/${shared?'shared':'direct'}/${root}/${tone}/${dir}`;
  await p.emulateMedia({forcedColors:tone==='forced'?'active':'none'});
  await p.evaluate(async({base,tier,shared,root,tone,dir})=>{document.documentElement.style.fontSize=root+'px';document.documentElement.dir=dir;document.body.className=`bf-theme bf-tier-${tier} is-${tone==='dark'?'dark':'light'}`;const link=document.querySelector('link[rel=stylesheet]');const href=base+'/dist/'+(shared?'styles.css':`tiers/${tier}/styles.css`);if(link.href!==href)await new Promise((resolve,reject)=>{link.onload=resolve;link.onerror=reject;link.href=href});await document.fonts.ready;document.querySelector('#review-group .bf-chip-value').textContent='Brand filter with a very long name';document.querySelector('#review-group .bf-chip').setAttribute('aria-pressed','false');document.querySelector('#review-dense').setAttribute('aria-pressed','false');},{base,tier,shared,root,tone,dir});
  const target=group.locator('button').first();await target.scrollIntoViewIfNeeded();await p.mouse.move(0,0);const initial=await state(target),d0=await state(dense),o0=await state(ordinary);
  check(label+' confined slot and zero border',initial.w<=180.1&&initial.markW>0&&initial.visibility==='hidden'&&initial.border==='0px',initial);
  check(label+' dense height and compensation unchanged',Math.abs(d0.h-o0.h)<.05&&Math.abs(d0.occupied-o0.occupied)<.05,{dense:d0,ordinary:o0});
  const z=await target.boundingBox();await p.mouse.move(z.x+z.width/2,z.y+z.height/2);await p.mouse.down();const active=await state(target);
  check(label+' pointer active alone is unchecked and uniform',active.pressed==='false'&&active.visibility==='hidden'&&active.selection==='0 0 0 0 transparent'&&active.end==='0px'&&same(initial,active),active);
  await p.mouse.up();await p.mouse.move(0,0);const selected=await state(target);
  check(label+' actual click selects with stable keyline and paint',selected.pressed==='true'&&selected.visibility==='visible'&&same(initial,selected)&&selected.stroke===initial.stroke&&selected.selection==='0 0 0 0 transparent'&&selected.end==='0px',selected);
  check(label+' mark follows logical leading direction',dir==='ltr'?selected.markX<selected.valueX:selected.markX>selected.valueX,{mark:selected.markX,value:selected.valueX});
  await target.press('Tab');await p.keyboard.press('Shift+Tab');const focus=await state(target);
  check(label+' native focus remains independent',focus.focusVisible&&same(initial,focus)&&(tone==='forced'?focus.outline==='solid'&&parseFloat(focus.outlineW)>0&&focus.pseudoOutline==='solid':!focus.focus.includes('transparent')),focus);
  check(label+' accessible name excludes decorative SVG',await group.getByRole('button',{name:'Brand filter with a very long name',exact:true}).count()===1,await target.ariaSnapshot());
  await dense.evaluate(el=>el.setAttribute('aria-pressed','true'));const d1=await state(dense);check(label+' dense selection stable and bar suppressed',same(d0,d1)&&d1.visibility==='visible'&&d1.end==='0px'&&d1.selection==='0 0 0 0 transparent',d1);
  await ordinary.evaluate(el=>el.setAttribute('aria-pressed','true'));const o1=await state(ordinary);check(label+' ordinary selection bar retained',!o1.selection.includes('transparent')&&(tone!=='forced'||parseFloat(o1.end)>0),o1);await ordinary.evaluate(el=>el.removeAttribute('aria-pressed'));
  if(tier==='editorial'&&shared&&root===20&&dir==='ltr')await group.screenshot({path:out+`/long-${tone}.png`});
  if(tier==='os'&&shared&&root===20&&dir==='rtl'&&tone==='dark')await group.screenshot({path:out+'/os-rtl.png'});
  await target.press('Space');check(label+' real demo Space unselects',await target.getAttribute('aria-pressed')==='false'&&(await state(target)).visibility==='hidden',{});
 }
}catch(e){r.errors.push(e.stack||String(e))}finally{await b.close();await fs.writeFile(out+'/independent.json',JSON.stringify(r,null,2));console.log(JSON.stringify({checks:r.checks.length,failed:r.errors,pageerrors:r.pageerrors}));}
