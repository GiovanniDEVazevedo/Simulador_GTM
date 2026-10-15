/* Study rules only: no tags, identity or network requests. */
(function(root,factory){const node=typeof module==='object'&&module.exports;const bank=node?require('./question-bank.js'):root.TagLabQuestionBank;const api=factory(bank);if(node)module.exports=api;else root.TagLabLearning=api;})(typeof globalThis!=='undefined'?globalThis:this,function(bank){
  'use strict';
  if(!bank)throw Error('Banco de questões indisponível.');
  const tasks=[
  {
    "id": "oci",
    "title": "Do clique à venda offline",
    "tab": "offline",
    "task": "Gere um GCLID fictício, crie o lead OCI, registre a venda e monte a prévia Data Manager.",
    "expected": "adIdentifiers.gclid acompanha o clique capturado. Não há userData no evento OCI deste laboratório."
  },
  {
    "id": "consent",
    "title": "Diagnosticar o bloqueio ECL",
    "tab": "offline",
    "task": "Com ad_user_data negado, crie o lead ECL e marque WON. Tente gerar o payload, revise o sinal na aba Consentimento e tente novamente.",
    "expected": "O aviso explica o bloqueio junto ao botão. Após aplicar granted, o mesmo lead pode gerar userData. Nenhum consentimento é concedido automaticamente."
  },
  {
    "id": "hash",
    "title": "Comparar normalização e SHA-256",
    "tab": "upd",
    "task": "Prepare a mesma identidade fictícia com e sem espaços/maiúsculas. Compare os hashes e rode a verificação local.",
    "expected": "Entradas que normalizam para o mesmo valor geram o mesmo hash de 64 caracteres hexadecimais. Não se aplica hash duas vezes."
  },
  {
    "id": "no-click",
    "title": "ECL sem GCLID",
    "tab": "offline",
    "task": "Inicie um novo caso ECL com GCLID vazio, identidade fictícia válida e ad_user_data concedido. Gere evento e request.",
    "expected": "userData.userIdentifiers está preenchido; adIdentifiers é omitido. O payload local não comprova correspondência com uma pessoa real."
  },
  {
    "id": "dedupe",
    "title": "Manter a identidade da venda",
    "tab": "offline",
    "task": "Gere duas vezes o evento da mesma venda e compare transactionId. Depois inicie outro caso e registre outra venda.",
    "expected": "Gerar novamente o payload preserva o ID da venda. Outro caso gera um ID diferente. Registrar WON duas vezes não cria outra transação."
  },
  {
    "id": "invalid",
    "title": "Testar falhas sem reaproveitar prévias",
    "tab": "offline",
    "task": "Tente registrar venda com valor zero. Depois crie uma prévia válida, altere o Customer ID para texto e gere novamente.",
    "expected": "Valor inválido mantém o lead OPEN. O request antigo é limpo ao alterar o destino; falha de validação não deixa JSON antigo disponível para cópia."
  },
  {
    "id": "revoke",
    "title": "Revogar consentimento após gerar",
    "tab": "offline",
    "task": "Gere ECL com permissão. Negue ad_user_data e volte ao laboratório para inspecionar as prévias.",
    "expected": "Evento e request atuais são limpos. O próximo payload ECL é bloqueado. Casos fictícios já salvos continuam sendo registros históricos locais."
  },
  {
    "id": "gateway",
    "title": "Distinguir push, tag e transporte GTG",
    "tab": "config",
    "task": "Inspecione um evento no dataLayer e no Tag Assistant. Se houver um gateway real configurado no seu domínio, confira /healthy e os hits no caminho first-party.",
    "expected": "Push local, tag disparada e entrega ao destino são evidências diferentes. Preencher /metrics não cria o roteamento nem comprova GTG ativo."
  },
  {
    "id": "tag-contract",
    "title": "Conferir o contrato do evento",
    "tab": "interacoes",
    "task": "Envie um evento personalizado, configure uma variável e confira no Preview qual acionador consome esse nome.",
    "expected": "Aplicação, nome do evento, variável e tag precisam concordar. A presença no dataLayer sozinha não prova entrega."
  },
  {
    "id": "ga4-commerce",
    "title": "Validar o funil e os escopos de e-commerce",
    "tab": "loja",
    "task": "Percorra produto, carrinho, entrega, pagamento e compra. Identifique itens, valor total, moeda e ID da venda.",
    "expected": "Cada etapa tem evento próprio. transaction_id representa a compra; items representa seus produtos. Confira também o destino real."
  },
  {
    "id": "navigation",
    "title": "Investigar page_view duplicado",
    "tab": "loja",
    "task": "Navegue pelas abas e compare o que o site emite com as requisições do GA4 e as regras de histórico da medição otimizada.",
    "expected": "Registre cada emissor do page_view. send_page_view=false e a opção de histórico precisam ser avaliados em conjunto."
  },
  {
    "id": "initialization",
    "title": "Explicar inicialização e publicação",
    "tab": "config",
    "task": "No Preview, compare Consent Initialization, Initialization e os eventos seguintes. Identifique a versão publicada do contêiner.",
    "expected": "Consentimento tem etapa própria. Preview do workspace e versão pública são contextos diferentes; o monitor local pode não listar todos os eventos internos."
  },
  {
    "id": "tool-fit",
    "title": "Desenhar uma arquitetura por necessidade",
    "tab": "guia",
    "task": "Escreva qual lacuna será resolvida por GTM, GA4, GTG, sGTM e importação offline em um caso fictício. Justifique também o que não adotaria agora.",
    "expected": "Cada ferramenta tem responsabilidade e custo de operação. O desenho precisa partir da origem do dado e do objetivo, com limites e evidências."
  },
  {
    "id": "dm-auth",
    "title": "Separar a prévia da integração real",
    "tab": "offline",
    "task": "Monte um request e liste o que ainda seria necessário fora do simulador: fonte, destino, autenticação, validação do serviço e operação.",
    "expected": "O JSON e validateOnly não chamam nem autorizam a API. Não coloque credenciais no HTML ou no dataLayer."
  },
  {
    "id": "consent-sequence",
    "title": "Conferir os sinais independentemente",
    "tab": "consentimento",
    "task": "Altere somente ad_user_data e confira o estado de ad_personalization. Observe a ordem dos comandos no Preview antes de mudar de aba.",
    "expected": "Os sinais representam finalidades diferentes. A escolha precisa ser aplicada e respeitada pelos eventos seguintes."
  },
  {
    "id": "mapping",
    "title": "Mapear identidade para cada destino",
    "tab": "upd",
    "task": "Compare email/sha256_email_address no fluxo UPD por tag com userData.userIdentifiers da prévia Data Manager.",
    "expected": "A identidade conceitual pode ser a mesma, mas nomes, normalização e formato seguem o contrato de cada destino."
  }
];
  const questions=bank.questions,allIds=questions.map(q=>q.id),byId=new Map(questions.map(q=>[q.id,q]));
  const levels={basico:'Básico',intermediario:'Intermediário',avancado:'Avançado'};
  const kinds={conceito:'Conceito',implementacao:'Implementação',cenario:'Escolha de solução',diagnostico:'Diagnóstico'};
  const topicTitle=id=>bank.topics.find(t=>t.id===id)?.label||id;
  const normalized=text=>String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const tools=[...new Set(questions.flatMap(q=>q.tools))].sort();
  function filterQuestions(filters={},bookmarks=[]){
    const query=normalized(filters.query).trim(),marked=new Set(bookmarks);
    return questions.filter(q=>(!filters.topic||q.topic===filters.topic)&&(!filters.level||q.level===filters.level)&&(!filters.tool||q.tools.includes(filters.tool))&&(!filters.kind||q.kind===filters.kind)&&(!filters.bookmarkedOnly||marked.has(q.id))&&(!query||normalized([q.question,...q.options,q.explanation,q.impact,topicTitle(q.topic),...q.tools].join(' ')).includes(query)));
  }
  function shuffled(items,rng){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.min(.999999,Math.max(0,rng()))*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
  function selectQuestions(filters={},count=10,bookmarks=[],rng=Math.random){
    const pool=filterQuestions(filters,bookmarks);const n=count==='all'?pool.length:Math.min(Number(count),pool.length);
    if(!Number.isInteger(n)||n<0)throw Error('Quantidade inválida.');
    const groups=new Map();for(const q of pool){if(!groups.has(q.topic))groups.set(q.topic,[]);groups.get(q.topic).push(q.id)}
    for(const [topic,ids]of groups)groups.set(topic,shuffled(ids,rng));
    const order=shuffled([...groups.keys()],rng),result=[];
    while(result.length<n){for(const topic of order){const id=groups.get(topic).pop();if(id)result.push(id);if(result.length===n)break}}
    return result;
  }
  function grade(answers,ids=allIds){
    if(!Array.isArray(ids)||!ids.length||new Set(ids).size!==ids.length||ids.some(id=>!byId.has(id)))throw Error('Seleção de questões inválida.');
    const selected=ids.map(id=>byId.get(id));const missing=selected.filter(q=>!Number.isInteger(answers?.[q.id])||answers[q.id]<0||answers[q.id]>=q.options.length).map(q=>q.id);
    if(missing.length)return {complete:false,missing};
    const results=selected.map(q=>({id:q.id,topic:q.topic,answer:answers[q.id],correct:q.correct,isCorrect:answers[q.id]===q.correct,practiceId:q.practiceId}));
    const score=results.filter(r=>r.isCorrect).length,topics={};for(const r of results){topics[r.topic]??={correct:0,total:0};topics[r.topic].total++;if(r.isCorrect)topics[r.topic].correct++}
    return {complete:true,score,total:results.length,percent:Math.round(score/results.length*100),reviewIds:results.filter(r=>!r.isCorrect).map(r=>r.id),topics,results};
  }
  function cleanAnswers(input={}){const answers={};for(const q of questions)if(Number.isInteger(input?.[q.id])&&input[q.id]>=0&&input[q.id]<q.options.length)answers[q.id]=input[q.id];return answers}
  function cleanFilters(f={}){return {query:typeof f.query==='string'?f.query.slice(0,200):'',topic:bank.topics.some(t=>t.id===f.topic)?f.topic:'',level:levels[f.level]?f.level:'',kind:kinds[f.kind]?f.kind:'',tool:tools.includes(f.tool)?f.tool:'',bookmarkedOnly:f.bookmarkedOnly===true}}
  function validIds(ids){return Array.isArray(ids)&&ids.length>0&&new Set(ids).size===ids.length&&ids.every(id=>byId.has(id))}
  function hydrate(saved,legacy){
    const state={version:2,bankVersion:bank.version,filters:cleanFilters(),tasks:{},bookmarks:[],stats:{},history:[],session:null,legacyBest:null};
    const source=saved?.version===2?saved:legacy?.version===1?legacy:null;
    if(!source)return state;
    for(const t of tasks)state.tasks[t.id]=source.tasks?.[t.id]===true;
    if(source.version===1){
      if(Number.isInteger(source.best)&&source.best>=0&&source.best<=100)state.legacyBest=source.best;
      if(validIds(source.ids))state.session={ids:source.ids,answers:cleanAnswers(source.answers),graded:source.graded===true&&grade(source.answers,source.ids).complete,index:0,kind:'legado',at:null};
      return state;
    }
    state.filters=cleanFilters(source.filters);state.bookmarks=[...new Set(Array.isArray(source.bookmarks)?source.bookmarks.filter(id=>byId.has(id)):[])];
    if(Number.isInteger(source.legacyBest)&&source.legacyBest>=0&&source.legacyBest<=100)state.legacyBest=source.legacyBest;
    for(const q of questions){const stat=source.stats?.[q.id];if(stat&&Number.isInteger(stat.attempts)&&stat.attempts>0&&Number.isInteger(stat.correct)&&stat.correct>=0&&stat.correct<=stat.attempts)state.stats[q.id]={attempts:stat.attempts,correct:stat.correct,lastCorrect:stat.lastCorrect===true};}
    state.history=(Array.isArray(source.history)?source.history:[]).filter(h=>h&&Number.isInteger(h.score)&&Number.isInteger(h.total)&&h.total>0&&h.total<=questions.length&&h.score>=0&&h.score<=h.total).slice(0,30).map(h=>({score:h.score,total:h.total,percent:Math.round(h.score/h.total*100),at:typeof h.at==='string'?h.at:null,kind:typeof h.kind==='string'?h.kind.slice(0,40):'simulado'}));
    const s=source.session;if(s&&validIds(s.ids)){const answers=cleanAnswers(s.answers);state.session={ids:s.ids,answers,graded:s.graded===true&&grade(answers,s.ids).complete,index:Math.max(0,Math.min(s.ids.length-1,Number.isInteger(s.index)?s.index:0)),kind:['simulado','revisao','erros','legado'].includes(s.kind)?s.kind:'simulado',at:typeof s.at==='string'?s.at:null};}
    return state;
  }
  function recordResult(state,result,at){
    if(!result.complete)throw Error('Resultado incompleto.');
    for(const r of result.results){const previous=state.stats[r.id]||{attempts:0,correct:0};state.stats[r.id]={attempts:previous.attempts+1,correct:previous.correct+(r.isCorrect?1:0),lastCorrect:r.isCorrect};}
    state.history.unshift({score:result.score,total:result.total,percent:result.percent,at,kind:state.session?.kind||'simulado'});state.history=state.history.slice(0,30);
  }
  function progress(state){const topicStats=bank.topics.map(t=>{const pool=questions.filter(q=>q.topic===t.id);let attempts=0,correct=0,seen=0;for(const q of pool){const stat=state.stats[q.id];if(stat){seen++;attempts+=stat.attempts;correct+=stat.correct}}return {...t,seen,total:pool.length,attempts,correct}});return {topics:topicStats,wrongIds:allIds.filter(id=>state.stats[id]?.lastCorrect===false),seen:allIds.filter(id=>state.stats[id]).length,attempts:topicStats.reduce((n,t)=>n+t.attempts,0),correct:topicStats.reduce((n,t)=>n+t.correct,0)}}
  return Object.freeze({bank,tasks,questions,topics:bank.topics,levels,kinds,tools,topicTitle,filterQuestions,selectQuestions,grade,hydrate,recordResult,progress});
});
