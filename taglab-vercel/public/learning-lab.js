(function(){
  'use strict';
  const core=window.TagLabLearning,app=window.TagLab,$=s=>document.querySelector(s);
  if(!core||!app||!$('#exercicios'))return;
  const key='taglab_learning_v2',bank=core.bank,pageSize=8;
  function read(k){try{return JSON.parse(localStorage.getItem(k))}catch{return null}}
  const saved=read(key);let state=core.hydrate(saved,read('taglab_learning_v1'));
  let view=['bank','session','progress'].includes(saved?.view)?saved.view:'bank',page=0;
  function save(){try{localStorage.setItem(key,JSON.stringify({...state,view}))}catch{$('#learning-note').hidden=false;$('#learning-note').textContent='O navegador bloqueou a gravação. Seu estudo continua em memória nesta página.'}}
  function el(tag,text,cls){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node}
  function button(text,fn,cls='secondary'){const node=el('button',text,cls);node.type='button';node.onclick=fn;return node}
  function notify(text,error=false){$('#learning-message').textContent=text;$('#learning-message').className='notice'+(error?' upd-error':'')}
  function sourceLinks(q){const list=el('ul',undefined,'question-sources');for(const id of q.sourceIds){const source=bank.sources[id],a=el('a',source.title+' ↗');a.href=source.url;a.target='_blank';a.rel='noopener';const item=el('li');item.append(a);list.append(item)}return list}
  function bookmark(q){const b=button('',()=>{state.bookmarks=state.bookmarks.includes(q.id)?state.bookmarks.filter(id=>id!==q.id):[...state.bookmarks,q.id];save();b.textContent=state.bookmarks.includes(q.id)?'★ Marcada para revisar':'☆ Marcar para revisar';b.setAttribute('aria-pressed',String(state.bookmarks.includes(q.id)));if(view==='bank')renderBank();renderStats()},'ghost');b.textContent=state.bookmarks.includes(q.id)?'★ Marcada para revisar':'☆ Marcar para revisar';b.setAttribute('aria-pressed',String(state.bookmarks.includes(q.id)));return b}
  function feedback(q,correct){const box=el('div',undefined,'question-explanation');if(correct!==undefined)box.append(el('p',correct?'Acertou.':'Revisar.',correct?'answer-correct':'answer-incorrect'));box.append(el('p','Resposta correta: '+q.options[q.correct]),el('p',q.explanation),el('p','Impacto no conjunto: '+q.impact));const task=core.tasks.find(t=>t.id===q.practiceId);box.append(button('Praticar: '+task.title,()=>app.navigate(task.tab),'ghost'),sourceLinks(q),el('p','Revisão da fonte: '+q.reviewedAt+' · '+(q.scope==='laboratorio'?'Regra ou caso do laboratório':'Aplicação do conceito do produto'),'muted'));return box}
  function metadata(q){return el('p',core.topicTitle(q.topic)+' · '+core.levels[q.level]+' · '+core.kinds[q.kind]+' · '+q.tools.join(' / '),'quiz-topic')}
  function renderStats(){
    $('#learning-bank-total').textContent=core.questions.length+' questões';$('#learning-bank-meta').textContent=core.topics.length+' temas · '+Object.keys(bank.sources).length+' fontes oficiais';
    $('#learning-task-count').textContent=core.tasks.filter(t=>state.tasks[t.id]).length+' / '+core.tasks.length;
    const last=state.history[0];$('#learning-last').textContent=last?last.score+' / '+last.total+' · '+last.percent+'%':'—';
  }
  function chooseView(name){view=name;for(const v of ['bank','session','progress']){$('#learning-'+v+'-view').hidden=v!==view;$('#learning-view-'+v).setAttribute('aria-pressed',String(v===view))}if(view==='progress')renderProgress();if(view==='bank')renderBank();if(view==='session')renderSession();save()}
  function renderBank(){
    const pool=core.filterQuestions(state.filters,state.bookmarks),pages=Math.max(1,Math.ceil(pool.length/pageSize));page=Math.max(0,Math.min(page,pages-1));
    $('#learning-bank-result').textContent=pool.length+' de '+core.questions.length+' questões encontradas.';
    $('#learning-bank-page').textContent='Página '+(page+1)+' / '+pages;
    $('#learning-bank-prev').disabled=page===0;$('#learning-bank-next').disabled=page>=pages-1;
    $('#learning-pool-description').textContent='Os filtros atuais selecionam '+pool.length+' questões. O sorteio usa até a quantidade escolhida, sem repetir questões na mesma tentativa.';
    $('#learning-start').disabled=!pool.length;
    const list=$('#learning-bank-list');list.replaceChildren();
    if(!pool.length)list.append(el('div','Nenhuma questão combina com os filtros. Tente remover um filtro ou marcar itens para revisão.','notice'));
    for(const q of pool.slice(page*pageSize,(page+1)*pageSize)){const card=el('article',undefined,'card bank-question');card.append(metadata(q));const details=el('details'),summary=el('summary',q.question);details.append(summary);const options=el('ol');options.type='A';for(const text of q.options)options.append(el('li',text));details.append(options);const answer=el('details',undefined,'bank-answer');answer.append(el('summary','Ver gabarito, impacto e fontes'),feedback(q));details.append(answer);card.append(details,bookmark(q));list.append(card)}
  }
  function syncFilterInputs(){for(const [key,selector]of Object.entries({query:'search',topic:'topic',level:'level',tool:'tool',kind:'kind'}))$('#learning-'+selector).value=state.filters[key]||'';$('#learning-bookmarked-only').checked=state.filters.bookmarkedOnly}
  function readFilters(){state.filters=core.hydrate({version:2,filters:{query:$('#learning-search').value,topic:$('#learning-topic').value,level:$('#learning-level').value,tool:$('#learning-tool').value,kind:$('#learning-kind').value,bookmarkedOnly:$('#learning-bookmarked-only').checked}}).filters;page=0;save();renderBank()}
  for(const t of core.topics){const option=el('option',t.label);option.value=t.id;$('#learning-topic').append(option)}
  for(const [selector,options]of [['level',Object.entries(core.levels)],['kind',Object.entries(core.kinds)],['tool',core.tools.map(t=>[t,t])]])for(const [value,label]of options){const option=el('option',label);option.value=value;$('#learning-'+selector).append(option)}
  for(const id of ['search','topic','level','kind','tool','bookmarked-only'])$('#learning-'+id).addEventListener(id==='search'?'input':'change',readFilters);
  $('#learning-clear-filters').onclick=()=>{state.filters=core.hydrate(null).filters;syncFilterInputs();page=0;save();renderBank()};
  $('#learning-bank-prev').onclick=()=>{page--;renderBank();$('#learning-bank-list').focus()};$('#learning-bank-next').onclick=()=>{page++;renderBank();$('#learning-bank-list').focus()};
  for(const name of ['bank','session','progress'])$('#learning-view-'+name).onclick=()=>chooseView(name);
  $('#learning-use-filters').onclick=()=>chooseView('session');$('#learning-go-filters').onclick=()=>chooseView('bank');
  function begin(ids,kind){if(!ids.length)return false;state.session={ids,answers:{},graded:false,index:0,kind,at:new Date().toISOString()};save();chooseView('session');notify('Tentativa iniciada com '+ids.length+' questões. Seu rascunho é salvo neste navegador.');return true}
  $('#learning-start').onclick=()=>{const count=$('#learning-size').value;const ids=core.selectQuestions(state.filters,count==='all'?'all':Number(count),state.bookmarks);if(!begin(ids,'simulado'))notify('Nenhuma questão disponível com esses filtros.',true)};
  function renderJumps(){const list=$('#learning-jump');list.replaceChildren();const s=state.session;if(!s)return;for(const [i,id]of s.ids.entries()){const answered=Number.isInteger(s.answers[id]);const b=button(String(i+1),()=>{s.index=i;save();renderSession()},'question-jump'+(answered?' answered':'')+(s.index===i?' current':''));b.setAttribute('aria-label','Questão '+(i+1)+(answered?' respondida':' pendente'));if(s.index===i)b.setAttribute('aria-current','step');list.append(b)}}
  function renderSession(){
    const s=state.session;$('#learning-session-container').hidden=!s;if(!s)return;
    $('#learning-scope').textContent=(s.kind==='simulado'?'Simulado':s.kind==='legado'?'Tentativa anterior preservada':'Revisão')+' · '+s.ids.length+' questões';
    $('#learning-position').textContent='Questão '+(s.index+1)+' de '+s.ids.length;
    $('#learning-answered').textContent=s.ids.filter(id=>Number.isInteger(s.answers[id])).length+' / '+s.ids.length+' respondidas';
    renderJumps();const list=$('#learning-questions');list.replaceChildren();const q=core.questions.find(q=>q.id===s.ids[s.index]),field=el('fieldset',undefined,'quiz-question');field.id='question-'+q.id;field.tabIndex=-1;field.append(el('legend',q.question),metadata(q));
    for(const [index,text]of q.options.entries()){const label=el('label',undefined,'quiz-option'),input=el('input');input.type='radio';input.name='quiz-'+q.id;input.value=String(index);input.checked=s.answers[q.id]===index;input.disabled=s.graded;input.onchange=()=>{s.answers[q.id]=index;save();$('#learning-answered').textContent=s.ids.filter(id=>Number.isInteger(s.answers[id])).length+' / '+s.ids.length+' respondidas';renderJumps()};label.append(input,document.createTextNode(text));field.append(label)}
    field.append(bookmark(q));if(s.graded){const correct=s.answers[q.id]===q.correct;field.classList.add(correct?'quiz-correct':'quiz-incorrect');field.append(feedback(q,correct))}list.append(field);
    $('#learning-question-prev').disabled=s.index===0;$('#learning-question-next').disabled=s.index===s.ids.length-1;$('#learning-grade').disabled=s.graded;
    renderResult();
  }
  function renderResult(){const box=$('#learning-summary');box.replaceChildren();const s=state.session,result=s?.graded?core.grade(s.answers,s.ids):null;$('#learning-retry').hidden=!result?.complete||!result.reviewIds.length;if(!result?.complete)return;
    box.append(el('h3',result.score+' / '+result.total+' acertos · '+result.percent+'%'),el('p','Resultado desta seleção. Simulados com temas ou tamanhos diferentes não são comparações equivalentes.','muted'));
    const table=el('table'),head=el('thead'),row=el('tr');row.append(el('th','Tema'),el('th','Acertos'));head.append(row);table.append(head);const body=el('tbody');for(const [topic,score]of Object.entries(result.topics)){const tr=el('tr');tr.append(el('td',core.topicTitle(topic)),el('td',score.correct+' / '+score.total));body.append(tr)}table.append(body);const wrap=el('div',undefined,'table-wrap');wrap.append(table);box.append(wrap,el('p',result.reviewIds.length?'Navegue pelas questões para ler as explicações ou refaça apenas os erros.':'Todas corretas nesta seleção. Complete a avaliação com uma prática e explicação ao tutor.'));
  }
  $('#learning-question-prev').onclick=()=>{if(state.session.index>0)state.session.index--;save();renderSession()};$('#learning-question-next').onclick=()=>{if(state.session.index<state.session.ids.length-1)state.session.index++;save();renderSession()};
  $('#learning-grade').onclick=()=>{const s=state.session;if(!s||s.graded)return;const result=core.grade(s.answers,s.ids);if(!result.complete){s.index=s.ids.indexOf(result.missing[0]);save();renderSession();notify('Faltam '+result.missing.length+' resposta(s). Voltamos à primeira questão pendente.',true);$('#question-'+result.missing[0]).focus();return}s.graded=true;core.recordResult(state,result,new Date().toISOString());save();renderSession();renderStats();notify('Correção concluída: '+result.score+' de '+result.total+' respostas corretas. Abra as fontes e revise o impacto no conjunto.');};
  $('#learning-retry').onclick=()=>{const s=state.session;if(!s?.graded)return;const result=core.grade(s.answers,s.ids);begin(result.reviewIds,'revisao')};
  function renderTasks(){const list=$('#learning-tasks');list.replaceChildren();for(const task of core.tasks){const row=el('div',undefined,'upd-exercise'),label=el('label',undefined,'check'),input=el('input');input.type='checkbox';input.checked=!!state.tasks[task.id];input.onchange=()=>{state.tasks[task.id]=input.checked;save();renderStats()};label.append(input,document.createTextNode(task.title));const details=el('details');details.append(el('summary','Conferir resultado esperado'),el('p',task.expected));row.append(label,el('p',task.task),details,button('Abrir laboratório',()=>app.navigate(task.tab)));list.append(row)}}
  function renderProgress(){const p=core.progress(state);$('#learning-progress-summary').textContent=p.seen+' de '+core.questions.length+' questões já corrigidas. '+p.correct+' acertos em '+p.attempts+' respostas acumuladas. '+p.wrongIds.length+' questões têm a última resposta incorreta.';const body=$('#learning-topic-progress');body.replaceChildren();for(const t of p.topics){const row=el('tr');row.append(el('td',t.label),el('td',t.seen+' / '+t.total),el('td',t.attempts?t.correct+' / '+t.attempts+' · '+Math.round(t.correct/t.attempts*100)+'%':'—'));body.append(row)}$('#learning-review-mistakes').disabled=!p.wrongIds.length;$('#learning-legacy').hidden=state.legacyBest===null;if(state.legacyBest!==null)$('#learning-legacy').textContent='Melhor nota do questionário anterior de 12 itens: '+state.legacyBest+'%. Preservada como legado; não equivale a uma nota no banco novo.';
    const history=$('#learning-history');history.replaceChildren();if(!state.history.length)history.append(el('p','Nenhuma tentativa nova corrigida.'));for(const h of state.history)history.append(el('p',(h.at?new Date(h.at).toLocaleString('pt-BR'):'Data não registrada')+' · '+h.kind+' · '+h.score+' / '+h.total+' · '+h.percent+'%'));renderTasks();
  }
  $('#learning-review-mistakes').onclick=()=>{const ids=core.progress(state).wrongIds;if(!begin(ids,'erros'))$('#learning-progress-message').textContent='Não há questões com erro pendente no seu histórico.'};
  $('#learning-reset-tasks').onclick=()=>{state.tasks={};save();renderTasks();renderStats();$('#learning-progress-message').textContent='Marcações das tarefas zeradas.'};
  function download(name,data){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=el('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
  $('#learning-export').onclick=()=>download('taglab-progresso-de-estudo.json',{exportedAt:new Date().toISOString(),bankVersion:bank.version,progress:state,scope:'Progresso local de estudo; sem verificação das contas Google ou payloads de identidade.'});
  $('#learning-export-bank').onclick=()=>download('taglab-banco-questoes.json',bank);
  const sources=$('#learning-sources');for(const source of Object.values(bank.sources)){const item=el('li'),a=el('a',source.title+' ↗');a.href=source.url;a.target='_blank';a.rel='noopener';item.append(a);sources.append(item)}
  $('#learning-source-summary').textContent=Object.keys(bank.sources).length+' referências oficiais consultadas. Revisão editorial: '+bank.reviewedAt+'. O banco está salvo nos arquivos públicos do site e pode ser baixado em JSON.';
  if(state.legacyBest!==null){$('#learning-note').hidden=false;$('#learning-note').textContent='Seu progresso anterior foi preservado. A nota de 12 questões aparece como legado em Progresso e desafios.'}
  syncFilterInputs();renderStats();renderBank();renderSession();chooseView(view);
})();
