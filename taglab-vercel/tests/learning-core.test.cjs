const {test}=require('node:test'),assert=require('node:assert/strict');
const core=require('../public/learning-core.js');const {questions,tasks,grade}=core;
const correctAnswers=ids=>Object.fromEntries(questions.filter(q=>!ids||ids.includes(q.id)).map(q=>[q.id,q.correct]));
test('versioned bank has 96 original study items, eight balanced topics and vetted metadata',()=>{
 assert.equal(questions.length,96);assert.equal(new Set(questions.map(q=>q.id)).size,96);assert.equal(Object.keys(core.bank.sources).length,39);
 for(const topic of core.topics)assert.equal(questions.filter(q=>q.topic===topic.id).length,12);
 for(const q of questions){assert.equal(q.options.length,4);assert(q.options[q.correct]);assert(q.explanation.length>25);assert(q.impact.length>20);assert(tasks.some(t=>t.id===q.practiceId));assert(core.levels[q.level]);assert(core.kinds[q.kind]);assert(q.sourceIds.length);for(const id of q.sourceIds){const s=core.bank.sources[id];assert(s);assert(['developers.google.com','support.google.com'].includes(new URL(s.url).hostname));}}
 assert.equal(grade(correctAnswers()).percent,100);
});
test('filters combine topic, level, tool, kind, accented search and bookmarks',()=>{
 assert.equal(core.filterQuestions({topic:'ga4'}).length,12);
 assert.deepEqual(core.filterQuestions({query:'DUPLICACAO'}).map(q=>q.id),core.filterQuestions({query:'duplicação'}).map(q=>q.id));assert(core.filterQuestions({query:'duplicacao'}).length);
 const filtered=core.filterQuestions({topic:'consent',level:'intermediario',tool:'Consent Mode'});assert(filtered.length);assert(filtered.every(q=>q.topic==='consent'&&q.level==='intermediario'&&q.tools.includes('Consent Mode')));
 assert.equal(core.filterQuestions({bookmarkedOnly:true},['oci-key']).length,1);assert.equal(core.filterQuestions({topic:'ga4',bookmarkedOnly:true},['oci-key']).length,0);
});
test('sampling avoids repetition, covers available themes and clamps size',()=>{
 const selected=core.selectQuestions({},10,[],()=>.4);assert.equal(selected.length,10);assert.equal(new Set(selected).size,10);assert.equal(new Set(selected.map(id=>questions.find(q=>q.id===id).topic)).size,8);
 assert.equal(core.selectQuestions({topic:'ga4'},20).length,12);assert.equal(core.selectQuestions({},'all').length,96);assert.deepEqual(core.selectQuestions({query:'no-matches-xyz'},10),[]);assert.throws(()=>core.selectQuestions({},-1));
});
test('grading requires valid complete answers and targeted review has its own denominator',()=>{
 assert.equal(grade({}).complete,false);const a=correctAnswers();a[questions[0].id]='1';assert.deepEqual(grade(a).missing,[questions[0].id]);assert.throws(()=>grade({},['unknown']));assert.throws(()=>grade({},[questions[0].id,questions[0].id]));
 a[questions[0].id]=(questions[0].correct+1)%4;const result=grade(a);assert.equal(result.score,95);assert.deepEqual(result.reviewIds,[questions[0].id]);a[questions[0].id]=questions[0].correct;assert.equal(grade(a,result.reviewIds).total,1);
});
test('legacy migration preserves old progress without claiming a score for the new bank',()=>{
 const ids=questions.slice(0,12).map(q=>q.id);const state=core.hydrate(null,{version:1,answers:correctAnswers(ids),tasks:{oci:true},ids,graded:true,best:92});
 assert.equal(state.legacyBest,92);assert(state.tasks.oci);assert.equal(state.session.kind,'legado');assert.equal(state.session.ids.length,12);assert.equal(state.history.length,0);assert.equal(core.progress(state).attempts,0);
});
test('progress records attempts, pending errors and bounded history',()=>{
 const id=questions[0].id,state=core.hydrate(null);state.session={kind:'simulado'};const a={[id]:(questions[0].correct+1)%4};core.recordResult(state,grade(a,[id]),'2026-10-15T12:00:00Z');assert.deepEqual(core.progress(state).wrongIds,[id]);
 a[id]=questions[0].correct;for(let i=0;i<32;i++)core.recordResult(state,grade(a,[id]),'2026-10-15T13:00:00Z');assert.deepEqual(core.progress(state).wrongIds,[]);assert.equal(state.history.length,30);assert.equal(state.stats[id].attempts,33);assert.equal(state.stats[id].correct,32);
 const restored=core.hydrate(state);assert.equal(restored.stats[id].attempts,33);assert.equal(restored.history[0].bankVersion,3);assert.deepEqual(restored.history[0].questionIds,[id]);assert.equal(restored.history.length,30);
});
test('invalid persisted records are ignored without corrupting a session',()=>{
 const state=core.hydrate({version:2,filters:{topic:'unknown',level:'invalid'},bookmarks:['unknown','oci-key','oci-key'],stats:{'oci-key':{attempts:-1,correct:9}},session:{ids:['unknown'],answers:{}},history:[{total:999,score:999}]});
 assert.deepEqual(state.bookmarks,['oci-key']);assert.equal(state.filters.topic,'');assert.equal(state.session,null);assert.equal(state.history.length,0);assert.equal(core.progress(state).seen,0);
});

test('bank v3 preserves v2 draft, task marks and scores without inventing old question scope',()=>{
 const ids=questions.slice(0,8).map(q=>q.id),answers=correctAnswers(ids);
 const saved={version:2,bankVersion:2,session:{ids,answers,graded:true,index:4,kind:'simulado'},tasks:{oci:true},bookmarks:[ids[0]],stats:{[ids[0]]:{attempts:2,correct:1,lastCorrect:true}},history:[{score:7,total:8,percent:88,kind:'simulado',at:'2026-10-15T12:00:00Z'}]};
 const restored=core.hydrate(saved);assert.equal(restored.bankVersion,3);assert.equal(restored.session.index,4);assert(restored.session.graded);assert.deepEqual(restored.session.ids,ids);assert(restored.tasks.oci);assert.equal(restored.history[0].score,7);assert.equal(restored.history[0].bankVersion,null);assert.deepEqual(restored.history[0].questionIds,[]);assert.equal(core.progress(restored).seen,1);
});
test('Moodle GIFT preserves 96 questions, eight categories, answer keys and literal control characters',()=>{
 const text=core.exportGift(),lines=text.split('\n');assert.equal(lines.filter(l=>l.startsWith('$CATEGORY: ')).length,8);
 const decode=s=>s.replace(/\\([\\~=#{}:])/g,'$1');
 const splitFeedback=line=>{let escaped=false;for(let i=1;i<line.length;i++){if(escaped){escaped=false;continue}if(line[i]==='\\'){escaped=true;continue}if(line[i]==='#')return [line[0],decode(line.slice(1,i)),decode(line.slice(i+1))]}throw Error('Feedback separator missing')};
 let current=null,count=0;
 for(const line of lines){if(line.startsWith('::')){const m=line.match(/^::([^:]+)::\[plain\](.*) \{$/);assert(m);current={q:questions.find(q=>q.id===m[1]),options:[]};assert(current.q);assert.equal(decode(m[2]),current.q.question);count++;}else if(current&&line==='}'){
   assert.equal(current.options.length,4);assert.equal(current.options.filter(o=>o[0]==='=').length,1);assert.deepEqual(current.options.map(o=>o[1]),current.q.options);assert.equal(current.options.findIndex(o=>o[0]==='='),current.q.correct);current=null;
 }else if(current){const answer=splitFeedback(line);assert(answer[2].includes(current.q.explanation));assert(answer[2].includes(current.q.impact));for(const id of current.q.sourceIds)assert(answer[2].includes(core.bank.sources[id].url));current.options.push(answer);}}
 assert.equal(count,96);assert.equal(current,null);assert(text.includes('\\='));assert(text.includes('https\\:'));
});
