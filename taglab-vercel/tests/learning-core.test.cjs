const {test}=require('node:test'),assert=require('node:assert/strict');
const {questions,tasks,grade}=require('../public/learning-core.js');
test('full quiz has unique questions, one valid answer and practical followups',()=>{
 assert.equal(questions.length,12);assert.equal(new Set(questions.map(q=>q.id)).size,12);
 for(const q of questions){assert.equal(q.options.length,4);assert(q.options[q.correct]);assert(q.explanation.length>30);assert(tasks.some(t=>t.id===q.practiceId));}
 const answers=Object.fromEntries(questions.map(q=>[q.id,q.correct]));const result=grade(answers);assert.equal(result.percent,100);assert.equal(result.reviewIds.length,0);
});
test('unanswered and malformed answers prevent grading',()=>{
 assert.equal(grade({}).complete,false);const answers=Object.fromEntries(questions.map(q=>[q.id,q.correct]));answers[questions[0].id]='1';const result=grade(answers);assert.deepEqual(result.missing,[questions[0].id]);
 assert.throws(()=>grade({},['unknown']));assert.throws(()=>grade({},[questions[0].id,questions[0].id]));
});
test('targeted review contains only errors and grades its own denominator',()=>{
 const answers=Object.fromEntries(questions.map(q=>[q.id,q.correct]));const q=questions[0];answers[q.id]=(q.correct+1)%4;
 const result=grade(answers);assert.equal(result.score,11);assert.deepEqual(result.reviewIds,[q.id]);answers[q.id]=q.correct;const review=grade(answers,result.reviewIds);assert.equal(review.total,1);assert.equal(review.percent,100);
 assert.equal(Object.values(result.topics).reduce((sum,t)=>sum+t.total,0),12);
});
