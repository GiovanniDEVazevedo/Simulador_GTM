(function () {
  'use strict';
  const core=window.TagLabOffline, upd=window.TagLabUPD, app=window.TagLab, $=s=>document.querySelector(s);
  if (!core || !upd || !app || !$('#offline')) return;

  let lead=null, latestEvent=null, latestRequest=null, busy=false, revision=0;
  const history=[];
  const syntheticGclid=()=>'TEST_GCLID_'+crypto.randomUUID().replace(/-/g,'').slice(0,20).toUpperCase();
  const syntheticLeadId=()=>'LEAD-'+crypto.randomUUID().slice(0,8).toUpperCase();
  const offlineTransaction=()=>'OFFLINE-'+crypto.randomUUID().replace(/-/g,'').slice(0,16).toUpperCase();
  function msg(text,error=false){
    for (const selector of ['#offline-status','#offline-event-status']) {
      const el=$(selector);el.textContent=text;el.className='notice'+(error?' upd-error':'');
    }
  }
  function pushMeta(name,extra={}){window.dataLayer.push({event:name,lab_module:'week3_offline',...extra,debug_mode:true})}
  function clearRequest(){latestRequest=null;$('#offline-request-payload').textContent='{}'}
  function clearEvent(){latestEvent=null;$('#offline-event-payload').textContent='{}';clearRequest()}
  function renderLead(){
    $('#offline-crm').textContent=lead?JSON.stringify({lead_id:lead.leadId,status:lead.status,captured_gclid:lead.gclid||null,identity:lead.prepared?'identidade fictícia preparada':'sem identidade; matching OCI por clique',created_at:lead.createdAt,converted_at:lead.convertedAt||null,conversion_value:lead.conversionValue??null,transaction_id:lead.transactionId||null},null,2):'Nenhum lead criado nesta sessão.';
  }
  function renderState(){
    const c=app.getConsent(),mode=$('#offline-mode').value,won=lead?.status==='WON';
    $('#offline-consent').textContent='ad_user_data: '+c.ad_user_data+' · ad_personalization: '+c.ad_personalization;
    $('#offline-mode-help').textContent=mode==='oci'?'OCI: preserve o GCLID junto ao lead. E-mail e telefone são opcionais nesta estratégia.':'ECL: prepare a identidade fictícia e conceda ad_user_data na aba Consentimento. GCLID é opcional neste exercício.';
    $('#offline-build-event').textContent='Gerar payload '+mode.toUpperCase();
    $('#offline-create-lead').textContent=busy?'Preparando lead…':'Criar lead no CRM local';
    $('#offline-create-lead').disabled=busy;
    $('#offline-close-lead').disabled=busy||!lead||won;
    $('#offline-value').disabled=busy||won;
    $('#offline-build-event').disabled=busy||!won;
    $('#offline-build-request').disabled=busy||!latestEvent;
    $('#offline-copy-request').disabled=!latestRequest;
    $('#offline-save-case').disabled=!latestRequest;
    const ready=!!won&&(mode==='oci'?!!lead.gclid:!!lead.prepared&&c.ad_user_data==='granted');
    $('#offline-readiness').textContent=busy?'Preparando a identidade fictícia…':!lead?'Etapa pendente: criar um lead.':!won?'Etapa pendente: registrar uma venda com valor válido (WON).':mode==='ecl'&&c.ad_user_data!=='granted'?'ECL bloqueado: ad_user_data está negado. Abra Consentimento, altere esse sinal e aplique a seleção.':mode==='ecl'&&!lead.prepared?'ECL precisa de identidade. Preencha o e-mail fictício e crie um novo lead.':mode==='oci'&&!lead.gclid?'OCI precisa de GCLID. Gere o clique fictício e crie um novo lead.':'Pronto para gerar o payload '+mode.toUpperCase()+'.';
    $('#offline-readiness').className='notice'+(won&&!ready?' upd-error':'');
    $('#offline-open-consent').hidden=mode!=='ecl'||c.ad_user_data==='granted';
  }
  function resetLead(){revision++;lead=null;clearEvent();renderLead();renderState()}
  $('#offline-open-consent').onclick=()=>app.navigate('consentimento');
  window.addEventListener('taglab:consent',()=>{revision++;clearEvent();renderState();msg('Consentimento alterado. O lead foi preservado; gere novamente o evento e a requisição.');});
  for(const selector of ['#offline-gclid','#offline-email','#offline-phone']) $(selector).addEventListener('input',()=>{resetLead();msg('Dados de captura alterados. Crie o lead novamente.');});
  for(const selector of ['#offline-customer-id','#offline-conversion-id']) $(selector).addEventListener('input',()=>{clearRequest();renderState();msg('Destino alterado. Monte uma nova prévia Data Manager.');});
  $('#offline-gclid-generate').onclick=()=>{$('#offline-gclid').value=syntheticGclid();resetLead();msg('GCLID fictício gerado. Agora crie o lead.')};
  $('#offline-mode').onchange=()=>{revision++;clearEvent();renderState();msg('Estratégia alterada. Confira os pré-requisitos e gere novamente o payload.');};

  $('#offline-create-lead').onclick=async()=>{
    if(busy)return;
    resetLead();busy=true;renderState();const current=revision;
    try{
      const mode=$('#offline-mode').value,gclid=$('#offline-gclid').value.trim();
      if(mode==='oci'||gclid)core.syntheticGclid(gclid);
      const email=$('#offline-email').value.trim(),phone=$('#offline-phone').value.trim();
      const prepared=mode==='ecl'||email||phone?await upd.prepare(email,phone):null;
      if(current!==revision)throw Error('O caso mudou durante a preparação. Crie o lead novamente.');
      lead={leadId:syntheticLeadId(),status:'OPEN',gclid,createdAt:new Date().toISOString(),prepared};
      renderLead();pushMeta('lab_offline_lead_created',{lab_match_strategy:mode,lab_has_gclid:!!gclid});
      msg('Lead fictício criado. Registre a venda no CRM para continuar.');
    }catch(err){msg(err.message,true)}finally{busy=false;renderState()}
  };
  $('#offline-close-lead').onclick=()=>{
    if(busy)return;
    try{
      if(!lead)throw Error('Crie um lead antes de registrar a venda offline.');
      if(lead.status==='WON')throw Error('Venda já registrada. Use Novo caso para outra transação.');
      const value=core.positiveMoney($('#offline-value').value);
      lead={...lead,status:'WON',convertedAt:new Date().toISOString(),conversionValue:value,transactionId:offlineTransaction()};
      clearEvent();renderLead();pushMeta('lab_offline_crm_won',{lab_lead_id:lead.leadId,lab_transaction_id:lead.transactionId,lab_value:value});
      msg('Venda registrada. Confira o consentimento e gere o payload.');
    }catch(err){msg(err.message,true)}finally{renderState()}
  };
  $('#offline-build-event').onclick=()=>{
    if(busy)return;
    clearEvent();
    try{
      if(!lead||lead.status!=='WON')throw Error('O lead precisa estar WON antes de virar conversão offline.');
      const mode=$('#offline-mode').value;
      latestEvent=core.buildEvent({mode,gclid:lead.gclid,prepared:lead.prepared,conversionValue:lead.conversionValue,transactionId:lead.transactionId,eventTimestamp:lead.convertedAt,consent:app.getConsent()});
      $('#offline-event-payload').textContent=JSON.stringify(latestEvent,null,2);
      pushMeta('lab_offline_conversion_prepared',{lab_match_strategy:mode,lab_has_gclid:!!latestEvent.adIdentifiers,lab_has_user_data:!!latestEvent.userData,lab_transaction_id:lead.transactionId});
      msg('Payload '+mode.toUpperCase()+' gerado. Agora monte a prévia Data Manager.');
    }catch(err){msg(err.message,true)}finally{renderState()}
  };
  $('#offline-build-request').onclick=()=>{
    clearRequest();
    try{
      if(!latestEvent)throw Error('Gere o evento OCI/ECL primeiro.');
      const request=core.buildRequest({event:latestEvent,customerId:$('#offline-customer-id').value,conversionActionId:$('#offline-conversion-id').value,consent:app.getConsent()});
      const check=core.localValidation(request);latestRequest=request;
      $('#offline-request-payload').textContent=JSON.stringify(request,null,2);
      pushMeta('lab_data_manager_preview',{lab_validate_only:true,lab_has_gclid:check.matchKeys.gclid,lab_has_user_data:check.matchKeys.userData,lab_transaction_id:check.transactionId});
      msg('Estrutura conferida localmente. A prévia contém validateOnly=true; nenhuma chamada à API foi executada.');
    }catch(err){msg(err.message,true)}finally{renderState()}
  };
  $('#offline-copy-request').onclick=async()=>{
    if(!latestRequest)return msg('Gere a requisição primeiro.',true);
    try{await navigator.clipboard.writeText(JSON.stringify(latestRequest,null,2));msg('JSON copiado.')}catch{msg('Selecione o JSON e copie manualmente.',true)}
  };
  $('#offline-save-case').onclick=()=>{
    if(!latestRequest||!lead)return msg('Gere a requisição antes de salvar o caso.',true);
    history.unshift({savedAt:new Date().toISOString(),leadId:lead.leadId,strategy:$('#offline-mode').value,event:structuredClone(latestEvent),request:structuredClone(latestRequest)});
    if(history.length>10)history.pop();$('#offline-history-count').textContent=history.length+' caso(s)';msg('Caso salvo na memória desta página.');
  };
  $('#offline-export').onclick=()=>{
    const out={evidence:window.TagLabEvidence.create('simulation'),generatedAt:new Date().toISOString(),cases:history,current:latestRequest?{leadId:lead?.leadId,event:latestEvent,request:latestRequest}:null,warning:'Laboratório local. Nenhuma chamada à Data Manager API foi executada.'};
    const url=URL.createObjectURL(new Blob([JSON.stringify(out,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='taglab-week3-offline-cases.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  $('#offline-reset').onclick=()=>{$('#offline-gclid').value='';resetLead();msg('Novo caso iniciado. O consentimento continua conforme sua seleção.');};
  renderLead();renderState();
})();
