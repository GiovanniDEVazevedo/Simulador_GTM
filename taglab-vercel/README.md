# TagLab — GTM, GTG e GA4

O padrão é **GTM-KW59VB3X**, carregado no `<head>` para testes de acionadores e tags. A alternativa GA4 direto usa **G-K3P3QWNJ38** e envia eventos sem depender de tags criadas no GTM. Apenas um modo de carregamento é executado por vez.

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

Cada usuário pode escolher GA4 direto, GTM ou somente dataLayer na aba Configuração. Os IDs, o modo debug e o caminho do gateway ficam apenas no localStorage daquele navegador. Salvar recarrega a página; apenas o carregador do modo escolhido é executado.

Os IDs padrão ficam em `window.TAGLAB_DEFAULT_GA4_ID` e `window.TAGLAB_DEFAULT_GTM_ID`, no início de `public/index.html`. O contêiner padrão disponível para o modo GTM é `GTM-KW59VB3X`.

No modo GTM, configure uma Google tag e tags de evento GA4 no contêiner, seguindo o Plano de mensuração do simulador. Nesse modo, os pushes no dataLayer dependem dessas tags para chegar ao GA4; o carregador GA4 direto fica desativado.

## Consentimento e duplicação

O Consent Mode v2 inicializa antes das tags. As quatro permissões são denied por padrão. A seleção pode ser alterada na aba Consentimento. Não substitui uma CMP de produção.

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
