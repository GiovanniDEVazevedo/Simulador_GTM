const {test}=require('node:test');
const assert=require('node:assert/strict');
const {webcrypto,createHash}=require('node:crypto');
globalThis.crypto=webcrypto;
const core=require('../public/upd-core.js');
const yes={analytics_storage:'granted',ad_user_data:'granted'};
const build=(prepared,extra={})=>core.payload({kind:'lead',prepared,format:'hashed',consent:yes,runId:'test',...extra});
test('normalization, independent SHA-256 and optional phone',async()=>{
 const p=await core.prepare(' Aluno.Teste@EXAMPLE.COM ','+1 (202) 555-0123');
 assert.deepEqual(p.normalized,{email:'aluno.teste@example.com',phone_number:'+12025550123'});
 assert.equal(p.hashed.sha256_email_address,createHash('sha256').update('aluno.teste@example.com').digest('hex'));
 assert.equal(p.hashed.sha256_phone_number,createHash('sha256').update('+12025550123').digest('hex'));
 assert.equal(core.normalizeEmail(' A.B+tag@GMAIL.COM '),'ab+tag@gmail.com');
 assert.deepEqual(Object.keys((await core.prepare('a@example.com','')).hashed),['sha256_email_address']);
});
test('invalid or non-test identities rejected',async()=>{
 for(const [email,phone] of [['',''],['invalid',''],['a@gmail.com',''],['a@example.com','2025550123'],['a@example.com','+5511999999999']])await assert.rejects(core.prepare(email,phone));
});
test('all consent combinations and both formats',async()=>{
 const p=await core.prepare('a@example.com','');
 for(const analytics_storage of ['granted','denied'])for(const ad_user_data of ['granted','denied']){
  const result=build(p,{consent:{analytics_storage,ad_user_data}});
  assert.equal(result.lab_upd_allowed,analytics_storage==='granted'&&ad_user_data==='granted');
  assert.deepEqual(result.lab_user_data,result.lab_upd_allowed?p.hashed:null);
 }
 const raw=build(p,{format:'raw'});assert.deepEqual(raw.lab_user_data,p.normalized);
 raw.lab_user_data.email='changed';assert.equal(p.normalized.email,'a@example.com');
});
test('event isolation, cleanup and purchase IDs',async()=>{
 const p=await core.prepare('a@example.com','+12025550123');const dl=[];
 core.dispatch(dl,build(p,{kind:'purchase',transactionId:'LAB-first'}));
 core.dispatch(dl,build(await core.prepare('b@example.com','')));
 assert.equal(dl.length,6);assert.equal(dl[1].ecommerce.transaction_id,'LAB-first');
 assert.equal(dl[1].ecommerce.value,49.9);
 assert.equal(dl[4].lab_user_data.sha256_phone_number,undefined);
 for(const i of [0,2,3,5])assert.equal(dl[i].lab_user_data,null);
 assert.throws(()=>build(p,{kind:'purchase',transactionId:'production'}));
 let count=0,cleared=false;
 assert.throws(()=>core.dispatch({push(x){count++;if(count===2)throw Error('failure');if(count===3)cleared=x.lab_user_data===null;}},build(p)));
 assert.equal(cleared,true);
});
