# Data Manager: desafios de implementação

Revisão: 19/10/2026. Versão 1. Material autoral para estudo, com fontes oficiais. Não é uma certificação.

## Como estudar

Abra **Desafios de código** no menu do TagLab. O enunciado fica ao lado do código ou editor. Tente resolver, execute a correção, investigue os critérios que falharam e use as dicas antes da solução. O editor recebe JSON, não executa JavaScript arbitrário.

Há cinco desafios de leitura: finalidade do envio OCI, preparação para ECL, alcance de validateOnly, avisos em HTTP 200 e acompanhamento por requestStatus. Quatro desafios de implementação cobrem conexão HTTP manual, correção de ECL, revogação de consentimento e um lote com duas vendas.

O progresso registra tentativas, conclusão e consulta a dicas/solução. Ver a solução não conclui o desafio. Uma execução aprovada após consulta é identificada. Exportação contém apenas IDs e progresso, sem código ou cabeçalhos. O estado é uma autoavaliação local e pode ser alterado pelo próprio navegador; a aprovação do tutor fica no fluxo da equipe.

## O que o corretor verifica

- Método POST, endpoint, Content-Type e token fictício **Bearer LAB_TOKEN**.
- Destino e campos de cada venda conforme o enunciado, sem descartar registros com erro.
- Tipos, validateOnly booleano, data RFC 3339 e equivalência do instante entre fusos.
- Preservação da transação, clique, valor, moeda e origem esperados no caso.
- SHA-256 do e-mail normalizado, comparando o valor conhecido da identidade fictícia. Aceita HEX sem diferenciar maiúsculas/minúsculas ou BASE64 correspondente. Um hash com formato válido, mas calculado sobre o texto errado, não passa.
- Consentimento consistente com o contexto. No exercício de revogação, a remoção de userData é a política conservadora da atividade. Não equivale a autorização geral para uploads reais com consentimento negado.

O corretor compara campos e significado, não o texto inteiro do JSON. A ordem das propriedades não importa. No lote, a ordem dos eventos também não importa. Só os campos pedidos fazem parte da rubrica; outros campos opcionais da API ficam fora desses exercícios.

## Limites técnicos

Não há chamadas à Data Manager API, autenticação real ou execução do código de leitura. O HTTP 200/400 e o corpo apresentados são respostas **simuladas**, não retornos do Google. Nenhuma conversão é ingerida ou atribuída.

O endpoint e o esquema seguem os cenários documentados, mas isso não é uma réplica completa do backend do Google. Não use as restrições didáticas como regras universais: a API aceita lotes de até 2.000 eventos; os exercícios trabalham com um ou dois. HEX e BASE64 podem representar identificadores com hash. Outros identificadores, destinos e campos dependem do caso.

Data e identidades dos exercícios são fixas e fictícias. Não transfira o request do laboratório para uma conta real sem adaptar todos os dados ao teste autorizado. Não cole tokens ou dados pessoais no TagLab. O módulo não grava os editores nem envia respostas ao dataLayer/GA4; tags externas do laboratório podem observar interações gerais.

## Prática acompanhada: conexão real

1. Combine com o tutor conta, destino, escopo e critérios de teste. Para o cenário Google Ads offline, use a conta que possui a ação apropriada para importação de cliques, conforme o guia atual.
2. Habilite a Data Manager API no projeto Google Cloud e configure uma autenticação suportada. O escopo principal é `https://www.googleapis.com/auth/datamanager`. API keys não são um método suportado para essa autenticação. O acesso ao projeto não substitui acesso à conta de destino.
3. Use o APIs Explorer acessível no exemplo REST oficial ou um ambiente local com credenciais configuradas. Segredos permanecem fora do site de testes.
4. Monte o request adequado ao caso, com IDs corretos, dados autorizados, datas e identificadores pertinentes. Os GCLIDs `TEST_GCLID_...` do TagLab não representam cliques reais.
5. Comece por `validateOnly: true`. Inspecione status HTTP e corpo. Investigue `error.status`, detalhes de campos e `fieldWarnings`, conforme a resposta.
6. Introduza um erro de formato no teste, explique a resposta, corrija e valide novamente. Entregue a comparação sem credenciais, dados de clientes ou informações pessoais.
7. Explique os limites: validateOnly realiza validação inicial sem ingestão, não testa processamento assíncrono ou atribuição e não fornece diagnóstico assíncrono daquela solicitação.

Uma prática de ingestão efetiva é outra atividade: precisa de destino e dados adequados e combinação explícita com o responsável. Após uma ingestão aceita, preserve requestId, acompanhe requestStatus por destino e investigue erros e avisos. PROCESSING não é conclusão; SUCCESS de processamento não comprova, sozinho, atribuição publicitária.

## Revisão pelo tutor

Peça ao aluno que explique o destino, a diferença entre normalização/hash/encoding, a origem do consentimento, o efeito de validateOnly e o tratamento de erros. Dê uma variação do cenário para conferir transferência do aprendizado. Uma nota local ou o acesso ao gabarito não substituem essa conversa.

## Fontes oficiais

- Acesso e autenticação: https://developers.google.com/data-manager/api/devguides/quickstart/set-up-access
- Conversões offline e ECL: https://developers.google.com/data-manager/api/devguides/events/google-ads/offline/send-events
- Eventos e limite por request: https://developers.google.com/data-manager/api/reference/rest/v1/events/ingest
- Erros, avisos e validateOnly: https://developers.google.com/data-manager/api/devguides/concepts/understand-errors
- Status e diagnósticos: https://developers.google.com/data-manager/api/reference/rest/v1/requestStatus/retrieve

Revise o conteúdo quando a API mudar. Data de revisão não implica sincronização automática com a documentação.
