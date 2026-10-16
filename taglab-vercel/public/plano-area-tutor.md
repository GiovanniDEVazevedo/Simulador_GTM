# Área do tutor: plano e comparação de serviços prontos

**Revisão:** 16/10/2026. **Estado:** planejamento, sem contas, contratação ou integrações externas criadas.  
**Premissa de dimensionamento:** piloto de 10 a 30 alunos e até dois tutores; hipótese a validar com a equipe.  
**Objetivo:** acompanhar aprendizagem e evidências práticas com o mínimo de desenvolvimento e operação próprios.

## 1. Recomendação

Começar com **TagLab para estudo e prática + ClickUp para acompanhar entregas e registrar a validação do tutor**, caso a equipe já tenha acesso à ferramenta. Esse piloto pode funcionar por configuração e registro manual, sem uma API nova.

Se o requisito for **login de aluno, notas centralizadas, questionários e entregas prontos com pouco código**, avaliar **MoodleCloud**. O TagLab continua sendo o laboratório, acessado por um recurso URL do curso. As questões podem ser importadas em GIFT; as tentativas devem ocorrer no Moodle para gerar notas centrais nativas.

Se for obrigatório manter **a experiência do aluno e o painel do tutor dentro do próprio produto**, a alternativa recomendada para uma evolução é **Supabase gerenciado**. Ele entrega serviços de backend, mas login na interface, políticas de acesso e integração das telas continuam exigindo implementação.

**Conclusão de arquitetura proposta:** validar o fluxo de tutoria antes de criar um portal. Um LMS, um gerenciador de tarefas e um backend como serviço resolvem camadas diferentes; não precisam ser contratados juntos.

## 2. Comparação das opções

| Opção | O que já entrega | O que ainda precisamos fazer | Custo e limite observado | Adequação para este momento |
| --- | --- | --- | --- | --- |
| ClickUp | Tarefas, status, responsáveis, comentários e campos configuráveis | Montar o modelo da turma e a rubrica; registrar resultados manualmente ou desenvolver integração | Reutilização depende do plano existente. Campos, relatórios e permissões têm limites por plano | Melhor ponto de partida se já estiver no fluxo da equipe |
| MoodleCloud | LMS hospedado, usuários, cursos, questionários, entregas e avaliação | Configurar curso, matrículas, banco e critérios; ligar o laboratório por URL | Starter com 50 usuários. Páginas oficiais consultadas mostram US$ 160 e US$ 170 anuais; confirmar cotação e cobrança em AUD no checkout | Mais próximo de configurar um ambiente de aprendizagem pronto |
| Supabase | Postgres, Auth, APIs de dados e Storage | Modelar relações, escrever/testar políticas, integrar telas e calcular avaliações confiáveis no serviço | Free: 500 MB de banco, 1 GB de arquivos; pausa após uma semana sem atividade. Pro a partir de US$ 25/mês, sujeito a adicionais/uso | Melhor evolução se a área do tutor precisar fazer parte do site |
| Firebase | Auth e Firestore, SDKs e regras de acesso | Estruturar documentos, consultas, regras e interface; planejar lógica de correção | Spark sem custo dentro das cotas; Blaze por uso. Recursos e limites variam por produto | Alternativa se a equipe já domina Firebase ou tem padrão Google Cloud |
| Directus | APIs REST/GraphQL, Data Studio e permissões configuráveis | Modelar dados, adaptar o fluxo de revisão e integrar o aluno ao site; notas automáticas exigem lógica | Core: três usuários de Studio; hospedagem Cloud é adicional de US$ 99/mês. Licença e SSO dependem do plano/elegibilidade | Útil para painel administrativo por configuração; custo maior no piloto |

Preços são uma fotografia de 16/10/2026 em moeda estrangeira, sem conversão, impostos ou contratação. As divergências de MoodleCloud foram mantidas explícitas. Não é possível assumir que o plano corporativo já autoriza convidados, novas licenças ou o recurso desejado.

O Directus auto-hospedado e o Moodle auto-hospedado transferem operação, atualização e backup para a equipe. São opções válidas quando essa responsabilidade é desejada; não atendem tão diretamente ao objetivo de reduzir operação agora.

## 3. Piloto por configuração no ClickUp

### Estrutura sugerida

- Uma pasta ou lista privada por turma, respeitando as permissões do Workspace.
- Um modelo de tarefa por competência: fundamentos, coleta/GA4, consentimento/UPD, offline e arquitetura.
- Uma tarefa de entrega por aluno e competência, com objetivo, evidência esperada e critério de revisão.
- Status propostos: A estudar → Em prática → Aguardando revisão → Ajustes solicitados → Validado pelo tutor.
- Vistas do tutor: fila de revisão, entregas por aluno e pendências por competência. Usar listas filtradas quando os cartões de dashboard não estiverem disponíveis.

### Dados mínimos de uma entrega

Aluno e tutor; competência; prazo; versão do banco; IDs e quantidade das questões usadas; acertos/total; link ou arquivo com evidência; explicação do aluno; decisão e comentário do tutor; data de revisão.

Campos customizados são convenientes, mas os mesmos itens podem começar na descrição da tarefa. O plano gratuito tem limites de uso de campos; evite depender de muitos campos/automação para validar o piloto.

### Fluxo operacional

1. O aluno estuda no TagLab e realiza um caso prático.
2. Registra o resultado e a explicação na tarefa. O JSON de progresso pode ser anexado manualmente, como material de autoavaliação.
3. O tutor confere a execução e pede uma explicação ou uma variação do caso.
4. Registra uma decisão explícita e a evidência que sustentou a revisão.
5. Avança a competência após a validação combinada. A nota do questionário é um apoio, não o critério único.

**Limite de permissão:** pessoas atribuídas a tarefas podem alterar o status em determinadas permissões, inclusive com acesso de comentário. O status sozinho não é uma aprovação protegida. No piloto, exigir o registro identificado do tutor; se for necessário controle técnico estrito, separar o registro de aprovação em uma lista privada mantida pelos tutores e testar os acessos antes de usar.

Essa etapa não sincroniza resultados automaticamente com o site e não exige tokens no navegador.

## 4. Caminho com MoodleCloud

Configurar um curso com módulos por competência, matrículas e papéis de professor/aluno. Importar o banco GIFT do TagLab, montar questionários menores, definir tentativas e exibição do feedback. Usar tarefas para evidências práticas e uma rubrica para a revisão. Adicionar a URL do TagLab como recurso de prática.

No site: **Exercícios & questionário → Baixar para Moodle (.gift)**. O arquivo mantém categorias por tema, IDs, alternativas, gabaritos, explicações, impacto e links oficiais em feedback textual.

A geração do arquivo foi testada localmente. A importação ainda precisa ser validada na versão e instância Moodle escolhidas: conferir 96 questões em oito categorias, uma alternativa correta por item, acentos, sinais como = e :, feedback e uma tentativa feita por um usuário de teste. O exportador não cria curso nem transfere tentativas existentes.

MoodleCloud não permite instalar livremente plugins próprios. Não pressupor integração automática com TagLab, plugins de avaliação ou disponibilidade irrestrita de web services. Para o piloto, preferir recursos nativos e importação de arquivo. Novas versões do banco devem entrar em categorias versionadas para não alterar silenciosamente um conjunto usado em avaliação.

## 5. Desenho funcional da futura área do tutor

| Tela | Conteúdo necessário | Ação principal |
| --- | --- | --- |
| Turmas | Integrantes, tutores, competências e pendências | Entrar na turma e localizar quem precisa de revisão |
| Perfil do aluno | Entregas, tentativas com escopo/versão, temas praticados e feedback | Preparar a próxima conversa com o aluno |
| Fila de evidências | Caso, explicação, evidência, estado e revisão anterior | Validar ou devolver com uma orientação concreta |
| Revisão prática | Rubrica, comentários e resultado observado | Registrar a decisão do tutor com contexto |
| Conteúdo | Versão, fonte, responsável e revisão editorial | Aprovar correções no banco e nos exercícios |

### Rubrica inicial proposta

Avaliar separadamente: **raciocínio técnico**, **execução**, **diagnóstico com evidências** e **reconhecimento dos limites**. Em cada critério, registrar: precisa de orientação, executa com apoio ou executa e explica com autonomia. O tutor define os critérios essenciais de cada tarefa; não transformar uma soma de pontos em liberação automática.

Exemplo: localizar um purchase no dataLayer não basta para validar o envio. O aluno precisa mostrar acionamento, transporte, destino e o que ainda não conseguiu comprovar.

### Permissões desejadas

| Papel | Pode fazer | Limite a garantir |
| --- | --- | --- |
| Aluno | Ver seu progresso e feedback; entregar evidências | Não aprovar a própria entrega nem acessar outra turma por trocar um ID |
| Tutor | Acompanhar turmas atribuídas; revisar e comentar | Não receber administração global por padrão |
| Editor de conteúdo | Propor/revisar questões e fontes | Não obter acesso automático aos resultados pessoais |
| Administrador | Gerir convites, vínculos e configurações | Alterações administrativas identificadas e limitadas ao necessário |

O painel com resultados pessoais deve usar acesso autenticado e não carregar o contêiner de testes público. A estrutura atual do laboratório carrega tags; adicionar uma aba oculta no mesmo HTML não cria uma área privada. Uma implantação com dados reais de alunos precisa de permissões no serviço, além da interface.

## 6. Se a escolha for Supabase: o que configurar e integrar

Proposta de modelo, ainda não implantada:

| Entidade | Finalidade |
| --- | --- |
| profiles | Perfil mínimo vinculado ao usuário autenticado |
| cohorts / cohort_members | Turmas e vínculos de alunos/tutores |
| assignments | Atividade atribuída, escopo e versão imutável do conteúdo |
| attempts / attempt_answers | Tentativas e respostas, com IDs das questões e contexto da avaliação |
| submissions | Explicação e evidência entregue para uma atividade |
| reviews | Decisão, critérios e comentário registrados pelo tutor |

Configuração: projeto gerenciado, autenticação, URLs de retorno, tabelas, bucket privado e políticas RLS por operação. Integração: login nas telas, criação/retomada de tentativas, submissão e leitura do painel.

A chave publicável identifica o projeto, mas só é apropriada no cliente com permissões/RLS corretas. Chaves secretas/service_role ficam no serviço. Os vínculos de tutor e aluno não devem ser autoconcedidos pelo aluno. Aluno A, aluno B, tutor de outra turma e visitante precisam ser testados com cenários permitidos e negados.

**Correção confiável:** se o resultado for usado como avaliação controlada, calcular a nota no serviço a partir das respostas e da versão atribuída, usando uma função de banco/Edge Function autorizada. Aceitar score enviado pelo navegador não resolve isso. O banco público continua sendo material de estudo com gabaritos abertos; uma avaliação reservada exigiria um conjunto separado e outra política de exposição.

Usar evidências de teste, com identidade fictícia e informações de clientes removidas. Definir responsável pelos acessos, retenção e remoção antes do uso com a turma.

## 7. APIs e integrações: responsabilidade de cada uma

| API/serviço | Uso possível | Configuração x código |
| --- | --- | --- |
| ClickUp API | Criar tarefa, ler entregas, atualizar campos e associar revisão | Piloto manual dispensa API. Automação futura precisa autenticação e integração; uso pessoal e apps multiusuário têm fluxos distintos |
| Moodle | Notas e tentativas dentro do LMS; recursos e relatórios nativos | Configurar os recursos e importar GIFT. Sincronizar tentativas do TagLab é outro projeto; confirmar web services no serviço contratado |
| Supabase Auth/Data API/Storage | Login e dados do produto; evidências privadas | Serviço gerenciado evita construir servidores próprios, mas requer modelo, políticas e interface |
| Firebase Auth/Firestore | Login e persistência de documentos de aprendizagem | Regras e consultas são parte da implementação; acompanhar cotas e faturamento dos recursos usados |
| Directus API/Data Studio | Dados por API e revisão via painel existente | Coleções/permissões por interface; fluxo de negócio e integração do aluno precisam ser definidos |

Uma automação que use segredo do ClickUp não pode colocá-lo no JS público. Para uma integração por código, usar uma função gerenciada que autentique o usuário e confira seu vínculo antes de acionar o serviço; um proxy aberto com o token da equipe também seria insuficiente. Para uma aplicação compartilhada, conferir OAuth, escopos, permissões e limites atuais do provedor.

Não são necessárias APIs do GA4 ou GTM para guardar notas e feedback pedagógico. Elas medem ou configuram a mensuração; o acompanhamento individual pertence ao serviço escolhido para a aprendizagem.

## 8. Ordem de execução proposta

1. **Definir o piloto:** responsável, grupo, competências e critérios de revisão. Confirmar se o ClickUp ou um LMS já licenciado cobre o caso.
2. **Configurar o acompanhamento:** uma turma, um modelo de entrega e vistas do tutor; evitar duplicar a fonte oficial de aprovação.
3. **Validar com poucos participantes:** executar estudo, envio de evidência, devolução e validação. Medir tempo de revisão e dificuldades do processo.
4. **Escolher a evolução pelo resultado:** MoodleCloud se a prioridade for recursos pedagógicos prontos; Supabase se o painel integrado ao site se tornar requisito confirmado.
5. **Automatizar o trabalho repetitivo observado:** só então ligar APIs e remover registro manual, mantendo a revisão humana da prática.

Critérios do piloto: aluno encontra a tarefa, entrega evidência, recebe orientação; tutor identifica pendências e registra a decisão; pessoas sem vínculo não veem resultados de outros; notas exibem escopo e versão; uma alteração de conteúdo não muda silenciosamente o contexto de uma avaliação anterior.

## 9. Entregue agora e pendente

**Implementado:** banco v3 com 96 questões (12 por tema), 39 fontes oficiais, exportação JSON/GIFT, preservação do progresso anterior e metadados de versão/IDs nas novas tentativas corrigidas. Os históricos antigos permanecem sem IDs/versão quando esses dados não foram registrados. Não há reconstrução desses detalhes.

**Pendente:** qualquer conta de serviço, turma remota, login de aluno, importação em Moodle, API conectada ou painel privado. Este documento e os links no site são o plano para tornar a próxima implementação concreta, sem apresentar um protótipo como integração operacional.

## Referências oficiais consultadas

- ClickUp: [status](https://help.clickup.com/hc/en-us/articles/6309452618647-Manage-task-statuses), [campos](https://help.clickup.com/hc/en-us/articles/6303536766231-Intro-to-Custom-Fields), [permissões](https://help.clickup.com/hc/en-us/articles/6309221065495-Permissions-in-detail), [autenticação API](https://developer.clickup.com/docs/authentication), [criar tarefa](https://developer.clickup.com/reference/createtask), [limites API](https://developer.clickup.com/docs/rate-limits).
- Moodle: [MoodleCloud e opções de hospedagem](https://support.moodle.com/support/solutions/articles/80000825155-moodlecloud-and-moodle-hosting-options), [planos](https://www.moodlecloud.com/standard-plans/), [especificações](https://www.moodlecloud.com/product-specifications/), [restrição de plugins](https://support.moodle.com/support/solutions/articles/80000831611), [GIFT](https://docs.moodle.org/en/GIFT_format), [relatórios de questionário](https://docs.moodle.org/en/Quiz_reports), [rubricas](https://docs.moodle.org/en/Rubrics).
- Supabase: [Auth](https://supabase.com/docs/guides/auth), [acesso aos dados](https://supabase.com/docs/guides/database/secure-data), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [preços](https://supabase.com/pricing).
- Firebase: [preços](https://firebase.google.com/pricing), [regras Firestore](https://firebase.google.com/docs/firestore/security/get-started).
- Directus: [API](https://directus.com/docs/api), [controle de acesso](https://directus.com/docs/guides/auth/access-control), [preços](https://directus.com/pricing).
