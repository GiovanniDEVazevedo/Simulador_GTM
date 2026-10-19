(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TagLabScenarios=api;})(typeof window==='object'?window:globalThis,function(){
  'use strict';
  const scenarios=[
    {id:'validate',title:'Validar sem ingerir',validateOnly:true,responses:[{status:200,body:{}}]},
    {id:'warnings',title:'HTTP 200 com aviso de campo',responses:[{status:200,body:{requestId:'LAB-REQUEST-001',fieldWarnings:[{fieldPath:'events[0].userData',message:'Identificador opcional descartado neste cenário.'}]}},{status:200,body:{requestStatusPerDestination:[{requestStatus:'SUCCESS'}]}}]},
    {id:'permission',title:'Acesso negado',responses:[{status:403,body:{error:'PERMISSION_DENIED'}}]},
    {id:'minute',title:'Cota por minuto e recuperação',responses:[{status:429,quota:'minute',body:{error:'RESOURCE_EXHAUSTED'}},{status:200,body:{requestId:'LAB-REQUEST-001'}},{status:200,body:{requestStatusPerDestination:[{requestStatus:'SUCCESS'}]}}]},
    {id:'daily',title:'Cota diária esgotada',responses:[{status:429,quota:'day',body:{error:'RESOURCE_EXHAUSTED'}}]},
    {id:'transient',title:'Falha transitória e processamento pendente',responses:[{status:503,body:{error:'UNAVAILABLE'}},{status:200,body:{requestId:'LAB-REQUEST-001'}},{status:200,body:{requestStatusPerDestination:[{requestStatus:'PROCESSING'}]}},{status:200,body:{requestStatusPerDestination:[{requestStatus:'SUCCESS'}]}}]},
    {id:'failed',title:'Ingestão aceita e processamento com falha',responses:[{status:200,body:{requestId:'LAB-REQUEST-001'}},{status:200,body:{requestStatusPerDestination:[{requestStatus:'FAILED',error:'Destino do exercício inválido.'}]}}]},
    {id:'exhausted',title:'Limite de tentativas',responses:Array.from({length:6},()=>({status:503,body:{error:'UNAVAILABLE'}}))}
  ];
  const clone=x=>JSON.parse(JSON.stringify(x));
  function start(id){const s=scenarios.find(x=>x.id===id);if(!s)throw Error('Cenário inválido.');return {version:1,id,phase:'ready',now:0,nextAt:0,index:0,retries:0,polls:0,requestId:null,transactionId:'TEST-CENARIO-001',history:[],warnings:[],validateOnly:!!s.validateOnly,message:'Pronto. Avance uma resposta simulada.'}}
  function tick(state,milliseconds){if(!Number.isFinite(milliseconds)||milliseconds<0)throw Error('Tempo virtual inválido.');state.now+=milliseconds;return state}
  function step(state,rng=()=>.5){
    const s=scenarios.find(x=>x.id===state.id);if(!s)throw Error('Cenário inválido.');
    if(['validated','processed','failed','blocked','exhausted'].includes(state.phase))return state;
    if(state.now<state.nextAt){state.message='Aguarde '+(state.nextAt-state.now)+' ms no relógio virtual antes de tentar.';return state}
    const raw=s.responses[state.index];if(!raw){state.phase='exhausted';state.message='Cenário encerrado sem resposta final.';return state}const response=clone(raw);
    state.index++;state.history.push({at:state.now,operation:state.requestId?'requestStatus.retrieve':'events.ingest',status:response.status,body:response.body,source:'simulador'});
    function wait(message,poll=false){const attempt=poll?++state.polls:++state.retries;if(attempt>(poll?6:3)){state.phase='exhausted';state.message='Teto de tentativas alcançado; investigar antes de reenviar.';return}const jitter=Math.max(0,Math.min(1,Number(rng())||0));const delay=Math.round(Math.min(8000,1000*2**(attempt-1))*(.75+jitter*.5));state.nextAt=state.now+delay;state.phase='waiting';state.message=message+' Próxima ação em '+delay+' ms virtuais.';}
    if([401,403].includes(response.status)){state.phase='blocked';state.message='Corrigir autenticação ou acesso ao destino; repetição automática interrompida.';return state}
    if(response.status===429&&response.quota==='day'){state.phase='blocked';state.message='Cota diária: rever cota, carga e janela; não repetir imediatamente.';return state}
    if(response.status===429||response.status===503){wait(response.status===429?'Limite por minuto: espera exponencial com jitter.':'Falha transitória: repetição limitada.');return state}
    if(response.status!==200){state.phase='failed';state.message='Inspecione o erro antes de reenviar.';return state}
    if(Array.isArray(response.body.fieldWarnings))state.warnings.push(...response.body.fieldWarnings);
    if(state.validateOnly){state.phase='validated';state.message='Validação simulada concluída sem ingestão. Não consultar diagnóstico desta validação.';state.requestId=null;return state}
    if(response.body.requestId){state.requestId=response.body.requestId;state.phase='pending';state.nextAt=state.now+1000;state.message='Ingestão simulada aceita. Preservar requestId e consultar o processamento depois.';return state}
    const statuses=response.body.requestStatusPerDestination||[];
    if(statuses.some(x=>x.requestStatus==='PROCESSING')){wait('Processamento pendente; isso ainda não é conclusão.',true);return state}
    if(statuses.some(x=>x.requestStatus==='FAILED')){state.phase='failed';state.message='Processamento falhou em um destino. Examinar erro e acesso.';return state}
    if(statuses.length&&statuses.every(x=>x.requestStatus==='SUCCESS')){state.phase='processed';state.message='Processamento simulado concluído. Correspondência e atribuição continuam sendo verificações separadas.';return state}
    state.phase='failed';state.message='Resposta sem estado conhecido; não declarar sucesso.';return state;
  }
  const gatewayCases=[
    {id:'route',title:'Saúde funciona e hit usa caminho inesperado',checks:{healthy:'ok',geo:'coerente',script:'caminho esperado',hit:'caminho incorreto',destination:'não conferido'},answer:'routing',why:'Revisar a regra do hit e a configuração do destino. /healthy responde, mas não demonstra o transporte completo.'},
    {id:'geo',title:'Cabeçalhos geográficos inconsistentes',checks:{healthy:'ok',geo:'inconsistente',script:'caminho esperado',hit:'pendente',destination:'não conferido'},answer:'geo',why:'Conferir os cabeçalhos e a validação geográfica no guia do gateway antes de concluir o teste.'},
    {id:'down',title:'Caminho indisponível',checks:{healthy:'timeout',geo:'não verificado',script:'falhou',hit:'não observado',destination:'não conferido'},answer:'health',why:'Começar pela disponibilidade e o roteamento do caminho no domínio. Preencher o campo no TagLab não cria infraestrutura.'}
  ];
  return Object.freeze({scenarios,start,tick,step,gatewayCases});
});
