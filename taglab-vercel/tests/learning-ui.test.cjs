const {test}=require('node:test'),assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');const core=require('../public/learning-core.js');
function setup(storage={}){
 const nodes=new Map(),navigation=[];
 class Node{constructor(tag='div'){this.tag=tag;this.children=[];this.classList={add(){}};this.textContent='';this.value='';this.hidden=false;this.disabled=false;this.listeners={};this.attrs={};}set id(v){this._id=v;nodes.set('#'+v,this)}get id(){return this._id}append(...c){this.children.push(...c)}replaceChildren(){this.children=[]}focus(){this.focused=true}setAttribute(k,v){this.attrs[k]=v}addEventListener(k,f){this.listeners[k]=f}}
 const get=s=>{if(!nodes.has(s))nodes.set(s,new Node());return nodes.get(s)};get('#learning-size').value='10';
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../public/learning-lab.js'),'utf8'),{window:{TagLabLearning:core,TagLab:{navigate:tab=>navigation.push(tab)}},document:{querySelector:get,createElement:t=>new Node(t),createTextNode:text=>({textContent:text})},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},console});
 const walk=n=>n.children.flatMap(c=>[c,...(c.children?walk(c):[])]);const current=()=>{const field=get('#learning-questions').children[0];return core.questions.find(q=>'question-'+q.id===field.id)};
 const answer=(correct=true)=>{const q=current(),i=correct?q.correct:(q.correct+1)%4;walk(get('#learning-questions')).find(n=>n.tag==='input'&&n.type==='radio'&&n.value===String(i)).onchange()};
 const click=id=>get('#learning-'+id).onclick();const filter=(name,value)=>{get('#learning-'+name).value=value;get('#learning-'+name).listeners[name==='search'?'input':'change']()};
 return {get,storage,navigation,walk,current,answer,click,filter,state:()=>JSON.parse(storage.taglab_learning_v2)};
}
test('bank filters, sampling, question navigation, grading and error review work together',()=>{
 const s=setup();assert.match(s.get('#learning-bank-result').textContent,/96 de 96/);assert.equal(s.get('#learning-bank-list').children.length,8);
 s.filter('topic','offline');s.get('#learning-size').value='all';s.click('use-filters');s.click('start');assert.equal(s.state().session.ids.length,12);s.click('grade');assert.match(s.get('#learning-message').textContent,/Faltam 12/);
 for(let i=0;i<12;i++){s.answer(i!==0);if(i<11)s.click('question-next')}s.click('grade');assert.match(s.get('#learning-message').textContent,/11 de 12/);assert.equal(s.state().history.length,1);assert.equal(s.get('#learning-retry').hidden,false);
 s.click('retry');assert.equal(s.state().session.ids.length,1);s.answer();s.click('grade');assert.match(s.get('#learning-message').textContent,/1 de 1/);assert.equal(s.state().history.length,2);assert.equal(core.progress(s.state()).wrongIds.length,0);
 const restored=setup(s.storage);assert(restored.state().session.graded);assert.equal(restored.get('#learning-grade').disabled,true);
});
test('bookmarks can filter the library; changing filters preserves the active draft',()=>{
 const s=setup();s.get('#learning-bank-list').children[0].children.at(-1).onclick();s.get('#learning-bookmarked-only').checked=true;s.get('#learning-bookmarked-only').listeners.change();assert.match(s.get('#learning-bank-result').textContent,/1 de 96/);
 s.get('#learning-size').value='all';s.click('use-filters');s.click('start');s.answer();const id=s.state().session.ids[0];s.click('view-bank');s.filter('topic','ga4');assert.equal(s.state().session.ids[0],id);
 s.click('view-session');assert.equal(s.current().id,id);assert.equal(Object.keys(s.state().session.answers).length,1);const resumed=setup(s.storage);assert.equal(resumed.current().id,id);assert.equal(Object.keys(resumed.state().session.answers).length,1);
});
test('legacy state stays available and task self-assessment survives migration',()=>{
 const s=setup({taglab_learning_v1:JSON.stringify({version:1,tasks:{oci:true},best:92,ids:['oci-key'],answers:{'oci-key':1},graded:true})});assert.equal(s.state().legacyBest,92);assert.equal(s.state().session.kind,'legado');assert.equal(s.get('#learning-note').hidden,false);
 s.click('view-progress');assert.equal(s.get('#learning-task-count').textContent,'1 / 16');const first=s.get('#learning-tasks').children[0];first.children.at(-1).onclick();assert.deepEqual(s.navigation,['offline']);s.click('reset-tasks');assert.equal(s.get('#learning-task-count').textContent,'0 / 16');
});
