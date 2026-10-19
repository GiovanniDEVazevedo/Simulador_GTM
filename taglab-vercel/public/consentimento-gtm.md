# Consentimento no TagLab

Revisão técnica de 19 de outubro de 2026. O estado visual é uma escolha local; confira o estado efetivo no Preview.

## Google Tag Manager

1. No contêiner de teste, abra Modelos, Modelos de tag e Novo.
2. Cole no editor Código o conteúdo de [gtm-consent-template.txt](/gtm-consent-template.txt). Esse código pertence ao modelo personalizado, não a uma tag HTML personalizada.
3. Em Permissões, permita escrever em `analytics_storage`, `ad_storage`, `ad_user_data` e `ad_personalization`. Em Acessa variáveis globais, permita executar `taglabRegisterConsent`. Não é necessário acesso a cookies, rede ou dados de identidade.
4. Salve o modelo e crie uma tag com ele. Use **Inicialização de consentimento — Todas as páginas**.
5. Configure sua Google tag com o G-ID de teste em **Inicialização — Todas as páginas**. Use acionadores de Evento personalizado para as tags de eventos de negócio.
6. Abra o Preview no contêiner e na URL corretos. A aba Consentimento deve informar que o modelo se conectou ao site. Esse aviso é uma confirmação local da ligação, sem validar uma conta externa.
7. Negue todos os sinais, faça uma ação e confira Consent no Preview. Conceda, repita; revogue `ad_user_data` e gere outra ação imediatamente. Confira o estado usado pela tag e a coleta.
8. Para UPD armado, o site exige a ligação do modelo. Sem ela, a prévia funciona e o push de teste é bloqueado. O bootstrap negado permanece como proteção para contêiner sem o modelo.

O modelo chama `setDefaultConsentState` na inicialização e registra uma função que chama `updateConsentState`. A página aciona essa função antes do próximo evento. Ela não usa `gtag('consent','update')` no modo GTM.

No modo GA4 direto, os comandos de consentimento usam gtag. No modo Somente dataLayer, a escolha é local e não chama uma tag externa. Preferências ficam em armazenamento local quando disponível; sem ele, a sessão continua em memória.

## Evidência e limite

Os testes automatizados verificam ordem, sinais independentes, revogação e a execução do código do modelo com APIs simuladas. Importação, permissões e comportamento dentro do seu contêiner precisam de validação manual no Preview. Este controle didático não substitui uma CMP completa.

Referências oficiais:

- https://developers.google.com/tag-platform/security/guides/consent
- https://developers.google.com/tag-platform/tag-manager/templates/consent-apis
- https://support.google.com/tagmanager/answer/15756616?hl=en
