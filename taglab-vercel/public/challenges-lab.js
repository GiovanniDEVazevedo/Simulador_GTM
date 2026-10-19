(function(){
  'use strict';
  const core=window.TagLabChallenges,$=selector=>document.querySelector(selector);
  if(!core||!$('#desafios'))return;
  const storageKey='taglab_challenges_v1',drafts=new Map(),choices=new Map(),hints=new Map();
  let saved;try{saved=JSON.parse(window.TagLabStorage.getItem(storageKey))}catch{}
  const state=core.hydrate(saved);let selected=core.exercise(state.selected),filter='';
  function el(tag,text,className){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node}
  function progress(){return state.progress[selected.id]||(state.progress[selected.id]={attempts:0,passed:false,assisted:false})}
  function save(){
    state.selected=selected.id;
    // Never persist editor contents, headers, tokens, payloads or external evidence.
    try{if(!window.TagLabStorage.setItem(storageKey,JSON.stringify(state)))throw Error('storage')}catch{$('#challenge-storage-note').hidden=false}
  }
  function pool(){return core.exercises.filter(item=>!filter||item.type===filter)}
  function renderCatalog(){
    const selector=$('#challenge-select');selector.replaceChildren();
    for(const item of pool()){
      const option=el('option',String(core.exercises.indexOf(item)+1).padStart(2,'0')+' · '+item.title+(state.progress[item.id]?.passed?' · concluído':''));
      option.value=item.id;selector.append(option);
    }
    selector.value=selected.id;
    const list=pool(),index=list.indexOf(selected);
    $('#challenge-prev').disabled=index<=0;$('#challenge-next').disabled=index>=list.length-1;
    $('#challenge-position').textContent=(index+1)+' / '+list.length;
    $('#challenge-progress').textContent=core.exercises.filter(item=>state.progress[item.id]?.passed).length+' / '+core.exercises.length+' concluídos localmente';
  }
  function markAssisted(){progress().assisted=true;save();renderStatus()}
  function renderStatus(){
    const p=progress();
    $('#challenge-status').textContent=p.passed?(p.assisted?'Concluído localmente · com consulta':'Concluído localmente'):'Em prática';
    $('#challenge-attempts').textContent=p.attempts+' tentativa(s) · progresso neste navegador';
  }
  function stale(){
    $('#challenge-results').replaceChildren();$('#challenge-response').hidden=true;
    $('#challenge-feedback').textContent='Resposta alterada. Execute a correção para avaliar esta versão.';
    $('#challenge-feedback').className='notice';
    if(selected.type==='request')drafts.set(selected.id,readRequest());
  }
  function readRequest(){return {method:$('#challenge-method').value,url:$('#challenge-url').value,headers:$('#challenge-headers').value,body:$('#challenge-body').value}}
  function loadRequest(value){for(const field of ['method','url','headers','body'])$('#challenge-'+field).value=value[field]}
  function renderSolution(){
    const box=$('#challenge-solution-content');box.replaceChildren();
    if(selected.type==='read')box.append(el('p','Resposta: '+selected.options[selected.correct]));
    else{
      const value=core.solution(selected.id);
      box.append(el('p',value.method+' '+value.url),el('pre',value.headers,'challenge-code'),el('pre',value.body,'challenge-code'));
    }
    box.append(el('p',selected.explanation));
  }
  function render(){
    renderCatalog();renderStatus();
    $('#challenge-title').textContent=selected.title;
    $('#challenge-meta').textContent=selected.level+' · '+(selected.type==='read'?'Interpretar código':'Implementar requisição');
    $('#challenge-prompt').textContent=selected.prompt;
    $('#challenge-context-title').textContent=selected.type==='read'?'Código para analisar':'Dados fictícios do cenário';
    $('#challenge-context').textContent=selected.type==='read'?selected.code:JSON.stringify(selected.context,null,2);
    $('#challenge-scope').textContent=selected.type==='read'?'O trecho é material de leitura; não será executado.':'Use apenas os campos pedidos. O cenário tem data fixa; a correção é local e cobre estes critérios, não toda a API.';
    $('#challenge-reading').hidden=selected.type!=='read';$('#challenge-request').hidden=selected.type!=='request';
    $('#challenge-prepare').hidden=selected.id!=='corrigir-ecl';$('#challenge-prepared').hidden=true;
    $('#challenge-submit').textContent=selected.type==='read'?'Corrigir resposta':'Executar testes locais';
    const options=$('#challenge-options');options.replaceChildren();
    if(selected.type==='read')for(const [index,text]of selected.options.entries()){
      const label=el('label',undefined,'quiz-option'),input=el('input');
      input.type='radio';input.name='challenge-answer';input.value=String(index);input.checked=choices.get(selected.id)===index;
      input.onchange=()=>{choices.set(selected.id,index);stale()};
      label.append(input,el('span',text));options.append(label);
    }
    else loadRequest(drafts.get(selected.id)||core.starter(selected.id));
    $('#challenge-hints').replaceChildren();
    const shown=hints.get(selected.id)||0;for(const hint of selected.hints.slice(0,shown))$('#challenge-hints').append(el('p',hint));
    $('#challenge-hint').disabled=shown>=selected.hints.length;
    $('#challenge-hint').textContent=shown>=selected.hints.length?'Todas as dicas exibidas':'Ver dica '+(shown+1);
    $('#challenge-solution').open=false;$('#challenge-solution-content').replaceChildren();
    $('#challenge-results').replaceChildren();$('#challenge-response').hidden=true;
    $('#challenge-feedback').textContent='Leia o enunciado, tente resolver e use as dicas quando precisar.';$('#challenge-feedback').className='notice';
    $('#challenge-sources').replaceChildren();
    for(const id of selected.sourceIds){const source=core.sources[id],li=el('li'),a=el('a',source.title+' ↗');a.href=source.url;a.target='_blank';a.rel='noopener';li.append(a);$('#challenge-sources').append(li)}
    $('#challenge-reviewed').textContent='Critérios e fontes revisados em '+core.reviewedAt+'.';
    save();
  }
  function choose(id,focus=true){
    if(selected.type==='request')drafts.set(selected.id,readRequest());
    selected=core.exercise(id)||pool()[0];render();if(focus)$('#challenge-title').focus();
  }
  $('#challenge-filter').onchange=()=>{filter=$('#challenge-filter').value;const list=pool();choose(list.includes(selected)?selected.id:list[0].id,false)};
  $('#challenge-select').onchange=()=>choose($('#challenge-select').value);
  $('#challenge-prev').onclick=()=>{const list=pool();choose(list[Math.max(0,list.indexOf(selected)-1)].id)};
  $('#challenge-next').onclick=()=>{const list=pool();choose(list[Math.min(list.length-1,list.indexOf(selected)+1)].id)};
  for(const field of ['method','url','headers','body'])$('#challenge-'+field).addEventListener(field==='method'?'change':'input',stale);
  $('#challenge-reset-code').onclick=()=>{loadRequest(core.starter(selected.id));stale();$('#challenge-body').focus()};
  $('#challenge-format').onclick=()=>{
    const input=$('#challenge-body');
    try{const value=JSON.parse(input.value);input.value=JSON.stringify(value,null,2);stale();$('#challenge-feedback').textContent='JSON formatado. Execute os testes para conferir o conteúdo.'}
    catch{$('#challenge-feedback').textContent='Não foi possível formatar: confira a sintaxe JSON.';$('#challenge-feedback').className='notice upd-error'}
  };
  $('#challenge-hint').onclick=()=>{
    const count=Math.min((hints.get(selected.id)||0)+1,selected.hints.length);hints.set(selected.id,count);markAssisted();
    $('#challenge-hints').replaceChildren();for(const hint of selected.hints.slice(0,count))$('#challenge-hints').append(el('p',hint));
    $('#challenge-hint').disabled=count>=selected.hints.length;$('#challenge-hint').textContent=count>=selected.hints.length?'Todas as dicas exibidas':'Ver dica '+(count+1);
  };
  $('#challenge-solution').addEventListener('toggle',()=>{if($('#challenge-solution').open){markAssisted();renderSolution()}});
  $('#challenge-prepare').onclick=async()=>{
    const id=selected.id,box=$('#challenge-prepared');markAssisted();
    try{
      const prepared=await window.TagLabUPD.prepare(core.fixture.email,'');if(selected.id!==id)return;
      const raw=Uint8Array.from(prepared.hashed.sha256_email_address.match(/../g),byte=>parseInt(byte,16));
      box.textContent=JSON.stringify({normalizado:prepared.normalized.email,HEX:prepared.hashed.sha256_email_address,BASE64:btoa(String.fromCharCode(...raw))},null,2);
    }catch{if(selected.id!==id)return;box.textContent='Preparação indisponível. Use HTTPS e um navegador com Web Crypto, ou consulte a solução.'}
    box.hidden=false;
  };
  $('#challenge-submit').onclick=()=>{
    const result=selected.type==='read'?core.gradeChoice(selected.id,choices.get(selected.id)):core.gradeRequest(selected.id,readRequest());
    if(result.unanswered){$('#challenge-feedback').textContent='Selecione uma alternativa antes de corrigir.';return}
    const p=progress();p.attempts=Math.min(10000,p.attempts+1);p.passed=p.passed||result.passed;save();renderCatalog();renderStatus();
    const passed=result.checks.filter(check=>check.passed).length;
    $('#challenge-feedback').textContent=(result.passed?'Passou nesta execução. ':'Revise e tente novamente. ')+passed+' / '+result.checks.length+' critério(s) atendido(s).'+(selected.type==='request'?' Nenhuma chamada à API foi executada.':'');
    $('#challenge-feedback').className='notice'+(result.passed?' challenge-pass':' upd-error');
    $('#challenge-results').replaceChildren();
    for(const check of result.checks){
      const li=el('li',undefined,'challenge-check '+(check.passed?'passed':'failed'));
      li.append(el('strong',(check.passed?'✓ Atendido · ':'↻ Revisar · ')+check.label));
      li.append(el('p',check.passed&&selected.type==='request'?'Critério atendido nesta execução.':check.detail));
      $('#challenge-results').append(li);
    }
    $('#challenge-response').hidden=!result.simulatedResponse;
    if(result.simulatedResponse){$('#challenge-response-note').textContent=result.simulatedResponse.note;$('#challenge-response-json').textContent='HTTP '+result.simulatedResponse.http+'\n'+JSON.stringify(result.simulatedResponse.body,null,2)}
  };
  $('#challenge-export').onclick=()=>{
    const data={evidence:window.TagLabEvidence.create('simulation'),module:'taglab-data-manager-challenges',version:core.version,reviewedAt:core.reviewedAt,generatedAt:new Date().toISOString(),progress:core.hydrate(state).progress,scope:'Autoavaliação local. Não comprova conexão, ingestão, atribuição ou aprovação do tutor.'};
    const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=el('a');a.href=url;a.download='taglab-desafios-progresso.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  $('#challenge-clear-progress').onclick=()=>{state.progress={};save();renderCatalog();renderStatus();$('#challenge-feedback').textContent='Progresso desta área zerado. O banco de questões e os outros laboratórios mantêm seus registros.'};
  render();
})();
