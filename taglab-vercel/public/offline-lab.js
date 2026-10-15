(function () {
  'use strict';
  const core=window.TagLabOffline, upd=window.TagLabUPD, app=window.TagLab, $=s=>document.querySelector(s);
  if (!core || !upd || !app || !$('#offline')) return;

  let lead=null, prepared=null, latestEvent=null, latestRequest=null;
  const history=[];

  function syntheticGclid(){return 'TEST_GCLID_'+crypto.randomUUID().replace(/-/g,'').slice(0,20).toUpperCase()}
  function syntheticLeadId(){return 'LEAD-'+crypto.randomUUID().slice(0,8).toUpperCase()}
  function offlineTransaction(){return 'OFFLINE-'+crypto.randomUUID().replace(/-/g,'').slice(0,16).toUpperCase()}
  function msg(text,error=false){const el=$('#offline-status');el.textContent=text;el.className='notice'+(error?' upd-error':'')}
  function pushMeta(name,extra={}){window.dataLayer.push({event:name,lab_module:'week3_offline',...extra,debug_mode:true})}
  function consentLabel(){const c=app.getConsent();$('#offline-consent').textContent='ad_user_data: '+c.ad_user_data+' · ad_personalization: '+c.ad_personalization}
  window.addEventListener('taglab:consent',()=>{consentLabel();latestEvent=null;latestRequest=null;$('#offline-event-payload').textContent='{}';$('#offline-request-payload').textContent='{}';msg('Consentimento alterado. Gere novamente o evento e a requisição.');});
  consentLabel();

  function renderLead(){
    const box=$('#offline-crm');
    if(!lead){box.textContent='Nenhum lead criado nesta sessão.';return}
    box.textContent=JSON.stringify({
      lead_id:lead.leadId,
      status:lead.status,
      captured_gclid:lead.gclid||null,
      identity:'somente dados fictícios preparados no navegador',
      created_at:lead.createdAt,
      converted_at:lead.convertedAt||null,
      conversion_value:lead.conversionValue||null,
      transaction_id:lead.transactionId||null
    },null,2);
  }

  $('#offline-gclid-generate').onclick=()=>{$('#offline-gclid').value=syntheticGclid();msg('GCLID fictício gerado. Agora crie o lead.')};

  $('#offline-create-lead').onclick=async()=>{
    try{
      const mode=$('#offline-mode').value;
      const gclid=$('#offline-gclid').value.trim();
      if(mode==='oci') core.syntheticGclid(gclid);
      if(gclid) core.syntheticGclid(gclid);
      prepared=await upd.prepare($('#offline-email').value,$('#offline-phone').value);
      lead={leadId:syntheticLeadId(),status:'OPEN',gclid:gclid||'',createdAt:new Date().toISOString(),prepared};
      latestEvent=null;latestRequest=null;
      renderLead();
      $('#offline-event-payload').textContent='{}';$('#offline-request-payload').textContent='{}';
      pushMeta('lab_offline_lead_created',{lab_match_strategy:mode,lab_has_gclid:!!gclid});
      msg('Lead fictício criado no CRM local. Nenhum dado de identidade foi colocado no dataLayer.');
    }catch(err){msg(err.message,true)}
  };

  $('#offline-close-lead').onclick=()=>{
    try{
      if(!lead) throw Error('Crie um lead antes de registrar a venda offline.');
      lead.status='WON';lead.convertedAt=new Date().toISOString();lead.conversionValue=core.positiveMoney($('#offline-value').value);lead.transactionId=offlineTransaction();
      latestEvent=null;latestRequest=null;renderLead();
      pushMeta('lab_offline_crm_won',{lab_lead_id:lead.leadId,lab_transaction_id:lead.transactionId,lab_value:lead.conversionValue});
      msg('Venda offline registrada no CRM local. Agora gere o payload OCI ou ECL.');
    }catch(err){msg(err.message,true)}
  };

  $('#offline-mode').onchange=()=>{latestEvent=null;latestRequest=null;$('#offline-event-payload').textContent='{}';$('#offline-request-payload').textContent='{}';$('#offline-mode-help').textContent=$('#offline-mode').value==='oci'?'OCI: tenta associar a conversão offline ao clique usando o GCLID capturado.':'ECL: usa dados first-party normalizados e com hash; o GCLID pode complementar o matching quando disponível.'};

  $('#offline-build-event').onclick=()=>{
    try{
      if(!lead || lead.status!=='WON') throw Error('O lead precisa estar WON antes de virar conversão offline.');
      const mode=$('#offline-mode').value;
      if(mode==='ecl' && app.getConsent().ad_user_data!=='granted') throw Error('Para este exercício de ECL, conceda ad_user_data antes de incluir UserData.');
      latestEvent=core.buildEvent({mode,gclid:lead.gclid,prepared:lead.prepared,conversionValue:lead.conversionValue,transactionId:lead.transactionId,eventTimestamp:lead.convertedAt});
      latestRequest=null;
      $('#offline-event-payload').textContent=JSON.stringify(latestEvent,null,2);
      $('#offline-request-payload').textContent='{}';
      pushMeta('lab_offline_conversion_prepared',{lab_strategy:mode,lab_has_gclid:!!latestEvent.adIdentifiers,lab_has_user_data:!!latestEvent.userData,lab_transaction_id:lead.transactionId});
      msg('Evento preparado. Compare as chaves de matching e monte a requisição Data Manager.');
    }catch(err){msg(err.message,true)}
  };

  $('#offline-build-request').onclick=()=>{
    try{
      if(!latestEvent) throw Error('Gere o evento OCI/ECL primeiro.');
      latestRequest=core.buildRequest({event:latestEvent,customerId:$('#offline-customer-id').value,conversionActionId:$('#offline-conversion-id').value,consent:app.getConsent()});
      const check=core.localValidation(latestRequest);
      $('#offline-request-payload').textContent=JSON.stringify(latestRequest,null,2);
      pushMeta('lab_data_manager_preview',{lab_validate_only:true,lab_has_gclid:check.matchKeys.gclid,lab_has_user_data:check.matchKeys.userData,lab_transaction_id:check.transactionId});
      msg('Prévia Data Manager validada localmente. validateOnly=true; o site não envia esta requisição à API.');
    }catch(err){msg(err.message,true)}
  };

  $('#offline-copy-request').onclick=async()=>{
    if(!latestRequest)return msg('Gere a requisição primeiro.',true);
    try{await navigator.clipboard.writeText(JSON.stringify(latestRequest,null,2));msg('JSON copiado.')}catch{msg('Selecione o JSON e copie manualmente.',true)}
  };

  $('#offline-save-case').onclick=()=>{
    if(!latestRequest || !lead)return msg('Gere a requisição antes de salvar o caso.',true);
    history.unshift({savedAt:new Date().toISOString(),leadId:lead.leadId,strategy:$('#offline-mode').value,event:structuredClone(latestEvent),request:structuredClone(latestRequest)});
    if(history.length>10)history.pop();
    $('#offline-history-count').textContent=history.length+' caso(s)';
    msg('Caso salvo somente na memória desta página.');
  };

  $('#offline-export').onclick=()=>{
    const out={generatedAt:new Date().toISOString(),cases:history,current:latestRequest?{leadId:lead&&lead.leadId,event:latestEvent,request:latestRequest}:null,warning:'Laboratório local. Nenhuma chamada à Data Manager API foi executada.'};
    const url=URL.createObjectURL(new Blob([JSON.stringify(out,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='taglab-week3-offline-cases.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };

  $('#offline-reset').onclick=()=>{lead=null;prepared=null;latestEvent=null;latestRequest=null;$('#offline-gclid').value='';$('#offline-event-payload').textContent='{}';$('#offline-request-payload').textContent='{}';renderLead();msg('Novo caso iniciado.')};
  renderLead();
  $('#offline-mode').dispatchEvent(new Event('change'));
})();
