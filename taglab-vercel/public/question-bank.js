/* Banco autoral versionado. Gabaritos públicos para estudo. */
(function(root,factory){const data=factory();if(typeof module==='object'&&module.exports)module.exports=data;else root.TagLabQuestionBank=data;})(typeof globalThis!=='undefined'?globalThis:this,function(){return {
  "version": 3,
  "reviewedAt": "2026-10-16",
  "language": "pt-BR",
  "notice": "Questões autorais de estudo, baseadas em documentação oficial. Não é uma prova ou certificação do Google. Gabaritos públicos.",
  "topics": [
    {
      "id": "gtm",
      "label": "GTM, Google tag e dataLayer",
      "description": "Configurar o que dispara, quando dispara e quais dados ficam disponíveis."
    },
    {
      "id": "ga4",
      "label": "GA4 e e-commerce",
      "description": "Mensurar navegação, eventos, produtos e recebimento no destino."
    },
    {
      "id": "gtg",
      "label": "GTG, CDN e sGTM",
      "description": "Separar roteamento first-party de processamento server-side."
    },
    {
      "id": "consent",
      "label": "Consentimento e CMP",
      "description": "Interpretar sinais, ordem de inicialização e revogação."
    },
    {
      "id": "upd",
      "label": "UPD e Enhanced Conversions",
      "description": "Preparar dados primários e entender sua aplicação à mensuração."
    },
    {
      "id": "offline",
      "label": "OCI e ECL",
      "description": "Relacionar cliques e identidade do lead ao resultado offline."
    },
    {
      "id": "data-manager",
      "label": "Data Manager: UI e API",
      "description": "Escolher integração e validar estrutura, destino e autorização."
    },
    {
      "id": "architecture",
      "label": "Arquitetura e diagnóstico",
      "description": "Escolher soluções combinadas e interpretar evidências com limites claros."
    }
  ],
  "sources": {
    "gtm_intro": {
      "title": "Introdução ao Google Tag Manager",
      "url": "https://support.google.com/tagmanager/answer/6102821?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "gtm_components": {
      "title": "Tags, acionadores, variáveis e camada de dados",
      "url": "https://support.google.com/tagmanager/answer/6103657?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "gtm_variables": {
      "title": "Variáveis no GTM",
      "url": "https://support.google.com/tagmanager/answer/7683056?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "gtm_triggers": {
      "title": "Ordem dos acionadores de carregamento",
      "url": "https://support.google.com/tagmanager/answer/7679319?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "datalayer": {
      "title": "Implementação da camada de dados",
      "url": "https://developers.google.com/tag-platform/tag-manager/datalayer",
      "publisher": "Google",
      "reviewedAt": "2026-10-16"
    },
    "preview": {
      "title": "Preview e depuração de contêineres web",
      "url": "https://support.google.com/tagmanager/answer/6107056?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "publish": {
      "title": "Publicação e versões no GTM",
      "url": "https://support.google.com/tagmanager/answer/6107163?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-16"
    },
    "gtag_vs_gtm": {
      "title": "Google Tag Manager e gtag.js",
      "url": "https://support.google.com/tagmanager/answer/7582054?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "ga_ecommerce": {
      "title": "E-commerce no GA4",
      "url": "https://developers.google.com/analytics/devguides/collection/ga4/ecommerce",
      "publisher": "Google",
      "reviewedAt": "2026-10-16"
    },
    "ga_debug": {
      "title": "Eventos no DebugView",
      "url": "https://support.google.com/analytics/answer/7201382?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "ga_views": {
      "title": "Pageviews e mudanças de histórico",
      "url": "https://developers.google.com/analytics/devguides/collection/ga4/views",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "ga_dedupe": {
      "title": "Deduplicação de compras no GA4 web",
      "url": "https://support.google.com/analytics/answer/12313109?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "ga_scope": {
      "title": "Escopos de e-commerce",
      "url": "https://support.google.com/analytics/answer/12947610?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "ads_tag": {
      "title": "Conversões Google Ads pelo GTM",
      "url": "https://support.google.com/tagmanager/answer/6105160?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "gtg_setup": {
      "title": "Google Tag Gateway: configuração e verificação",
      "url": "https://developers.google.com/tag-platform/tag-manager/gateway/setup-guide?setup=manual",
      "publisher": "Google",
      "reviewedAt": "2026-10-16"
    },
    "gtg_combo": {
      "title": "GTG com CDN e sGTM",
      "url": "https://developers.google.com/tag-platform/tag-manager/gateway/sgtm-and-cdn",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "sgtm_overview": {
      "title": "Visão geral de server-side tagging",
      "url": "https://developers.google.com/tag-platform/tag-manager/server-side/overview",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "tagging_sides": {
      "title": "Client-side e server-side tagging",
      "url": "https://support.google.com/tagmanager/answer/13387731?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "sgtm_debug": {
      "title": "Depuração de contêineres server-side",
      "url": "https://developers.google.com/tag-platform/tag-manager/server-side/debug",
      "publisher": "Google",
      "reviewedAt": "2026-10-16"
    },
    "consent_modes": {
      "title": "Consent Mode básico e avançado",
      "url": "https://support.google.com/analytics/answer/14009635?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "consent_impl": {
      "title": "Implementar consentimento em websites",
      "url": "https://developers.google.com/tag-platform/security/guides/consent",
      "publisher": "Google",
      "reviewedAt": "2026-10-16"
    },
    "consent_gtm": {
      "title": "Suporte a consentimento no GTM",
      "url": "https://support.google.com/tagmanager/answer/10718549?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-16"
    },
    "upd_overview": {
      "title": "Coleta de dados fornecidos pelo usuário no GA4",
      "url": "https://support.google.com/analytics/answer/14077171?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "upd_code": {
      "title": "UPD por código no GTM",
      "url": "https://support.google.com/analytics/answer/14179230?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-16"
    },
    "upd_verify": {
      "title": "Validação da implementação UPD",
      "url": "https://support.google.com/analytics/answer/14171683?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "ec_ga4": {
      "title": "Conversões otimizadas no Google Analytics",
      "url": "https://support.google.com/analytics/answer/14252663?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "ec_ads": {
      "title": "Conversões otimizadas no Google Ads",
      "url": "https://support.google.com/google-ads/answer/9888656?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "ecl": {
      "title": "Conversões otimizadas para leads",
      "url": "https://support.google.com/google-ads/answer/15713840?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "oci": {
      "title": "Importações de conversões offline",
      "url": "https://support.google.com/google-ads/answer/2998031?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "ecl_upgrade": {
      "title": "Atualizar OCI para ECL",
      "url": "https://support.google.com/google-ads/answer/14274408?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "dm_ui": {
      "title": "Visão geral do Google Ads Data Manager",
      "url": "https://support.google.com/google-ads-data-manager/answer/13761872?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "dm_events": {
      "title": "Eventos e destinos da Data Manager API",
      "url": "https://developers.google.com/data-manager/api/devguides/events",
      "publisher": "Google",
      "reviewedAt": "2026-10-16"
    },
    "dm_ingest": {
      "title": "Referência events.ingest",
      "url": "https://developers.google.com/data-manager/api/reference/rest/v1/events/ingest",
      "publisher": "Google",
      "reviewedAt": "2026-10-16"
    },
    "dm_format": {
      "title": "Normalização, hash e encoding na API",
      "url": "https://developers.google.com/data-manager/api/devguides/concepts/formatting",
      "publisher": "Google",
      "reviewedAt": "2026-10-16"
    },
    "dm_access": {
      "title": "Autenticação e acesso à Data Manager API",
      "url": "https://developers.google.com/data-manager/api/devguides/quickstart/set-up-access",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "dm_userdata": {
      "title": "Estrutura UserData da API",
      "url": "https://developers.google.com/data-manager/api/reference/rest/v1/UserData",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "dm_migrate": {
      "title": "Diagnóstico e migração de uploads offline",
      "url": "https://support.google.com/google-ads/answer/13321563?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-15"
    },
    "gtm_exceptions": {
      "title": "Acionadores de disparo e exceções",
      "url": "https://support.google.com/tagmanager/answer/7679318?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-16"
    },
    "ga_developer_filter": {
      "title": "Filtrar tráfego de desenvolvedor no GA4",
      "url": "https://support.google.com/analytics/answer/13296662?hl=en",
      "publisher": "Google",
      "reviewedAt": "2026-10-16"
    }
  },
  "questions": [
    {
      "id": "oci-key",
      "topic": "offline",
      "level": "basico",
      "kind": "conceito",
      "tools": [
        "Google Ads",
        "CRM"
      ],
      "question": "No modo OCI deste laboratório, qual dado deve acompanhar o lead até a venda?",
      "options": [
        "O título da página",
        "O GCLID capturado no clique",
        "O nome visual do botão",
        "A nota do questionário"
      ],
      "correct": 1,
      "explanation": "O modo OCI usa adIdentifiers.gclid para relacionar a conversão ao clique. O valor TEST_GCLID_ é apenas um identificador sintético para estudo.",
      "impact": "O identificador precisa acompanhar o lead no CRM, além da camada de coleta.",
      "sourceIds": [
        "oci"
      ],
      "practiceId": "oci",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "ecl-block",
      "topic": "consent",
      "level": "basico",
      "kind": "diagnostico",
      "tools": [
        "Consent Mode",
        "ECL"
      ],
      "question": "O lead está WON, mas o ECL não gera payload e ad_user_data está denied. Qual é o próximo passo?",
      "options": [
        "Trocar o transactionId até funcionar",
        "Renomear emailAddress para email",
        "Revisar o consentimento, aplicar a seleção e gerar novamente",
        "Conceder todos os sinais automaticamente no código"
      ],
      "correct": 2,
      "explanation": "A regra deste laboratório bloqueia ECL com UserData enquanto ad_user_data está negado. O atalho abre o controle; o usuário decide e aplica o sinal. ad_personalization continua independente.",
      "impact": "A decisão de consentimento afeta quais dados podem compor o evento, mesmo com o CRM pronto.",
      "sourceIds": [
        "consent_impl",
        "ecl"
      ],
      "practiceId": "consent",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "normalize",
      "topic": "upd",
      "level": "basico",
      "kind": "implementacao",
      "tools": [
        "UPD",
        "GTM"
      ],
      "question": "Antes de aplicar SHA-256 a um e-mail, qual preparação está correta?",
      "options": [
        "Remover espaços nas extremidades e converter para minúsculas",
        "Aplicar SHA-256 ao texto com espaços e maiúsculas",
        "Converter o e-mail em um user_id do GA4",
        "Remover todos os pontos de qualquer domínio"
      ],
      "correct": 0,
      "explanation": "Normalização consistente evita hashes diferentes para o mesmo valor. A regra de remoção de pontos na parte local de Gmail/Googlemail é específica desses domínios.",
      "impact": "Uma normalização inconsistente quebra a comparação de hashes entre etapas.",
      "sourceIds": [
        "upd_code"
      ],
      "practiceId": "hash",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "hash-format",
      "topic": "upd",
      "level": "basico",
      "kind": "conceito",
      "tools": [
        "UPD",
        "Data Manager"
      ],
      "question": "Qual representação este laboratório usa para SHA-256 no request ECL?",
      "options": [
        "O telefone em claro sem o sinal +",
        "Uma senha criptografada reversível",
        "Um número aleatório de 32 dígitos",
        "Uma string de 64 caracteres hexadecimais, com encoding HEX no request"
      ],
      "correct": 3,
      "explanation": "SHA-256 produz 256 bits, representados aqui em 64 caracteres hexadecimais. encoding descreve essa representação; não significa aplicar hash outra vez.",
      "impact": "Encoding descreve a representação dos bytes; não é outra rodada de hash.",
      "sourceIds": [
        "dm_userdata"
      ],
      "practiceId": "hash",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "ecl-no-click",
      "topic": "offline",
      "level": "intermediario",
      "kind": "cenario",
      "tools": [
        "ECL",
        "CRM",
        "Google Ads"
      ],
      "question": "O que o caso ECL do laboratório permite quando o GCLID está vazio?",
      "options": [
        "Gerar UserData preparado, se a identidade for válida e houver consentimento",
        "Inventar um GCLID real",
        "Tratar o e-mail como transactionId",
        "Afirmar que houve atribuição de anúncio"
      ],
      "correct": 0,
      "explanation": "Neste exercício, ECL pode ser preparado com userData.userIdentifiers sem GCLID. A estrutura local e dados fictícios não demonstram matching ou atribuição no Google Ads.",
      "impact": "No ambiente real, configure a coleta web e preserve GCLIDs disponíveis. A prévia isolada não testa atribuição.",
      "sourceIds": [
        "ecl"
      ],
      "practiceId": "no-click",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "transaction",
      "topic": "architecture",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "CRM",
        "Data Manager"
      ],
      "question": "Você gera novamente o evento da mesma venda do CRM. Como deve tratar transactionId?",
      "options": [
        "Gerar outro ID a cada clique no botão",
        "Remover o ID do evento",
        "Preservar o ID da venda e usar outro em uma nova venda",
        "Substituir pelo hash do e-mail"
      ],
      "correct": 2,
      "explanation": "Um ID estável identifica a mesma transação. Trocar o ID a cada tentativa prejudica o controle de duplicação. O processamento final também depende do destino e da ação de conversão.",
      "impact": "CRM e mecanismo de entrega precisam identificar a mesma venda de forma consistente.",
      "sourceIds": [
        "dm_events"
      ],
      "practiceId": "dedupe",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "invalid-sale",
      "topic": "architecture",
      "level": "basico",
      "kind": "diagnostico",
      "tools": [
        "CRM"
      ],
      "question": "Ao registrar uma venda com valor zero neste laboratório, qual resultado é esperado?",
      "options": [
        "Marcar WON e deixar o valor antigo",
        "Manter o lead OPEN e explicar o erro",
        "Criar uma venda de R$ 1 automaticamente",
        "Gerar um request sem valor"
      ],
      "correct": 1,
      "explanation": "A validação precisa ocorrer antes de alterar o CRM. Neste simulador, só um valor positivo em centavos permite concluir a venda e liberar o evento.",
      "impact": "Validar antes de atualizar o CRM impede que dados inválidos liberem etapas posteriores.",
      "sourceIds": [
        "dm_ingest"
      ],
      "practiceId": "invalid",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "validate-only",
      "topic": "data-manager",
      "level": "basico",
      "kind": "diagnostico",
      "tools": [
        "Data Manager"
      ],
      "question": "O Playground exibe um JSON com validateOnly=true. O que isso comprova?",
      "options": [
        "Uma conversão já entrou no Google Ads",
        "A identidade foi reconhecida pelo Google",
        "A API recebeu o request e retornou 200",
        "Somente a geração da prévia local; o site não chamou a API"
      ],
      "correct": 3,
      "explanation": "Aqui não existe chamada de rede. Em uma chamada real à API, validateOnly=true solicita validação sem executar a ingestão. Exibir o campo não equivale a essa chamada.",
      "impact": "A interface local não autentica nem solicita validação ao serviço Google.",
      "sourceIds": [
        "dm_ingest"
      ],
      "practiceId": "oci",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "revoke",
      "topic": "consent",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "Consent Mode",
        "ECL"
      ],
      "question": "O que deve acontecer com a prévia ECL atual quando ad_user_data é revogado?",
      "options": [
        "Evento e request devem ser invalidados; nova geração com UserData fica bloqueada",
        "O hash permite ignorar a revogação",
        "A prévia anterior deve continuar pronta para envio",
        "A permissão deve voltar para granted sozinha"
      ],
      "correct": 0,
      "explanation": "Hash não substitui consentimento. O laboratório limpa os objetos atuais para impedir cópia ou uso de uma prévia que já não representa o estado selecionado.",
      "impact": "A mudança invalida a prévia atual; registros históricos fictícios continuam sendo evidências locais.",
      "sourceIds": [
        "consent_gtm"
      ],
      "practiceId": "revoke",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "evidence",
      "topic": "architecture",
      "level": "basico",
      "kind": "diagnostico",
      "tools": [
        "GTM",
        "GA4"
      ],
      "question": "O evento aparece no monitor dataLayer. Qual é a conclusão correta?",
      "options": [
        "O Google Ads atribuiu a venda",
        "O dado já aparece no relatório do GA4",
        "O push aconteceu; disparo da tag e entrega ainda precisam de evidências",
        "O gateway está ativo"
      ],
      "correct": 2,
      "explanation": "O monitor é uma evidência local. Use Tag Assistant para as tags, Network para o transporte e o destino para conferir recebimento e diagnóstico.",
      "impact": "Problemas em acionador, transporte e processamento exigem verificações diferentes.",
      "sourceIds": [
        "preview",
        "ga_debug"
      ],
      "practiceId": "gateway",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "gtg",
      "topic": "gtg",
      "level": "basico",
      "kind": "implementacao",
      "tools": [
        "GTG",
        "CDN"
      ],
      "question": "O que falta se você apenas preencher /metrics na configuração do simulador?",
      "options": [
        "Criar um push manual gtm.init",
        "Configurar o roteamento real do gateway na infraestrutura do domínio",
        "Colocar a chave OAuth no HTML",
        "Desativar o consentimento"
      ],
      "correct": 1,
      "explanation": "O campo seleciona o caminho usado pelo site. O GTG requer uma CDN, balanceador ou servidor configurado para encaminhar as requisições por esse domínio.",
      "impact": "O carregamento first-party depende de uma rota real e do contêiner associado a ela.",
      "sourceIds": [
        "gtg_setup"
      ],
      "practiceId": "gateway",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "metadata",
      "topic": "data-manager",
      "level": "basico",
      "kind": "conceito",
      "tools": [
        "Data Manager",
        "dataLayer"
      ],
      "question": "O que os eventos técnicos do laboratório offline colocam no dataLayer global?",
      "options": [
        "E-mail e telefone completos",
        "Tokens de acesso à API",
        "Todos os hashes da identidade",
        "Metadados do caso, sem e-mail, telefone ou hashes"
      ],
      "correct": 3,
      "explanation": "O módulo offline mantém identidade e request na sua própria prévia. Seus eventos técnicos informam estratégia, presença de chaves e transactionId de teste.",
      "impact": "O módulo offline evita colocar a identidade de teste em cada evento técnico do monitor.",
      "sourceIds": [
        "dm_userdata"
      ],
      "practiceId": "oci",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "gtm-owner",
      "topic": "gtm",
      "level": "basico",
      "kind": "cenario",
      "tools": [
        "GTM",
        "GA4"
      ],
      "question": "A equipe precisa gerenciar tags e regras de disparo por interface. Qual componente atende essa responsabilidade?",
      "options": [
        "O CRM de vendas",
        "O GTM e seu contêiner",
        "O relatório do GA4",
        "O campo /metrics"
      ],
      "correct": 1,
      "explanation": "O GTM organiza configurações de tags, acionadores e variáveis. GA4 recebe e analisa os eventos enviados.",
      "impact": "Separar gestão de tags e análise facilita localizar em qual etapa o problema está.",
      "sourceIds": [
        "gtm_intro"
      ],
      "practiceId": "tag-contract",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "gtm-triplet",
      "topic": "gtm",
      "level": "basico",
      "kind": "conceito",
      "tools": [
        "GTM"
      ],
      "question": "Qual associação está correta no GTM?",
      "options": [
        "Tag decide a nota; variável hospeda o site",
        "Acionador armazena permanentemente o CRM",
        "Tag executa; acionador define quando; variável fornece valores",
        "dataLayer publica automaticamente o contêiner"
      ],
      "correct": 2,
      "explanation": "Tags, acionadores e variáveis cumprem papéis complementares. Um valor disponível não substitui uma regra de disparo.",
      "impact": "A tag GA4 pode consumir o valor da venda por variável quando o acionador de compra ocorrer.",
      "sourceIds": [
        "gtm_components"
      ],
      "practiceId": "tag-contract",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "dl-event-contract",
      "topic": "gtm",
      "level": "intermediario",
      "kind": "implementacao",
      "tools": [
        "GTM",
        "dataLayer"
      ],
      "question": "O front-end envia event=\"lab_upd_lead\". Como acionar a tag de lead do exercício?",
      "options": [
        "Usar Evento personalizado com esse nome exato",
        "Criar uma nova propriedade por clique",
        "Acionar apenas no carregamento de imagens",
        "Renomear gtm.init para lab_upd_lead"
      ],
      "correct": 0,
      "explanation": "O nome do evento funciona como contrato entre a aplicação e o acionador. Confira também as condições e exceções da tag.",
      "impact": "Um evento correto no dataLayer pode não disparar uma tag com nome de acionador diferente.",
      "sourceIds": [
        "datalayer",
        "gtm_components"
      ],
      "practiceId": "tag-contract",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "gtm-value-variable",
      "topic": "gtm",
      "level": "basico",
      "kind": "implementacao",
      "tools": [
        "GTM",
        "dataLayer"
      ],
      "question": "Você precisa enviar o total calculado do carrinho, disponível em ecommerce.value. O que configurar?",
      "options": [
        "Um valor fixo de 1 em todas as compras",
        "Um gatilho com o preço no nome",
        "Um novo contêiner para cada produto",
        "Uma variável de camada de dados para ecommerce.value"
      ],
      "correct": 3,
      "explanation": "Variáveis permitem passar valores dinâmicos para tags. Use o caminho compatível com o objeto emitido pela aplicação.",
      "impact": "O valor enviado acompanha o carrinho real do caso em vez de uma constante.",
      "sourceIds": [
        "gtm_variables"
      ],
      "practiceId": "tag-contract",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "gtm-consent-order",
      "topic": "gtm",
      "level": "intermediario",
      "kind": "cenario",
      "tools": [
        "GTM",
        "Consent Mode"
      ],
      "question": "Qual acionador foi criado especificamente para tags que definem o consentimento antes dos demais?",
      "options": [
        "Window Loaded",
        "DOM Ready",
        "Consent Initialization",
        "Evento de compra"
      ],
      "correct": 2,
      "explanation": "Consent Initialization precede Initialization. O acionador Initialization atende outras tags que precisam iniciar cedo.",
      "impact": "A ordem evita que tags avaliem um evento antes de conhecer os sinais aplicáveis.",
      "sourceIds": [
        "gtm_triggers"
      ],
      "practiceId": "initialization",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "gtm-dom-timing",
      "topic": "gtm",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "GTM",
        "dataLayer"
      ],
      "question": "Uma variável consulta um elemento HTML e volta vazia porque ele ainda não existe. Qual investigação faz sentido?",
      "options": [
        "Usar DOM Ready ou um evento após a criação do elemento; preferir um contrato de dados estável",
        "Gerar outro GCLID",
        "Mudar BRL para USD",
        "Conceder ad_personalization em todos os casos"
      ],
      "correct": 0,
      "explanation": "O momento em que o DOM está disponível importa para leitura de elementos. Se possível, entregue o dado por um evento bem definido.",
      "impact": "Dependência do HTML pode tornar a mensuração frágil diante de alterações de layout.",
      "sourceIds": [
        "gtm_triggers",
        "gtm_variables"
      ],
      "practiceId": "initialization",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "gtm-publish",
      "topic": "gtm",
      "level": "basico",
      "kind": "diagnostico",
      "tools": [
        "GTM"
      ],
      "question": "A tag funciona no Preview do seu workspace, mas a versão pública ainda não contém a mudança. O que verificar?",
      "options": [
        "O hash do telefone",
        "O valor da moeda",
        "O tamanho da imagem do site",
        "Se a versão correta do contêiner foi publicada"
      ],
      "correct": 3,
      "explanation": "Preview permite testar alterações antes de publicar. Deploy do site e publicação do GTM são operações independentes.",
      "impact": "Manter versão, descrição e possibilidade de reversão ajuda a investigar regressões.",
      "sourceIds": [
        "publish"
      ],
      "practiceId": "initialization",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "gtm-gtag-choice",
      "topic": "gtm",
      "level": "intermediario",
      "kind": "cenario",
      "tools": [
        "GTM",
        "Google tag"
      ],
      "question": "Como escolher entre configurar pelo GTM e integrar gtag.js diretamente no projeto?",
      "options": [
        "GTM é obrigatório para qualquer evento do GA4",
        "Avaliar governança pela interface, acesso ao código e responsabilidade de manutenção",
        "gtag.js cria um CRM automaticamente",
        "Ambos dispensam teste e consentimento"
      ],
      "correct": 1,
      "explanation": "A escolha envolve como a configuração será mantida e validada. Preserve uma estratégia coerente para cada evento.",
      "impact": "No Playground, os modos são exclusivos para facilitar a comparação e reduzir duplicações acidentais.",
      "sourceIds": [
        "gtag_vs_gtm"
      ],
      "practiceId": "gateway",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "ga4-purpose",
      "topic": "ga4",
      "level": "basico",
      "kind": "cenario",
      "tools": [
        "GA4",
        "GTM"
      ],
      "question": "A pergunta de negócio é quais produtos os usuários visualizam e compram. Onde analisar os eventos coletados?",
      "options": [
        "No editor de DNS",
        "Somente no botão Gerar GCLID",
        "No GA4 com a instrumentação de e-commerce configurada",
        "No campo encoding"
      ],
      "correct": 2,
      "explanation": "GA4 usa eventos e parâmetros de produtos para organizar a mensuração de e-commerce. A instrumentação precisa existir.",
      "impact": "O GTM pode entregar os eventos; o GA4 permite analisar o comportamento registrado.",
      "sourceIds": [
        "ga_ecommerce"
      ],
      "practiceId": "ga4-commerce",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "ga4-debug",
      "topic": "ga4",
      "level": "basico",
      "kind": "implementacao",
      "tools": [
        "GA4",
        "Tag Assistant"
      ],
      "question": "Você quer acompanhar eventos do seu dispositivo durante a implementação. Qual recurso usar?",
      "options": [
        "DebugView com modo de depuração ativado",
        "Somente uma captura do dataLayer",
        "Um novo ID de transação a cada segundo",
        "A área de DNS da CDN"
      ],
      "correct": 0,
      "explanation": "DebugView mostra os eventos recebidos em contexto de depuração. Confira dispositivo, propriedade e condições de privacidade.",
      "impact": "Isso acrescenta evidência de recebimento além do disparo observado no GTM.",
      "sourceIds": [
        "ga_debug"
      ],
      "practiceId": "ga4-commerce",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "ga4-spa-duplicates",
      "topic": "ga4",
      "level": "avancado",
      "kind": "diagnostico",
      "tools": [
        "GA4",
        "Google tag"
      ],
      "question": "Uma SPA envia page_view manual e duplica após mudar o histórico. send_page_view=false resolveu só a carga inicial. O que revisar?",
      "options": [
        "O Country do telefone",
        "O algoritmo SHA-256",
        "O Customer ID do Ads",
        "As visualizações por mudanças no histórico na medição otimizada"
      ],
      "correct": 3,
      "explanation": "A opção de histórico da medição otimizada é independente do parâmetro send_page_view. Defina quem controla as visualizações.",
      "impact": "GTM, roteador da SPA e GA4 precisam concordar sobre um único envio por navegação desejada.",
      "sourceIds": [
        "ga_views"
      ],
      "practiceId": "navigation",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "ga4-items-scope",
      "topic": "ga4",
      "level": "intermediario",
      "kind": "conceito",
      "tools": [
        "GA4",
        "dataLayer"
      ],
      "question": "Em uma compra com três produtos, qual distinção de escopos está correta?",
      "options": [
        "Preço do item deve substituir o ID da transação",
        "transaction_id descreve o evento; item_id descreve cada produto em items",
        "Todos os campos devem virar propriedades de usuário",
        "O evento purchase aceita somente um produto"
      ],
      "correct": 1,
      "explanation": "Parâmetros no nível de evento descrevem a transação; parâmetros de item descrevem cada entrada da lista de produtos.",
      "impact": "Respeitar os escopos evita confundir receita total com características de um produto.",
      "sourceIds": [
        "ga_scope"
      ],
      "practiceId": "ga4-commerce",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "ga4-purchase-id",
      "topic": "ga4",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "GA4",
        "CRM"
      ],
      "question": "No fluxo web, por que enviar um transaction_id único e consistente para a compra?",
      "options": [
        "Para substituir todos os parâmetros de produtos",
        "Para garantir atribuição em qualquer plataforma",
        "Para apoiar a deduplicação da mesma compra e o vínculo do reembolso",
        "Para autorizar o uso de dados pessoais"
      ],
      "correct": 2,
      "explanation": "O GA4 web usa o ID para reconhecer compras repetidas. Não reutilize o mesmo identificador entre vendas distintas.",
      "impact": "O ID de negócio deve se manter consistente entre checkout e reembolso.",
      "sourceIds": [
        "ga_dedupe"
      ],
      "practiceId": "ga4-commerce",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "ga4-refund",
      "topic": "ga4",
      "level": "intermediario",
      "kind": "implementacao",
      "tools": [
        "GA4",
        "CRM"
      ],
      "question": "Como modelar um reembolso parcial de um produto no exercício de e-commerce?",
      "options": [
        "Enviar refund com o transaction_id da compra e os itens/quantidades reembolsados",
        "Disparar purchase com outro título",
        "Remover a tag base de todos os visitantes",
        "Enviar um page_view negativo"
      ],
      "correct": 0,
      "explanation": "O evento refund referencia a transação original. Itens e quantidades permitem detalhar quais produtos foram reembolsados.",
      "impact": "O contrato entre CRM/checkout e GA4 precisa preservar a identificação da compra.",
      "sourceIds": [
        "ga_ecommerce"
      ],
      "practiceId": "ga4-commerce",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "ga4-ads-tag-ids",
      "topic": "ga4",
      "level": "basico",
      "kind": "cenario",
      "tools": [
        "Google Ads",
        "GTM",
        "GA4"
      ],
      "question": "Você quer uma tag de conversão nativa do Google Ads. Quais IDs devem vir da ação configurada no Ads?",
      "options": [
        "Somente o título do GA4",
        "Somente um GCLID sintético",
        "O nome do contêiner server-side",
        "Conversion ID e Conversion Label"
      ],
      "correct": 3,
      "explanation": "A tag nativa do Google Ads usa os identificadores da conta/ação. Um G-ID do Analytics tem outra finalidade.",
      "impact": "GA4 e Ads podem medir a jornada por rotas distintas; mapeie o destino antes de configurar tags.",
      "sourceIds": [
        "ads_tag"
      ],
      "practiceId": "ga4-commerce",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "ga4-no-hit",
      "topic": "ga4",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "GA4",
        "Tag Assistant"
      ],
      "question": "A tag disparou no Preview, mas o DebugView esperado está vazio. Qual sequência é mais útil?",
      "options": [
        "Concluir que o GA4 está com defeito",
        "Conferir destino, modo de depuração, consentimento e requisições de rede",
        "Publicar dez vezes o mesmo contêiner",
        "Alterar o conteúdo do questionário"
      ],
      "correct": 1,
      "explanation": "Disparo local não basta. Verifique se o evento foi enviado para a propriedade pretendida e se pode aparecer no DebugView.",
      "impact": "O diagnóstico percorre configuração, transporte e recebimento sem confundir as evidências.",
      "sourceIds": [
        "ga_debug",
        "preview"
      ],
      "practiceId": "ga4-commerce",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "gtg-sgtm-diff",
      "topic": "gtg",
      "level": "basico",
      "kind": "conceito",
      "tools": [
        "GTG",
        "sGTM",
        "CDN"
      ],
      "question": "Qual é a principal diferença entre GTG e um contêiner server-side do GTM?",
      "options": [
        "GTG é o relatório do Ads; sGTM é a CMP",
        "São apenas dois nomes para o mesmo contêiner",
        "GTG fornece o caminho first-party; sGTM processa eventos com clientes, tags e regras no servidor",
        "sGTM elimina a necessidade de coleta de eventos"
      ],
      "correct": 2,
      "explanation": "GTG e sGTM ocupam papéis diferentes na arquitetura e podem ser combinados. Roteamento não equivale ao processamento de um contêiner server-side.",
      "impact": "É possível usar GTG sem implantar um sGTM; adicione processamento servidor quando existir essa necessidade.",
      "sourceIds": [
        "tagging_sides",
        "sgtm_overview"
      ],
      "practiceId": "tool-fit",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "gtg-healthy-proof",
      "topic": "gtg",
      "level": "basico",
      "kind": "diagnostico",
      "tools": [
        "GTG",
        "CDN"
      ],
      "question": "O endpoint /metrics/healthy respondeu ok. O que falta antes de concluir que a mensuração funciona?",
      "options": [
        "Gerar eventos e conferir os hits no caminho e o recebimento no destino",
        "Nada: health check garante todas as conversões",
        "Adicionar e-mails reais ao teste",
        "Apagar o GA4"
      ],
      "correct": 0,
      "explanation": "O health check verifica a rota. A validação completa também observa scripts, eventos e o destino de coleta.",
      "impact": "Cada camada pode funcionar isoladamente enquanto outra continua com falha.",
      "sourceIds": [
        "gtg_setup"
      ],
      "practiceId": "gateway",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "gtg-route-collision",
      "topic": "gtg",
      "level": "intermediario",
      "kind": "implementacao",
      "tools": [
        "GTG",
        "CDN"
      ],
      "question": "A aplicação já usa /metrics para uma funcionalidade. Qual escolha evita conflito de roteamento?",
      "options": [
        "Encaminhar a raiz inteira para o gateway",
        "Apagar os parâmetros dos eventos",
        "Usar o mesmo caminho sem avaliar o comportamento",
        "Reservar outro caminho livre e configurar CDN e snippet de forma coerente"
      ],
      "correct": 3,
      "explanation": "O caminho do gateway não deve conflitar com rotas existentes. A regra precisa identificar apenas o tráfego pretendido.",
      "impact": "Uma regra ampla pode capturar páginas ou APIs de negócio que não pertencem à mensuração.",
      "sourceIds": [
        "gtg_setup"
      ],
      "practiceId": "gateway",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "gtg-and-upd",
      "topic": "gtg",
      "level": "intermediario",
      "kind": "cenario",
      "tools": [
        "GTG",
        "UPD",
        "Consent Mode"
      ],
      "question": "Ao ativar GTG, o que acontece com a necessidade de consentimento e preparação do UPD?",
      "options": [
        "O caminho first-party autoriza todos os usos",
        "Consentimento e preparação continuam necessários",
        "O hash vira opcional em qualquer API",
        "Todas as pessoas passam a ser reconhecidas"
      ],
      "correct": 1,
      "explanation": "Trocar a infraestrutura de transporte não substitui as regras aplicáveis à coleta e ao uso dos dados.",
      "impact": "Valide transporte e configuração de identidade separadamente. GTG não garante aumento fixo de conversões.",
      "sourceIds": [
        "gtg_combo",
        "consent_gtm"
      ],
      "practiceId": "consent",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "gtg-cdn-sgtm-combo",
      "topic": "gtg",
      "level": "avancado",
      "kind": "cenario",
      "tools": [
        "GTG",
        "CDN",
        "sGTM"
      ],
      "question": "Você quer servir scripts pela borda e processar eventos em um contêiner servidor. Como essas peças podem trabalhar juntas?",
      "options": [
        "A CDN substitui todas as tags do servidor",
        "O sGTM precisa criar um page_view manual por imagem",
        "GTG/CDN atende scripts first-party e o sGTM recebe/processa o fluxo de eventos planejado",
        "Basta mudar o nome do array dataLayer"
      ],
      "correct": 2,
      "explanation": "A arquitetura combinada distribui responsabilidades entre entrega de scripts e processamento de dados. Configure explicitamente os caminhos e destinos.",
      "impact": "Servir scripts pela CDN pode reduzir a carga dessa entrega no servidor de tagging; o processamento continua precisando de operação.",
      "sourceIds": [
        "gtg_combo"
      ],
      "practiceId": "tool-fit",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "sgtm-client-role",
      "topic": "gtg",
      "level": "intermediario",
      "kind": "conceito",
      "tools": [
        "sGTM",
        "GTM"
      ],
      "question": "No contêiner server-side, qual é o papel de um client?",
      "options": [
        "Reconhecer a requisição recebida e transformá-la em dados de evento para o contêiner",
        "Emitir o boleto da CDN",
        "Criar o consentimento do usuário",
        "Desenhar o banner de cookies no navegador"
      ],
      "correct": 0,
      "explanation": "Clients adaptam requisições para o modelo de eventos do servidor. Tags usam esses eventos para enviar dados aos destinos.",
      "impact": "Um request pode chegar ao servidor e ainda não ser reconhecido pelo client esperado.",
      "sourceIds": [
        "sgtm_overview"
      ],
      "practiceId": "gateway",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "sgtm-debug-endtoend",
      "topic": "gtg",
      "level": "avancado",
      "kind": "diagnostico",
      "tools": [
        "sGTM",
        "Tag Assistant"
      ],
      "question": "O navegador enviou para seu endpoint sGTM, mas o destino não recebeu o evento. Onde investigar?",
      "options": [
        "Apenas no quiz",
        "Somente no arquivo do logotipo",
        "No texto do botão de compra",
        "No Preview do servidor: request, client, dados de evento e tags de saída"
      ],
      "correct": 3,
      "explanation": "A depuração servidor permite rastrear a requisição e o processamento interno. Confira também erros na saída para os destinos.",
      "impact": "O fluxo navegador → servidor → produto requer evidência em cada trecho.",
      "sourceIds": [
        "sgtm_debug"
      ],
      "practiceId": "gateway",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "cmp-vs-consent",
      "topic": "consent",
      "level": "basico",
      "kind": "conceito",
      "tools": [
        "CMP",
        "Consent Mode"
      ],
      "question": "Qual divisão de responsabilidades faz sentido entre CMP e Consent Mode?",
      "options": [
        "Consent Mode é o banco de contatos e a CMP faz hashing",
        "CMP obtém/gerencia escolhas; Consent Mode comunica sinais que ajustam o comportamento das tags",
        "São duas ferramentas de e-commerce",
        "A CMP importa vendas no Google Ads"
      ],
      "correct": 1,
      "explanation": "Um mecanismo de consentimento coleta a escolha. A implementação precisa traduzir essa decisão para os sinais usados pelas tags.",
      "impact": "Exibir um banner sem atualizar os sinais pode deixar a mensuração incoerente com a escolha.",
      "sourceIds": [
        "consent_modes"
      ],
      "practiceId": "consent",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "consent-basic-advanced",
      "topic": "consent",
      "level": "intermediario",
      "kind": "conceito",
      "tools": [
        "Consent Mode",
        "GA4"
      ],
      "question": "O que diferencia o modo básico do avançado na documentação de Consent Mode?",
      "options": [
        "Os dois sempre bloqueiam todos os scripts",
        "O avançado transforma denied em granted",
        "O básico bloqueia tags até o consentimento; o avançado pode enviar pings sem cookies com consentimento negado",
        "O básico dispensa banner"
      ],
      "correct": 2,
      "explanation": "O comportamento depende da modalidade e da configuração. Não interprete denied isoladamente como ausência garantida de qualquer requisição.",
      "impact": "Teste os pings e o uso de cookies conforme a estratégia aprovada para o ambiente.",
      "sourceIds": [
        "consent_modes"
      ],
      "practiceId": "consent",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "consent-default-order",
      "topic": "consent",
      "level": "basico",
      "kind": "implementacao",
      "tools": [
        "Consent Mode",
        "Google tag"
      ],
      "question": "Em uma integração própria, quando definir o estado padrão de consentimento?",
      "options": [
        "Antes dos comandos de mensuração que dependem desse estado",
        "Somente depois do purchase",
        "No último dia do mês",
        "Depois de copiar o request de ECL"
      ],
      "correct": 0,
      "explanation": "Defina defaults antes de medir e envie updates quando houver decisão do usuário. A sequência importa.",
      "impact": "Uma tag executada antes do estado correto pode produzir comportamento diferente do pretendido.",
      "sourceIds": [
        "consent_impl"
      ],
      "practiceId": "consent",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "consent-distinct-signals",
      "topic": "consent",
      "level": "intermediario",
      "kind": "cenario",
      "tools": [
        "Consent Mode",
        "ECL"
      ],
      "question": "O usuário permite envio de dados para publicidade, mas não personalização. Qual ação é coerente?",
      "options": [
        "Usar o mesmo valor para todos os sinais por conveniência",
        "Ignorar a distinção porque existe hash",
        "Substituir os sinais por um GCLID",
        "Representar ad_user_data e ad_personalization de acordo com suas escolhas independentes"
      ],
      "correct": 3,
      "explanation": "Os sinais têm finalidades distintas. Não conceda personalização automaticamente por causa da permissão para outro uso.",
      "impact": "No laboratório ECL, uma prévia pode ter UserData com personalização negada se a regra de ad_user_data for satisfeita.",
      "sourceIds": [
        "consent_gtm",
        "dm_ingest"
      ],
      "practiceId": "consent-sequence",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "consent-update-navigation",
      "topic": "consent",
      "level": "avancado",
      "kind": "diagnostico",
      "tools": [
        "CMP",
        "Consent Mode"
      ],
      "question": "O clique em aceitar navega imediatamente e o update não chega às tags. Qual ponto revisar?",
      "options": [
        "O preço unitário dos produtos",
        "A atualização do consentimento na página onde a escolha ocorreu, antes da transição",
        "A geração de outro hash do mesmo hash",
        "A criação de uma propriedade por página"
      ],
      "correct": 1,
      "explanation": "A documentação orienta tratar a atualização antes da transição de página. Investigue a ordem dos comandos e integrações do banner.",
      "impact": "A navegação pode interromper o fluxo e deixar o estado efetivo diferente da escolha feita.",
      "sourceIds": [
        "consent_impl"
      ],
      "practiceId": "consent-sequence",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "consent-exercise-rule",
      "topic": "consent",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "Consent Mode",
        "UPD"
      ],
      "question": "No Playground, UPD exige analytics_storage e ad_user_data; ECL exige ad_user_data. Como interpretar isso?",
      "options": [
        "Como uma lei universal para todas as tags",
        "Como prova de que todas as tags externas foram bloqueadas",
        "Como regras didáticas explícitas, que não substituem a validação da implementação real",
        "Como autorização para conceder qualquer sinal"
      ],
      "correct": 2,
      "explanation": "Os módulos locais impõem critérios conservadores para seus próprios payloads. As tags conectadas e os destinos têm comportamento próprio.",
      "impact": "O aluno precisa distinguir regras do simulador, configuração do produto e decisões de consentimento.",
      "sourceIds": [
        "consent_gtm"
      ],
      "practiceId": "consent",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "upd-ec-difference",
      "topic": "upd",
      "level": "basico",
      "kind": "conceito",
      "tools": [
        "UPD",
        "Enhanced Conversions"
      ],
      "question": "Qual distinção entre UPD e Enhanced Conversions é útil para a implementação?",
      "options": [
        "UPD é a informação fornecida; EC é uma aplicação desses sinais para melhorar a mensuração de conversões",
        "UPD é uma CDN e EC um banco SQL",
        "Os dois são IDs do mesmo contêiner",
        "EC dispensa os dados de conversão existentes"
      ],
      "correct": 0,
      "explanation": "Dados primários consentidos podem complementar a mensuração. A funcionalidade depende da coleta e da configuração dos destinos.",
      "impact": "Enviar um campo preparado não ativa automaticamente todas as capacidades de conversão.",
      "sourceIds": [
        "ec_ads",
        "upd_overview"
      ],
      "practiceId": "hash",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "upd-key-mapping",
      "topic": "upd",
      "level": "intermediario",
      "kind": "implementacao",
      "tools": [
        "UPD",
        "GTM",
        "GA4"
      ],
      "question": "Você já calculou SHA-256 do e-mail no site para o fluxo UPD por código do GA4. Qual chave usar?",
      "options": [
        "email com outro hash por cima",
        "transaction_id",
        "sha256_email_address na estrutura adequada de UPD",
        "gclid com o valor do hash"
      ],
      "correct": 2,
      "explanation": "O método distingue os campos originais dos campos com hash por nomes específicos. Use a variável especializada de Dados fornecidos pelo usuário.",
      "impact": "Nomes corretos evitam interpretar um hash como e-mail original e processá-lo de novo.",
      "sourceIds": [
        "upd_code"
      ],
      "practiceId": "mapping",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "upd-user-id",
      "topic": "upd",
      "level": "basico",
      "kind": "conceito",
      "tools": [
        "UPD",
        "GA4"
      ],
      "question": "Por que UPD não deve ser confundido com User-ID?",
      "options": [
        "User-ID só aceita telefones",
        "User-ID é seu identificador não pessoal; UPD contém campos específicos usados para correspondência",
        "User-ID é o endpoint da CDN",
        "Hash e User-ID sempre são idênticos"
      ],
      "correct": 1,
      "explanation": "As duas capacidades cumprem papéis distintos e podem coexistir. Não transforme o e-mail em uma dimensão comum por esse motivo.",
      "impact": "A arquitetura precisa mapear cada identidade ao campo e à finalidade corretos.",
      "sourceIds": [
        "upd_overview"
      ],
      "practiceId": "hash",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "upd-ga4-prereq",
      "topic": "upd",
      "level": "intermediario",
      "kind": "implementacao",
      "tools": [
        "UPD",
        "GA4",
        "Google Ads"
      ],
      "question": "Segundo os pré-requisitos atuais de UPD/EC no GA4, o que conferir antes da validação no destino?",
      "options": [
        "Apenas o tamanho do hash local",
        "Somente se o botão está azul",
        "Se o hash aparece como dimensão personalizada",
        "Vínculo com Ads, habilitação da coleta/capacidade UPD, permissões e termos aplicáveis"
      ],
      "correct": 3,
      "explanation": "A documentação consultada exige a vinculação e a configuração do recurso. A preparação local pode ser estudada antes de conectar contas.",
      "impact": "Um payload correto não elimina os requisitos de ativação do produto; revise a fonte porque o recurso pode mudar.",
      "sourceIds": [
        "ec_ga4",
        "upd_overview"
      ],
      "practiceId": "hash",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "upd-network",
      "topic": "upd",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "UPD",
        "GA4",
        "Tag Assistant"
      ],
      "question": "O generate_lead apareceu no DebugView. Isso confirma a implementação de UPD inteira?",
      "options": [
        "Não; confira variável especializada, configuração e os campos processados na requisição",
        "Sim; o DebugView comprova correspondência da pessoa",
        "Sim; qualquer lead contém UPD automaticamente",
        "Somente se a nota do quiz for 100%"
      ],
      "correct": 0,
      "explanation": "A validação de UPD exige verificar a própria implementação e a coleta. Recebimento de um evento de negócio é uma evidência diferente.",
      "impact": "Diagnósticos do destino e dados elegíveis continuam necessários para avaliar efeitos de mensuração.",
      "sourceIds": [
        "upd_verify"
      ],
      "practiceId": "hash",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "ec-web-vs-leads",
      "topic": "upd",
      "level": "intermediario",
      "kind": "cenario",
      "tools": [
        "Enhanced Conversions",
        "ECL",
        "Google Ads"
      ],
      "question": "Uma compra é concluída no site; outro lead fecha contrato dias depois no CRM. Qual distinção orientar?",
      "options": [
        "Usar apenas page_view nos dois",
        "Tratar todo formulário como venda offline importada",
        "Planejar EC para a conversão web e ECL com resultado offline, conforme a jornada",
        "Abandonar o CRM porque existe GTG"
      ],
      "correct": 2,
      "explanation": "O momento e a origem do resultado definem o fluxo. ECL envolve conectar o lead ao resultado posterior, não apenas enviar o formulário.",
      "impact": "As configurações de EC podem ser unificadas na interface, mas as jornadas e as etapas de dados continuam distintas.",
      "sourceIds": [
        "ec_ads",
        "ecl"
      ],
      "practiceId": "no-click",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "oci-crm-choice",
      "topic": "offline",
      "level": "basico",
      "kind": "cenario",
      "tools": [
        "OCI",
        "CRM",
        "Google Ads"
      ],
      "question": "O clique trouxe um orçamento e a venda acontece depois por telefone. O que falta ao medir somente generate_lead?",
      "options": [
        "Um gateway que invente a venda",
        "O retorno do resultado offline vinculado ao lead/clique",
        "A cor do formulário",
        "Outro page_view em cada minuto"
      ],
      "correct": 1,
      "explanation": "Uma submissão de formulário e uma venda posterior representam etapas diferentes. Preserve as chaves de associação e o resultado no processo offline.",
      "impact": "O CRM pode informar quais leads geraram valor em vez de otimizar apenas quantidade de formulários.",
      "sourceIds": [
        "oci"
      ],
      "practiceId": "oci",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "ecl-two-halves",
      "topic": "offline",
      "level": "intermediario",
      "kind": "implementacao",
      "tools": [
        "ECL",
        "UPD",
        "CRM"
      ],
      "question": "Qual plano representa as duas partes do ECL descritas pelo Google?",
      "options": [
        "Coletar dados primários consentidos no site e importar o resultado offline com identificadores correspondentes",
        "Criar um hash e encerrar o projeto",
        "Usar só o endpoint healthy",
        "Copiar o e-mail como nome de evento"
      ],
      "correct": 0,
      "explanation": "A coleta web e a integração do resultado offline precisam conversar. Verifique a implementação da tag e o mecanismo de importação.",
      "impact": "Sem retorno do CRM, a jornada continua sem o resultado posterior esperado.",
      "sourceIds": [
        "ecl"
      ],
      "practiceId": "no-click",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "ecl-preserve-gclid",
      "topic": "offline",
      "level": "intermediario",
      "kind": "cenario",
      "tools": [
        "ECL",
        "OCI",
        "CRM"
      ],
      "question": "Ao adicionar ECL a um fluxo que já preserva GCLID, qual orientação seguir?",
      "options": [
        "Apagar todos os GCLIDs existentes",
        "Substituir GCLID pelo nome da campanha",
        "Ignorar o CRM",
        "Continuar incluindo GCLID quando disponível junto dos dados elegíveis"
      ],
      "correct": 3,
      "explanation": "A atualização permite complementar identificadores existentes com dados primários. A recomendação é preservar os GCLIDs disponíveis.",
      "impact": "ECL e a chave de clique podem atuar em conjunto; não trate a atualização como obrigação de descartar informação válida.",
      "sourceIds": [
        "ecl_upgrade"
      ],
      "practiceId": "oci",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "offline-time",
      "topic": "offline",
      "level": "intermediario",
      "kind": "implementacao",
      "tools": [
        "CRM",
        "Data Manager"
      ],
      "question": "Qual horário deve representar eventTimestamp da venda offline neste exercício?",
      "options": [
        "A hora de gerar o GCLID",
        "A data de criar a propriedade GA4",
        "O momento do resultado de negócio, com fuso/representação adequados",
        "Sempre o horário de copiar o JSON"
      ],
      "correct": 2,
      "explanation": "Diferencie ocorrência do resultado e momento de preparação/envio. O campo da API usa timestamp no formato especificado.",
      "impact": "Trocar esses momentos pode distorcer o diagnóstico da jornada e da importação.",
      "sourceIds": [
        "dm_ingest",
        "oci"
      ],
      "practiceId": "oci",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "offline-synthetic-match",
      "topic": "offline",
      "level": "basico",
      "kind": "diagnostico",
      "tools": [
        "ECL",
        "OCI"
      ],
      "question": "O caso com TEST_GCLID_ e example.com passou na validação local. O que você pode afirmar?",
      "options": [
        "A estrutura do exercício passou; não houve comprovação de clique real nem matching",
        "A campanha recuperou uma venda real",
        "O Google reconheceu o proprietário do e-mail",
        "A ação de conversão recebeu receita"
      ],
      "correct": 0,
      "explanation": "As fixtures servem para aprender e testar o encadeamento do simulador. Elas não representam usuários ou interações publicitárias elegíveis.",
      "impact": "Evita relatar um sucesso de atribuição usando apenas um resultado de código local.",
      "sourceIds": [
        "ecl_upgrade"
      ],
      "practiceId": "no-click",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "offline-new-api",
      "topic": "offline",
      "level": "avancado",
      "kind": "cenario",
      "tools": [
        "OCI",
        "ECL",
        "Data Manager"
      ],
      "question": "Um tutorial antigo ensina upload OCI/ECL por Google Ads API. Qual decisão tomar ao iniciar uma integração agora?",
      "options": [
        "Copiar sem conferir a data",
        "Rever a migração e adotar o caminho atual da Data Manager API para esses uploads",
        "Colocar o token no dataLayer",
        "Trocar o nome da ação até passar"
      ],
      "correct": 1,
      "explanation": "A documentação atual contém mudanças e restrições para uploads legados. Confira a migração em vez de depender de um tutorial antigo.",
      "impact": "A modelagem de eventos pode continuar útil, mas endpoint, acesso e operação precisam seguir o caminho suportado.",
      "sourceIds": [
        "dm_migrate"
      ],
      "practiceId": "oci",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "dm-ui-vs-api",
      "topic": "data-manager",
      "level": "basico",
      "kind": "cenario",
      "tools": [
        "Data Manager",
        "CRM"
      ],
      "question": "Sua fonte já tem um conector suportado e o time quer configurar a conexão por interface. Qual opção avaliar primeiro?",
      "options": [
        "Um servidor sGTM só para desenhar formulários",
        "Um contêiner GTM novo por linha do CRM",
        "A conexão pela UI do Data Manager",
        "Uma dimensão com o token de acesso"
      ],
      "correct": 2,
      "explanation": "A UI concentra conexões e ativação de dados. Confira se a fonte e o caso de uso são suportados antes de criar uma integração própria.",
      "impact": "Um conector pode reduzir desenvolvimento, mas ainda exige mapeamento e validação do dado.",
      "sourceIds": [
        "dm_ui"
      ],
      "practiceId": "oci",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "dm-api-choice",
      "topic": "data-manager",
      "level": "intermediario",
      "kind": "cenario",
      "tools": [
        "Data Manager",
        "CRM"
      ],
      "question": "O processo requer preparar eventos e controlar a ingestão programaticamente. O que planejar?",
      "options": [
        "Uma integração com a Data Manager API, destino e autorização adequados",
        "Apenas um evento de clique em qualquer botão",
        "Um novo logo do GA4",
        "O endpoint healthy como API de vendas"
      ],
      "correct": 0,
      "explanation": "A API oferece ingestão programática; é preciso habilitar acesso, preparar dados e configurar destinos e autenticação.",
      "impact": "A integração adiciona responsabilidade de operação, falhas, repetição e proteção de credenciais.",
      "sourceIds": [
        "dm_events",
        "dm_access"
      ],
      "practiceId": "dm-auth",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "dm-api-access",
      "topic": "data-manager",
      "level": "intermediario",
      "kind": "implementacao",
      "tools": [
        "Data Manager"
      ],
      "question": "Por que preencher Customer ID e Conversion Action ID não basta para chamar a API?",
      "options": [
        "Porque é obrigatório usar dados reais no teste",
        "Porque o ID substitui o consentimento",
        "Porque o navegador precisa saber o segredo do servidor",
        "Porque também são necessários API habilitada, autenticação e autorização no destino"
      ],
      "correct": 3,
      "explanation": "Os IDs identificam o destino; não concedem acesso. O Playground só usa esses valores para uma prévia estrutural.",
      "impact": "Uma etapa futura de envio real exige um desenho próprio de autenticação, sem expor credenciais no site público.",
      "sourceIds": [
        "dm_access"
      ],
      "practiceId": "dm-auth",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "dm-field-shapes",
      "topic": "data-manager",
      "level": "intermediario",
      "kind": "implementacao",
      "tools": [
        "UPD",
        "Data Manager",
        "GTM"
      ],
      "question": "Você vai reutilizar a identidade do fluxo UPD por tag na Data Manager API. O que revisar?",
      "options": [
        "Somente o texto da pergunta",
        "Nomes/estrutura de UserData, normalização e encoding exigidos pelo destino",
        "Se os campos estão na mesma ordem visual",
        "Se todo dado pode ser enviado em claro"
      ],
      "correct": 1,
      "explanation": "A API usa userIdentifiers com campos próprios e hashes normalizados. Não copie o objeto de outra integração sem mapear o contrato.",
      "impact": "Um mesmo conceito de identidade precisa de representações compatíveis em cada etapa.",
      "sourceIds": [
        "dm_format",
        "dm_userdata"
      ],
      "practiceId": "mapping",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "dm-destination",
      "topic": "data-manager",
      "level": "basico",
      "kind": "conceito",
      "tools": [
        "Data Manager",
        "Google Ads"
      ],
      "question": "Qual parte da prévia diz para qual conta e ação de conversão o evento está sendo preparado?",
      "options": [
        "A lista destinations com operatingAccount e productDestinationId",
        "O title da página",
        "A alternativa marcada no quiz",
        "O filtro de busca"
      ],
      "correct": 0,
      "explanation": "Destino e evento são peças distintas do request. Confira o mapeamento da conta e da ação antes de operar uma integração.",
      "impact": "Uma conversão correta associada ao destino errado continua sendo um erro de implementação.",
      "sourceIds": [
        "dm_ingest"
      ],
      "practiceId": "oci",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "dm-local-vs-service",
      "topic": "data-manager",
      "level": "avancado",
      "kind": "diagnostico",
      "tools": [
        "Data Manager"
      ],
      "question": "A verificação local aprovou o JSON, mas a API real retornou erro de acesso ou regra do produto. Por quê?",
      "options": [
        "O Google sempre deve aceitar qualquer JSON válido",
        "O hash necessariamente mudou",
        "Estrutura local não testa autorização, elegibilidade e processamento do serviço",
        "A CDN apagou a resposta do questionário"
      ],
      "correct": 2,
      "explanation": "Validação do simulador cobre apenas regras implementadas no cliente. O serviço aplica requisitos adicionais ao request e ao destino.",
      "impact": "Documente claramente o que foi testado antes de declarar uma integração pronta para produção.",
      "sourceIds": [
        "dm_access",
        "dm_events"
      ],
      "practiceId": "dm-auth",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "architecture-path",
      "topic": "architecture",
      "level": "intermediario",
      "kind": "cenario",
      "tools": [
        "dataLayer",
        "GTM",
        "GA4"
      ],
      "question": "Qual cadeia descreve um caminho possível de mensuração de uma compra web?",
      "options": [
        "GA4 cria o produto e manda para o CRM automaticamente",
        "Interface de DNS → nota do quiz → e-mail",
        "CMP → impressão do PDF → conversão offline",
        "Aplicação publica dados → GTM aciona a tag → requisição chega ao GA4"
      ],
      "correct": 3,
      "explanation": "A aplicação fornece o dado; o gerenciador aplica as regras; a tag envia; o produto recebe. Cada trecho precisa de evidência.",
      "impact": "O contrato de dados permite testar configuração e transporte sem alterar a lógica comercial a cada tag.",
      "sourceIds": [
        "gtm_components",
        "preview"
      ],
      "practiceId": "tool-fit",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "architecture-tool-fit",
      "topic": "architecture",
      "level": "intermediario",
      "kind": "cenario",
      "tools": [
        "GTG",
        "ECL",
        "CRM"
      ],
      "question": "O problema é que o resultado da venda no CRM não volta à mensuração. Qual iniciativa ataca diretamente a lacuna?",
      "options": [
        "Trocar a cor do botão de GTG",
        "Planejar o fluxo de resultado offline com chaves preservadas e importação/ECL quando aplicável",
        "Servir apenas o logotipo pela CDN",
        "Conceder todos os sinais sem consultar o usuário"
      ],
      "correct": 1,
      "explanation": "Melhorar o transporte web não cria o resultado offline que está ausente. Comece pelo dado de negócio e pelo mecanismo de retorno.",
      "impact": "A escolha de ferramenta deve responder à lacuna observada, e não à vontade de instalar todas as opções.",
      "sourceIds": [
        "oci",
        "dm_ui"
      ],
      "practiceId": "tool-fit",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "architecture-sgtm-not-auto",
      "topic": "architecture",
      "level": "avancado",
      "kind": "cenario",
      "tools": [
        "sGTM",
        "Consent Mode",
        "GTM"
      ],
      "question": "Ao migrar parte da coleta para sGTM, o que continua precisando ser planejado?",
      "options": [
        "Origem dos eventos, consentimento, regras de envio e evidências de recebimento",
        "Somente a largura do painel",
        "Nada: server-side garante todos os resultados",
        "A nota mínima do estágio"
      ],
      "correct": 0,
      "explanation": "O servidor oferece controle de processamento; não define sozinho a política de coleta nem gera os eventos de negócio necessários.",
      "impact": "Pode haver ganhos de controle com custos e operação adicionais. Valide a necessidade antes da adoção.",
      "sourceIds": [
        "tagging_sides",
        "sgtm_debug"
      ],
      "practiceId": "tool-fit",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "architecture-duplicate-routes",
      "topic": "architecture",
      "level": "avancado",
      "kind": "diagnostico",
      "tools": [
        "GTM",
        "Google tag",
        "GA4"
      ],
      "question": "Uma compra passou a ser enviada por código direto e por uma tag GTM. Como investigar a duplicação?",
      "options": [
        "Gerar outro ID em cada rota",
        "Remover todos os testes",
        "Mapear os emissores, o evento e o destino, e definir a estratégia de envio",
        "Trocar o GCLID pelo telefone"
      ],
      "correct": 2,
      "explanation": "Integrações podem coexistir, mas o mesmo evento não deve ser duplicado por acidente. Analise a origem de cada requisição.",
      "impact": "A arquitetura e o plano de mensuração devem indicar qual componente é responsável por cada envio.",
      "sourceIds": [
        "gtag_vs_gtm",
        "ga_dedupe"
      ],
      "practiceId": "tool-fit",
      "scope": "produto",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "architecture-mentor-check",
      "topic": "architecture",
      "level": "basico",
      "kind": "cenario",
      "tools": [
        "GTM",
        "GA4",
        "Data Manager"
      ],
      "question": "O estagiário acertou todas as questões. Qual validação complementar é adequada antes de maior autonomia?",
      "options": [
        "Avaliar explicação e execução de um caso, com evidências e limites descritos",
        "Dispensar o tutor e entregar acesso irrestrito ao cliente",
        "Tratar a nota como certificação oficial",
        "Importar conversões reais sem revisar"
      ],
      "correct": 0,
      "explanation": "O banco mede respostas a itens conhecidos. Uma verificação prática observa se a pessoa consegue raciocinar, configurar e diagnosticar o caso.",
      "impact": "Use o resultado para orientar revisão, não como prova isolada de competência ou impacto comercial.",
      "sourceIds": [
        "preview",
        "sgtm_debug"
      ],
      "practiceId": "tool-fit",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-15"
    },
    {
      "id": "dl-overwrite-after-load",
      "topic": "gtm",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "dataLayer",
        "GTM"
      ],
      "question": "Depois de carregar o GTM, outro script executa window.dataLayer = []. Os novos pushes aparecem nesse array, mas as tags falham. O que corrigir?",
      "options": [
        "Criar um segundo array chamado datalayer para os eventos de compra",
        "Preservar a instância da camada e acrescentar dados com dataLayer.push",
        "Publicar novamente a tag sem alterar a sobrescrita do array",
        "Enviar gtm.init manualmente depois de cada interação"
      ],
      "correct": 1,
      "explanation": "Reatribuir o array pode desconectar a camada que o contêiner acompanha. Inicialize preservando a instância existente e use push depois.",
      "impact": "Um defeito no contrato da página pode interromper várias tags ao mesmo tempo; trocar apenas o destino não o corrige.",
      "sourceIds": [
        "datalayer"
      ],
      "practiceId": "tag-contract",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "dl-event-and-value",
      "topic": "gtm",
      "level": "intermediario",
      "kind": "implementacao",
      "tools": [
        "dataLayer",
        "GTM"
      ],
      "question": "O site publica event=\"orcamento_enviado\" e só depois publica o valor do orçamento. A tag lê o valor anterior. Qual ajuste torna o contrato mais previsível?",
      "options": [
        "Adicionar um atraso fixo em todas as tags do contêiner",
        "Ler sempre o último total de outro evento do carrinho",
        "Trocar a variável por um texto fixo para evitar valores antigos",
        "Publicar o evento e seus valores necessários na mesma mensagem, com o dado já calculado"
      ],
      "correct": 3,
      "explanation": "O GTM processa mensagens em ordem e avalia as tags do evento naquele contexto. Entregue os valores junto do evento que os consome.",
      "impact": "Aplicação e GTM passam a compartilhar um instante definido para ler o dado, reduzindo dependência de atrasos arbitrários.",
      "sourceIds": [
        "datalayer"
      ],
      "practiceId": "tag-contract",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "gtm-exception-matched",
      "topic": "gtm",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "GTM",
        "Tag Assistant"
      ],
      "question": "No Preview, o acionador de uma tag está satisfeito, mas uma exceção também corresponde ao mesmo evento. Qual hipótese investigar primeiro?",
      "options": [
        "A exceção está impedindo o disparo; revisar sua condição e a intenção da regra",
        "Aumentar a prioridade de disparo para que a tag ignore a exceção",
        "Trocar apenas o ID de destino, sem avaliar as regras de disparo",
        "Alterar o sequenciamento das tags para tornar qualquer exceção inoperante"
      ],
      "correct": 0,
      "explanation": "Exceções podem impedir uma tag mesmo quando há um acionador correspondente. Verifique os critérios no evento observado.",
      "impact": "A investigação começa na regra de execução; diagnosticar uma falha de rede antes de haver disparo mistura etapas diferentes.",
      "sourceIds": [
        "gtm_exceptions",
        "preview"
      ],
      "practiceId": "tag-contract",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "gtm-version-rollback",
      "topic": "gtm",
      "level": "avancado",
      "kind": "cenario",
      "tools": [
        "GTM",
        "Tag Assistant"
      ],
      "question": "Uma publicação do GTM introduziu um erro. Existe uma versão anterior conhecida e validada. Qual procedimento oferece uma recuperação controlada?",
      "options": [
        "Apagar o contêiner e criar outro ID para todos os alunos",
        "Usar Preview como se ele revertesse a versão pública para todos",
        "Revisar a diferença, publicar a versão adequada e validar o fluxo restaurado",
        "Editar só o nome da versão, pois isso restaura as tags anteriores"
      ],
      "correct": 2,
      "explanation": "O histórico permite avaliar e publicar versões. Recuperação exige escolher a configuração correta e verificar o comportamento público.",
      "impact": "Versão publicada, evento e evidências devem ser registrados para distinguir uma recuperação real de um teste no workspace.",
      "sourceIds": [
        "publish",
        "preview"
      ],
      "practiceId": "initialization",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "ga4-value-needs-currency",
      "topic": "ga4",
      "level": "basico",
      "kind": "implementacao",
      "tools": [
        "GA4",
        "Google tag"
      ],
      "question": "Um evento de e-commerce envia value=150, mas não informa a moeda. O que falta no contrato recomendado?",
      "options": [
        "Colocar o símbolo R$ dentro da string de value",
        "Definir currency apenas no nome do item",
        "Enviar currency no nível do evento, com o código da moeda do valor",
        "Reutilizar o G-ID como se ele identificasse a moeda da compra"
      ],
      "correct": 2,
      "explanation": "Valores monetários precisam de currency no nível do evento. O campo identifica a unidade usada na mensuração.",
      "impact": "A coleta pode ter o evento correto e ainda produzir receita incoerente se valor e moeda não forem compatíveis.",
      "sourceIds": [
        "ga_ecommerce"
      ],
      "practiceId": "ga4-commerce",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "ga4-purchase-value-math",
      "topic": "ga4",
      "level": "intermediario",
      "kind": "cenario",
      "tools": [
        "GA4",
        "dataLayer"
      ],
      "question": "A compra tem dois itens de R$ 50 cada, frete de R$ 10 e imposto de R$ 5. Como representar value na recomendação de purchase?",
      "options": [
        "value=100 e currency=\"BRL\", com shipping=10 e tax=5 separados",
        "value=115 e somar novamente shipping e tax nos mesmos campos",
        "value=\"R$ 100,00\" sem currency, porque o símbolo já define a moeda",
        "value=50 porque a quantidade deve ser ignorada no total"
      ],
      "correct": 0,
      "explanation": "O valor dos itens é a soma de preço vezes quantidade. Frete e imposto são parâmetros separados no exemplo oficial de compra.",
      "impact": "Um cálculo consistente evita misturar receita dos itens com componentes que já têm seus próprios campos.",
      "sourceIds": [
        "ga_ecommerce"
      ],
      "practiceId": "ga4-commerce",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "ga4-purchase-business-trigger",
      "topic": "ga4",
      "level": "basico",
      "kind": "cenario",
      "tools": [
        "GA4",
        "GTM"
      ],
      "question": "Em uma loja real, clicar em pagar pode resultar em pagamento recusado. Qual momento representa melhor o evento purchase?",
      "options": [
        "Todo clique no botão pagar, antes de qualquer resultado",
        "A seleção da forma de pagamento, mesmo quando a tentativa falha",
        "O primeiro view_item da sessão, reaproveitando o valor exibido",
        "A confirmação de compra definida pelo negócio, com os dados finais da transação"
      ],
      "correct": 3,
      "explanation": "Compra e envio de informações de pagamento são etapas distintas. O acionamento precisa refletir o resultado que se pretende medir.",
      "impact": "A qualidade do evento depende do significado de negócio, além de o GTM conseguir disparar uma tag.",
      "sourceIds": [
        "ga_ecommerce"
      ],
      "practiceId": "ga4-commerce",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "ga4-developer-filter",
      "topic": "ga4",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "GA4",
        "Tag Assistant"
      ],
      "question": "O evento com debug aparece no DebugView, mas não nos relatórios usuais. Há um filtro ativo de tráfego de desenvolvedor. Como interpretar?",
      "options": [
        "O filtro prova que o dataLayer deixou de funcionar",
        "O filtro pode excluir esses dados dos relatórios enquanto o DebugView continua útil para depuração",
        "Ativar debug garante que qualquer filtro será ignorado nos relatórios",
        "Desativar o filtro recuperará automaticamente os dados já excluídos"
      ],
      "correct": 1,
      "explanation": "Esse filtro permite depurar sem incluir a atividade nos relatórios. Exclusões ativas são permanentes para os dados afetados; teste antes de ativar.",
      "impact": "A validação precisa considerar as configurações da propriedade, para não tratar filtragem esperada como falha de transporte.",
      "sourceIds": [
        "ga_developer_filter",
        "ga_debug"
      ],
      "practiceId": "navigation",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "gtg-html-fallback",
      "topic": "gtg",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "GTG",
        "CDN"
      ],
      "question": "Abrir /metrics/healthy retorna HTTP 200, mas o corpo é o HTML da aplicação. Qual diagnóstico é mais provável?",
      "options": [
        "Qualquer resposta 200 confirma o gateway, independentemente do conteúdo",
        "A rota caiu no fallback do site, em vez de chegar ao health check esperado do gateway",
        "O HTML confirma que o GA4 já atribuiu a conversão",
        "A camada de dados precisa receber um evento healthy para corrigir a CDN"
      ],
      "correct": 1,
      "explanation": "O teste documentado espera o conteúdo ok na rota do gateway. Status 200 com HTML pode ser apenas a resposta da aplicação.",
      "impact": "É preciso conferir destino e conteúdo da resposta; sucesso HTTP isolado não identifica qual serviço atendeu a requisição.",
      "sourceIds": [
        "gtg_setup"
      ],
      "practiceId": "gateway",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "gtg-forward-headers",
      "topic": "gtg",
      "level": "avancado",
      "kind": "diagnostico",
      "tools": [
        "GTG",
        "CDN",
        "Google tag"
      ],
      "question": "Após uma regra de CDN para GTG, o navegador recebe o script sem o Content-Type adequado e não o executa. Qual configuração investigar?",
      "options": [
        "A prioridade de disparo da Google tag dentro do contêiner",
        "A troca do acionador de page_view para DOM Ready",
        "Os nomes dos eventos que seriam recebidos pelo GA4",
        "As regras que alteram ou removem os headers da resposta encaminhada"
      ],
      "correct": 3,
      "explanation": "A configuração do gateway precisa preservar as respostas necessárias ao script. A documentação alerta para regras que removem Content-Type.",
      "impact": "Uma transformação de infraestrutura pode impedir a execução da coleta antes que qualquer acionador de negócio seja avaliado.",
      "sourceIds": [
        "gtg_setup"
      ],
      "practiceId": "gateway",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "gtg-forward-query",
      "topic": "gtg",
      "level": "intermediario",
      "kind": "implementacao",
      "tools": [
        "GTG",
        "CDN"
      ],
      "question": "Uma regra genérica de GTG encaminha o caminho, mas descarta query strings e cookies. O que revisar?",
      "options": [
        "O encaminhamento previsto na configuração oficial para preservar esses elementos e o Host de origem adequado",
        "Remover os parâmetros no navegador, supondo que o destino os reconstrói",
        "Mudar os parâmetros para outro caminho sem ajustar o contrato com a origem",
        "Alterar apenas a medição otimizada da propriedade GA4"
      ],
      "correct": 0,
      "explanation": "O caminho é parte da configuração. A orientação genérica também trata origem, Host e preservação de cookies e query strings.",
      "impact": "Uma rota pode responder e ainda perder informações necessárias ao fluxo; valide a requisição encaminhada, não só o health check.",
      "sourceIds": [
        "gtg_setup"
      ],
      "practiceId": "gateway",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "sgtm-client-not-claimed",
      "topic": "gtg",
      "level": "avancado",
      "kind": "diagnostico",
      "tools": [
        "sGTM",
        "GTM"
      ],
      "question": "No Preview server-side há uma requisição recebida, mas nenhum client a transforma em evento. Qual etapa verificar?",
      "options": [
        "Publicar novamente só as tags de saída, mantendo a entrada sem avaliação",
        "Alterar o relatório do GA4 antes de identificar dados de evento no servidor",
        "A compatibilidade do formato/caminho da requisição com os clients configurados",
        "Aumentar a prioridade da tag de saída para substituir o papel do client"
      ],
      "correct": 2,
      "explanation": "Receber HTTP e produzir um evento no contêiner são etapas distintas. O client precisa reconhecer e adaptar a requisição.",
      "impact": "Sem dados de evento no servidor, as tags de saída não têm o mesmo contexto de processamento esperado.",
      "sourceIds": [
        "sgtm_overview",
        "sgtm_debug"
      ],
      "practiceId": "tool-fit",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "consent-persist-choice",
      "topic": "consent",
      "level": "intermediario",
      "kind": "implementacao",
      "tools": [
        "Consent Mode",
        "CMP"
      ],
      "question": "A pessoa aceita o banner, navega e a escolha se perde na próxima carga. Quem deve persistir a preferência e reaplicá-la?",
      "options": [
        "O Consent Mode sozinho, sem armazenamento ou integração com a escolha",
        "O GA4, usando a nota do simulado para inferir todas as permissões",
        "A solução de consentimento/CMP e sua integração, atualizando os sinais nas páginas seguintes",
        "O gateway, concedendo os quatro sinais sempre que responde ok"
      ],
      "correct": 2,
      "explanation": "Consent Mode não armazena as escolhas por conta própria. A solução precisa persistir a decisão e atualizar o estado nas próximas páginas.",
      "impact": "Transportar dados por GTG não resolve uma falha na continuidade da preferência do usuário.",
      "sourceIds": [
        "consent_impl"
      ],
      "practiceId": "consent-sequence",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "consent-wait-timeout",
      "topic": "consent",
      "level": "intermediario",
      "kind": "conceito",
      "tools": [
        "Consent Mode",
        "Google tag"
      ],
      "question": "Em uma integração gtag.js, wait_for_update=500 foi configurado com default denied. O fim desses 500 ms significa o quê?",
      "options": [
        "Terminou a espera pela atualização; isso não concede consentimento automaticamente",
        "Os sinais tornam-se granted porque o visitante permaneceu na página",
        "A CMP recebeu uma escolha explícita mesmo sem interação",
        "As tags ficam bloqueadas permanentemente até reiniciar o navegador"
      ],
      "correct": 0,
      "explanation": "wait_for_update controla uma janela para uma atualização assíncrona. O sinal continua dependendo do default e dos updates recebidos.",
      "impact": "Tempo de espera e escolha do usuário são informações diferentes; confundi-las altera indevidamente a lógica da coleta.",
      "sourceIds": [
        "consent_impl"
      ],
      "practiceId": "consent-sequence",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "consent-custom-third-party",
      "topic": "consent",
      "level": "intermediario",
      "kind": "cenario",
      "tools": [
        "GTM",
        "Consent Mode"
      ],
      "question": "Uma tag HTML de terceiro não possui verificações nativas de consentimento. Definir denied para as Google tags garante que ela respeite a escolha?",
      "options": [
        "Sim, qualquer JavaScript da página é bloqueado pelo Consent Mode",
        "Sim, desde que o mesmo contêiner também envie eventos ao GA4",
        "Sim, porque a presença de um banner bloqueia todas as tags automaticamente",
        "Não; é preciso configurar as verificações e o comportamento apropriados para essa tag"
      ],
      "correct": 3,
      "explanation": "Os controles da tag devem ser analisados. As verificações adicionais do GTM ajudam a condicionar tags sem integração nativa adequada.",
      "impact": "Um inventário de tags é necessário para aplicar a escolha de forma coerente entre fornecedores.",
      "sourceIds": [
        "consent_gtm"
      ],
      "practiceId": "consent-sequence",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "consent-additional-checks",
      "topic": "consent",
      "level": "avancado",
      "kind": "diagnostico",
      "tools": [
        "GTM",
        "Consent Mode",
        "GA4"
      ],
      "question": "O plano é Consent Mode avançado, mas a Google tag não dispara quando analytics_storage está denied. Há uma verificação adicional exigindo granted. O que revisar?",
      "options": [
        "Se denied deveria ser trocado por granted em todos os visitantes",
        "Se a exigência adicional está bloqueando a tag e contrariando o comportamento planejado para esse modo",
        "Se o GTG precisa ignorar as escolhas da CMP",
        "Se desativar DebugView concede armazenamento à tag"
      ],
      "correct": 1,
      "explanation": "Verificações adicionais podem impedir o disparo. Google tags com verificações nativas ajustam o comportamento; confirme a modalidade pretendida.",
      "impact": "O banner, as configurações do GTM e o modo escolhido precisam concordar; uma exigência extra pode mudar o fluxo observado.",
      "sourceIds": [
        "consent_gtm",
        "consent_modes"
      ],
      "practiceId": "consent-sequence",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "upd-double-hash",
      "topic": "upd",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "UPD",
        "GTM",
        "Enhanced Conversions"
      ],
      "question": "O site já forneceu um e-mail normalizado com SHA-256. Uma segunda etapa aplica SHA-256 novamente ao texto hexadecimal. O que corrigir?",
      "options": [
        "Manter dois hashes porque cada ferramenta exige sempre uma camada extra",
        "Evitar o segundo hash e mapear o valor preparado no campo apropriado para dados com hash",
        "Declarar o hash duplo no campo email, como se fosse um valor original",
        "Corrigir apenas o nome da tag, preservando as duas etapas de hash"
      ],
      "correct": 1,
      "explanation": "Aplicar hash ao hash cria outro valor. A integração deve distinguir campo original e campo já processado, respeitando o contrato do destino.",
      "impact": "Um payload pode ter o tamanho esperado e ainda não representar o identificador normalizado que se pretendia usar.",
      "sourceIds": [
        "upd_code",
        "dm_format"
      ],
      "practiceId": "mapping",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "upd-phone-normalization",
      "topic": "upd",
      "level": "basico",
      "kind": "implementacao",
      "tools": [
        "UPD",
        "Data Manager"
      ],
      "question": "Antes do hash de um telefone, o que significa prepará-lo em E.164 para esses fluxos?",
      "options": [
        "Aplicar o hash primeiro e depois remover parênteses do resultado",
        "Preservar o formato local sem país porque o navegador sempre o infere",
        "Acrescentar o código do país ao hash já pronto",
        "Representar o número com +, código do país e dígitos, sem pontuação de apresentação"
      ],
      "correct": 3,
      "explanation": "A normalização vem antes do SHA-256. E.164 é uma representação do telefone, não um formato do hash.",
      "impact": "Tag e importação precisam preparar a mesma identidade de forma compatível para que o sinal tenha utilidade.",
      "sourceIds": [
        "upd_code",
        "dm_format"
      ],
      "practiceId": "hash",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "upd-optional-missing-field",
      "topic": "upd",
      "level": "basico",
      "kind": "implementacao",
      "tools": [
        "UPD",
        "GTM"
      ],
      "question": "O caso de UPD tem e-mail válido, mas não coleta telefone. Como tratar o campo que não existe no objeto de identidade?",
      "options": [
        "Omitir o campo não coletado, em vez de inventar um valor ou enviar a string undefined",
        "Preencher phone_number com a string null em todas as requisições",
        "Enviar a string undefined como um telefone válido",
        "Reutilizar o telefone do caso anterior para completar o objeto"
      ],
      "correct": 0,
      "explanation": "A configuração por código orienta remover campos que não são coletados. Preserve apenas informações disponíveis e adequadas ao fluxo.",
      "impact": "Dados de preenchimento artificial prejudicam o contrato da identidade e dificultam o diagnóstico entre sistemas.",
      "sourceIds": [
        "upd_code"
      ],
      "practiceId": "hash",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "upd-stale-identity-case",
      "topic": "upd",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "UPD",
        "dataLayer",
        "GTM"
      ],
      "question": "Neste laboratório, depois de preparar uma identidade, você inicia outro caso sem os consentimentos necessários. O que verificar nos eventos seguintes?",
      "options": [
        "Que o hash anterior acompanha qualquer novo evento por conveniência",
        "Que a negação muda somente a cor do aviso, mantendo o mesmo envio de identidade",
        "Que a identidade anterior foi limpa e não foi reaproveitada no novo caso",
        "Que o monitor offline recebeu e-mail e telefone em claro para comparar os dois casos"
      ],
      "correct": 2,
      "explanation": "A limpeza entre eventos é parte das regras locais. Um novo caso sem as permissões exigidas não deve herdar a identidade do anterior.",
      "impact": "Estado antigo em uma página longa pode contaminar eventos; a revisão precisa incluir o que deixou de ser enviado.",
      "sourceIds": [
        "upd_code",
        "consent_impl"
      ],
      "practiceId": "revoke",
      "scope": "laboratorio",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "offline-click-id-redirect",
      "topic": "offline",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "OCI",
        "CRM",
        "Google Ads"
      ],
      "question": "Uma campanha traz GCLID, mas um redirecionamento o elimina antes da captura do lead. O CRM registra apenas UTMs. Qual lacuna investigar para o OCI por GCLID?",
      "options": [
        "Renomear utm_campaign para gclid sem mudar seu conteúdo",
        "Usar o número da linha do CRM como se fosse o GCLID original",
        "A preservação e captura do identificador do clique ao longo do caminho até o lead",
        "Criar um novo TEST_GCLID_ e tratá-lo como o clique real perdido"
      ],
      "correct": 2,
      "explanation": "UTMs descrevem campanha e não substituem automaticamente o identificador usado nessa associação. Verifique onde o parâmetro é perdido.",
      "impact": "Problemas na jornada de entrada precisam ser resolvidos antes do upload; a API não recria por conta própria um clique descartado.",
      "sourceIds": [
        "oci",
        "ecl"
      ],
      "practiceId": "oci",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "offline-business-stage",
      "topic": "offline",
      "level": "basico",
      "kind": "cenario",
      "tools": [
        "CRM",
        "OCI",
        "ECL"
      ],
      "question": "O formulário criou um lead, mas a ação de conversão desejada é contrato fechado. Qual evento de negócio deve orientar o retorno offline?",
      "options": [
        "A confirmação do contrato fechado no CRM, com seu horário e dados associados",
        "A simples abertura do formulário, mesmo sem identificação do lead",
        "Todo carregamento da página de obrigado, independentemente do resultado posterior",
        "A preparação de um hash, tratada como se fosse receita recebida"
      ],
      "correct": 0,
      "explanation": "A etapa medida precisa corresponder à definição da conversão. Captura do lead e fechamento são resultados diferentes.",
      "impact": "O time de negócio e a integração precisam concordar sobre a etapa devolvida à mensuração.",
      "sourceIds": [
        "oci",
        "ecl"
      ],
      "practiceId": "oci",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "offline-timezone-offset",
      "topic": "offline",
      "level": "intermediario",
      "kind": "implementacao",
      "tools": [
        "CRM",
        "Data Manager"
      ],
      "question": "O CRM registra uma venda às 14h em UTC-03:00. Qual representação conserva esse instante em eventTimestamp?",
      "options": [
        "14:00:00Z, apenas trocando o sufixo sem converter o instante",
        "O horário em que o analista abriu o gerador, ignorando a venda",
        "Somente 14:00, sem data nem indicação de fuso",
        "14:00:00-03:00 ou o horário equivalente 17:00:00Z, na data correspondente"
      ],
      "correct": 3,
      "explanation": "O timestamp precisa representar a ocorrência e respeitar RFC 3339. Trocar o offset por Z sem converter o horário muda o instante.",
      "impact": "A associação temporal entre clique, resultado do CRM e ingestão depende de representar a mesma ocorrência.",
      "sourceIds": [
        "dm_ingest",
        "dm_format"
      ],
      "practiceId": "mapping",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "offline-key-reuse-two-sales",
      "topic": "offline",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "CRM",
        "OCI",
        "Data Manager"
      ],
      "question": "O CRM usa o ID do lead como transactionId para duas vendas distintas do mesmo lead. Qual problema de modelagem revisar?",
      "options": [
        "Toda repetição de upload deve trocar o ID mesmo sem nova venda",
        "A chave deve identificar cada venda distinta, mantendo estabilidade nas repetições da mesma venda",
        "A moeda precisa ser removida para diferenciar as transações",
        "Todas as vendas do mesmo cliente devem compartilhar um único ID global"
      ],
      "correct": 1,
      "explanation": "Identidade do lead e identidade do resultado de negócio cumprem papéis diferentes. Não colapse vendas distintas no mesmo identificador de evento.",
      "impact": "A chave mal definida pode prejudicar o controle de duplicações ou a distinção entre resultados, conforme o contrato do destino.",
      "sourceIds": [
        "dm_ingest",
        "oci"
      ],
      "practiceId": "dedupe",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "dm-request-vs-transaction-id",
      "topic": "data-manager",
      "level": "intermediario",
      "kind": "conceito",
      "tools": [
        "Data Manager",
        "CRM"
      ],
      "question": "Uma ingestão real retorna requestId. Esse campo deve substituir transactionId nas vendas do CRM?",
      "options": [
        "Sim, toda venda do lote deve adotar o mesmo requestId",
        "Não; requestId identifica a requisição, enquanto transactionId identifica o evento de negócio",
        "Sim, a API sempre dispensa a identificação da transação depois de aceitar o request",
        "Não é preciso guardar nenhum deles se o HTTP for 200"
      ],
      "correct": 1,
      "explanation": "A API retorna um identificador do request. O ID da transação tem outra finalidade e não deve ser trocado pelo identificador do envio.",
      "impact": "Conservar as duas referências facilita investigar o envio sem perder a identidade estável do resultado.",
      "sourceIds": [
        "dm_ingest"
      ],
      "practiceId": "dm-auth",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "dm-event-consent-override",
      "topic": "data-manager",
      "level": "avancado",
      "kind": "implementacao",
      "tools": [
        "Data Manager",
        "Consent Mode"
      ],
      "question": "Na Data Manager API, há consentimento no request e um consentimento diferente em um Event. Qual regra a referência descreve?",
      "options": [
        "O valor mais permissivo sempre vence, independentemente do nível",
        "O consentimento da requisição elimina qualquer estado individual",
        "A presença de UserData transforma automaticamente ambos em GRANTED",
        "O consentimento do evento prevalece sobre o definido no request para aquele caso"
      ],
      "correct": 3,
      "explanation": "A referência distingue consentimento do lote e do evento, com precedência do evento. Modele os estados sem ampliar uma escolha individual.",
      "impact": "Agrupar dados para envio não autoriza aplicar a todos os usuários a permissão de uma única pessoa.",
      "sourceIds": [
        "dm_ingest"
      ],
      "practiceId": "consent-sequence",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "dm-destination-references-empty",
      "topic": "data-manager",
      "level": "avancado",
      "kind": "diagnostico",
      "tools": [
        "Data Manager",
        "Google Ads"
      ],
      "question": "Um request tem dois destinos e um Event sem destinationReferences. O que a referência da API indica?",
      "options": [
        "Esse evento será enviado a todos os destinos do request; revisar o mapeamento antes do envio",
        "O evento será descartado silenciosamente por não escolher o primeiro destino",
        "O nome do arquivo define sozinho qual destino será usado",
        "O servidor escolherá o destino com melhor taxa de conversão"
      ],
      "correct": 0,
      "explanation": "A lista vazia significa todos os destinos no request. Misturar contas ou ações requer referências explícitas e conferência do contrato.",
      "impact": "Erros de roteamento de dados podem ocorrer mesmo quando o JSON é válido e o envio foi autorizado.",
      "sourceIds": [
        "dm_ingest"
      ],
      "practiceId": "mapping",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "dm-encoding-mismatch",
      "topic": "data-manager",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "Data Manager",
        "UPD"
      ],
      "question": "Um integrador envia os hashes hexadecimais do laboratório, mas declara encoding=BASE64. O que corrigir?",
      "options": [
        "Aplicar SHA-256 novamente para transformar automaticamente HEX em BASE64",
        "Remover todos os identificadores sem conferir o contrato",
        "Fazer o encoding declarado corresponder à representação efetiva dos identificadores preparados",
        "Renomear emailAddress para transactionId para evitar informar encoding"
      ],
      "correct": 2,
      "explanation": "Hashing e encoding são operações diferentes. O request descreve como os bytes preparados foram representados.",
      "impact": "Interfaces podem usar estruturas distintas; compatibilidade exige verificar conteúdo, nomes e representação dos campos.",
      "sourceIds": [
        "dm_format",
        "dm_ingest"
      ],
      "practiceId": "mapping",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "architecture-reproduction-record",
      "topic": "architecture",
      "level": "intermediario",
      "kind": "diagnostico",
      "tools": [
        "GTM",
        "Tag Assistant",
        "GA4"
      ],
      "question": "Outro estagiário não consegue reproduzir uma falha que você viu. Qual registro torna a investigação mais útil?",
      "options": [
        "Somente a captura do contador local, sem configuração de teste",
        "Somente a URL da página, sem passos nem descrição do resultado esperado",
        "Passos, versão/ambiente, estado de consentimento, esperado/observado e evidências de cada etapa",
        "Somente a versão mais recente do código, sem identificar a versão testada"
      ],
      "correct": 2,
      "explanation": "O contexto do teste é necessário para localizar uma diferença de configuração ou de execução. Use evidências compatíveis com cada ferramenta.",
      "impact": "Um relato reproduzível ajuda a separar defeito do site, configuração de tag e comportamento do destino.",
      "sourceIds": [
        "preview",
        "ga_debug"
      ],
      "practiceId": "tool-fit",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "architecture-change-one-route",
      "topic": "architecture",
      "level": "intermediario",
      "kind": "cenario",
      "tools": [
        "GTG",
        "GTM",
        "GA4"
      ],
      "question": "Ao mesmo tempo, a equipe mudou o caminho GTG e as regras das tags. A compra parou de chegar. Como reduzir a incerteza?",
      "options": [
        "Comparar com uma configuração conhecida e isolar cada mudança, observando disparo, rota e destino",
        "Refazer todas as tags e trocar o ID da propriedade ao mesmo tempo",
        "Concluir que o GTG causou a falha apenas porque foi uma das mudanças",
        "Adicionar outro emissor de purchase antes de verificar o atual"
      ],
      "correct": 0,
      "explanation": "Separe as etapas alteradas e teste a hipótese correspondente. A evidência precisa indicar se houve disparo e qual caminho foi usado.",
      "impact": "Isolar mudanças evita atribuir a uma ferramenta um problema introduzido em outra parte do fluxo.",
      "sourceIds": [
        "gtg_setup",
        "preview"
      ],
      "practiceId": "gateway",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "architecture-owner-of-result",
      "topic": "architecture",
      "level": "basico",
      "kind": "cenario",
      "tools": [
        "CRM",
        "GTM",
        "GA4",
        "Data Manager"
      ],
      "question": "O desenho contém GTM, GA4 e Data Manager, mas ninguém definiu de onde virá a confirmação da venda no CRM. O que falta?",
      "options": [
        "Adicionar GTG para gerar automaticamente o resultado que falta no CRM",
        "Tratar todas as submissões de formulário como contratos fechados",
        "Escolher a API primeiro e deixar a definição do resultado para depois",
        "Definir a fonte do resultado, a chave de associação e a responsabilidade pela integração"
      ],
      "correct": 3,
      "explanation": "A integração depende de um resultado de negócio existente e identificado. As ferramentas não substituem a definição dessa fonte.",
      "impact": "Arquitetura útil mostra os dados e responsáveis que conectam as peças, além dos nomes dos produtos.",
      "sourceIds": [
        "oci",
        "dm_events"
      ],
      "practiceId": "tool-fit",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    },
    {
      "id": "architecture-test-data-isolation",
      "topic": "architecture",
      "level": "intermediario",
      "kind": "cenario",
      "tools": [
        "GA4",
        "GTM",
        "Tag Assistant"
      ],
      "question": "A turma vai gerar compras fictícias repetidamente. Qual planejamento reduz confusão com indicadores reais de negócio?",
      "options": [
        "Apontar todos os exercícios para qualquer propriedade de produção disponível",
        "Usar destino de teste definido para a turma e documentar a configuração de debug e filtros",
        "Confiar que o prefixo TEST elimina automaticamente toda coleta no GA4",
        "Supor que abrir o Preview impede qualquer evento de chegar ao destino"
      ],
      "correct": 1,
      "explanation": "Atividades de teste precisam de contexto de mensuração definido. Debug e filtros têm funções próprias e não equivalem a desligar a coleta.",
      "impact": "A separação dos dados facilita avaliar a aprendizagem sem interpretar receitas e conversões fictícias como resultado comercial.",
      "sourceIds": [
        "ga_developer_filter",
        "ga_debug",
        "preview"
      ],
      "practiceId": "tool-fit",
      "scope": "produto",
      "reviewedAt": "2026-10-16"
    }
  ]
};});
