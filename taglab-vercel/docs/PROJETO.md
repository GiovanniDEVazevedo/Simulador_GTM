# TagLab — documentação do projeto

Estado de referência: implementação de 19/10/2026 sobre a main `46bd841ef979e61554530bde174a023ee1375144`. O plano Word dessa data continua como referência de escopo anterior; este documento descreve o código evoluído.

## Objetivo e público

Ambiente para estagiários e pessoas entrando no projeto praticarem GTM, GA4, consentimento, UPD/EC, OCI/ECL e Data Manager. A trilha combina aprendizagem, execução local e diagnóstico de situações de trabalho. Contas Google e infraestrutura real são verificadas fora dos corretores locais.

## Recursos implementados

| Frente | Recursos |
| --- | --- |
| Aprendizagem | 5 missões versionadas; requisitos prévios orientativos; 96 questões existentes; filtros e revisão por 7 competências; 7 casos de escolha de ferramenta com justificativa e fonte |
| Prática | Loja e interações; UPD/EC; CRM e prévia offline; 9 desafios HTTP/leitura existentes; 2 contratos de evento; 4 casos de defeito; mapeamento de CSV; 3 funções JavaScript com 13 vetores de teste |
| Cenários reais | 8 cenários de operação da API com relógio virtual; 3 incidentes de gateway; roteiros externos; rubrica e exportação para tutor |

Todas as áreas usam o tema claro/escuro. Botões no cabeçalho controlam páginas e monitor. O menu permite rolagem quando há pouco espaço. Os novos módulos não enviam respostas, código, notas ou arquivos ao dataLayer.

## Executar e testar

O site de produção continua estático e sem build. Na pasta `taglab-vercel`:

```bash
python -m http.server 8000 --directory public
```

Abra `http://localhost:8000`. Para testes, use Node 22 ou 24; o CI fixa Node 24.

```bash
npm ci --ignore-scripts
npm test
npx playwright install chromium
npm run test:browser
```

`npm test` executa regras e interfaces em DOM simulado. `test:browser` cria um servidor local temporário, abre Chromium e intercepta recursos Google externos. Não usa conta Google. Um executável Chromium já instalado pode ser indicado por `TAGLAB_CHROMIUM_EXECUTABLE`; esse é um recurso de teste, sem efeito no site publicado.

## Arquitetura

| Arquivo | Responsabilidade |
| --- | --- |
| `public/index.html` | Abas, controles, ordem dos scripts e bootstrap dos carregadores |
| `storage.js` | Acesso único ao storage, JSON seguro e fallback em memória |
| `consent-bridge.js` | Estado normalizado e caminhos GTM, gtag e local |
| `gtm-consent-template.txt` | Código para o modelo de consentimento no contêiner GTM |
| `app.js` | Loja, navegação, eventos, monitor e ponte de leitura dos laboratórios |
| `theme.js`, `style.css`, `labs.css` | Tema, layout e apresentação dos novos módulos |
| `upd-core.js`, `upd-lab.js` | Identidade sintética, hash, prévia e push armado |
| `offline-core.js`, `offline-lab.js` | Lead OPEN/WON e prévias OCI/ECL |
| `question-bank.js`, `learning-core.js`, `learning-lab.js` | Banco, simulados, histórico e tarefas |
| `competencies-core.js` | Classificação por competência e decisões de ferramentas |
| `challenges-core.js`, `challenges-lab.js` | Desafios HTTP/JSON, correção semântica e progresso |
| `evidence-core.js`, `missions-core.js`, `journey-lab.js` | Níveis de evidência, missões, contratos e casos de falha |
| `event-contracts.js` | Validação sem mutar o payload; diagnóstico dos quatro casos |
| `csv-core.js` | Parsing, validação por linha e transformação sintética |
| `code-core.js`, `code-runner.js`, `runner-frame.html` | Enunciados, correção e execução isolada das funções |
| `scenarios-core.js`, `advanced-lab.js` | API, gateway, CSV, código e preparação da revisão com tutor |

Os arquivos core são testáveis sem conta. Os arquivos lab ligam regras ao DOM. O site não tem backend, autenticação ou banco central. Playwright é dependência de desenvolvimento e não entra em `public`.

## Modos e contrato de eventos

Somente dataLayer não carrega uma tag externa por escolha do laboratório. GTM carrega o contêiner selecionado. GA4 direto carrega gtag.js e envia os eventos para o G-ID escolhido. O site não carrega os dois caminhos ao mesmo tempo.

Os padrões públicos continuam `GTM-KW59VB3X` e `G-K3P3QWNJ38`. Cada aluno pode substituí-los na Configuração do navegador. `noscript` mantém o ID padrão e não lê preferências JavaScript. Para gateway, a configuração aceita um caminho na mesma origem, sem provisionar infraestrutura.

Eventos da loja cobrem catálogo, carrinho, checkout, entrega, pagamento, compra e reembolso. A compra tem `ecommerce.transaction_id`, `currency`, `value` e `items`. O site limpa `ecommerce` antes de novos eventos; valor dos itens e frete são campos distintos. O verificador exige os campos do contrato do laboratório e aponta caminho, erro e origem da regra. ID repetido com outra venda é erro; reenvio da mesma referência gera um aviso para investigação.

O GA4 direto envia `page_view` manualmente. `send_page_view:false` não desliga por si só a detecção de histórico da medição otimizada; revisar o fluxo para não duplicar visualizações. As tags de evento no GTM dependem dos acionadores e variáveis configurados pelo aluno.

## Consentimento e identidade

O bootstrap começa negado. No modo GTM, o modelo em Consent Initialization usa `setDefaultConsentState` e registra o callback da página para `updateConsentState`. A página aplica esse callback antes do evento seguinte. Sem modelo conectado, as escolhas continuam locais e o push armado de UPD é bloqueado. O modo gtag mantém comandos próprios; o modo local não chama tags.

Instalação e critérios manuais em [consentimento-gtm.md](../public/consentimento-gtm.md). A ligação local do modelo não comprova estado de uma tag no Preview. Importação, permissões e comportamento da conta continuam pendentes até o teste externo.

UPD aceita apenas e-mails sintéticos permitidos e a faixa de telefone fictício. Normalização antecede SHA-256. O laboratório exige `analytics_storage` e `ad_user_data` para incluir UPD: é uma restrição didática local. ECL exige `ad_user_data` e pode ser preparado sem GCLID. OCI da aba Offline exige GCLID `TEST_GCLID_…`. Essa aba mantém um evento, BRL e valor positivo como recorte de estudo, sem impor essas regras a toda a API.

## Evidências e tutoria

| Nível | Origem | Limite |
| --- | --- | --- |
| Prévia simulada | Corretor ou simulador | Não comprova push ou integração |
| Push local observado | dataLayer do site | Não comprova disparo de tag |
| Tag no Preview | Declaração do aluno com referência | Conferir no contêiner |
| Transporte no Network | Declaração do aluno com referência | Conferir request e destino |
| Destino conferido | Declaração do aluno com referência | Não equivale a atribuição nem a aprovação do tutor |

Registros têm versão, nível, origem, data, ambiente e, quando pertinente, evento ou referência. `verifiedByTutor` permanece false. Missões exigem evidência e explicação para concluir a autoavaliação. Requisitos prévios não bloqueiam estudo livre. Textos das missões são salvos localmente; não inserir dados pessoais nem credenciais.

A área de tutoria prepara contexto, quatro critérios da rubrica, dúvidas e progresso. Exporta um JSON editável para o fluxo da equipe. Não há notas protegidas, sincronização, turmas ou login. A revisão do tutor deve ocorrer no processo externo já usado pela equipe; um futuro portal exige autenticação e controles de acesso.

## CSV e funções

CSV: máximo didático de 50 linhas de dados e 100 KB UTF-8; BOM, aspas, separadores em campos e quebras internas são tratados. Linhas vazias são identificadas. Datas precisam de fuso e calendário válido. Colunas, moeda, valor, identidade, duplicidade e consentimento são validados. Se uma linha falha, o lote não é exportado parcialmente. Entrada, mapeamento e consentimento alterados invalidam a prévia; hashes antigos não são reaproveitados.

Funções: a página principal nunca avalia código do aluno. Cada tentativa cria iframe `sandbox="allow-scripts"`, sem `allow-same-origin`, e Worker. CSP restringe recursos e rede; o Worker não recebe DOM, storage ou credenciais. APIs de rede, importação de scripts e criação de outros Workers são removidas. O protocolo confere a janela de origem e o ID da tentativa. O Worker é encerrado no limite de um segundo; há teto de entrada e saída. Não há cota rígida de memória por processo. Os casos são locais e públicos para aprendizagem, sem avaliação protegida.

## API e gateway

API: respostas e relógio são simulados. Há validação sem ingestão, avisos, acesso negado, cota por minuto, cota diária, falha transitória, estado pendente, falha de processamento e teto de repetição. IDs são conservados. O simulador não solicita token real. [Roteiro externo](../public/data-manager-pratica.md) separa validação, ingestão e diagnóstico por requestId.

Gateway: os três incidentes separam saúde, localização, script, hit e destino. `/healthy=ok` não encerra a prática. [Roteiro de domínio e CDN](../public/gateway-pratica.md) registra versões e verificações. Nenhum gateway foi provisionado automaticamente.

## Persistência e exportações

Chaves preservadas: `taglab_config`, `taglab_consent`, `taglab_monitor_hidden`, `taglab_theme`, `taglab_upd_progress_v1`, `taglab_learning_v2` e `taglab_challenges_v1`. A leitura do legado de aprendizagem v1 continua disponível.

Novas chaves: `taglab_navigation_hidden`, `taglab_missions_v1`, `taglab_decisions_v1` e `taglab_code_v1`. As duas últimas guardam somente metadados de tentativas; não guardam código ou tokens. Missões guardam explicações e referências declaradas. Corrupção de JSON usa fallback; falha de acesso/gravação mantém estado em memória e avisa que ele se perde ao recarregar. Em storage bloqueado, mudar o carregador não força reload e perda da sessão: habilite persistência para aplicar a troca.

Carrinho, CRM, payloads de identidade, CSV, funções digitadas, cenários, rascunhos HTTP e logs são de memória. Limites existentes continuam: monitor 500 registros, recibos UPD 30, casos offline 10 e histórico de estudo 30.

Novos arquivos exportados: `taglab-missoes-evidencias.json`, `taglab-csv-transformado.json`, `taglab-api-cenario.json` e `taglab-revisao-tutor.json`. Os formatos anteriores continuam disponíveis. GIFT mantém o banco v3; importação em uma instância Moodle não foi validada.

## Publicação operação e responsabilidades

Vercel: raiz `taglab-vercel`, preset Other, instalação/build vazios, saída `public`. CI em `.github/workflows/taglab-ci.yml` executa testes locais e de navegador em PR e push para main. Publicar site, publicar GTM e alterar CDN são ações independentes. Conferir commit e implantação antes do smoke. Reverter o componente responsável, preservando compatibilidade do progresso salvo.

Manutenção técnica responde por código e testes; revisão de conteúdo, por fontes e enunciados; tutoria, por observar evidências e feedback; administração, por contas e domínio. Designar pessoas no piloto. Este projeto não assume contratação de serviço ou licença de redistribuição do material interno de onboarding.

## Referências oficiais

- https://support.google.com/tagmanager/answer/15756616?hl=en
- https://developers.google.com/tag-platform/security/guides/consent
- https://developers.google.com/tag-platform/tag-manager/templates/consent-apis
- https://developers.google.com/analytics/devguides/collection/ga4/views
- https://developers.google.com/analytics/devguides/collection/ga4/validate-ecommerce
- https://support.google.com/analytics/answer/14077171?hl=en
- https://developers.google.com/data-manager/api/reference/rest/v1/events/ingest
- https://developers.google.com/data-manager/api/devguides/concepts/understand-errors
- https://developers.google.com/data-manager/api/devguides/diagnostics
- https://developers.google.com/tag-platform/tag-manager/gateway/setup-guide?setup=manual
- https://developers.google.com/tag-platform/tag-manager/gateway/sgtm-and-cdn
- https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox
- https://w3c.github.io/webappsec-csp/
- https://playwright.dev/docs/ci
- https://nodejs.org/en/about/previous-releases
- https://vercel.com/docs/deployments/environments
