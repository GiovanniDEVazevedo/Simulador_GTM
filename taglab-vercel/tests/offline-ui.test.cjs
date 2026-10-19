const {test}=require('node:test'),assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const {webcrypto}=require('node:crypto');globalThis.crypto=webcrypto;
const offline=require('../public/offline-core.js'),upd=require('../public/upd-core.js');
function setup(override={}){
 const nodes=new Map(),listeners={},navigation=[];
 const get=s=>{if(!nodes.has(s))nodes.set(s,{value:'',textContent:'',disabled:false,hidden:false,listeners:{},addEventListener(type,fn){this.listeners[type]=fn}});return nodes.get(s)};
 const consent={ad_user_data:'denied',ad_personalization:'denied'};
 const window={TagLabOffline:offline,TagLabUPD:{...upd,...override},TagLab:{getConsent:()=>({...consent}),navigate:tab=>navigation.push(tab)},dataLayer:[],addEventListener:(type,fn)=>listeners[type]=fn};
 get('#offline-mode').value='ecl';get('#offline-email').value='cliente.offline@example.com';get('#offline-phone').value='+1 (202) 555-0142';get('#offline-value').value='750';get('#offline-customer-id').value='1234567890';get('#offline-conversion-id').value='987654321';
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../public/storage.js'),'utf8')+'\n'+fs.readFileSync(path.join(__dirname,'../public/evidence-core.js'),'utf8')+'\n'+fs.readFileSync(path.join(__dirname,'../public/offline-lab.js'),'utf8'),{window,document:{querySelector:get},crypto:webcrypto,console,structuredClone});
 return {get,window,consent,listeners,navigation,click:id=>get('#offline-'+id).onclick(),crm:()=>JSON.parse(get('#offline-crm').textContent),event:()=>JSON.parse(get('#offline-event-payload').textContent),request:()=>JSON.parse(get('#offline-request-payload').textContent)};
}
test('reported ECL flow: denied explains next to generator, consent grant resumes same lead',async()=>{
 const s=setup();await s.click('create-lead');s.click('close-lead');const id=s.crm().transaction_id;
 s.click('build-event');assert.deepEqual(s.event(),{});assert.match(s.get('#offline-event-status').textContent,/ad_user_data/);assert.equal(s.get('#offline-open-consent').hidden,false);
 s.click('open-consent');assert.deepEqual(s.navigation,['consentimento']);
 s.consent.ad_user_data='granted';s.listeners['taglab:consent']();s.click('build-event');s.click('build-request');
 assert.equal(s.crm().transaction_id,id);assert.equal(s.event().userData.userIdentifiers.length,2);assert.equal(s.request().encoding,'HEX');assert.equal(s.request().validateOnly,true);
 assert(!JSON.stringify(s.window.dataLayer).includes('emailAddress'));assert(!JSON.stringify(s.window.dataLayer).includes(s.event().userData.userIdentifiers[0].emailAddress));
 s.consent.ad_user_data='denied';s.listeners['taglab:consent']();assert.deepEqual(s.event(),{});assert.deepEqual(s.request(),{});assert.equal(s.get('#offline-copy-request').disabled,true);s.click('build-event');assert.deepEqual(s.event(),{});
});
test('invalid sale does not transition to WON and repeated close preserves transaction',async()=>{
 const s=setup();await s.click('create-lead');s.get('#offline-value').value='0';s.click('close-lead');assert.equal(s.crm().status,'OPEN');assert.equal(s.crm().transaction_id,null);assert.equal(s.get('#offline-build-event').disabled,true);
 s.get('#offline-value').value='10';s.click('close-lead');const id=s.crm().transaction_id;s.click('close-lead');assert.equal(s.crm().transaction_id,id);assert.equal(s.window.dataLayer.filter(x=>x.event==='lab_offline_crm_won').length,1);
});
test('OCI works without identity and stale previews clear on invalid target/input',async()=>{
 const s=setup();s.get('#offline-mode').value='oci';s.get('#offline-email').value='';s.get('#offline-phone').value='';s.click('gclid-generate');await s.click('create-lead');s.click('close-lead');s.click('build-event');s.click('build-request');assert(s.event().adIdentifiers.gclid);assert.equal(s.event().userData,undefined);
 s.get('#offline-customer-id').value='invalid';s.get('#offline-customer-id').listeners.input();assert.deepEqual(s.request(),{});s.click('build-request');assert.deepEqual(s.request(),{});assert(s.get('#offline-copy-request').disabled);
 s.get('#offline-email').value='invalid';s.get('#offline-email').listeners.input();assert.deepEqual(s.event(),{});await s.click('create-lead');assert.match(s.get('#offline-crm').textContent,/Nenhum lead/);
});
test('reset during async preparation cancels old result and duplicate create is ignored',async()=>{
 let release;const s=setup({prepare:()=>new Promise(resolve=>release=resolve)});
 const pending=s.click('create-lead');await s.click('create-lead');s.click('reset');release(await upd.prepare('a@example.com',''));await pending;
 assert.match(s.get('#offline-crm').textContent,/Nenhum lead/);assert.equal(s.window.dataLayer.length,0);assert.equal(s.get('#offline-create-lead').disabled,false);
});
