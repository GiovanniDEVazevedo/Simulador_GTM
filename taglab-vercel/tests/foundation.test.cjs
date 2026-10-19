const {test}=require('node:test'),assert=require('node:assert/strict');
const {create:storage}=require('../public/storage.js');
const consent=require('../public/consent-bridge.js'),evidence=require('../public/evidence-core.js');
const fs=require('node:fs'),vm=require('node:vm');
test('storage survives denied reads, writes and removals without reviving stale saved values',()=>{
 for(const operation of ['getItem','setItem','removeItem']){
  const backend={getItem:()=>'{"old":true}',setItem(){},removeItem(){}};backend[operation]=()=>{throw new DOMException('blocked','SecurityError')};
  const s=storage(()=>backend);if(operation==='getItem')assert.equal(s.getItem('a'),null);
  s.setItem('a','new');if(operation==='removeItem')s.removeItem('a');
  assert.equal(s.getItem('a'),operation==='removeItem'?null:'new');assert.equal(s.status().persistent,false);
 }
});
test('storage tolerates corrupt JSON, a throwing storage getter and quota errors',()=>{
 const s=storage(()=>({getItem:()=>'{',setItem(){throw new DOMException('full','QuotaExceededError')}}));assert.deepEqual(s.readJSON('a',{}),{});assert.deepEqual(s.status().invalidKeys,['a']);
 assert.equal(s.writeJSON('a',{x:1}),false);assert.deepEqual(s.readJSON('a'),{x:1});
 const blocked=storage(()=>{throw Error('denied')});assert.equal(blocked.removeItem('x'),false);assert.equal(blocked.writeJSON('x',{ok:true}),false);assert.deepEqual(blocked.readJSON('x'),{ok:true});
});
test('GTM applies template consent synchronously before a following business event and never queues an update command',()=>{
 const calls=[];const bridge=consent.create({mode:'gtm',initial:{ad_user_data:'granted'},command:(...x)=>calls.push(x)});
 assert.equal(calls[0][2].ad_user_data,'denied');assert.equal(bridge.status().ready,false);
 bridge.update({ad_user_data:'granted'});assert.equal(bridge.status().ready,false);
 bridge.register(value=>calls.push(['template',value]));bridge.update({ad_user_data:'denied'});calls.push(['business']);
 assert.equal(calls.at(-2)[1].ad_user_data,'denied');assert.equal(bridge.status().ready,true);assert(!calls.some(c=>c[0]==='consent'&&c[1]==='update'));
});
test('direct gtag and local mode have independent consent paths and callback failure remains pending',()=>{
 const calls=[],c=consent.create({mode:'ga4',initial:null,command:(...x)=>calls.push(x)});c.update({analytics_storage:'granted'});assert.equal(calls[1][1],'update');
 consent.create({mode:'layer',command:()=>assert.fail('local mode called a tag')}).update({ad_storage:'granted'});
 const g=consent.create({mode:'gtm',command(){}});g.register(()=>{throw Error('template failed')});assert.equal(g.status().ready,false);
});
test('GTM template uses official APIs and connects to the browser callback',()=>{
 const calls=[];let callback;
 vm.runInNewContext(fs.readFileSync(require.resolve('../public/gtm-consent-template.txt'),'utf8'),{data:{gtmOnSuccess:()=>calls.push('ok')},require:name=>name==='callInWindow'?(name,fn)=>{assert.equal(name,'taglabRegisterConsent');callback=fn}:value=>calls.push({name,value})});
 callback({ad_user_data:'granted'});assert.equal(calls[0].name,'setDefaultConsentState');assert.equal(calls[2].name,'updateConsentState');assert.equal(calls[2].value.analytics_storage,'denied');
});
test('external evidence cannot be inferred from a simulated response or marked as protected tutor approval',()=>{
 assert.equal(evidence.create('simulation').source,'simulador');assert.throws(()=>evidence.create('destination'),/manual/);
 const e=evidence.create('destination',{declaredBy:'aluno',reference:'DebugView da propriedade de teste'});assert.equal(e.verifiedByTutor,false);assert.equal(e.source,'declaracao_manual');
});
