const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const core=require('../public/challenges-core.js');
function edit(id,change){const input=core.solution(id),body=JSON.parse(input.body);change(body,input);input.body=JSON.stringify(body);return core.gradeRequest(id,input)}
const failed=(result,id)=>result.checks.find(check=>check.id===id)?.passed===false;

test('all authored problems have sources and grade their reference while rejecting unfinished attempts',()=>{
 assert.equal(core.exercises.length,9);assert.equal(new Set(core.exercises.map(item=>item.id)).size,9);
 for(const item of core.exercises){
  assert(item.hints.length>=2);assert(item.sourceIds.every(id=>core.sources[id]));
  if(item.type==='read'){
   assert.equal(core.gradeChoice(item.id,item.correct).passed,true);
   assert.equal(core.gradeChoice(item.id,(item.correct+1)%item.options.length).passed,false);
   assert.equal(core.gradeChoice(item.id,undefined).unanswered,true);
  }else{
   assert.equal(core.gradeRequest(item.id,core.solution(item.id)).passed,true,item.id);
   assert.equal(core.gradeRequest(item.id,core.starter(item.id)).passed,false,item.id);
  }
 }
});
test('semantic request grading accepts reordered keys, header case, time-zone equivalence and reordered batches',()=>{
 const result=edit('lote-api',(body,input)=>{
  input.headers=JSON.stringify({authorization:'Bearer LAB_TOKEN','content-type':'application/json; charset=UTF-8'});
  body.events[0].eventTimestamp='2026-10-16T17:30:00Z';
  body.events[1].eventTimestamp='2026-10-16T18:00:00+00:00';
  body.events.reverse();
  for(let i=0;i<body.events.length;i++)body.events[i]=Object.fromEntries(Object.entries(body.events[i]).reverse());
 });
 assert.equal(result.passed,true);
});
test('ECL checks the actual normalized identity digest, including HEX and BASE64 representations',()=>{
 const normalized=core.fixture.email.trim().toLowerCase();
 const digest=createHash('sha256').update(normalized).digest();
 const hex=edit('corrigir-ecl',body=>body.events[0].userData.userIdentifiers[0].emailAddress=digest.toString('hex').toUpperCase());
 assert.equal(hex.passed,true);
 const base64=edit('corrigir-ecl',body=>{body.encoding='BASE64';body.events[0].userData.userIdentifiers[0].emailAddress=digest.toString('base64')});
 assert.equal(base64.passed,true);
 for(const value of [core.fixture.email,createHash('sha256').update(core.fixture.email).digest('hex'),createHash('sha256').update(digest.toString('hex')).digest('hex'),'a'.repeat(64)]){
  const wrong=edit('corrigir-ecl',body=>body.events[0].userData.userIdentifiers[0].emailAddress=value);
  assert(failed(wrong,'identity'));
 }
 assert(failed(edit('corrigir-ecl',body=>body.encoding='UTF8'),'encoding'));
});
test('the consent case cannot be passed by inventing a grant or leaving identity in the body',()=>{
 assert(failed(edit('consentimento-api',body=>body.consent.adUserData='CONSENT_GRANTED'),'consent'));
 const identity=edit('consentimento-api',body=>{body.events[0].userData={userIdentifiers:[]};body.encoding='HEX'});
 assert(failed(identity,'no-identity-0'));
 assert(failed(edit('consentimento-api',body=>delete body.events[0].adIdentifiers),'click-0'));
});
test('all batch records and transaction IDs must survive a correction',()=>{
 assert(failed(edit('lote-api',body=>body.events.pop()),'event-count'));
 assert(failed(edit('lote-api',body=>body.events[1].transactionId=body.events[0].transactionId),'transactions'));
 assert(failed(edit('lote-api',body=>body.events[1].currency='REAIS'),'value-1'));
 assert(failed(edit('lote-api',body=>body.events[1].eventTimestamp='16/10/2026 15:00'),'date-1'));
 assert(failed(edit('lote-api',body=>body.events[1].eventTimestamp='2026-10-16T15:00:00Z'),'date-1'));
});
test('local connection requires fake authorization and a nonexecuting validation request',()=>{
 const input=core.solution('conectar-oci');
 input.headers=JSON.stringify({Authorization:'Bearer REAL_TOKEN_SHOULD_NOT_BE_USED','Content-Type':'application/json'});
 const result=core.gradeRequest('conectar-oci',input);
 assert(failed(result,'authorization'));assert(!JSON.stringify(result).includes('REAL_TOKEN_SHOULD_NOT_BE_USED'));
 for(const value of [false,'true',1])assert(failed(edit('conectar-oci',body=>body.validateOnly=value),'validate-only'));
 const changed=edit('conectar-oci',(body,input)=>{input.method='GET';input.url+='?key=EXAMPLE'});
 assert(failed(changed,'method'));assert(failed(changed,'endpoint'));
 const success=core.gradeRequest('conectar-oci',core.solution('conectar-oci'));
 assert.equal(success.simulatedResponse.http,200);assert.match(success.simulatedResponse.note,/SIMULAÇÃO LOCAL/);assert.equal(success.simulatedResponse.body.requestId,undefined);
});
test('malformed JSON and unexpected shapes fail as feedback without execution or crashes',()=>{
 const values=['{','null','[]','"texto"','function(){return {}}','x'.repeat(40001),JSON.stringify({events:[null],destinations:[null]})];
 for(const body of values){const result=core.gradeRequest('conectar-oci',{...core.solution('conectar-oci'),body});assert.equal(result.passed,false)}
 assert.equal(core.gradeRequest('conectar-oci',null).passed,false);
 assert(failed(edit('conectar-oci',body=>body.events[0].conversionValue='750'),'value-0'));
 assert(failed(edit('conectar-oci',body=>body.unrequestedField=true),'body-scope'));
});
test('hydration whitelists learning metadata and drops editor contents and unknown records',()=>{
 const state=core.hydrate({version:1,selected:'conectar-oci',headers:'SECRET',body:'PAYLOAD',progress:{'conectar-oci':{attempts:3,passed:true,assisted:true,body:'SECRET'},unknown:{passed:true}}});
 assert.deepEqual(state,{version:1,selected:'conectar-oci',progress:{'conectar-oci':{attempts:3,passed:true,assisted:true}}});
 assert.equal(core.hydrate({version:99}).selected,'ler-oci');
 assert.equal(core.hydrate({version:1,progress:{'ler-oci':{attempts:-2,passed:'true'}}}).progress['ler-oci'].attempts,0);
});
