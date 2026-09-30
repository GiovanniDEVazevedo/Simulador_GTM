# TagLab — GTM, GTG e GA4

Site estático de testes. Contêiner padrão: **GTM-KW59VB3X**.

## Publicar na Vercel pelo GitHub

1. Extraia o ZIP.
2. Crie um repositório no GitHub e coloque nele o conteúdo da pasta `taglab-vercel`.
3. A raiz do repositório deve conter `vercel.json`, `README.md` e a pasta `public/`.
4. Na Vercel, escolha Add New → Project e importe esse repositório.
5. Use Framework Preset **Other**, Root Directory **./**, Build Command vazio, Install Command vazio e Output Directory **public**. O `vercel.json` já define essas opções.
6. Clique Deploy e abra a URL gerada.

Não coloque apenas o ZIP no repositório: envie os arquivos extraídos. Não é preciso instalar Node, React ou dependências para esse site.

## Publicar com CLI (opcional)

Na pasta que contém `vercel.json`:

```bash
npx vercel
```

Esse comando cria um preview. Para publicar em produção:

```bash
npx vercel --prod
```

A CLI pode solicitar login e seleção de conta/projeto.

## Executar localmente

Com Python instalado, a partir da raiz do projeto:

```bash
python -m http.server 8000 --directory public
```

Abra http://localhost:8000. Sirva a pasta por HTTP; não abra o HTML diretamente como arquivo, porque os caminhos dos assets partem da raiz.

## Contêiner instalado

- O snippet do GTM fica no início do `<head>`.
- O `noscript` fica imediatamente após a abertura do `<body>`.
- O Consent Mode v2 é inicializado antes do GTM, com as quatro permissões como `denied` por padrão.
- A aba Consentimento permite conceder permissões para testar a coleta.
- A variável `window.TAGLAB_DEFAULT_GTM_ID`, no início do `public/index.html`, define o contêiner padrão.
- Cada pessoa troca o ID na aba Configuração → Google Tag Manager → Salvar e aplicar. A escolha não afeta outros usuários.
- O botão Restaurar contêiner padrão remove apenas a configuração local e retorna ao GTM-KW59VB3X.
- O contêiner escolhido é carregado no head. O carregador da aplicação detecta essa instalação e não carrega uma segunda cópia.
- A interface distingue carregamento solicitado, script carregado e falha; não presume recebimento no GA4.
- Em um navegador novo, o site usa GTM-KW59VB3X. A aba Configuração permite escolher explicitamente outro contêiner, GA4 direto ou somente dataLayer. Esses overrides ficam apenas no navegador.
- O noscript é fixo em GTM-KW59VB3X; ele só atua quando JavaScript está desativado.

## Validar o GA4

1. No contêiner GTM-KW59VB3X, configure uma Google tag com seu ID G-... e o acionador All Pages.
2. Configure as tags de evento GA4 e os acionadores de Evento personalizado. Consulte a aba Plano de mensuração.
3. No GTM, clique Preview e conecte a URL gerada pela Vercel.
4. Confira o estado de consentimento e teste denied/granted.
5. Faça produto → carrinho → checkout → entrega → pagamento → compra.
6. Confira os pushes no monitor e as tags disparadas no Tag Assistant.
7. Valide os eventos no DebugView do GA4 e as requisições de coleta no Network. Passe `debug_mode` como parâmetro nas tags GA4 de teste do GTM.
8. Use uma propriedade/fluxo de testes para não poluir os dados de produção.

O monitor comprova o push local; ele não confirma o recebimento no GA4. Evite duplicar page_view, cliques, formulários e vídeo entre a instrumentação manual e a medição otimizada.

## GTG

Este pacote NÃO cria um gateway ou proxy. Ele permite informar o caminho first-party de um gateway já configurado no domínio. Publicar na Vercel e instalar GTM não ativa o GTG. O gateway exige configuração de domínio e infraestrutura compatível. A verificação de /healthy só passa se o gateway responder `ok`.

## Estrutura

- `public/index.html`: interface e bootstrap GTM/consentimento
- `public/app.js`: dataLayer, eventos, preferências e fluxos de teste
- `public/style.css`: estilos responsivos
- `public/checklist.txt`: arquivo real para o evento de download
- `vercel.json`: configuração de hospedagem estática

Todos os produtos, pedidos e usuários do laboratório são fictícios. Os dados do formulário não são enviados a um backend; nome/e-mail não entram no dataLayer.

## Referências

- https://vercel.com/docs/builds/configure-a-build
- https://vercel.com/docs/project-configuration/vercel-json
- https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
- https://developers.google.com/tag-platform/tag-manager/gateway/setup-guide?setup=manual
