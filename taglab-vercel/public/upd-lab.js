(function () {
  'use strict';
  const core=window.TagLabUPD, app=window.TagLab, $=s=>document.querySelector(s);
  if (!core || !app) return;
  let busy=false, sent=false, revision=0, caseId=crypto.randomUUID(), transactionId='LAB-'+crypto.randomUUID(), latest=null;
  const receipts=[];
  const progressKey='taglab_upd_progress_v1';
  let progress={};try{progress=JSON.parse(localStorage.getItem(progressKey))||{}}catch{}
  const exercises=[
    ['normalize','Normalização antes do hash','Use o caso válido. Compare o e-mail com espaços/maiúsculas e o telefone formatado com a saída normalizada. Execute a verificação local.','O e-mail vira aluno.teste@example.com; o telefone vira +12025550123. SHA-256 tem 64 caracteres hexadecimais. Hash não é criptografia reversível.'],
    ['denied','Consentimento negado','Na aba Consentimento, recuse tudo. Gere a prévia do lead, depois envie ao GTM de teste.','lab_upd_allowed=false e lab_user_data=null. O evento de negócio ainda pode existir; a identidade não deve estar na variável UPD desse evento. Confira isso no Preview.'],
    ['lead','UPD no GA4','Configure as variáveis e a tag generate_lead. Conceda analytics_storage e ad_user_data, envie um novo caso e confira Tag Assistant + Network.','A variável UPD deve estar preenchida no evento lab_upd_lead. Procure generate_lead no DebugView e em não vazio na coleta. Isso confirma aspectos da implementação, não correspondência de usuário.'],
    ['format','Comparar raw e SHA-256','Envie dois novos casos: um normalizado e outro com SHA-256. Mantenha a variável Dados fornecidos pelo usuário como intermediária.','No dataLayer raw usa email/phone_number; hashed usa sha256_email_address/sha256_phone_number. Não envie o hash sob email nem faça hash duas vezes. Na requisição ao Google, não deve haver e-mail em claro.'],
    ['purchase','Conversão e repetição','Escolha compra, envie e tente clicar novamente. Crie outro caso e compare os IDs. Se tiver Ads, configure a ação de teste conforme o roteiro.','Um clique enviado bloqueia repetição local. Novo caso gera transaction_id diferente. O produto vale 49.90 BRL. Validação de tag não comprova atribuição em Ads.'],
    ['cleanup','Campo ausente, erro e revogação','Depois de um teste com telefone, envie novo caso somente com e-mail. Teste e-mail inválido. Por fim negue ad_user_data e gere novo caso.','Telefone ausente é omitido, não reutilizado. Dados inválidos não geram evento. Revogação remove todo lab_user_data do próximo payload. Após cada push, o objeto da camada é limpo.']
  ];
  function message(selector,text,error=false){const el=$(selector);el.textContent=text;el.className='upd-feedback'+(error?' upd-error':'')}
  function saveProgress(){try{localStorage.setItem(progressKey,JSON.stringify(progress))}catch{}$('#upd-progress').textContent=exercises.filter(([id])=>progress[id]).length+' / '+exercises.length}
  exercises.forEach(([id,title,task,answer],index)=>{const row=document.createElement('div');row.className='upd-exercise';const label=document.createElement('label');label.className='check';const input=document.createElement('input');input.type='checkbox';input.checked=!!progress[id];input.onchange=()=>{progress[id]=input.checked;saveProgress()};label.append(input,document.createTextNode((index+1)+'. '+title));const p=document.createElement('p');p.textContent=task;const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent='Conferir resultado esperado';const a=document.createElement('p');a.textContent=answer;details.append(summary,a);row.append(label,p,details);$('#upd-exercises').append(row)});saveProgress();
  function status(){const c=app.getConfig(),s=app.getConsent();$('#upd-mode-status').textContent='Modo do site: '+(c.mode==='gtm'?c.gtm:c.mode==='ga4'?'GA4 direto':'Somente dataLayer');$('#upd-consent-status').textContent='analytics_storage: '+s.analytics_storage+' · ad_user_data: '+s.ad_user_data;}
  window.addEventListener('taglab:consent',()=>{revision++;latest=null;$('#upd-payload').textContent='Consentimento alterado. Gere uma nova prévia.';status()});
  $('#upd-open-consent').onclick=()=>app.navigate('consentimento');status();
  function label(){const live=$('#upd-delivery').value==='gtm';$('#upd-send').textContent=busy?'Preparando…':sent&&live?'Enviado — crie novo caso':live?'Enviar ao GTM de teste':'Gerar prévia';$('#upd-send').disabled=busy||(live&&sent);}
  function invalidate(){revision++;latest=null;$('#upd-normalized').textContent='Dados alterados. Prepare novamente.';$('#upd-hashed').textContent='Ainda não calculado.';$('#upd-payload').textContent='{}';message('#upd-validation','');label();}
  ['#upd-email','#upd-phone','#upd-format','#upd-kind','#upd-delivery','#upd-armed'].forEach(sel=>$(sel).addEventListener('input',invalidate));
  $('#upd-preset').onchange=()=>{const cases={normal:[' Aluno.Teste@EXAMPLE.COM ','+1 (202) 555-0123'],email:[' aluno.teste@example.com ',''],invalid:['aluno.sem.arroba',''],phone:['aluno.teste@example.com','2025550123'],empty:['','']};const values=cases[$('#upd-preset').value];$('#upd-email').value=values[0];$('#upd-phone').value=values[1];invalidate()};
  async function preparation(){const before=revision;const result=await core.prepare($('#upd-email').value,$('#upd-phone').value);if(before!==revision)throw Error('Os dados ou o consentimento mudaram durante o cálculo. Gere novamente.');$('#upd-normalized').textContent=JSON.stringify(result.normalized,null,2);$('#upd-hashed').textContent=JSON.stringify(result.hashed,null,2);message('#upd-validation','Formato válido. Identidade fictícia preparada.');return result}
  $('#upd-prepare').onclick=async()=>{if(busy)return;busy=true;label();try{await preparation()}catch(err){message('#upd-validation',err.message,true);$('#upd-normalized').textContent='Dados não preparados.';$('#upd-hashed').textContent='Dados não preparados.'}finally{busy=false;label()}};
  $('#upd-new').onclick=()=>{revision++;caseId=crypto.randomUUID();transactionId='LAB-'+crypto.randomUUID();sent=false;latest=null;$('#upd-payload').textContent='{}';message('#upd-send-status','Novo caso criado. A próxima compra usará um novo transaction_id.');label()};
  $('#upd-send').onclick=async()=>{
    if(busy)return;const live=$('#upd-delivery').value==='gtm';
    if(live&&sent)return;
    if(live&&app.getConfig().mode!=='gtm'){message('#upd-send-status','Selecione Google Tag Manager na Configuração do site. O laboratório UPD usa suas tags no GTM.',true);return}
    if(live&&!$('#upd-armed').checked){message('#upd-send-status','Marque a confirmação do ambiente de teste antes de enviar.',true);return}
    busy=true;label();
    try{
      const prepared=await preparation();
      // Read consent after asynchronous hashing, never reuse an older consent snapshot.
      const payload=core.payload({kind:$('#upd-kind').value,prepared,format:$('#upd-format').value,consent:app.getConsent(),runId:caseId,transactionId});
      latest=payload;$('#upd-payload').textContent=JSON.stringify(payload,null,2);
      if(live){sent=true;core.dispatch(window.dataLayer,payload);const receipt={time:new Date().toISOString(),event:payload.event,run_id:caseId,transaction_id:payload.transaction_id||null,format:payload.lab_data_format,upd_included:payload.lab_upd_allowed,result:'push_local_only'};receipts.unshift(receipt);if(receipts.length>30)receipts.pop();renderReceipts();message('#upd-send-status','Push realizado. Abra esse evento no Tag Assistant; o recebimento pelo Google ainda precisa ser verificado.');}
      else message('#upd-send-status',payload.lab_upd_allowed?'Prévia pronta. Nenhum push deste evento foi feito.':'Prévia pronta sem UPD: analytics_storage e ad_user_data precisam estar granted para incluir a identidade.');
    }catch(err){latest=null;$('#upd-payload').textContent='{}';message('#upd-send-status',err.message,true)}finally{busy=false;label()}
  };
  function renderReceipts(){$('#upd-receipts').replaceChildren();receipts.forEach(r=>{const el=document.createElement('div');el.className='upd-receipt';el.textContent=new Date(r.time).toLocaleTimeString('pt-BR')+' · '+r.event+' · '+r.format+' · UPD '+(r.upd_included?'incluído':'omitido')+' · push local'+(r.transaction_id?' · '+r.transaction_id:'');$('#upd-receipts').append(el)})}
  $('#upd-copy').onclick=async()=>{if(!latest)return message('#upd-send-status','Gere uma prévia primeiro.',true);try{await navigator.clipboard.writeText(JSON.stringify(latest,null,2));message('#upd-send-status','Payload copiado.')}catch{message('#upd-send-status','Selecione o JSON e copie manualmente.',true)}};
  $('#upd-selftest').onclick=async()=>{try{const normalized=await core.prepare(' Aluno.Teste@EXAMPLE.COM ','+1 (202) 555-0123');const same=await core.prepare('aluno.teste@example.com','+12025550123');const abc=await core.sha256('abc');const pass=normalized.hashed.sha256_email_address===same.hashed.sha256_email_address&&normalized.normalized.phone_number==='+12025550123'&&abc==='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';if(!pass)throw Error('Falha na verificação local.');message('#upd-selftest-result','3 verificações locais passaram: normalização de e-mail, E.164 e vetor conhecido SHA-256. Isto não testa o recebimento no Google.')}catch(err){message('#upd-selftest-result',err.message,true)}};
  $('#upd-reset-progress').onclick=()=>{progress={};$('#upd-exercises').querySelectorAll('input').forEach(x=>x.checked=false);saveProgress()};
  $('#upd-export').onclick=()=>{const out={generated_at:new Date().toISOString(),self_assessment:progress,local_receipts:receipts,limitations:'Evidência local. Valide tags, requests e destino externamente; sem confirmação de match/atribuição.'};const url=URL.createObjectURL(new Blob([JSON.stringify(out,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='taglab-upd-evidencias.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
  label();
})();
