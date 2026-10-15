const {test}=require('node:test'),assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const core=require('../public/learning-core.js');
function setup(storage={}){
 const nodes=new Map(),navigation=[];
 class Node{
  constructor(tag='div'){this.tag=tag;this.children=[];this.classList={add(){}};this.textContent='';this.hidden=false;this.disabled=false;}
  set id(value){this._id=value;nodes.set('#'+value,this)}get id(){return this._id}
  append(...children){this.children.push(...children)}replaceChildren(){this.children=[]}focus(){this.focused=true}
 }
 const get=s=>{if(!nodes.has(s))nodes.set(s,new Node());return nodes.get(s)};
 const window={TagLabLearning:core,TagLab:{navigate:tab=>navigation.push(tab)}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../public/learning-lab.js'),'utf8'),{window,document:{querySelector:get,createElement:tag=>new Node(tag),createTextNode:text=>({textContent:text})},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},console});
 const descendants=node=>node.children.flatMap(n=>[n,...(n.children?descendants(n):[])]);
 const radios=()=>descendants(get('#learning-questions')).filter(n=>n.tag==='input');
 const answer=(id,index)=>radios().find(n=>n.name==='quiz-'+id&&n.value===String(index)).onchange();
 return {get,storage,navigation,radios,answer,submit:()=>get('#learning-quiz').onsubmit({preventDefault(){}})};
}
test('quiz requires answers, grades explanations, retries errors and preserves full best',()=>{
 const s=setup();s.submit();assert.match(s.get('#learning-message').textContent,/Faltam 12/);
 for(const q of core.questions)s.answer(q.id,q.id===core.questions[0].id?(q.correct+1)%4:q.correct);
 s.submit();assert.match(s.get('#learning-message').textContent,/11 de 12/);assert.equal(s.get('#learning-best').textContent,'92%');assert(s.radios().every(n=>n.disabled));assert.equal(s.get('#learning-retry').hidden,false);
 s.get('#learning-retry').onclick();assert.equal(s.radios().length,4);s.answer(core.questions[0].id,core.questions[0].correct);s.submit();assert.match(s.get('#learning-message').textContent,/1 de 1/);assert.equal(s.get('#learning-best').textContent,'92%');
 const restored=setup(s.storage);assert.match(restored.get('#learning-message').textContent,/1 de 1/);assert.equal(restored.get('#learning-best').textContent,'92%');
 restored.get('#learning-restart').onclick();assert.equal(restored.radios().length,48);assert.equal(restored.get('#learning-best').textContent,'92%');
});
test('task self-assessment is stored separately and links to the right lab',()=>{
 const s=setup();const first=s.get('#learning-tasks').children[0];const input=first.children[0].children[0];input.checked=true;input.onchange();assert.equal(s.get('#learning-task-count').textContent,'1 / 8');first.children.at(-1).onclick();assert.deepEqual(s.navigation,['offline']);
 const restored=setup(s.storage);assert.equal(restored.get('#learning-task-count').textContent,'1 / 8');restored.get('#learning-reset-tasks').onclick();assert.equal(restored.get('#learning-task-count').textContent,'0 / 8');
});
