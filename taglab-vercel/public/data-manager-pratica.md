# Prática acompanhada da Data Manager API

Revisão de 19 de outubro de 2026. O TagLab não autentica, armazena token ou envia conversões. Os cenários de operação são simulados e os desafios de requisição usam apenas `Bearer LAB_TOKEN`.

## Antes de executar fora do site

Defina com o responsável a conta usada no ensaio, destino, ação de conversão, identificadores e acessos. Habilite a API no projeto adequado e configure autenticação conforme a documentação vigente. O escopo é `https://www.googleapis.com/auth/datamanager`; API key não substitui OAuth. Use APIs Explorer oficial ou ambiente local. Nunca cole o token na página que carrega tags.

## Etapa de validação

1. Prepare `POST https://datamanager.googleapis.com/v1/events:ingest`, JSON com `destinations` e `events`, consentimento e encoding quando aplicável.
2. Informe referência estável da venda, data com fuso e campos adequados ao destino. `TEST_GCLID_…` do TagLab é fictício e não comprova correspondência.
3. Use `validateOnly: true`. Registre HTTP, erros e eventuais avisos. Corrija o campo apontado e repita a validação.
4. Explique o limite: essa etapa não ingere eventos, não comprova atribuição e não oferece o diagnóstico assíncrono de uma ingestão efetiva.

## Etapa de ingestão e diagnóstico

Quando essa etapa fizer parte do ensaio definido pela equipe, envie uma requisição própria com dados adequados ao ambiente. Preserve a referência da venda e o `requestId` retornado. Consulte `requestStatus.retrieve` por destino, com espera e teto de tentativas. `PROCESSING` está pendente; leia erros e avisos finais. Processamento bem-sucedido e atribuição publicitária são verificações diferentes.

Em 401/403, corrija autenticação ou acesso. Em 429, identifique a cota: limite por minuto pode exigir espera exponencial com jitter; cota diária não se resolve com repetição imediata. Falha transitória pode usar repetição limitada. Evite recriar IDs de venda a cada tentativa.

## Entrega ao tutor

Anexe versão do código, ambiente, contrato usado, HTTP e corpo sem credenciais. Separe prova da validação, prova da ingestão e diagnóstico por destino. Registre o que continua pendente e a próxima investigação. Use a área Revisão com tutor para preparar o relato.

Referências oficiais:

- https://developers.google.com/data-manager/api/devguides/events/google-ads/offline/send-events
- https://developers.google.com/data-manager/api/reference/rest/v1/events/ingest
- https://developers.google.com/data-manager/api/devguides/concepts/understand-errors
- https://developers.google.com/data-manager/api/devguides/diagnostics
- https://developers.google.com/data-manager/api/reference/rest/v1/requestStatus/retrieve
- https://developers.google.com/data-manager/api/devguides/events/google-ads/offline/upgrade
- https://support.google.com/google-ads-data-manager/answer/14184381
