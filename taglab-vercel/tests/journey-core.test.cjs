const {test}=require('node:test'),assert=require('node:assert/strict');
const contracts=require('../public/event-contracts.js'),missions=require('../public/missions-core.js'),evidence=require('../public/evidence-core.js'),skills=require('../public/competencies-core.js'),bank=require('../public/question-bank.js');
test('event checker locates errors, accepts zero and cents, preserves input and separates extra fields from violations',()=>{
 const x=contracts.sample(),before=JSON.stringify(x);assert(contracts.check(x).valid);assert.equal(JSON.stringify(x),before);
 delete x.ecommerce.transaction_id;assert(contracts.check(x).errors.some(x=>x.path==='ecommerce.transaction_id'));
 const zero=contracts.sample();zero.ecommerce.value=0;zero.ecommerce.items[0].price=0;zero.extra='allowed';assert(contracts.check(zero).valid);
 zero.ecommerce.items[0].quantity=0;assert(!contracts.check(zero).valid);assert(!contracts.check('{').valid);assert(!contracts.check(null).valid);
});
test('reused reference with another sale differs from a retry of the same payload',()=>{
 const x=contracts.sample(),t=contracts.check(x).transaction;assert.equal(contracts.check(x,'purchase',[t]).warnings.length,1);
 x.ecommerce.items[0].price=50;x.ecommerce.value=100;assert(contracts.check(x,'purchase',[t]).errors.some(x=>x.path==='ecommerce.transaction_id'));
});
test('all fault cases reject their defect, accept correction and preserve essential case records',()=>{
 for(const f of contracts.faults){assert(!contracts.diagnose(f.id,f.broken).valid);assert(contracts.diagnose(f.id,f.solution).valid);assert(!contracts.diagnose(f.id,'{').valid)}
 const bad=structuredClone(contracts.faults[2].solution);bad.ad_user_data='granted';assert(!contracts.diagnose('stale',bad).valid);
 const missing=structuredClone(contracts.faults[3].solution);missing.sales.pop();assert(!contracts.diagnose('transaction',missing).valid);
});
test('missions reuse real question IDs, retain advisory prerequisites and require explained evidence for self-assessment',()=>{
 const s=missions.hydrate(null);for(const m of missions.definitions){assert(m.questionIds.every(id=>bank.questions.some(q=>q.id===id)));assert(m.version);}
 assert.deepEqual(missions.pending(s,'consent'),['ecommerce']);assert.throws(()=>missions.complete(s,'ecommerce','x'),/evidência/);
 missions.record(s,'ecommerce',evidence.create('local_push'));assert.throws(()=>missions.complete(s,'ecommerce','curta'),/40/);
 missions.complete(s,'ecommerce','Comparei o payload local e ainda falta verificar o recebimento no GA4.');assert.deepEqual(missions.pending(s,'consent'),[]);
 const restored=missions.hydrate(s);assert(restored.missions.ecommerce.selfAssessed);assert.equal(restored.missions.ecommerce.evidence[0].verifiedByTutor,false);
});
test('mission migration rejects invented external proof and drops approval and token fields',()=>{
 const s=missions.hydrate({missions:{ecommerce:{selfAssessed:true,token:'secret',evidence:[{version:1,level:'destination',declaredBy:'aplicacao',reference:'fake'},{...evidence.create('simulation'),verifiedByTutor:true}]},unknown:{selfAssessed:true}}});
 assert.equal(s.missions.ecommerce.evidence.length,1);assert.equal(s.missions.ecommerce.evidence[0].verifiedByTutor,false);assert(!JSON.stringify(s).includes('secret'));assert(!s.missions.unknown);
});
test('competencies cover the bank and decision cases have practical feedback and official sources',()=>{
 assert(skills.classify(bank.questions.find(q=>q.topic==='data-manager')).includes('api'));
 for(const c of skills.decisions){assert(skills.labels[c.id]);assert(c.options[c.correct]);assert(c.why.length>40);assert(c.impact.length>30);assert(['developers.google.com','support.google.com'].includes(new URL(c.source).hostname));}
 const report=skills.progress(bank.questions,{[bank.questions[0].id]:{lastCorrect:false}});assert(report.some(x=>x.wrongIds.length));assert(report.every(x=>x.total>0));
});
