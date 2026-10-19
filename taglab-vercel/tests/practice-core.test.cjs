const {test}=require('node:test'),assert=require('node:assert/strict');
const csv=require('../public/csv-core.js'),scenarios=require('../public/scenarios-core.js');
const mapping={transactionId:'sale_id',eventTimestamp:'date',conversionValue:'value',currency:'currency',email:'email',gclid:'gclid'};
test('CSV supports BOM, quoted separators, quotes and embedded newlines while reporting skipped blank lines',()=>{
 const p=csv.parse('\uFEFFid;note\nTEST-001;"a; b\n""c"""\n\n');assert.equal(p.errors.length,0);assert.equal(p.rows[0].cells[1],'a; b\n"c"');assert.deepEqual(p.ignoredEmptyLines,[4]);
 assert(csv.parse('a;b\n"open').errors.length);assert(csv.parse('a;a\n1;2').errors.length);assert(csv.parse('a;b\n1').errors.length);assert.throws(()=>csv.parse('é'.repeat(50001)),/100 KB/);
});
test('CSV transforms two strategies, normalizes zoned dates and refuses partial export when any row fails',async()=>{
 const p=csv.parse(csv.sample),result=await csv.transform(p,mapping,{adUserData:'granted'});assert(result.valid);assert.equal(result.events.length,2);assert.equal(result.events[0].eventTimestamp,'2026-10-19T13:30:00.000Z');assert.equal(result.events[0].conversionValue,99.9);assert.equal(result.events[0].userData.userIdentifiers[0].emailAddress.length,64);assert(result.events[1].adIdentifiers);
 const denied=await csv.transform(p,mapping);assert(!denied.valid);assert.equal(denied.events.length,0);assert.equal(denied.errors[0].line,2);
 const duplicate=csv.parse(csv.sample.replace('TEST-CSV-002','TEST-CSV-001'));assert(!(await csv.transform(duplicate,mapping,{adUserData:'granted'})).valid);
});
test('CSV rejects real identities, ambiguous dates, invalid calendar, overlong batches and wrong decimals',async()=>{
 for(const date of ['2026-02-30T10:00:00Z','2026-10-19T10:00:00','19/10/2026'])assert.throws(()=>csv.dateWithZone(date));
 const real=csv.parse(csv.sample.replace('aluno@example.com','aluno@gmail.com'));assert(!(await csv.transform(real,mapping,{adUserData:'granted'})).valid);
 const p=csv.parse('id;date\n'+Array.from({length:51},(_,i)=>'TEST-'+i+';x').join('\n'));assert(p.errors.some(x=>x.path==='limite'));
 assert(!(await csv.transform(csv.parse(csv.sample),mapping,{decimal:'.',adUserData:'granted'})).valid);
});
test('validateOnly ends without requestId or diagnostics and HTTP warnings remain explicit',()=>{
 const v=scenarios.step(scenarios.start('validate'));assert.equal(v.phase,'validated');assert.equal(v.requestId,null);scenarios.step(v);assert.equal(v.history.length,1);
 const w=scenarios.step(scenarios.start('warnings'));assert.equal(w.phase,'pending');assert.equal(w.warnings.length,1);assert.equal(w.history[0].source,'simulador');
});
test('API simulator applies virtual backoff, preserves transaction and never completes PROCESSING early',()=>{
 const s=scenarios.start('transient');scenarios.step(s,()=>.5);assert.equal(s.nextAt,1000);scenarios.step(s);assert.equal(s.history.length,1);scenarios.tick(s,1000);scenarios.step(s);assert(s.requestId);scenarios.tick(s,1000);scenarios.step(s);assert.equal(s.phase,'waiting');scenarios.tick(s,s.nextAt-s.now);scenarios.step(s);assert.equal(s.phase,'processed');assert.equal(s.transactionId,'TEST-CENARIO-001');assert.equal(s.history.at(-1).operation,'requestStatus.retrieve');
});
test('daily quota and access failures stop retries; transient retries have a ceiling',()=>{
 for(const id of ['daily','permission']){const s=scenarios.step(scenarios.start(id));assert.equal(s.phase,'blocked');scenarios.tick(s,99999);scenarios.step(s);assert.equal(s.history.length,1)}
 const s=scenarios.start('exhausted');for(let i=0;i<8;i++){scenarios.tick(s,20000);scenarios.step(s)}assert.equal(s.phase,'exhausted');assert.equal(s.history.length,4);
 const f=scenarios.start('failed');scenarios.step(f);scenarios.tick(f,1000);scenarios.step(f);assert.equal(f.phase,'failed');
});
