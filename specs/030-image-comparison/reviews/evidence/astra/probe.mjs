import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base='http://127.0.0.1:58656',out='specs/030-image-comparison/reviews/evidence/astra';
const b=await chromium.launch({channel:'chrome'}),p=await b.newPage({viewport:{width:700,height:900}});const result={chrome:await b.version(),runtimeHash:createHash('sha256').update(await fs.readFile('dist/image-comparison.js')).digest('hex'),cases:[]};
const markup=`<div class="bf-image-comparison" id="host"><div class="bf-image-comparison-stage" style="height:180px"><div class="bf-image-comparison-layer is-second"></div><div class="bf-image-comparison-layer is-first"></div><div class="bf-image-comparison-seam"></div><input class="bf-image-comparison-value" id="value" type="range" min="0" max="100" step="1"><div class="bf-image-comparison-grip"></div></div></div>`;
for(const kind of ['text label','empty label fallback','image alt label','aria-label label','label with aria-hidden text','labelledby aria-label target','labelledby image alt','display-none label text']){
 await p.goto(base+'/demo/components/image-comparison.html');await p.setContent(`<html class="bf-theme"><head><link rel="stylesheet" href="${base}/dist/styles.css"></head><body>${markup}</body></html>`);
 const setup=await p.evaluate(async({base,kind})=>{const api=await import(base+'/dist/index.js');window.host=document.getElementById('host');const input=document.getElementById('value');const label=document.createElement('label');label.htmlFor='value';label.id='label';host.before(label);
 if(kind==='text label')label.textContent='Visible comparison';
 if(kind==='image alt label')label.innerHTML='<img alt="Compare visual states" src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27/%3E">';
 if(kind==='aria-label label')label.setAttribute('aria-label','Compare visual states');
 if(kind==='label with aria-hidden text')label.innerHTML='<span aria-hidden="true">Ignored decorative text</span>';
 if(kind==='labelledby aria-label target'){label.setAttribute('aria-label','Compare visual states');input.setAttribute('aria-labelledby','label');}
 if(kind==='labelledby image alt'){label.innerHTML='<img alt="Compare visual states" src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27/%3E">';input.setAttribute('aria-labelledby','label');}
 if(kind==='display-none label text'){label.textContent='Hidden text';label.style.display='none';}
 let before=host.outerHTML;try{window.controller=api.setupImageComparison(host,kind==='empty label fallback'?{accessibleName:'Fallback'}:{});return{success:true,name:input.getAttribute('aria-label')}}catch(e){return{success:false,error:String(e),unchanged:before===host.outerHTML}}},{base,kind});result.cases.push({kind,setup,snapshot:await p.getByRole('slider').ariaSnapshot()});
}
await b.close();await fs.writeFile(out+'/naming-probe.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
