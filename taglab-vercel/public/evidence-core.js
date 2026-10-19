(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TagLabEvidence=api;})(typeof window==='object'?window:globalThis,function(){
  'use strict';
  const levels={simulation:'Prévia simulada',local_push:'Push local observado',tag_preview:'Tag no Preview',transport:'Transporte no Network',destination:'Destino conferido'};
  function create(level,options={}){
    if(!levels[level])throw Error('Nível de evidência inválido.');
    const external=!['simulation','local_push'].includes(level);
    if(external&&(options.declaredBy!=='aluno'||!String(options.reference||'').trim()))throw Error('Evidência externa exige referência e declaração manual do aluno.');
    return {version:1,level,label:levels[level],source:external?'declaracao_manual':level==='simulation'?'simulador':'dataLayer',observedAt:options.observedAt||new Date().toISOString(),environment:String(options.environment||'navegador').slice(0,300),eventName:level==='local_push'?String(options.eventName||'').slice(0,40):'',reference:external?String(options.reference).trim().slice(0,1000):'',declaredBy:external?'aluno':'aplicacao',verifiedByTutor:false};
  }
  return Object.freeze({levels,create});
});
