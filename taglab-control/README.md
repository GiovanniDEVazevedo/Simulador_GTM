# TagLab Control

Central editorial e API independente do laboratório TagLab. O time cria questões, atividades, trilhas e sugestões pelo painel; o TagLab recebe somente as versões publicadas. Este projeto tem suas próprias dependências, processo de build, variáveis, banco e deployment. Está em uma pasta separada no mesmo repositório para facilitar a entrega; pode ser movido para um repositório exclusivo sem depender do código do laboratório.

## O que esta versão entrega

- Painel próprio em português: visão geral, banco de questões, trilhas, atividades, sugestões, revisão, equipe, auditoria e integração.
- Formulários com alternativas, gabarito, explicação, impacto, fontes HTTPS, nível, tema e revisão editorial.
- Autor cria e envia para revisão; revisor também publica e arquiva; administrador também autoriza e desativa pessoas.
- Rascunho, revisão, publicação e arquivamento. Editar mantém a versão pública anterior. Restaurar histórico cria outro rascunho.
- Revisão otimista: uma edição concorrente retorna HTTP 409 em vez de sobrescrever o trabalho de outra pessoa.
- Histórico recente de até 40 revisões por item na interface e 100 ações de auditoria; o banco mantém os registros anteriores.
- Trilhas com etapas, questões, atividades e pré-requisitos. Referências precisam estar publicadas, e ciclos são recusados.
- Login, cadastro, verificação por código e recuperação por código com Neon Auth. Sessão é validada pelo provedor e associação/perfil são conferidos no servidor em cada pedido administrativo.
- Importador idempotente de 96 questões, 39 fontes, 16 atividades e cinco trilhas do TagLab, mantendo os IDs das questões e as chaves de progresso das atividades.
- API REST de leitura com versão, ETag, filtros e CORS; cliente TagLab com timeout, validação e fallback local.

Não há gestão de alunos, notas centralizadas, correção protegida de provas, SSO corporativo, notificações editoriais, execução remota de código ou IA nesta versão. Revisores podem revisar conteúdo próprio; separação obrigatória entre autor e aprovador é uma evolução de governança.

## Arquitetura

Next.js 16 + React 19 no painel e nas rotas. Postgres exclusivo na Neon para conteúdos, versões, membros e auditoria. Neon Auth gerencia credenciais e sessões em seu próprio schema. Não se usa o banco de outros projetos do usuário. O TagLab continua um site estático.

O catálogo publicado é **público**, inclusive gabaritos e explicações. Use apenas material de estudo autorizado, exemplos sintéticos e fontes que possam ser divulgadas. Informações de clientes e conteúdo interno confidencial não devem ser publicados. CORS controla a leitura por JavaScript no navegador; não transforma uma API pública em privada.

## Executar

Node >=24.22.1.

```bash
cd taglab-control
npm ci
cp .env.example .env.local
# Preencher as variáveis sem versionar o arquivo.
npm run db:migrate
npm run db:seed
npm run dev -- --hostname 0.0.0.0 --port 3000
```

O importador não cria senhas ou contas no provedor de identidade e não envia convites. `BOOTSTRAP_ADMIN_EMAIL` autoriza o endereço inicial no banco da aplicação. A pessoa cria sua conta, solicita/verifica o código e entra. Um cadastro sem e-mail verificado e sem associação ativa recebe HTTP 403 na API administrativa.

O script de desenvolvimento aceita `--host` como alias de `--hostname` para o preview. Isso não muda o build de produção.

## Variáveis e implantação na Vercel

Crie **outro projeto** na Vercel com Root Directory `taglab-control` e framework Next.js. Preserve o projeto existente do TagLab.

| Variável                  | Uso                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `DATABASE_URL`            | Conexão pooled do banco exclusivo, somente no servidor. Prefira `sslmode=verify-full`. |
| `NEON_AUTH_BASE_URL`      | URL completa do Neon Auth da mesma branch do banco.                                    |
| `NEON_AUTH_COOKIE_SECRET` | Segredo aleatório, pelo menos 32 caracteres, somente no servidor.                      |
| `APP_ORIGIN`              | Origem exata do painel, por exemplo `https://central.exemplo.com`, sem barra no fim.   |
| `TAGLAB_ORIGINS`          | Origens exatas autorizadas para CORS, separadas por vírgula.                           |
| `BOOTSTRAP_ADMIN_EMAIL`   | E-mail inicial para o importador; não é um cadastro automático de identidade.          |

Use banco/Auth de desenvolvimento para Preview e de produção para Production. Nunca use os dados de produção em testes automáticos. Configure o domínio exato do painel como origem confiável no Neon Auth antes do login. Configure SMTP próprio e revise as políticas de autenticação antes de disponibilizar o piloto ao time; não foram alteradas automaticamente. Não coloque o contêiner GTM, analytics ou credenciais do laboratório no painel administrativo.

As migrações e a carga inicial são comandos explícitos; não rodam durante `next build` ou em cada requisição. Depois da autorização para importar, rode os dois comandos contra o banco selecionado. Para mudanças futuras de schema, acrescente migrações versionadas, valide na branch de desenvolvimento e só então aplique na produção.

## Integrar com o TagLab

No projeto estático, `public/content-config.js` começa com `apiBaseUrl: ''`, preservando o banco local. Depois de publicar a central:

```js
window.TagLabContentConfig = {
  apiBaseUrl: "https://DOMINIO-DA-CENTRAL",
};
```

Inclua a origem do TagLab em `TAGLAB_ORIGINS` e publique essa configuração do laboratório. Não inclua token, senha ou URL do banco. O cliente envia `credentials: 'omit'`, limita tamanho/tempo, valida o contrato e carrega os módulos de aprendizagem na ordem correta. Questões e atividades entram no questionário; trilhas e sugestões aparecem em Exercícios. O laboratório mantém suas cinco missões com evidências próprias, além das trilhas editoriais.

Em erro de rede, CORS, HTTP ou contrato, o banco distribuído no site é preservado e aparece um aviso. Conteúdo remoto não é salvo para uso offline nesta versão: o fallback é o banco original. Uma sessão aberta mantém o catálogo carregado até atualizar a página. O CDN da API pode levar até 90 segundos para refletir publicação/arquivamento. Para reverter imediatamente a integração, deixe `apiBaseUrl` vazio e publique o TagLab.

Mantenha o mesmo ID ao corrigir a redação. Para outra habilidade, sentido ou gabarito de uma nova pergunta, crie outro ID: os resultados anteriores são históricos e não são recalculados. As atividades importadas têm `legacyId` reservado e imutável, porque compartilham as chaves usadas pelo progresso antigo.

## API

Base pública: `/api/v1`. Contrato de catálogo `schemaVersion: 1`. A resposta `/catalog` é compatível com o formato do banco do TagLab e acrescenta `activities`, `trails` e `suggestions`.

| Método e caminho                      | Resultado                                                            |
| ------------------------------------- | -------------------------------------------------------------------- |
| `GET /api/health`                     | Identificação do serviço; não comprova conexão com o banco ou login. |
| `GET /api/v1/catalog`                 | Catálogo publicado completo, fontes e versão.                        |
| `GET /api/v1/questions`               | Questões publicadas; filtros `topic`, `level` e `q`.                 |
| `GET /api/v1/trails`                  | Trilhas publicadas.                                                  |
| `GET /api/v1/activities`              | Atividades publicadas.                                               |
| `GET /api/v1/suggestions`             | Sugestões que o time decidiu publicar.                               |
| `GET /api/admin/me`                   | Usuário autorizado e permissões.                                     |
| `GET, POST /api/admin/content`        | Lista administrativa ou criação em rascunho.                         |
| `GET, PATCH /api/admin/content/:id`   | Documento com revisões, ou edição com `revision` atual.              |
| `POST /api/admin/content/:id/review`  | Envio da revisão atual para análise.                                 |
| `POST /api/admin/content/:id/publish` | Publicação por revisor/administrador.                                |
| `POST /api/admin/content/:id/archive` | Arquivamento sem exclusão; recusa referências públicas dependentes.  |
| `POST /api/admin/content/:id/restore` | Recuperação usando `revision` e `restoreRevision`.                   |
| `GET /api/admin/audit`                | Ações recentes.                                                      |
| `GET, POST /api/admin/members`        | Administração de associações e perfis.                               |

Escritas administrativas exigem sessão, associação ativa, permissão e `Origin` exata da aplicação. Corpo JSON limitado a 200 KB. Mensagens de erro não devolvem segredos do servidor. O catálogo não recebe cookies e não entrega rascunhos, usuários ou auditoria. `401` indica sessão ausente, `403` acesso negado, `409` conflito e `422` conteúdo inválido.

## Testes

```bash
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:browser
```

34 testes de domínio, autorização, API e persistência com Postgres executado em PGlite. Três fluxos de navegador usam o serviço real e PGlite, simulando somente a identidade já verificada: acesso restrito/formulário, criar→revisar→publicar→editar, e navegação/permissões no celular. Não fazem cadastro real ou envio de e-mail. O CI também executa o conjunto do TagLab, incluindo integração com catálogo e fallback.

Antes do piloto humano, validar na URL publicada: cadastro, código recebido, login, restauração da sessão, logout, recuperação de senha, convite/autorização de outro colaborador, mudança/revogação do perfil, publicação e recebimento efetivo no TagLab. Essas etapas não equivalem aos testes com identidade simulada.

## Estado da preparação em 06/11/2026

O projeto Neon `taglab-control` (`winter-cherry-21064906`) foi criado com branches `production` e `development`, separadas dos outros sistemas. Auth foi provisionado. A importação do catálogo e do administrador no banco remoto foi bloqueada pela revisão automática, que exige autorização específica. **A carga foi testada localmente; não foi gravada nessas branches.**

A criação do projeto Vercel foi bloqueada por HTTP 403 para a equipe conectada; é necessário autorizar o acesso dessa conexão à equipe. Não existe implantação pública desta central nesta entrega enquanto essas etapas não forem liberadas. A configuração de origem do TagLab continua vazia. A alteração de políticas de senha/verificação no Neon também foi rejeitada e não foi contornada; o servidor da central exige e-mail verificado independentemente dessa política.

## Próximas melhorias

Piloto pequeno com um administrador, um revisor e dois autores; regra editorial para publicação; busca/paginação além do limite administrativo atual de 600 itens; aprovação por outra pessoa; SMTP corporativo e SSO/MFA conforme o provedor aprovado pela empresa; monitoramento e limites de uso; exportação integral/backup com política de retenção; métricas de utilidade das questões sem coletar dados pessoais do laboratório.

## Referências técnicas

- https://neon.com/docs/auth/quick-start/nextjs-api-only
- https://neon.com/docs/auth/production-checklist
- https://neon.com/docs/introduction/branching
- https://vercel.com/docs/functions
- https://nextjs.org/docs/app/getting-started/route-handlers
