const {test}=require('node:test'),assert=require('node:assert/strict');
const core=require('../public/learning-core.js');const {questions,tasks,grade}=core;
const correctAnswers=ids=>Object.fromEntries(questions.filter(q=>!ids||ids.includes(q.id)).map(q=>[q.id,q.correct]));
test('versioned bank has 64 original study items, eight balanced topics and vetted metadata',()=>{
 assert.equal(questions.length,64);assert.equal(new Set(questions.map(q=>q.id)).size,64);assert.equal(Object.keys(core.bank.sources).length,37);
 for(const topic of core.topics)assert.equal(questions.filter(q=>q.topic===topic.id).length,8);
 for(const q of questions){assert.equal(q.options.length,4);assert(q.options[q.correct]);assert(q.explanation.length>25);assert(q.impact.length>20);assert(tasks.some(t=>t.id===q.practiceId));assert(core.levels[q.level]);assert(core.kinds[q.kind]);assert(q.sourceIds.length);for(const id of q.sourceIds){const s=core.bank.sources[id];assert(s);assert(['developers.google.com','support.google.com'].includes(new URL(s.url).hostname));}}
 assert.equal(grade(correctAnswers()).percent,100);
});
test('filters combine topic, level, tool, kind, accented search and bookmarks',()=>{
 assert.equal(core.filterQuestions({topic:'ga4'}).length,8);
 assert.deepEqual(core.filterQuestions({query:'DUPLICACAO'}).map(q=>q.id),core.filterQuestions({query:'duplicação'}).map(q=>q.id));assert(core.filterQuestions({query:'duplicacao'}).length);
 const filtered=core.filterQuestions({topic:'consent',level:'intermediario',tool:'Consent Mode'});assert(filtered.length);assert(filtered.every(q=>q.topic==='consent'&&q.level==='intermediario'&&q.tools.includes('Consent Mode')));
 assert.equal(core.filterQuestions({bookmarkedOnly:true},['oci-key']).length,1);assert.equal(core.filterQuestions({topic:'ga4',bookmarkedOnly:true},['oci-key']).length,0);
});
test('sampling avoids repetition, covers available themes and clamps size',()=>{
 const selected=core.selectQuestions({},10,[],()=>.4);assert.equal(selected.length,10);assert.equal(new Set(selected).size,10);assert.equal(new Set(selected.map(id=>questions.find(q=>q.id===id).topic)).size,8);
 assert.equal(core.selectQuestions({topic:'ga4'},20).length,8);assert.equal(core.selectQuestions({},'all').length,64);assert.deepEqual(core.selectQuestions({query:'no-matches-xyz'},10),[]);assert.throws(()=>core.selectQuestions({},-1));
});
test('grading requires valid complete answers and targeted review has its own denominator',()=>{
 assert.equal(grade({}).complete,false);const a=correctAnswers();a[questions[0].id]='1';assert.deepEqual(grade(a).missing,[questions[0].id]);assert.throws(()=>grade({},['unknown']));assert.throws(()=>grade({},[questions[0].id,questions[0].id]));
 a[questions[0].id]=(questions[0].correct+1)%4;const result=grade(a);assert.equal(result.score,63);assert.deepEqual(result.reviewIds,[questions[0].id]);a[questions[0].id]=questions[0].correct;assert.equal(grade(a,result.reviewIds).total,1);
});
test('legacy migration preserves old progress without claiming a score for the new bank',()=>{
 const ids=questions.slice(0,12).map(q=>q.id);const state=core.hydrate(null,{version:1,answers:correctAnswers(ids),tasks:{oci:true},ids,graded:true,best:92});
 assert.equal(state.legacyBest,92);assert(state.tasks.oci);assert.equal(state.session.kind,'legado');assert.equal(state.session.ids.length,12);assert.equal(state.history.length,0);assert.equal(core.progress(state).attempts,0);
});
test('progress records attempts, pending errors and bounded history',()=>{
 const id=questions[0].id,state=core.hydrate(null);state.session={kind:'simulado'};const a={[id]:(questions[0].correct+1)%4};core.recordResult(state,grade(a,[id]),'2026-10-15T12:00:00Z');assert.deepEqual(core.progress(state).wrongIds,[id]);
 a[id]=questions[0].correct;for(let i=0;i<32;i++)core.recordResult(state,grade(a,[id]),'2026-10-15T13:00:00Z');assert.deepEqual(core.progress(state).wrongIds,[]);assert.equal(state.history.length,30);assert.equal(state.stats[id].attempts,33);assert.equal(state.stats[id].correct,32);
 const restored=core.hydrate(state);assert.equal(restored.stats[id].attempts,33);assert.equal(restored.history.length,30);
});
test('invalid persisted records are ignored without corrupting a session',()=>{
 const state=core.hydrate({version:2,filters:{topic:'unknown',level:'invalid'},bookmarks:['unknown','oci-key','oci-key'],stats:{'oci-key':{attempts:-1,correct:9}},session:{ids:['unknown'],answers:{}},history:[{total:999,score:999}]});
 assert.deepEqual(state.bookmarks,['oci-key']);assert.equal(state.filters.topic,'');assert.equal(state.session,null);assert.equal(state.history.length,0);assert.equal(core.progress(state).seen,0);
});
