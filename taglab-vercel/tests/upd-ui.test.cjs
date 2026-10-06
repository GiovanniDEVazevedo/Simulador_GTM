const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');const fs=require('node:fs');const path=require('node:path');
const {webcrypto}=require('node:crypto');globalThis.crypto=webcrypto;
const core=require('../public/upd-core.js');
function setup(override={}){
 const nodes=new Map(),listeners={};
 function node(){return {value:'',checked:false,textContent:'',children:[],listeners:{},append(...x){this.children.push(...x)},replaceChildren(){this.children=[]},addEventListener(t,fn){this.listeners[t]=fn},querySelectorAll(){return []}}}
 const get=s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)};
 const consent={analytics_storage:'granted',ad_user_data:'granted'};const config={mode:'gtm',gtm:'GTM-TEST'};
 const window={TagLabUPD:{...core,...override},TagLab:{getConfig:()=>({...config}),getConsent:()=>({...consent}),navigate(){}},dataLayer:[],addEventListener:(t,f)=>listeners[t]=f};
 const context={window,document:{querySelector:get,createElement:node,createTextNode:x=>x},crypto:webcrypto,localStorage:{getItem:()=>null,setItem(){}},setTimeout,console};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../public/upd-lab.js'),'utf8'),context);
 get('#upd-email').value='a@example.com';get('#upd-phone').value='';get('#upd-format').value='hashed';get('#upd-kind').value='lead';get('#upd-delivery').value='preview';
 return {get,window,consent,config,listeners,send:()=>get('#upd-send').onclick()};
}
test('preview does not push; live requires GTM and explicit activation',async()=>{
 const s=setup();await s.send();assert.equal(s.window.dataLayer.length,0);assert.match(s.get('#upd-payload').textContent,/sha256_email_address/);
 s.get('#upd-delivery').value='gtm';await s.send();assert.equal(s.window.dataLayer.length,0);
 s.get('#upd-armed').checked=true;s.config.mode='ga4';await s.send();assert.equal(s.window.dataLayer.length,0);
 s.config.mode='gtm';await s.send();assert.equal(s.window.dataLayer.length,3);
});
test('concurrent/repeated clicks blocked, new case has distinct purchase ID',async()=>{
 const s=setup();s.get('#upd-delivery').value='gtm';s.get('#upd-armed').checked=true;s.get('#upd-kind').value='purchase';
 await Promise.all([s.send(),s.send()]);await s.send();assert.equal(s.window.dataLayer.length,3);
 const first=s.window.dataLayer[1].transaction_id;
 s.get('#upd-new').onclick();await s.send();assert.equal(s.window.dataLayer.length,6);assert.notEqual(first,s.window.dataLayer[4].transaction_id);
});
test('consent change during hashing aborts; denied new case omits identity',async()=>{
 let release;const s=setup({prepare:()=>new Promise(resolve=>release=resolve)});
 s.get('#upd-delivery').value='gtm';s.get('#upd-armed').checked=true;
 const sending=s.send();s.consent.ad_user_data='denied';s.listeners['taglab:consent']();
 release(await core.prepare('a@example.com',''));await sending;assert.equal(s.window.dataLayer.length,0);
 s.window.TagLabUPD.prepare=core.prepare;await s.send();assert.equal(s.window.dataLayer[1].lab_user_data,null);
});
test('input edit during hashing aborts and invalid email produces no push',async()=>{
 let release;const s=setup({prepare:()=>new Promise(resolve=>release=resolve)});
 s.get('#upd-delivery').value='gtm';s.get('#upd-armed').checked=true;const sending=s.send();
 s.get('#upd-email').value='invalid';s.get('#upd-email').listeners.input();
 release(await core.prepare('a@example.com',''));await sending;assert.equal(s.window.dataLayer.length,0);
 s.window.TagLabUPD.prepare=core.prepare;await s.send();assert.equal(s.window.dataLayer.length,0);
});
