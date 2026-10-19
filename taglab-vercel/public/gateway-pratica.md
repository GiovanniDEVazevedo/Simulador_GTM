# Prática de Google tag gateway

Revisão de 19 de outubro de 2026. Este site aceita um caminho na mesma origem, mas não cria domínio, CDN ou gateway. Um playground de terceiros não provisiona roteamento no seu vercel.app.

## Preparação do ambiente

Escolha um domínio cujo roteamento a equipe controla e uma infraestrutura compatível com o guia oficial. Defina um caminho dedicado, a tag ou contêiner associado e a revisão da CDN. Configure upstream, cabeçalhos e query strings conforme o provedor. Não reutilize o caminho de outra tag por suposição.

GTM usa o caminho de script com `?id=GTM-…`. O modelo manual atual de gtag direto pode usar `/caminho/` com associação do ID no upstream. A ausência de `?id` nesse fluxo não é um bug por si só. Se combinar GTG, CDN e sGTM, planeje os papéis e os caminhos distintos para scripts e coleta segundo o guia dessa arquitetura.

## Conferências independentes

1. **Saúde** — confira `/caminho/healthy`, HTTP e corpo, sem concluir que a coleta funciona apenas pelo `ok`.
2. **Localização** — faça a verificação geográfica `validate_geo` indicada no guia e examine cabeçalhos repassados.
3. **Script** — observe no Network o carregamento pelo domínio e caminho esperados. Confira o conteúdo e evite fallback HTML da hospedagem.
4. **Hit** — execute um evento de teste e confira os hits no Tag Assistant e seu roteamento efetivo.
5. **Destino** — confira o evento e os parâmetros na ferramenta de destino. Registre a diferença entre transporte e recebimento.

## Falhas para estudar

- Caminho ausente, timeout e resposta de saúde diferente de `ok`.
- Saúde correta com regra de coleta incorreta.
- Localização inconsistente por cabeçalho ausente.
- Script carregado com evento ainda não observado no destino.

O bloqueio de requisições no DevTools é um ensaio controlado; não representa o comportamento de todos os AdBlock. No TagLab, os incidentes em Cenários reais são simulados e não alteram a CDN.

## Registro e reversão

Registre URL, caminho, tag, versão da aplicação, versão publicada do GTM e revisão da CDN. Reverta o componente responsável pela falha; reverter a Vercel não reverte GTM ou CDN. As evidências externas registradas na missão são declarações do aluno para revisão.

Referências oficiais:

- https://developers.google.com/tag-platform/tag-manager/gateway/setup-guide?setup=manual
- https://developers.google.com/tag-platform/tag-manager/gateway/sgtm-and-cdn
- https://developer.chrome.com/docs/devtools/request-conditions
