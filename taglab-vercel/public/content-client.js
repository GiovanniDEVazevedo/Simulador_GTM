(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TagLabContentClient=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const topics=new Set(['gtm','ga4','gtg','consent','upd','offline','data-manager','architecture']);
  const tabs=new Set(['missoes','pratica','cenarios','tutoria','loja','interacoes','upd','offline','exercicios','desafios','consentimento','config','guia']);
  const kinds=new Set(['conceito','implementacao','diagnostico','cenario']),levels=new Set(['basico','intermediario','avancado']);
  const str=(value,max=10000)=>typeof value==='string'&&value.length>0&&value.length<=max;
  const ids=(list)=>Array.isArray(list)&&list.every(x=>str(x,80))&&new Set(list).size===list.length;
  function validate(data){
    if(!data||data.schemaVersion!==1||!Number.isInteger(data.version)||data.version<1||!Array.isArray(data.questions)||!data.questions.length||data.questions.length>2000||!Array.isArray(data.topics)||!data.sources||typeof data.sources!=='object'||Array.isArray(data.sources))throw Error('Contrato do catálogo inválido.');
    if(!ids(data.questions.map(q=>q.id))||!ids(data.topics.map(t=>t.id))||data.topics.some(t=>!topics.has(t.id)||!str(t.label,250)))throw Error('IDs ou temas inválidos.');
    for(const source of Object.values(data.sources)){if(!source||!str(source.title,250)||!str(source.url,2000)||new URL(source.url).protocol!=='https:')throw Error('Fonte inválida.');}
    const qids=new Set(data.questions.map(q=>q.id));
    for(const q of data.questions){if(!str(q.question,3000)||!str(q.explanation,5000)||!str(q.impact,3000)||!topics.has(q.topic)||!levels.has(q.level)||!kinds.has(q.kind)||!Array.isArray(q.tools)||!q.tools.length||!q.tools.every(t=>str(t,80))||!Array.isArray(q.options)||q.options.length<2||q.options.length>6||!q.options.every(o=>str(o,1500))||!Number.isInteger(q.correct)||q.correct<0||q.correct>=q.options.length||!Array.isArray(q.sourceIds)||!q.sourceIds.length||q.sourceIds.some(id=>!Object.hasOwn(data.sources,id)))throw Error('Questão inválida.');}
    const activities=data.activities||[],trails=data.trails||[],suggestions=data.suggestions||[];
    if(!ids(activities.map(a=>a.id))||!ids(activities.map(a=>a.legacyId||a.id))||activities.some(a=>!tabs.has(a.tab)||!str(a.title,180)||!str(a.task,6000)||!str(a.expected,4000)||!ids(a.questionIds)||a.questionIds.some(id=>!qids.has(id))))throw Error('Atividade inválida.');
    const aids=new Set(activities.map(a=>a.id)),tids=new Set(trails.map(t=>t.id));
    if(!ids(trails.map(t=>t.id))||trails.some(t=>!str(t.title,180)||!str(t.objective,2000)||!str(t.description,4000)||!Array.isArray(t.steps)||!t.steps.length||!t.steps.every(s=>str(s,2000))||!ids(t.questionIds)||t.questionIds.some(id=>!qids.has(id))||!ids(t.activityIds)||t.activityIds.some(id=>!aids.has(id))||!ids(t.prerequisites)||t.prerequisites.some(id=>!tids.has(id))))throw Error('Trilha inválida.');
    if(!ids(suggestions.map(s=>s.id))||suggestions.some(s=>!str(s.title,180)||!str(s.description,4000)||(s.url&&new URL(s.url).protocol!=='https:')))throw Error('Sugestão inválida.');
    return data;
  }
  async function load(base,fallback,fetcher=globalThis.fetch){
    if(!base)return{bank:fallback,source:'bundled',message:'Banco incluído no TagLab.'};
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),3500);
    try{const url=new URL(base);if(url.username||url.password||url.search||url.hash||url.pathname!=='/'||!(url.protocol==='https:'||(url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname))))throw Error('Use o domínio HTTPS da central.');const response=await fetcher(url.origin+'/api/v1/catalog',{signal:controller.signal,credentials:'omit',cache:'no-cache',redirect:'error'});if(!response.ok)throw Error('Central indisponível.');if(Number(response.headers.get('content-length'))>2000000)throw Error('Catálogo excede o limite.');const text=await response.text();if(new TextEncoder().encode(text).length>2000000)throw Error('Catálogo excede o limite.');return{bank:validate(JSON.parse(text)),source:'central',message:'Catálogo da central · versão '+JSON.parse(text).version};}
    catch{return{bank:fallback,source:'fallback',message:'Central indisponível ou catálogo incompatível. O banco incluído no TagLab foi preservado.'};}
    finally{clearTimeout(timer);}
  }
  return Object.freeze({load,validate});
});
