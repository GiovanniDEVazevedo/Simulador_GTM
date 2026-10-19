(function(){
  'use strict';
  const app=window.TagLab,storage=window.TagLabStorage,missions=window.TagLabMissions,contracts=window.TagLabContracts,skills=window.TagLabCompetencies,evidence=window.TagLabEvidence,$=s=>document.querySelector(s);
  if(!app||!storage||!missions||!$('#missoes'))return;
  const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
  const button=(text,action)=>{const n=el('button',text,'secondary');n.type='button';n.onclick=action;return n};
  const download=(name,value)=>{const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'})),a=el('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
  let state=missions.hydrate(storage.readJSON('taglab_missions_v1')),selected=missions.definitions[0].id;
  const save=()=>storage.writeJSON('taglab_missions_v1',state);
  const notice=text=>$('#mission-message').textContent=text;
  for(const m of missions.definitions){const option=el('option',m.title);option.value=m.id;$('#mission-select').append(option)}
  function renderMission(){
    const m=missions.definitions.find(x=>x.id===selected),record=state.missions[m.id],pending=missions.pending(state,m.id);
    $('#mission-title').textContent=m.title;$('#mission-objective').textContent=m.objective;
    $('#mission-prerequisites').textContent=pending.length?'Recomendação antes desta missão: '+pending.map(id=>missions.definitions.find(x=>x.id===id).title).join(', ')+'. Você pode estudar livremente.':'Requisitos recomendados atendidos ou missão inicial.';
    $('#mission-steps').replaceChildren(...m.steps.map(s=>el('li',s)));$('#mission-expected').textContent=m.expected;
    $('#mission-explanation').value=record?.explanation||'';
    $('#mission-status').textContent=record?.selfAssessed?'Autoavaliação concluída · revisão do tutor fora do site':'Em estudo · conclusão local';
    const list=$('#mission-evidence-list');list.replaceChildren();for(const e of record?.evidence||[])list.append(el('li',e.label+' · '+e.source+' · '+(e.reference||e.eventName||'registro local')+' · '+new Date(e.observedAt).toLocaleString('pt-BR')));
    if(!list.children.length)list.append(el('li','Nenhuma evidência registrada.'));
    $('#mission-total').textContent=missions.definitions.filter(m=>state.missions[m.id]?.selfAssessed).length+' / '+missions.definitions.length;
  }
  $('#mission-select').onchange=()=>{selected=$('#mission-select').value;notice('');renderMission()};
  $('#mission-open-lab').onclick=()=>app.navigate(missions.definitions.find(m=>m.id===selected).tab);
  $('#mission-study').onclick=()=>{const m=missions.definitions.find(m=>m.id===selected);window.dispatchEvent(new CustomEvent('taglab:study',{detail:{ids:m.questionIds,kind:'missao'}}))};
  $('#mission-capture').onclick=()=>{
    const m=missions.definitions.find(m=>m.id===selected),found=[...app.getEvents()].reverse().find(x=>m.events.includes(x.payload.event));
    if(!found){notice(m.events.length?'Execute no laboratório um evento desta missão: '+m.events.join(', ')+'.':'Esta missão usa simulação ou evidência externa declarada; registre o nível apropriado.');return}
    missions.record(state,selected,evidence.create('local_push',{environment:location.origin,eventName:found.payload.event,observedAt:found.evidence?.observedAt}));save();renderMission();notice('Push '+found.payload.event+' registrado como evidência local. O payload de identidade não foi salvo na missão.');
  };
  for(const [level,label]of Object.entries(evidence.levels)){const option=el('option',label);option.value=level;$('#mission-evidence-level').append(option)}
  $('#mission-add-evidence').onclick=()=>{try{const level=$('#mission-evidence-level').value;if(level==='local_push')throw Error('Use Capturar evento local para comprovar esse nível.');missions.record(state,selected,evidence.create(level,{environment:location.origin,declaredBy:'aluno',reference:$('#mission-reference').value}));save();renderMission();notice(level==='simulation'?'Prévia simulada registrada.':'Declaração do aluno registrada. O site não verificou essa conta externa.')}catch(error){notice(error.message)}};
  $('#mission-complete').onclick=()=>{try{missions.complete(state,selected,$('#mission-explanation').value);save();renderMission();notice('Autoavaliação concluída. Exporte o material para a revisão do tutor.')}catch(error){notice(error.message)}};
  $('#mission-explanation').addEventListener('input',()=>{state.missions[selected]??={version:1,evidence:[],selfAssessed:false,explanation:''};state.missions[selected].explanation=$('#mission-explanation').value;state.missions[selected].selfAssessed=false;save()});
  $('#mission-export').onclick=()=>download('taglab-missoes-evidencias.json',{module:'taglab-missions',exportedAt:new Date().toISOString(),scope:'Autoavaliação local; evidências externas declaradas pelo aluno; sem aprovação protegida.',progress:missions.hydrate(state)});
  renderMission();

  const previous=[];
  function checkContract(){const result=contracts.check($('#contract-json').value,$('#contract-event').value,previous),box=$('#contract-results');box.replaceChildren();box.append(el('p',result.valid?'Contrato local atendido. Confira também Preview, Network e destino.':'Revise o contrato local.',result.valid?'answer-correct':'answer-incorrect'));for(const issue of [...result.errors,...result.warnings])box.append(el('p',issue.path+' — '+issue.message));if(result.transaction&&!previous.some(x=>x.transactionId===result.transaction.transactionId))previous.push(result.transaction);return result}
  $('#contract-example').onclick=()=>{$('#contract-json').value=JSON.stringify(contracts.sample($('#contract-event').value),null,2);$('#contract-results').replaceChildren()};
  $('#contract-capture').onclick=()=>{const name=$('#contract-event').value,found=[...app.getEvents()].reverse().find(x=>x.payload.event===name);if(found){$('#contract-json').value=JSON.stringify(found.payload,null,2);checkContract()}else $('#contract-results').replaceChildren(el('p','Execute '+name+' na loja antes de capturar.'))};
  $('#contract-check').onclick=checkContract;$('#contract-json').addEventListener('input',()=>$('#contract-results').replaceChildren());$('#contract-event').onchange=()=>$('#contract-results').replaceChildren();$('#contract-example').click();
  let activeFault=null;
  for(const fault of contracts.faults){const option=el('option',fault.title);option.value=fault.id;$('#fault-select').append(option)}
  function exitFault(){activeFault=null;$('#fault-editor').hidden=true;$('#fault-json').value='';$('#fault-feedback').textContent='Cenário inativo. Loja e tags preservam o fluxo normal.';$('#fault-assistance').textContent='';$('#fault-explanation').value='';$('#fault-solution').open=false;}
  function startFault(){activeFault=$('#fault-select').value;const f=contracts.faults.find(x=>x.id===activeFault);$('#fault-editor').hidden=false;$('#fault-objective').textContent=f.objective;$('#fault-json').value=JSON.stringify(f.broken,null,2);$('#fault-feedback').textContent='Simulação ativada. Encontre a causa, altere o JSON e confira.';$('#fault-solution-code').textContent=JSON.stringify(f.solution,null,2);$('#fault-solution').open=false;$('#fault-assistance').textContent='Sem consulta nesta tentativa.';$('#fault-explanation').value='';}
  $('#fault-start').onclick=startFault;$('#fault-reset').onclick=startFault;$('#fault-exit').onclick=exitFault;
  $('#fault-check').onclick=()=>{if(!activeFault)return;const result=contracts.diagnose(activeFault,$('#fault-json').value);$('#fault-feedback').textContent=result.valid&&$('#fault-explanation').value.trim().length<40?'JSON corrigido. Explique a causa e a recuperação em pelo menos 40 caracteres para concluir a prática.':result.message;};
  $('#fault-json').addEventListener('input',()=>$('#fault-feedback').textContent='Alteração pendente de nova correção.');
  $('#fault-solution').addEventListener('toggle',()=>{if($('#fault-solution').open)$('#fault-assistance').textContent='Com consulta nesta tentativa; abrir a solução não conclui a prática.'});
  window.addEventListener('taglab:navigate',event=>{if(event.detail!=='pratica'&&activeFault)exitFault()});exitFault();

  let choice=null,assisted=false;const savedDecisions=storage.readJSON('taglab_decisions_v1',{}),decisionState={};for(const c of skills.decisions){const old=savedDecisions?.[c.id];if(old&&Number.isInteger(old.attempts)&&old.attempts>=0)decisionState[c.id]={attempts:Math.min(10000,old.attempts),correct:old.correct===true,assisted:old.assisted===true}}
  for(const c of skills.decisions){const option=el('option',c.title+' · '+skills.labels[c.id]);option.value=c.id;$('#decision-select').append(option)}
  function renderDecision(){choice=null;assisted=false;const c=skills.decisions.find(x=>x.id===$('#decision-select').value);$('#decision-question').textContent=c.question;const list=$('#decision-options');list.replaceChildren();c.options.forEach((text,index)=>{const label=el('label',undefined,'quiz-option'),radio=el('input');radio.type='radio';radio.name='decision-answer';radio.value=index;radio.onchange=()=>choice=index;label.append(radio,document.createTextNode(text));list.append(label)});$('#decision-feedback').textContent='';$('#decision-explanation').textContent=c.why+' Impacto: '+c.impact;$('#decision-source').href=c.source;$('#decision-solution').open=false;const old=decisionState[c.id];$('#decision-progress').textContent=old?'Histórico local: '+Number(old.attempts||0)+' tentativa(s); última '+(old.correct?'correta':'incorreta')+'.':'Sem tentativa neste caso.';}
  $('#decision-select').onchange=renderDecision;
  $('#decision-solution').addEventListener('toggle',()=>{if($('#decision-solution').open)assisted=true});
  $('#decision-submit').onclick=()=>{const c=skills.decisions.find(x=>x.id===$('#decision-select').value);if(choice===null){$('#decision-feedback').textContent='Selecione uma resposta.';return}const correct=choice===c.correct;decisionState[c.id]={attempts:Math.min(10000,Number(decisionState[c.id]?.attempts||0)+1),correct,assisted};storage.writeJSON('taglab_decisions_v1',decisionState);$('#decision-feedback').textContent=(correct?'Resposta correta. ':'Revise a escolha. ')+c.why+' Impacto: '+c.impact+(assisted?' Tentativa com consulta.':' Tentativa sem consulta.');};
  $('#decision-practice').onclick=()=>app.navigate(skills.decisions.find(x=>x.id===$('#decision-select').value).practice);renderDecision();
})();
