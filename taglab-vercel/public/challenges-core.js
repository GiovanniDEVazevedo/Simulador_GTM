/* Authored learning scenarios, not a complete emulator of Google's backend.
   JSON is parsed as data. No student JavaScript, HTTP calls or credentials run here. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.TagLabChallenges=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const version=1,reviewedAt='2026-10-19';
  const endpoint='https://datamanager.googleapis.com/v1/events:ingest';
  const sources={
    events:{title:'Google: conversões offline e ECL',url:'https://developers.google.com/data-manager/api/devguides/events/google-ads/offline/send-events'},
    errors:{title:'Google: erros, avisos e validateOnly',url:'https://developers.google.com/data-manager/api/devguides/concepts/understand-errors'},
    access:{title:'Google: acesso e autenticação',url:'https://developers.google.com/data-manager/api/devguides/quickstart/set-up-access'},
    status:{title:'Google: requestStatus.retrieve',url:'https://developers.google.com/data-manager/api/reference/rest/v1/requestStatus/retrieve'}
  };
  const clone=value=>JSON.parse(JSON.stringify(value));
  const emailHash='27f4dfcd5fde5475d4aae0ae501d9c55ecb8b3f100a3adab2b55c0157b7e4293';
  const emailBase64='J/TfzV/eVHXUquCuUB2cVey4s/EAo62rK1XAFXt+QpM=';
  const fixture={
    customerId:'1234567890',conversionActionId:'987654321',
    email:'  Aluno.Teste@EXAMPLE.COM  ',
    conversion:{transactionId:'LAB-DM-001',gclid:'TEST_GCLID_DM_0001',eventTimestamp:'2026-10-16T14:30:00-03:00',conversionValue:750,currency:'BRL'},
    secondConversion:{transactionId:'LAB-DM-002',gclid:'TEST_GCLID_DM_0002',eventTimestamp:'2026-10-16T15:00:00-03:00',conversionValue:125,currency:'BRL'}
  };
  function baseBody(){
    const c=fixture.conversion;
    return {destinations:[{operatingAccount:{accountType:'GOOGLE_ADS',accountId:fixture.customerId},productDestinationId:fixture.conversionActionId}],
      events:[{adIdentifiers:{gclid:c.gclid},eventTimestamp:c.eventTimestamp,eventSource:'WEB',transactionId:c.transactionId,conversionValue:c.conversionValue,currency:c.currency}],
      consent:{adUserData:'CONSENT_GRANTED',adPersonalization:'CONSENT_DENIED'},validateOnly:true};
  }
  function connection(body){return {method:'POST',url:endpoint,headers:JSON.stringify({'Content-Type':'application/json',Authorization:'Bearer LAB_TOKEN'},null,2),body:JSON.stringify(body,null,2)}}
  const exercises=[
    {id:'ler-oci',type:'read',level:'Básico',title:'Para onde vai esta conversão?',
      prompt:'Uma venda foi concluída no CRM. Analise a chamada e identifique sua finalidade. Considere que a autenticação e o destino já foram configurados.',
      code:`const response = await fetch(
  'https://datamanager.googleapis.com/v1/events:ingest',
  {
    method: 'POST',
    headers: cabecalhosAutenticados,
    body: JSON.stringify({
      destinations: [destinoGoogleAds],
      events: [{
        adIdentifiers: { gclid: lead.gclid },
        eventTimestamp: venda.data,
        eventSource: 'WEB',
        transactionId: venda.id,
        conversionValue: venda.valor,
        currency: 'BRL'
      }],
      validateOnly: true
    })
  }
);`,
      options:['Publicar um contêiner do GTM.','Validar uma requisição de conversão offline ao Data Manager usando o clique preservado no CRM.','Criar uma conexão agendada com o CRM pela interface do Data Manager.','Enviar um page_view ao GA4 pelo navegador.'],correct:1,
      explanation:'O endpoint events:ingest recebe eventos. Neste caso há um destino Google Ads e um GCLID do lead. validateOnly:true solicita validação inicial sem ingestão. A chamada não cria uma conexão agendada nem configura GTM.',
      hints:['Leia o domínio e o recurso no endpoint.','Observe adIdentifiers.gclid, o destino e validateOnly.'],sourceIds:['events','errors']},
    {id:'ler-ecl',type:'read',level:'Básico',title:'Por que preparar o e-mail?',
      prompt:'Este trecho faz parte da preparação de um identificador para ECL. O que ele produz? O dado de entrada é fictício.',
      code:`const normalized = email.trim().toLowerCase();
const bytes = new TextEncoder().encode(normalized);
const digest = await crypto.subtle.digest('SHA-256', bytes);
const hex = Array.from(new Uint8Array(digest), byte =>
  byte.toString(16).padStart(2, '0')
).join('');

const userData = {
  userIdentifiers: [{ emailAddress: hex }]
};`,
      options:['Um e-mail criptografado que pode ser recuperado com uma chave.','Uma autorização de consentimento concedida pelo usuário.','Um hash SHA-256 do e-mail normalizado, representado em hexadecimal para userData.','Uma garantia de que o Google vai encontrar o usuário e atribuir a conversão.'],correct:2,
      explanation:'O código normaliza e aplica SHA-256, depois representa os bytes em HEX. Hash não é criptografia reversível, não concede consentimento e não comprova matching. Na requisição com esse userData, encoding deve corresponder à representação escolhida.',
      hints:['Separe normalização, hash e representação do resultado.','Observe SHA-256 e toString(16). Nenhuma chamada ao Google ocorre aqui.'],sourceIds:['events']},
    {id:'ler-validacao',type:'read',level:'Intermediário',title:'O teste passou. O que foi comprovado?',
      prompt:'A requisição abaixo passou na validação inicial. Qual conclusão é sustentada por esse teste?',
      code:`const request = {
  destinations,
  events,
  validateOnly: true
};

const response = await client.ingestEvents(request);
// A chamada terminou sem erro de validação inicial.`,
      options:['A conversão já entrou no relatório e foi atribuída a um anúncio.','A requisição passou nas verificações iniciais; os eventos não foram ingeridos e não há diagnóstico assíncrono dessa validação.','Todos os processos de normalização e consentimento do cliente foram auditados.','O requestStatus deve obrigatoriamente retornar SUCCESS para esta validação.'],correct:1,
      explanation:'validateOnly não executa a ingestão. Ele verifica os erros iniciais e pode retornar avisos. Não prevê os erros do processamento assíncrono nem permite recuperar diagnósticos dessa validação.',
      hints:['Procure o efeito de validateOnly.','Validação inicial, processamento e atribuição são etapas distintas.'],sourceIds:['errors']},
    {id:'ler-avisos',type:'read',level:'Intermediário',title:'HTTP 200 encerra a investigação?',
      prompt:'Uma ingestão retornou HTTP 200 com o corpo abaixo. Qual ação técnica deve acompanhar o registro do requestId?',
      code:`{
  "requestId": "EXEMPLO-DE-INGESTAO",
  "fieldWarnings": [{
    "field": "events.events[0].cart_data.items[0].merchant_product_id",
    "description": "The merchant product ID is missing in the cart item.",
    "reason": "WARNING_REASON_CART_DATA_ITEM_MERCHANT_PRODUCT_ID_MISSING"
  }]
}`,
      options:['Ignorar o corpo: HTTP 200 prova que todos os campos foram aceitos.','Trocar o ID da transação e reenviar tudo imediatamente.','Confirmar que a conversão já foi atribuída no Google Ads.','Revisar o campo avisado e acompanhar os diagnósticos da ingestão, sem confundir aceitação inicial com atribuição.'],correct:3,
      explanation:'fieldWarnings indica problemas em campos opcionais mesmo quando a requisição é aceita. Preserve o requestId, investigue o aviso e acompanhe o processamento. Reenviar com um ID novo pode atrapalhar a deduplicação.',
      hints:['O status HTTP descreve apenas parte do resultado.','Leia fieldWarnings e o caminho do campo.'],sourceIds:['errors','status']},
    {id:'ler-status',type:'read',level:'Intermediário',title:'O processamento já terminou?',
      prompt:'Após uma ingestão efetiva, este código consultou o requestId. Como o sistema deve interpretar o resultado mostrado?',
      code:`GET https://datamanager.googleapis.com/v1/requestStatus:retrieve
    ?requestId=EXEMPLO-DE-INGESTAO

{
  "requestStatusPerDestination": [{
    "requestStatus": "PROCESSING"
  }]
}`,
      options:['O destino ainda está processando; aguardar e consultar novamente conforme a estratégia de acompanhamento.','A requisição foi recusada por um erro de sintaxe JSON.','A conversão foi atribuída e já pode ser considerada receita de anúncio.','O código está criando uma nova ação de conversão no Google Ads.'],correct:0,
      explanation:'requestStatus.retrieve acompanha uma solicitação existente por destino. PROCESSING ainda não é um resultado final. Após o processamento, é necessário avaliar o status, erros e avisos disponíveis; atribuição continua sendo outra verificação.',
      hints:['É uma consulta GET por requestId, não uma ingestão.','PROCESSING indica uma etapa em andamento.'],sourceIds:['status']},
    {id:'conectar-oci',type:'request',level:'Básico',title:'Conecte manualmente a API',
      prompt:'Monte a requisição de validação para a venda fictícia abaixo. Complete método, endpoint, cabeçalhos e corpo. Use somente Bearer LAB_TOKEN no simulador. Envie um evento OCI para o destino indicado, preserve a transação e configure validateOnly como booleano true.',
      context:{destino:{accountType:'GOOGLE_ADS',accountId:fixture.customerId,productDestinationId:fixture.conversionActionId},venda:fixture.conversion,consentimento:{adUserData:'CONSENT_GRANTED',adPersonalization:'CONSENT_DENIED'}},
      hints:['Use POST em events:ingest, Content-Type application/json e Authorization Bearer LAB_TOKEN.','destinations é uma lista de destinos; events é uma lista de eventos. O identificador de clique fica em adIdentifiers.gclid.'],
      explanation:'O transporte e o corpo foram montados para o cenário OCI. O token e os identificadores são fictícios. A resposta é uma simulação de validação local e não comprova acesso ao Google.',sourceIds:['access','events','errors']},
    {id:'corrigir-ecl',type:'request',level:'Intermediário',title:'Corrija a preparação do ECL',
      prompt:'O request inclui o e-mail em claro e um encoding incompatível. Corrija userData e encoding. Normalize o e-mail fictício antes do SHA-256; use HEX ou BASE64. Preserve os dados da venda e o consentimento informado. O botão de cálculo local ajuda a conferir a preparação.',
      context:{emailOriginal:fixture.email,venda:fixture.conversion,destino:{accountId:fixture.customerId,productDestinationId:fixture.conversionActionId},consentimento:{adUserData:'CONSENT_GRANTED',adPersonalization:'CONSENT_DENIED'}},
      hints:['O e-mail normalizado é aluno.teste@example.com. A representação deve corresponder a encoding.','Um hash com formato válido pode ter sido calculado sobre o texto errado. O corretor compara com o hash da identidade fornecida.'],
      explanation:'O identificador corresponde ao SHA-256 do e-mail normalizado. HEX e BASE64 são representações aceitas neste exercício. Hash não concede consentimento nem demonstra correspondência com usuários reais.',sourceIds:['events']},
    {id:'consentimento-api',type:'request',level:'Intermediário',title:'O consentimento foi revogado',
      prompt:'O usuário fictício negou adUserData e adPersonalization antes da preparação deste envio. A política conservadora deste exercício mantém a prévia OCI pelo clique e remove userData. Corrija o corpo preservando o estado negado, o GCLID e a transação. Não altere a autorização do cenário para fazer o teste passar.',
      context:{venda:fixture.conversion,consentimentoAtual:{adUserData:'CONSENT_DENIED',adPersonalization:'CONSENT_DENIED'},regraDoExercicio:'Remover userData e encoding. Manter a prévia com GCLID e validateOnly:true.'},
      hints:['Compare o consentimento do contexto com o consentimento no corpo.','Remova userData e encoding. Preserve adIdentifiers.gclid e registre CONSENT_DENIED.'],
      explanation:'A prévia segue a política conservadora descrita e preserva a escolha do usuário. A remoção de identidade é uma regra deste exercício, não uma afirmação de que toda coleta ou todo envio OCI com consentimento negado é permitido. A integração real exige avaliação do caso e dos requisitos do destino.',sourceIds:['events','errors']},
    {id:'lote-api',type:'request',level:'Avançado',title:'Encontre o erro no lote',
      prompt:'Duas vendas devem seguir na mesma requisição. O segundo evento tem data e moeda incorretas. Corrija o lote sem apagar a venda problemática, mudar os IDs ou alterar os valores. O corretor aceita outra ordem de eventos e datas equivalentes com fuso. A falha inicial de um campo obrigatório impede o processamento do lote.',
      context:{vendas:[fixture.conversion,fixture.secondConversion],consentimento:{adUserData:'CONSENT_GRANTED',adPersonalization:'CONSENT_DENIED'}},
      hints:['Confira cada evento; o primeiro estar correto não valida o lote.','Use eventTimestamp em RFC 3339 com fuso e currency BRL. Preserve LAB-DM-001 e LAB-DM-002.'],
      explanation:'As duas vendas foram preservadas e corrigidas. A validação inicial usa fast-fail: erro estrutural ou em campo obrigatório rejeita a requisição inteira. Falhas posteriores e avisos ainda exigem acompanhamento na integração real.',sourceIds:['events','errors']}
  ];
  function exercise(id){return exercises.find(item=>item.id===id)}
  function solution(id){
    const item=exercise(id);if(!item||item.type!=='request')return null;
    const body=baseBody();
    if(id==='corrigir-ecl'){body.events[0].userData={userIdentifiers:[{emailAddress:emailHash}]};body.encoding='HEX'}
    if(id==='consentimento-api')body.consent.adUserData='CONSENT_DENIED';
    if(id==='lote-api'){
      const c=fixture.secondConversion;
      body.events.push({adIdentifiers:{gclid:c.gclid},eventTimestamp:c.eventTimestamp,eventSource:'WEB',transactionId:c.transactionId,conversionValue:c.conversionValue,currency:c.currency});
    }
    return connection(body);
  }
  function starter(id){
    const result=solution(id);if(!result)return null;
    const body=JSON.parse(result.body);
    if(id==='conectar-oci')return {method:'GET',url:'https://datamanager.googleapis.com/v1/',headers:'{}',body:JSON.stringify({destinations:[],events:[],validateOnly:false},null,2)};
    if(id==='corrigir-ecl'){body.events[0].userData.userIdentifiers[0].emailAddress=fixture.email;body.encoding='UTF8'}
    if(id==='consentimento-api'){body.consent.adUserData='CONSENT_GRANTED';body.events[0].userData={userIdentifiers:[{emailAddress:emailHash}]};body.encoding='HEX'}
    if(id==='lote-api'){body.events[1].currency='REAIS';body.events[1].eventTimestamp='16/10/2026 15:00'}
    result.body=JSON.stringify(body,null,2);return result;
  }
  function gradeChoice(id,answer){
    const item=exercise(id);if(!item||item.type!=='read')throw Error('Desafio de leitura inválido.');
    if(!Number.isInteger(answer)||answer<0||answer>=item.options.length)return {unanswered:true,passed:false,checks:[]};
    const passed=answer===item.correct;
    return {passed,checks:[{id:'interpretacao',label:'Interpretação do código',passed,detail:passed?item.explanation:'Releia o trecho e use as dicas. Você pode tentar novamente antes de abrir a solução.'}]};
  }
  const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
  function parse(text,label){
    if(typeof text!=='string'||text.length>40000)throw Error(label+': limite de 40.000 caracteres por editor.');
    let value;try{value=JSON.parse(text)}catch{throw Error(label+': JSON inválido. Confira aspas duplas, vírgulas e chaves.')}
    if(!object(value))throw Error(label+': use um objeto JSON na raiz.');
    return value;
  }
  function gradeRequest(id,input){
    const item=exercise(id);if(!item||item.type!=='request')throw Error('Desafio de implementação inválido.');
    const checks=[];
    function check(key,label,passed,detail){checks.push({id:key,label,passed:!!passed,detail})}
    const method=String(input?.method||'').trim().toUpperCase();
    check('method','Método HTTP',method==='POST','Use POST para events:ingest.');
    check('endpoint','Endpoint',String(input?.url||'').trim()===endpoint,'Use o endpoint v1/events:ingest indicado na documentação. Nenhuma chamada será feita aqui.');
    let headers,body;
    try{headers=parse(input?.headers,'Cabeçalhos');check('headers-json','JSON dos cabeçalhos',true,'Objeto JSON válido.')}catch(error){check('headers-json','JSON dos cabeçalhos',false,error.message)}
    if(headers){
      const names=Object.keys(headers).map(key=>key.toLowerCase());
      const header=name=>Object.entries(headers).find(([key])=>key.toLowerCase()===name)?.[1];
      check('content-type','Content-Type',String(header('content-type')||'').split(';')[0].trim().toLowerCase()==='application/json','Defina Content-Type como application/json.');
      check('authorization','Autorização fictícia',header('authorization')==='Bearer LAB_TOKEN','Neste simulador use apenas Authorization: Bearer LAB_TOKEN. Gere e use credenciais reais fora do TagLab.');
      check('headers-scope','Cabeçalhos do exercício',new Set(names).size===names.length&&names.every(name=>['content-type','authorization'].includes(name)),'Use somente Content-Type e Authorization, sem duplicar nomes. É o escopo didático desta atividade.');
    }
    try{body=parse(input?.body,'Corpo');check('body-json','JSON do corpo',true,'Objeto JSON válido.')}catch(error){check('body-json','JSON do corpo',false,error.message)}
    if(body){
      const expected=JSON.parse(solution(id).body),dest=body.destinations?.[0];
      check('validate-only','Validação sem ingestão',body.validateOnly===true,'validateOnly precisa ser o booleano true, não uma string.');
      check('destination','Conta e ação de conversão',Array.isArray(body.destinations)&&body.destinations.length===1&&dest?.operatingAccount?.accountType==='GOOGLE_ADS'&&dest.operatingAccount.accountId===fixture.customerId&&dest.productDestinationId===fixture.conversionActionId,'Use uma lista com o destino do enunciado: operatingAccount GOOGLE_ADS, accountId e productDestinationId como strings.');
      check('consent','Consentimento do cenário',object(body.consent)&&body.consent.adUserData===expected.consent.adUserData&&body.consent.adPersonalization===expected.consent.adPersonalization,'Registre o consentimento informado no contexto, sem conceder autorização por conta própria.');
      const events=Array.isArray(body.events)?body.events:[];
      check('event-count','Todas as vendas presentes',events.length===expected.events.length,'Este exercício espera '+expected.events.length+' evento(s). Não descarte a venda com erro.');
      const ids=events.map(event=>event?.transactionId);
      check('transactions','Transações preservadas',events.length===expected.events.length&&new Set(ids).size===ids.length&&expected.events.every(event=>ids.includes(event.transactionId)),'Preserve os IDs de todas as vendas. Neste cenário eles permitem acompanhar a mesma transação e evitar duplicidade.');
      for(const [index,wanted]of expected.events.entries()){
        const event=events.find(event=>event?.transactionId===wanted.transactionId)||events[index];
        const prefix=expected.events.length>1?wanted.transactionId+' · ':'';
        const date=event?.eventTimestamp;
        const dateValid=typeof date==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(date)&&Date.parse(date)===Date.parse(wanted.eventTimestamp);
        check('date-'+index,prefix+'Data e fuso',dateValid,'Use o instante da venda em RFC 3339, incluindo Z ou o fuso. Outra representação do mesmo instante também passa.');
        check('value-'+index,prefix+'Valor e moeda',event?.conversionValue===wanted.conversionValue&&event?.currency===wanted.currency,'Preserve o valor numérico da venda e currency BRL. A exigência desses valores vem do enunciado.');
        check('source-'+index,prefix+'Origem do evento',event?.eventSource==='WEB','Neste cenário, eventSource é WEB.');
        check('click-'+index,prefix+'Clique preservado',event?.adIdentifiers?.gclid===wanted.adIdentifiers.gclid,'Use o GCLID fictício da venda em adIdentifiers.gclid. Este teste não verifica a existência de um clique real.');
        if(id==='corrigir-ecl'){
          const encoding=body.encoding,identifiers=event?.userData?.userIdentifiers;
          const hash=Array.isArray(identifiers)&&identifiers.length===1?identifiers[0]?.emailAddress:undefined;
          const validHash=encoding==='HEX'?typeof hash==='string'&&hash.toLowerCase()===emailHash:encoding==='BASE64'&&hash===emailBase64;
          check('encoding','Representação do hash',['HEX','BASE64'].includes(encoding),'Declare encoding HEX ou BASE64. A representação deve corresponder ao identificador.');
          check('identity','Hash da identidade normalizada',validHash,'Use um único emailAddress com o SHA-256 de aluno.teste@example.com. E-mail em claro, hash do texto original e hash duplo não passam.');
          check('identity-scope','Identificador do exercício',object(event?.userData)&&Object.keys(event.userData).every(key=>key==='userIdentifiers')&&Array.isArray(identifiers)&&identifiers.length===1&&object(identifiers[0])&&Object.keys(identifiers[0]).every(key=>key==='emailAddress'),'Este exercício usa somente um identificador de e-mail.');
        }else{
          check('no-identity-'+index,prefix+'Prévia somente por clique',object(event)&&!Object.hasOwn(event,'userData')&&!Object.hasOwn(body,'encoding'),id==='consentimento-api'?'Pela política deste exercício, remova userData e encoding após a revogação.':'Esta atividade OCI usa somente GCLID; não inclua userData ou encoding. É o escopo do exercício, não uma restrição geral da API.');
        }
        const allowedEvent=['adIdentifiers','eventTimestamp','eventSource','transactionId','conversionValue','currency',...(id==='corrigir-ecl'?['userData']:[])];
        check('event-scope-'+index,prefix+'Campos do evento',object(event)&&Object.keys(event).every(key=>allowedEvent.includes(key))&&object(event.adIdentifiers)&&Object.keys(event.adIdentifiers).every(key=>key==='gclid'),'Use apenas os campos do enunciado. Campos extras da API ficam fora desta atividade.');
      }
      check('body-scope','Campos do corpo',Object.keys(body).every(key=>['destinations','events','consent','validateOnly',...(id==='corrigir-ecl'?['encoding']:[])].includes(key))&&object(body.consent)&&Object.keys(body.consent).every(key=>['adUserData','adPersonalization'].includes(key))&&object(dest)&&Object.keys(dest).every(key=>['operatingAccount','productDestinationId'].includes(key))&&object(dest.operatingAccount)&&Object.keys(dest.operatingAccount).every(key=>['accountType','accountId'].includes(key)),'Use apenas os campos solicitados. O corretor cobre estes cenários, não todo o contrato da API.');
    }
    const passed=checks.every(check=>check.passed);
    return {passed,checks,simulatedResponse:passed?{http:200,body:{},note:'SIMULAÇÃO LOCAL · validação inicial aprovada para este exercício; sem ingestão ou atribuição.'}:{http:400,body:{error:{status:'INVALID_ARGUMENT',message:'Um ou mais critérios didáticos não foram atendidos.'}},note:'SIMULAÇÃO LOCAL · consulte os critérios abaixo. Este resultado não foi retornado pelo Google.'}};
  }
  function hydrate(saved){
    const state={version,selected:exercises[0].id,progress:{}};
    if(!object(saved)||saved.version!==version)return state;
    if(exercise(saved.selected))state.selected=saved.selected;
    for(const item of exercises){
      const value=saved.progress?.[item.id];if(!object(value))continue;
      state.progress[item.id]={attempts:Number.isSafeInteger(value.attempts)?Math.max(0,Math.min(value.attempts,10000)):0,passed:value.passed===true,assisted:value.assisted===true};
    }
    return state;
  }
  return Object.freeze({version,reviewedAt,endpoint,sources,exercises,fixture:clone(fixture),exercise,solution,starter,gradeChoice,gradeRequest,hydrate});
});
