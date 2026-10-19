const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const core=require('../public/challenges-core.js');
function setup(storage={},blocked=false){
 const nodes=new Map();
 class Node{
  constructor(tag='div'){this.tag=tag;this.children=[];this.listeners={};this.value='';this.textContent='';this.hidden=false;this.disabled=false;this.open=false}
  append(...nodes){this.children.push(...nodes)}replaceChildren(){this.children=[]}focus(){this.focused=true}addEventListener(type,fn){this.listeners[type]=fn}
 }
 const get=key=>{if(!nodes.has(key))nodes.set(key,new Node());return nodes.get(key)};
 const dataLayer=[];
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../public/challenges-lab.js'),'utf8'),{
  window:{TagLabChallenges:core,dataLayer},document:{querySelector:get,createElement:tag=>new Node(tag)},
  localStorage:{getItem:key=>storage[key]||null,setItem:(key,value)=>{if(blocked)throw Error('blocked');storage[key]=value}},console
 });
 const click=id=>get('#challenge-'+id).onclick();
 const choose=id=>{get('#challenge-select').value=id;get('#challenge-select').onchange()};
 const fill=(input,change=true)=>{for(const field of ['method','url','headers','body'])get('#challenge-'+field).value=input[field];if(change)get('#challenge-body').listeners.input()};
 const stored=()=>JSON.parse(storage.taglab_challenges_v1||'{}');
 return {get,click,choose,fill,stored,storage,dataLayer};
}
test('reading requires an answer, supports correction and tracks consulted solutions without auto-completing',()=>{
 const s=setup();s.click('submit');assert.match(s.get('#challenge-feedback').textContent,/Selecione/);
 s.get('#challenge-options').children[0].children[0].onchange();s.click('submit');assert.equal(s.stored().progress['ler-oci'].passed,false);
 s.get('#challenge-solution').open=true;s.get('#challenge-solution').listeners.toggle();
 assert.equal(s.stored().progress['ler-oci'].passed,false);assert.equal(s.stored().progress['ler-oci'].assisted,true);
 s.get('#challenge-options').children[1].children[0].onchange();s.click('submit');
 assert.equal(s.stored().progress['ler-oci'].passed,true);assert.match(s.get('#challenge-status').textContent,/com consulta/);
 assert.match(s.get('#challenge-progress').textContent,/1 \/ 9/);assert.equal(s.dataLayer.length,0);
});
test('manual request correction invalidates displayed feedback after edits and preserves only learning metadata',()=>{
 const s=setup();s.choose('conectar-oci');s.click('submit');assert.match(s.get('#challenge-feedback').textContent,/Revise/);
 const valid=core.solution('conectar-oci');s.fill(valid);s.click('submit');assert.match(s.get('#challenge-feedback').textContent,/Passou/);assert.equal(s.get('#challenge-response').hidden,false);
 s.fill({...valid,body:'{' });assert.equal(s.get('#challenge-response').hidden,true);assert.equal(s.get('#challenge-results').children.length,0);s.click('submit');assert.match(s.get('#challenge-feedback').textContent,/Revise/);
 assert(!JSON.stringify(s.stored()).includes('LAB_TOKEN'));assert(!JSON.stringify(s.stored()).includes('destinations'));
 s.choose('ler-oci');s.choose('conectar-oci');assert.equal(s.get('#challenge-body').value,'{');
 const restored=setup(s.storage);assert.equal(restored.get('#challenge-body').value,core.starter('conectar-oci').body);
 assert.match(restored.get('#challenge-status').textContent,/Concluído localmente/);
 assert.equal(s.dataLayer.length,0);
});
test('filters and navigation remain scoped; reset restores the starter and clears only this area',()=>{
 const storage={unrelated:'preserve'},s=setup(storage);s.get('#challenge-filter').value='request';s.get('#challenge-filter').onchange();assert.equal(s.stored().selected,'conectar-oci');
 assert.equal(s.get('#challenge-select').children.length,4);s.click('next');assert.equal(s.stored().selected,'corrigir-ecl');
 s.fill(core.solution('corrigir-ecl'));s.click('hint');s.click('submit');assert(s.stored().progress['corrigir-ecl'].passed);assert(s.stored().progress['corrigir-ecl'].assisted);
 s.click('reset-code');assert.equal(s.get('#challenge-body').value,core.starter('corrigir-ecl').body);
 s.click('clear-progress');assert.match(s.get('#challenge-progress').textContent,/0 \/ 9/);assert.equal(storage.unrelated,'preserve');
 const blocked=setup({},true);assert.equal(blocked.get('#challenge-storage-note').hidden,false);blocked.choose('conectar-oci');blocked.fill(core.solution('conectar-oci'));blocked.click('submit');assert.match(blocked.get('#challenge-feedback').textContent,/Passou/);
});
