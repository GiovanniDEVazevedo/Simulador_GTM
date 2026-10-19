# TagLab — GTM, GTG e GA4

O padrão é **GTM-KW59VB3X**, carregado no `<head>` para testes de acionadores e tags. A alternativa GA4 direto usa **G-K3P3QWNJ38** e envia eventos sem depender de tags criadas no GTM. Apenas um modo de carregamento é executado por vez.

## Evolução de aprendizagem prática e cenários reais

A implementação de 19/10/2026 acrescenta **5 missões**, revisão por **7 competências**, **7 casos de escolha de ferramenta**, verificação de contratos de eventos, **4 casos de defeito**, mapeamento CSV, **3 desafios de funções JavaScript**, **8 cenários de API**, **3 incidentes de gateway** e preparação de revisão com tutor.

- **Missões:** estudo, requisitos orientativos, evidência e explicação; conclusão como autoavaliação.
- **Prática:** contrato de purchase/add_to_cart, falhas isoladas, CSV sintético e funções em executor isolado.
- **Cenários reais:** decisões de ferramentas, operação simulada com relógio virtual e roteiros de validação externa.
- **Revisão com tutor:** rubrica e JSON para o fluxo da equipe; sem login, turma ou aprovação protegida.
- **Base:** armazenamento resiliente, níveis de evidência e consentimento separado por modo. O cabeçalho mostra e oculta páginas e dataLayer.

**No modo GTM, instale o modelo de consentimento descrito em [consentimento-gtm.md](public/consentimento-gtm.md).** O envio armado de UPD requer essa ligação. O site fornece o código, mas não altera seu contêiner automaticamente.

Documentação atual: [manual do projeto](docs/PROJETO.md) e [implementação e testes por item do plano](docs/IMPLEMENTACAO_E_TESTES.md). Os relatórios anteriores ficam identificados como históricos.

## Deploy deste repositório na Vercel

O código está em uma subpasta. Ao importar `GiovanniDEVazevedo/Simulador_GTM`, use:

- Root Directory: `taglab-vercel`
- Framework Preset: Other
- Build Command: vazio
- Install Command: vazio
- Output Directory: `public`

O `vercel.json` nessa pasta já configura framework, comandos e saída. Após um commit em main, confira se o novo deployment terminou com sucesso. A atualização do GitHub não comprova que o site publicado já mudou.

## Primeiro teste de coleta

1. Abra a nova versão publicada.
2. Se já usou o simulador, entre em Configuração → Restaurar configuração padrão. Preferências antigas do navegador são preservadas até você restaurar.
3. Para testar coleta sem configurar o contêiner, selecione GA4 direto, confirme ID `G-K3P3QWNJ38` e salve. Para testar acionadores, selecione Google Tag Manager e configure a Google tag dentro do contêiner.
4. Em Consentimento, aceite analytics_storage (ou Aceitar tudo para testar todos os sinais).
5. Navegue na loja e adicione produtos ao carrinho.
6. No GA4 da mesma propriedade, confira Tempo real e DebugView. O modo debug está ativo por padrão.
7. No Network do navegador, procure requisições `collect` com `tid=G-K3P3QWNJ38`. Bloqueadores podem impedir scripts ou requisições.

O monitor comprova o push local, não o recebimento pelo GA4. O aviso do fluxo não é a única forma de validar a instalação.

## Configuração por pessoa

Cada usuário pode escolher GA4 direto, GTM ou somente dataLayer na aba Configuração. Os IDs, o modo debug e o caminho do gateway ficam no armazenamento daquele navegador quando disponível. Sem acesso, o estudo continua em memória e a interface avisa. Trocar o carregador requer gravação bem-sucedida para não destruir a sessão por reload. Salvar com persistência recarrega a página; apenas o carregador do modo escolhido é executado.

Os IDs padrão ficam em `window.TAGLAB_DEFAULT_GA4_ID` e `window.TAGLAB_DEFAULT_GTM_ID`, no início de `public/index.html`. O contêiner padrão disponível para o modo GTM é `GTM-KW59VB3X`.

No modo GTM, instale o modelo de consentimento e configure uma Google tag e tags de evento GA4 no contêiner, seguindo o Plano de mensuração do simulador. Nesse modo, os pushes no dataLayer dependem dessas tags para chegar ao GA4; o carregador GA4 direto fica desativado.

## Consentimento e duplicação

O bootstrap negado precede as tags. No GTM, o modelo usa setDefaultConsentState em Inicialização de consentimento e updateConsentState pelo callback da página. No GA4 direto, os comandos usam gtag; no modo local não há chamada de tag. A seleção fica na aba Consentimento. Sem modelo conectado, as escolhas locais não comprovam aplicação no GTM. O controle didático não substitui uma CMP de produção.

O GA4 direto usa `send_page_view: false` e envia page_view manualmente na navegação. Desative também "Page changes based on browser history events" na Medição otimizada do fluxo para evitar page_views extras. Escolha uma estratégia para cliques, formulários, downloads e vídeos, pois a Medição otimizada pode gerar eventos além dos eventos manuais do laboratório.

O aplicativo não carrega uma segunda cópia da tag inicializada no head. O noscript no início do body continua fixo em GTM-KW59VB3X e só atua quando JavaScript está desativado.

## Testar localmente

Na pasta `taglab-vercel`, execute:

```bash
python -m http.server 8000 --directory public
```

Abra http://localhost:8000. Não abra index.html como arquivo, pois os assets usam caminhos a partir da raiz.

## GTG

O simulador aceita o caminho first-party de um gateway já instalado no domínio e verifica /healthy. Ele não cria gateway, proxy ou contêiner server-side. Informar /metrics sem infraestrutura não ativa o GTG.

## Estrutura

- public/index.html: interface, consentimento e carregadores no head
- public/app.js: dataLayer e interações de teste
- public/style.css: estilos
- public/checklist.txt: download real para teste
- vercel.json: hospedagem estática

Produtos, pedidos e usuários são fictícios. Nome e e-mail do formulário não entram no dataLayer e não são enviados a um backend.

## Referências

- https://developers.google.com/analytics/devguides/collection/ga4/views
- https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
- https://developers.google.com/tag-platform/tag-manager/gateway/setup-guide?setup=manual
- https://vercel.com/docs/builds/configure-a-build

## Acionador de inicialização

Para testar seu contêiner, selecione Google Tag Manager na Configuração, use GTM-KW59VB3X e clique Salvar e aplicar. Abra o Preview desse contêiner no Tag Assistant. A Google tag dentro do GTM deve usar o acionador nativo Inicialização – Todas as páginas, com o ID G-K3P3QWNJ38.

Não crie um acionador de Evento personalizado chamado gtm.init e não insira esse evento manualmente no site. A inicialização é gerada pelo contêiner; eventos internos do GTM podem aparecer no Preview sem corresponder a pushes visíveis no monitor local. Se o Preview não mostrar inicialização, confira o carregamento de gtm.js, o contêiner selecionado e possíveis bloqueadores.

## Laboratório UPD & EC

A aba **UPD & EC** oferece normalização e SHA-256 de identidades fictícias, prévia sem push, envio explícito ao GTM, cenários de consentimento, leads e compras, limpeza de dados entre eventos e seis exercícios com evidências locais.

Leia o [roteiro completo](public/upd-guide.md) para configurar variáveis/tags no GTM, habilitar UPD no GA4 e verificar Network/DebugView. Para validar UPD e EC no GA4, cumpra os pré-requisitos atuais, incluindo vínculo da propriedade com Ads. A preparação de dados pode ser praticada localmente sem conectar contas; uma conversão nativa do Ads exige sua própria ação de conversão. Nenhuma configuração de conta Google é criada pelo site. Identidades fictícias não validam correspondência ou atribuição.

Execute os testes locais com Node 22 ou 24: `node --test tests/*.test.cjs` (nesta pasta). Eles validam preparação, consentimento e fluxo da interface com DOM simulado; não comprovam entrega aos serviços Google.


## Laboratório Semana 3 — OCI, ECL e Data Manager

A nova aba **OCI · ECL · Data Manager** simula o fluxo anúncio → lead → CRM → venda offline → preparação para upload.

O laboratório foi desenhado para estudo seguro:
- OCI usa um GCLID **sintético** iniciado por `TEST_GCLID_`.
- ECL reutiliza a normalização e SHA-256 do módulo UPD, sempre com identidades fictícias.
- O CRM existe somente na memória da página.
- A prévia do Data Manager usa `validateOnly: true` e **não executa chamada de API**.
- O `transactionId` é único por caso para reforçar deduplicação.
- O dataLayer recebe somente eventos/metadados do laboratório; e-mail, telefone e hashes não são empurrados para o monitor global.

Arquivos:
- `public/offline-core.js`: validação e geração dos objetos Event/request.
- `public/offline-lab.js`: fluxo visual do laboratório e CRM fictício.
- `tests/offline-core.test.cjs`: testes do núcleo OCI/ECL/Data Manager.

Para executar todos os testes locais: `node --test tests/*.test.cjs`.

Referências oficiais usadas no desenho do payload:
- https://developers.google.com/data-manager/api/devguides/events/google-ads/online/send-events
- https://developers.google.com/data-manager/api/devguides/events/send-events
- https://developers.google.com/data-manager/api/get-started/quickstart/send-events

### Gerar um payload ECL

1. Em **OCI · ECL · Data Manager**, selecione ECL, use os dados fictícios e crie o lead.
2. Registre uma venda com valor positivo para colocar o lead em WON.
3. Se o aviso junto ao botão indicar `ad_user_data: denied`, clique **Revisar consentimento para ECL**. Altere esse sinal e aplique a seleção; volte à aba offline. O site não concede permissões automaticamente e preserva o lead nessa navegação.
4. Clique **Gerar payload ECL** e depois **Montar request validateOnly**. O JSON é apenas uma prévia; não existe chamada à API nem confirmação de correspondência/atribuição.

Falhas limpam as prévias dependentes. Alterar os dados de captura exige recriar o lead; alterar os IDs do destino exige montar outro request. Uma venda WON mantém seu transactionId ao gerar novamente o payload; use **Novo caso** para outra venda. OCI pode usar somente GCLID, sem preencher identidade.

## Banco de questões e aprendizagem

A aba **Exercícios & questionário** oferece **96 questões autorais**, **8 temas**, **39 referências oficiais Google** e **16 desafios práticos**. O banco fica salvo nos arquivos públicos do site, versionado com o código, sem depender de um serviço externo para montar questões. Não é um exame oficial ou uma certificação.

- Temas: GTM/dataLayer, GA4/e-commerce, GTG/CDN/sGTM, consentimento/CMP, UPD/EC, OCI/ECL, Data Manager UI/API e arquitetura/diagnóstico.
- Busque por palavras e filtre por tema, nível, ferramenta, tipo de problema ou marcação para revisar.
- Estude o gabarito explicado, o impacto no conjunto, a fonte e a prática sugerida de cada questão.
- Monte simulados com até 10, até 20 ou todas as questões filtradas. O sorteio distribui os temas disponíveis e não repete itens na tentativa.
- Responda uma questão por vez, salve o rascunho automaticamente, corrija e refaça somente os erros. Também é possível praticar os erros pendentes do histórico.
- Acompanhe as questões distintas corrigidas, as respostas acumuladas por tema e as últimas 30 tentativas. Cada nota mostra seu denominador; seleções diferentes não são notas equivalentes. Novas tentativas também registram versão do banco e IDs do escopo; registros antigos sem esses dados continuam identificados como versão não registrada.
- Baixe o banco completo ou exporte seu progresso em JSON. A exportação **Moodle GIFT** mantém categorias, IDs, alternativas, gabaritos, explicações, impacto e fontes; configure a importação, feedback e tentativas no LMS. A importação em uma instância real ainda precisa ser validada.

Respostas, marcações, tarefas e histórico ficam no armazenamento local deste navegador (`taglab_learning_v2`). O progresso antigo de 12 questões é migrado; sua melhor nota é preservada como legado, sem equipará-la ao banco de 96 itens. O módulo não envia respostas ou notas ao dataLayer/GA4; tags externas podem observar interações gerais. Limpar o navegador elimina o progresso, salvo se você tiver exportado uma cópia. Não há sincronização, login de aluno, importação de progresso ou painel protegido do tutor. A área Revisão com tutor prepara uma exportação para avaliação no fluxo da equipe.

Os desafios são autoavaliação: marcar uma tarefa não verifica a conta Google, a implantação ou a entrega de uma conversão. Gabaritos e fontes são públicos para estudo; o recurso não serve como prova sigilosa de seleção.

### Manter o conteúdo

- `public/question-bank.js`: banco único, versão, revisão editorial, temas, questões e registro de fontes.
- `public/learning-core.js`: filtros, sorteio equilibrado, correção e persistência saneada.
- `public/learning-lab.js`: interface de estudo, simulados, histórico e tarefas.
- Preserve IDs estáveis; cada questão precisa de tema, nível, tipo, ferramentas, quatro alternativas, gabarito, explicação, impacto, fonte, prática e data de revisão.
- As fontes foram consultadas até **16/10/2026**, com a data individual no registro da fonte. Revise novamente após mudanças em APIs, consentimento ou pré-requisitos de produto; a data não implica atualização automática.
- Execute `node --test tests/*.test.cjs`: os 59 testes locais cobrem preparação, consentimento, CRM, prévias assíncronas, filtros, migração e novos módulos. Há ainda nove fluxos de navegador em `npm run test:browser`. Não comprovam entrega aos serviços Google.

Veja o [relatório de implementação, impacto e próximos passos](public/relatorio-aprendizagem.md).

## Área do tutor e piloto

O [plano da área do tutor](public/plano-area-tutor.md) compara ClickUp, MoodleCloud, Supabase, Firebase e Directus, com fontes oficiais e preços/limites consultados em 16/10/2026. Propõe piloto por configuração e registro manual, define telas, papéis, rubrica e uma evolução com serviços gerenciados. A área Revisão com tutor implementa a preparação local desse piloto com rubrica e exportação. Login, contas externas, turmas remotas e backend não foram criados.

Banco v3: 96 itens, 12 por tema; 33 básicos, 49 intermediários e 14 avançados. São 14 de conceito, 22 de implementação, 27 de escolha de solução e 33 de diagnóstico. Os 32 itens novos preservam IDs e gabaritos dos 64 anteriores.

## Tema claro e escuro

O botão **Modo escuro** no cabeçalho alterna a aparência sem recarregar a página. Na primeira visita o tema acompanha a preferência do sistema; uma escolha manual fica salva em `taglab_theme` neste navegador e é compartilhada entre abas. O tema é aplicado no início do carregamento e cobre loja, formulários, laboratórios, banco de questões e feedback. A preferência visual é independente das configurações de mensuração e do progresso de estudo.

## Desafios de código — Data Manager

A aba **Desafios de código** reúne nove problemas: cinco de interpretação de código e quatro de montagem/correção manual de requisições HTTP em JSON. A interface oferece enunciado, dados fictícios, alternativas ou editores, correção por critério, dicas graduais, solução comentada, fontes oficiais e exportação do progresso. Integra os temas claro/escuro e funciona sem dependências ou backend adicional.

Nessa aba, o token aceito é somente `Bearer LAB_TOKEN`. Não há envio HTTP nem execução de JavaScript escrito pelo aluno. O executor de funções é outro recurso, na aba Prática, com Worker isolado, CSP e limites próprios. Os códigos HTTP e respostas são simulados. O corretor cobre os casos declarados, não toda a API; aceita JSON com propriedades em outra ordem, instantes equivalentes em RFC 3339, reordenação do lote e hashes HEX/BASE64 correspondentes à identidade do exercício. Hash de formato válido com valor incorreto falha.

`taglab_challenges_v1` salva apenas seleção e progresso local, incluindo uso de dicas/solução. Editores ficam em memória até recarregar; não persistem cabeçalhos, código ou evidências de contas reais. O módulo não envia respostas ao dataLayer/GA4. A coleta geral das tags conectadas continua conforme a configuração do laboratório. Progresso é autoavaliação, sem aprovação central ou proteção contra edição local.

O [roteiro de estudo e conexão real](public/data-manager-desafios.md) orienta a prática autenticada fora do site, usando documentação/APIs Explorer e `validateOnly:true`. Essa etapa não é verificada automaticamente. Ingestão efetiva e diagnósticos são práticas distintas.

- `public/challenges-core.js`: enunciados, fixtures, soluções e regras de correção.
- `public/challenges-lab.js`: interface e progresso.
- `tests/challenges-*.test.cjs`: correção semântica, erros, consentimento e fluxo da interface.

Verifique com `node --test tests/*.test.cjs`. Preserve IDs e versão ao atualizar as rubricas e revise fontes/requisitos após mudanças no produto Google.


## Verificação automatizada e fluxo de alteração

Com Node 22 ou 24 na pasta `taglab-vercel`:

```bash
npm ci --ignore-scripts
npm test
npx playwright install chromium
npm run test:browser
```

São **59 testes locais e 9 fluxos de navegador**. O conjunto de navegador intercepta os recursos Google e não exige conta. `.github/workflows/taglab-ci.yml` configura Node 24 e executa os dois conjuntos em PR e push para main. As dependências npm são apenas de desenvolvimento; a Vercel continua entregando `public` sem instalação ou build.

Antes de publicar, conferir PR, CI e Preview. Depois, conferir commit e deployment e repetir o smoke. Contas Google, importação do modelo GTM, autenticação Data Manager, gateway/CDN e piloto com tutor têm critérios manuais separados. As simulações não os aprovam automaticamente.
