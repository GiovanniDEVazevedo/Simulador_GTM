# TagLab: relatório de implementação, aprendizagem e evolução

**Entrega:** banco de questões v2, revisado em 15/10/2026.  
**Público:** novos estagiários e tutores de implementação de mensuração.  
**Site:** https://simuladorgtm-taglab-vercel.vercel.app/#exercicios  
**Código:** https://github.com/GiovanniDEVazevedo/Simulador_GTM

## 1. Resultado da entrega

O questionário anterior de 12 itens foi ampliado para um banco estático e versionado de **64 questões autorais**, distribuídas igualmente em **oito temas**, com **37 referências oficiais Google** e **16 desafios práticos**. O conteúdo permanece salvo no próprio site e no repositório. Não depende de geração por IA durante o uso, de banco remoto ou de login.

Cada questão apresenta quatro alternativas, gabarito, explicação, impacto no uso conjunto das ferramentas, fontes, data de revisão e uma prática relacionada. Os itens distinguem conceitos do produto de regras específicas deste laboratório. O material é para estudo; não é uma prova oficial Google ou certificação.

Esta entrega acrescenta busca, filtros, favoritos de revisão, simulados menores, rascunho persistente, revisão dos erros e histórico por tema. Também corrige orientações sobre os pré-requisitos atuais de UPD/EC no GA4 e inclui a migração de uploads offline para Data Manager API.

## 2. Inventário do ambiente

| Recurso | O que existe no site | O que o resultado permite concluir |
| --- | --- | --- |
| Loja e jornada | Produtos, carrinho, checkout, compra, reembolso, formulários, vídeos e interações de teste | Eventos podem ser exercitados e inspecionados; não são transações comerciais reais. |
| Carregamento | Modo GTM, GA4 direto ou somente dataLayer; IDs por navegador | Cada pessoa pode usar seu destino. Configurar o site não publica o contêiner nem cria a propriedade. |
| Monitor dataLayer | Lista, filtro e detalhe dos pushes; painel recolhível | Comprova o dado publicado na página. Recebimento exige evidência de rede e do destino. |
| Consentimento | Defaults negados e controles independentes para os quatro sinais | Permite treinar ordem e mudança de estado. Não é uma CMP de produção. |
| UPD e EC | Identidades fictícias, normalização, SHA-256, prévia e envio explícito ao GTM | Valida preparação e regras locais; não demonstra correspondência com usuários reais. |
| OCI e ECL | Clique sintético, lead, CRM em memória, venda WON e payload offline | Exercita associação e diagnóstico. O CRM não persiste após recarregar. |
| Data Manager | Evento e request de prévia com validateOnly=true | Não há OAuth ou chamada de ingestão; nem a validação do serviço é executada. |
| GTG | Campo de caminho no domínio e verificação de rota /healthy | Requer gateway provisionado fora do site. Health check não comprova entrega ao GA4. |
| sGTM | Questões, comparação e tarefas de arquitetura | Nenhum contêiner servidor, hospedagem ou processamento sGTM foi provisionado. |
| Aprendizagem v2 | Banco, simulados, fontes, revisão, exportação e desafios | Apoia estudo e autoavaliação local; não substitui avaliação prática de um tutor. |

As correções ECL da entrega anterior permanecem: aviso de consentimento junto ao gerador, atalho para revisão, retomada do mesmo lead, bloqueio de venda inválida, preservação do ID da mesma transação e limpeza de prévias desatualizadas.

## 3. Banco de questões e formas de estudar

| Tema | Itens | Competência principal |
| --- | --- | --- |
| GTM, Google tag e dataLayer | 8 | Associar tag, acionador e variável; definir contratos de evento e ordem de execução. |
| GA4 e e-commerce | 8 | Escolher eventos/parâmetros, entender escopos, compras, reembolsos e duplicação. |
| GTG, CDN e sGTM | 8 | Distinguir transporte, infraestrutura e processamento; validar cada trecho. |
| Consentimento e CMP | 8 | Diferenciar escolha e sinal; compreender default/update e modos básico/avançado. |
| UPD e Enhanced Conversions | 8 | Preparar dados, escolher campos e cumprir pré-requisitos dos destinos. |
| OCI e ECL | 8 | Preservar chaves, conectar CRM ao resultado offline e reconhecer dados sintéticos. |
| Data Manager UI e API | 8 | Escolher conector ou integração, revisar contratos e separar IDs de autorização. |
| Arquitetura e diagnóstico | 8 | Escolher a solução pelo problema e justificar conclusões com evidências. |

São **27 questões básicas, 29 intermediárias e oito avançadas**. Por tipo, são **12 de conceito, 14 de implementação, 19 de escolha de solução e 19 de diagnóstico**. As quatro posições de gabarito são utilizadas.

### Funcionalidades novas

1. **Banco consultável:** busca sem diferenciar maiúsculas ou acentos; filtros combináveis por tema, nível, ferramenta e tipo. Oito cartões por página evitam uma lista inicial de 64 itens.
2. **Estudo explicado:** alternativas e gabarito ficam em expansões. A explicação conecta a resposta ao impacto no restante da arquitetura, a uma prática e à documentação.
3. **Marcar para revisar:** favoritos locais permitem montar uma seleção individual. Um filtro sem resultados mostra uma mensagem e bloqueia o início de um simulado vazio.
4. **Simulados:** até dez, até vinte ou todas as questões filtradas. O sorteio intercala os temas disponíveis e não repete IDs na mesma tentativa. Se o filtro tiver oito itens, o simulado terá oito.
5. **Navegação e rascunho:** uma pergunta por vez, atalhos numerados, progresso de respostas, anterior/próxima e retomada após recarregar. Alterar os filtros não apaga a tentativa ativa; iniciar outra a substitui.
6. **Correção:** exige todas as respostas, encaminha ao primeiro item pendente e mostra acertos/total, percentual, explicações e desempenho nos temas incluídos.
7. **Revisão:** refazer apenas os erros da tentativa ou praticar os erros ainda pendentes do histórico. A última resposta correta retira o item da lista pendente.
8. **Progresso:** questões distintas corrigidas, contagens acumuladas por tema e últimas 30 tentativas. Repetições entram no total de respostas; a interface declara isso.
9. **Portabilidade:** download do banco e exportação do progresso em JSON. Não há importação de progresso ou sincronização entre dispositivos nesta entrega.
10. **Migração:** tarefas e rascunho compatíveis são preservados do modelo anterior. A melhor nota antiga aparece separada como legado de 12 itens, sem equivaler a uma nota no novo banco.

O armazenamento é local ao navegador. Limpar dados do site elimina o progresso não exportado. O código de aprendizagem não envia respostas ou notas ao dataLayer/GA4. Tags externas conectadas podem observar interações gerais na interface.

### Os 16 desafios

Os oito casos anteriores permanecem: OCI com GCLID, consentimento no ECL, normalização/hash, ECL sem GCLID, repetição da mesma venda, venda inválida, revogação e gateway real. Foram adicionados oito: contrato de evento GTM, compra/reembolso GA4, navegação sem duplicar page_view, sequência de inicialização, escolha de ferramentas, acesso à Data Manager API, sequência de consentimento e mapeamento entre contratos de dados.

Cada desafio informa ação, evidência esperada e acesso ao laboratório relacionado. A marcação é manual: o aluno precisa executar e explicar; o site não inspeciona automaticamente suas contas.

## 4. Ferramentas: diferenças e efeito em conjunto

| Peça | Quando usar | Dependência e efeito combinado |
| --- | --- | --- |
| GTM / gtag.js | Implementar e manter a coleta; escolher interface de gestão ou integração direta conforme governança | O contrato do site alimenta tags. Emissores sobrepostos podem duplicar eventos; controlar destino e responsabilidade. |
| GA4 | Medir comportamento e analisar eventos de negócio | Depende da instrumentação, dos sinais e do recebimento. Evento no dataLayer não é evidência de coleta no GA4. |
| GTG / CDN | Servir scripts e encaminhar mensuração pelo domínio configurado | Altera a rota e exige infraestrutura. Não cria o evento, o consentimento ou o resultado do CRM. Ganhos precisam ser medidos. |
| sGTM | Processar requisições e controlar envios no servidor | Pode coexistir com GTG. Acrescenta configuração, operação e diagnóstico do servidor; não é ativado por um campo no site. |
| CMP / Consent Mode | Obter escolhas e comunicar estados às tags | Uma CMP e os sinais cumprem papéis complementares. O modo avançado pode enviar pings sem cookies quando negado; denied não significa sempre ausência de rede. |
| UPD / EC | Complementar mensuração com dados primários elegíveis e consentidos | UPD é o dado; EC é uma aplicação. Hash não substitui consentimento. UPD/EC no GA4 exige os pré-requisitos atuais, incluindo vínculo com Ads. |
| OCI / ECL | Devolver à mensuração o resultado que ocorreu depois do lead | OCI preserva a associação ao clique; ECL complementa com dados primários. Quando houver GCLID, preserve-o; não confunda formulário enviado com venda offline. |
| Data Manager UI / API | Conectar fontes suportadas ou controlar ingestão por código | A UI pode atender um conector existente; a API requer acesso, autenticação, destino e manutenção. JSON local ou IDs preenchidos não concedem autorização. |

Exemplo: adicionar GTG não corrige ausência de venda no CRM. É necessário preservar chaves e retornar o resultado offline. Em outro caso, adicionar sGTM não elimina compras emitidas duas vezes pelo site; primeiro mapeie emissores e rotas. A solução deve atacar a etapa onde a evidência falha.

A documentação de UPD/EC e a migração de uploads offline foram revisitadas nesta entrega. Tutoriais antigos devem ser confrontados com os pré-requisitos e o caminho atual de Data Manager API, sem presumir que um fluxo legado continua disponível para uma nova implementação.

## 5. Como ajuda e como pode afetar estagiários

**Benefícios esperados, ainda não medidos:** tornar o raciocínio explícito; permitir revisão dirigida por erro; conectar conceitos a tarefas; reduzir confusão entre transporte, processamento e análise; e dar ao tutor um roteiro consistente para discutir evidências.

**Limites e cuidados didáticos:**

- Acertar itens conhecidos pode refletir memorização. Combine nota com execução e explicação de um caso novo.
- Os gabaritos são públicos e o progresso é editável no navegador. Não use a nota como prova sigilosa, certificação ou critério isolado de contratação.
- Cenários sintéticos permitem aprender o encadeamento, mas não comprovam matching, atribuição, elegibilidade, ganho de conversões ou conformidade de uma implantação real.
- Regras locais de bloqueio não descrevem todos os comportamentos dos produtos. O banco identifica questões de laboratório e de produto.
- A variedade de ferramentas pode sobrecarregar quem está começando. Comece por GTM/dataLayer, GA4 e consentimento; avance conforme a pessoa explique a evidência de cada trecho.
- As fontes podem mudar. A revisão de 15/10/2026 é editorial, sem atualização automática. É preciso um responsável por conteúdo e por revisar itens afetados por mudanças.
- O tutor não recebe resultados automaticamente. A exportação pode apoiar uma conversa, mas não representa uma trilha auditável de avaliação.
- Use identidades fictícias no laboratório. Uma eventual integração real deve manter autorização e credenciais fora do código público.

## 6. Roteiro de uso com tutor

1. **Diagnóstico inicial:** selecionar um conjunto conhecido de questões e dois casos práticos. Registrar quais temas e IDs foram usados, em vez de comparar percentuais de seleções diferentes.
2. **Fundamentos:** demonstrar um push, a variável no GTM, o disparo, a requisição e o recebimento no GA4. Explicar o que cada evidência prova.
3. **Jornada e privacidade:** executar compra/reembolso e mudança de consentimento; investigar uma duplicação e distinguir os sinais.
4. **Resultado offline:** preservar uma chave, registrar venda e preparar OCI/ECL. Explicar por que a prévia não equivale a ingestão ou matching.
5. **Arquitetura:** escolher entre GTG, sGTM, UI ou API a partir de um problema concreto. Descrever dependências e custos de operação sem prometer melhora automática.
6. **Revisão:** refazer erros e executar um caso equivalente com detalhes diferentes. O tutor avalia justificativa, evidências e reconhecimento dos limites.

Critério sugerido de autonomia: a pessoa explica a escolha, executa a configuração, localiza uma falha introduzida e registra o que foi e não foi comprovado. O tutor define a exigência adequada ao estágio; o site não impõe uma aprovação automática.

## 7. Verificação técnica

Foram aprovados **28 testes automatizados locais**, cobrindo normalização/hash, consentimento, geração OCI/ECL, estado do CRM, prévias assíncronas, filtros, sorteio, correção, revisão, persistência e migração. A estrutura HTML foi verificada quanto a IDs únicos, scripts existentes e seletores estáticos do módulo.

Os testes de interface usam DOM simulado. Eles não executam chamadas aos serviços Google, não validam credenciais, não provisionam gateway e não comprovam métricas de aprendizagem. A hospedagem continua estática, sem backend novo ou serviço de banco de dados.

## 8. Próximos passos priorizados

| Prioridade | Entrega sugerida | Critério de conclusão |
| --- | --- | --- |
| P0 | Rubrica do tutor e piloto com uma turma pequena | Usar o mesmo escopo de avaliação antes/depois; registrar execução, justificativa e dificuldades. Só então avaliar ganho de aprendizagem. |
| P0 | Responsável editorial e revisão de fontes | Definir dono, periodicidade e revisão após mudanças. Preservar IDs, registrar versão e retirar itens desatualizados. |
| P1 | GTG real em domínio isolado | Provisionar a rota; documentar DNS/CDN/configuração e demonstrar health check, transporte e recebimento. |
| P1 | Biblioteca de falhas controladas | Introduzir rota incorreta, tag ausente, consentimento fora de ordem, duplicação e erro de destino. Cada cenário precisa de reprodução e solução verificáveis. |
| P1 | Registro de bugs e evidências | Template no GitHub com ambiente, passos, esperado, observado e evidência; distinguir falha do simulador de falha de configuração. |
| P2 | Comparação entre coleta direta, GTG e sGTM | Usar os mesmos eventos e registrar entrega, duplicação, latência e esforço operacional. Evitar atribuir efeitos sem experimento controlado. |
| P2 | Integração real Data Manager em ambiente autorizado | Backend com segredos protegidos, acesso válido, validação do serviço, logs e tratamento de erros. Ingestão efetiva requer objetivo e autorização explícitos. |
| P3 | Contribuições e progresso compartilhado | Revisão por PR e fontes obrigatórias; só adicionar login/painel do tutor quando a necessidade de acompanhamento justificar backend e gestão dos dados. |

Ideias adicionais: casos com níveis de pistas, desafios em dupla com revisão de evidências, perguntas abertas avaliadas pelo tutor e um catálogo de decisões de arquitetura. Automatizadores como Node-RED podem ser avaliados depois que contratos e cenários estiverem estáveis; não são necessários para o banco atual.

## 9. Fontes

Todas as referências abaixo são oficiais Google e foram consultadas na revisão editorial de 15/10/2026. Cada questão mantém a associação às suas fontes no banco público. O conteúdo é autoral e foi organizado para este laboratório.

1. [Introdução ao Google Tag Manager](https://support.google.com/tagmanager/answer/6102821?hl=en)
2. [Tags, acionadores, variáveis e camada de dados](https://support.google.com/tagmanager/answer/6103657?hl=en)
3. [Variáveis no GTM](https://support.google.com/tagmanager/answer/7683056?hl=en)
4. [Ordem dos acionadores de carregamento](https://support.google.com/tagmanager/answer/7679319?hl=en)
5. [Implementação da camada de dados](https://developers.google.com/tag-platform/tag-manager/datalayer)
6. [Preview e depuração de contêineres web](https://support.google.com/tagmanager/answer/6107056?hl=en)
7. [Publicação e versões no GTM](https://support.google.com/tagmanager/answer/6107163?hl=en)
8. [Google Tag Manager e gtag.js](https://support.google.com/tagmanager/answer/7582054?hl=en)
9. [E-commerce no GA4](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
10. [Eventos no DebugView](https://support.google.com/analytics/answer/7201382?hl=en)
11. [Pageviews e mudanças de histórico](https://developers.google.com/analytics/devguides/collection/ga4/views)
12. [Deduplicação de compras no GA4 web](https://support.google.com/analytics/answer/12313109?hl=en)
13. [Escopos de e-commerce](https://support.google.com/analytics/answer/12947610?hl=en)
14. [Conversões Google Ads pelo GTM](https://support.google.com/tagmanager/answer/6105160?hl=en)
15. [Google Tag Gateway: configuração e verificação](https://developers.google.com/tag-platform/tag-manager/gateway/setup-guide?setup=manual)
16. [GTG com CDN e sGTM](https://developers.google.com/tag-platform/tag-manager/gateway/sgtm-and-cdn)
17. [Visão geral de server-side tagging](https://developers.google.com/tag-platform/tag-manager/server-side/overview)
18. [Client-side e server-side tagging](https://support.google.com/tagmanager/answer/13387731?hl=en)
19. [Depuração de contêineres server-side](https://developers.google.com/tag-platform/tag-manager/server-side/debug)
20. [Consent Mode básico e avançado](https://support.google.com/analytics/answer/14009635?hl=en)
21. [Implementar consentimento em websites](https://developers.google.com/tag-platform/security/guides/consent)
22. [Suporte a consentimento no GTM](https://support.google.com/tagmanager/answer/10718549?hl=en)
23. [Coleta de dados fornecidos pelo usuário no GA4](https://support.google.com/analytics/answer/14077171?hl=en)
24. [UPD por código no GTM](https://support.google.com/analytics/answer/14179230?hl=en)
25. [Validação da implementação UPD](https://support.google.com/analytics/answer/14171683?hl=en)
26. [Conversões otimizadas no Google Analytics](https://support.google.com/analytics/answer/14252663?hl=en)
27. [Conversões otimizadas no Google Ads](https://support.google.com/google-ads/answer/9888656?hl=en)
28. [Conversões otimizadas para leads](https://support.google.com/google-ads/answer/15713840?hl=en)
29. [Importações de conversões offline](https://support.google.com/google-ads/answer/2998031?hl=en)
30. [Atualizar OCI para ECL](https://support.google.com/google-ads/answer/14274408?hl=en)
31. [Visão geral do Google Ads Data Manager](https://support.google.com/google-ads-data-manager/answer/13761872?hl=en)
32. [Eventos e destinos da Data Manager API](https://developers.google.com/data-manager/api/devguides/events)
33. [Referência events.ingest](https://developers.google.com/data-manager/api/reference/rest/v1/events/ingest)
34. [Normalização, hash e encoding na API](https://developers.google.com/data-manager/api/devguides/concepts/formatting)
35. [Autenticação e acesso à Data Manager API](https://developers.google.com/data-manager/api/devguides/quickstart/set-up-access)
36. [Estrutura UserData da API](https://developers.google.com/data-manager/api/reference/rest/v1/UserData)
37. [Diagnóstico e migração de uploads offline](https://support.google.com/google-ads/answer/13321563?hl=en)
