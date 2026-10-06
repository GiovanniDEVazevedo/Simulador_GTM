# Laboratório UPD & EC — roteiro de prática

UPD significa dados fornecidos pelo usuário. EC significa conversões otimizadas (Enhanced Conversions). UPD pode alimentar EC no GA4; uma tag de conversão nativa do Google Ads é outra rota. Este laboratório prepara dados fictícios e eventos. As configurações das contas, publicação do contêiner e verificação das requisições são feitas por você.

## 1. Preparar o ambiente

1. Faça o deploy na Vercel: Root Directory `taglab-vercel`, Framework `Other`, Output Directory `public`, sem comando de build.
2. Abra Configuração no simulador. Escolha GTM e informe seu contêiner de teste. Salve e recarregue. O padrão continua `GTM-KW59VB3X`; use uma propriedade GA4 de testes. GA4 direto continua disponível no site, mas o envio deste laboratório exige o modo GTM.
3. No GTM, crie/confira a **Tag do Google** com o ID da propriedade de teste (o ID informado anteriormente foi `G-K3P3QWNJ38`). Use o acionador nativo **Initialization – All Pages**. Não crie um evento personalizado `gtm.init` nem o envie manualmente.
4. Abra Preview e conecte o endereço publicado. Confira o contêiner correto e o evento Initialization. Se ele não aparecer, verifique o carregamento de `gtm.js`, bloqueadores, CSP e configuração salva no navegador.
5. No GA4, habilite a coleta de dados fornecidos pelo usuário em Administração → Coleta de dados, aceite os termos quando aplicáveis e habilite a capacidade correspondente nas configurações da Tag do Google. Use coleta por código para este exercício; desative métodos automáticos concorrentes durante a comparação controlada.
6. Na aba UPD & EC, comece com **Gerar prévia**. Esta opção não envia o evento do laboratório; outras tags existentes na página continuam funcionando.

O laboratório aceita e-mails nos domínios reservados `example.com`, `example.org`, `example.net` e `test.invalid`; telefone opcional de `+12025550100` a `+12025550199`. Não use dados reais. Esses valores permitem testar a implementação, mas não demonstram correspondência com usuários ou atribuição a anúncios.

## 2. Variáveis e tags do GTM

Crie uma variável de camada de dados versão 2 chamada `DLV - lab_user_data`, nome da variável na camada: `lab_user_data`.

Crie a variável JavaScript personalizado `JS - lab user data`:

```javascript
function () {
  var data = {{DLV - lab_user_data}};
  return data || undefined;
}
```

Crie uma variável **Dados fornecidos pelo usuário / User-Provided Data**, escolha **Código / Code** e selecione `{{JS - lab user data}}`. Nome sugerido: `UPD - laboratório`. A variável especializada interpreta os campos originais ou já processados com hash.

| Variável DLV (versão 2) | Nome na camada | Uso |
|---|---|---|
| DLV - lab_user_data | lab_user_data | Fonte da variável UPD |
| DLV - lab_run_id | lab_run_id | Identificar o caso de teste |
| DLV - lab_data_format | lab_data_format | raw ou hashed |
| DLV - lab_upd_allowed | lab_upd_allowed | Inspeção da regra local de consentimento |
| DLV - value | value | Valor do evento |
| DLV - currency | currency | BRL |
| DLV - transaction_id | transaction_id | ID da compra de teste |

### Lead no GA4

- Tag: Evento do GA4, ligada à sua Tag do Google/propriedade de teste.
- Nome enviado ao GA4: `generate_lead`.
- Parâmetros: `user_data` = `{{UPD - laboratório}}`, `debug_mode` = `true`, `value` e `currency` = DLV correspondentes. Opcionalmente envie `lab_run_id` e `lab_data_format` para correlacionar o teste.
- Acionador: Evento personalizado, nome exato `lab_upd_lead`.

`user_data` é o campo especial para UPD, usando a variável especializada. Não mapeie e-mail, telefone ou hashes como parâmetros personalizados comuns, dimensões personalizadas ou `user_id`.

### Compra no GA4

Crie outra tag de evento com nome `purchase`, acionada pelo evento personalizado exato `lab_ec_purchase`. Habilite o envio de dados de e-commerce a partir do dataLayer e inclua `user_data` = variável UPD e `debug_mode` = true. O objeto `ecommerce` contém transaction_id, value, currency e items. Se sua interface exigir mapeamento manual, mapeie esses campos a partir de `ecommerce.*`.

O site envia nomes `lab_*` para você escolher o destino explicitamente. Revise tags antigas com acionadores genéricos, expressões regulares ou HTML personalizado para evitar duplicação e envio indevido. A limpeza do objeto no site não altera configurações automáticas das suas tags.

### Google Ads opcional

Se quiser testar uma conversão nativa do Ads, configure uma ação de conversão de teste e habilite EC/coleta de dados fornecidos pelo usuário na interface atual da conta. Aceite os termos quando aplicáveis. Use o **Conversion ID e Conversion Label reais dessa ação**, obtidos no Google Ads. Nenhuma credencial Ads foi inventada ou instalada neste projeto.

Na tag de conversão do Google Ads, use a variável UPD conforme a opção de dados fornecidos pelo usuário do template; associe o evento `lab_ec_purchase`, valor, moeda e ID da transação. Confira a configuração de vinculação de conversões exigida pelo seu contêiner. Prefira uma ação secundária de teste para não afetar lances.

A alternativa é vincular GA4 e Ads e importar o evento principal do GA4. Evite contar a mesma compra como duas conversões primárias (importada e nativa). EC para leads com resultado offline exige etapa posterior de importação/integração, por exemplo via Data Manager; o formulário deste site não executa essa etapa.

## 3. Dados e consentimento

Entrada ` Aluno.Teste@EXAMPLE.COM ` vira `aluno.teste@example.com`. Telefone `+1 (202) 555-0123` vira `+12025550123`. O formato hashed usa SHA-256 hexadecimal de 64 caracteres sobre os valores normalizados.

```javascript
// Formato raw: a tag processa os dados.
{email: 'aluno.teste@example.com', phone_number: '+12025550123'}
// Formato hashed: o site processa antes.
{sha256_email_address: '<64 caracteres hex>', sha256_phone_number: '<64 caracteres hex>'}
```

Não coloque um hash na chave `email` nem aplique hash duas vezes. Telefone vazio é omitido. A normalização interna contempla remoção de pontos na parte local de Gmail/Googlemail, mas esses domínios não são aceitos no envio deste laboratório para evitar uso de pessoas reais.

| analytics_storage | ad_user_data | lab_user_data no evento |
|---|---|---|
| denied | denied | null |
| granted | denied | null |
| denied | granted | null |
| granted | granted | objeto no formato escolhido |

Esta é uma regra conservadora **do laboratório**, não uma descrição completa do Consent Mode. O evento de negócio pode existir sem identidade; o comportamento dos pings depende das tags e do consentimento. `ad_storage` e `ad_personalization` continuam sendo sinais independentes: não conceda todos os sinais apenas para eliminar um erro.

Cada envio limpa `lab_user_data`, `lab_consent` e `ecommerce` antes e depois do evento para impedir reaproveitamento de dados. No Preview, selecione o evento `lab_*` para inspecionar os valores naquele momento. A posição mais recente da camada já estará limpa. O histórico local pode conservar o evento fictício até limpar/recarregar a página.

## 4. Executar e verificar

1. Prepare dados e gere uma prévia. Confira formato e consentimento.
2. Selecione **Enviar ao GTM**, confirme que usa ambiente de teste e envie.
3. No Tag Assistant, abra o evento `lab_upd_lead` ou `lab_ec_purchase`. Confira variáveis, consentimento e a tag disparada. Um push local não prova disparo de tag.
4. Em DevTools → Network, filtre `collect`. Na coleta GA4, confira destino `tid`, evento `en` e a presença de dados UPD processados. A documentação indica o parâmetro `em`, com prefixo `tv.1~em` e hash; um campo vazio não comprova envio de identidade. Confira também que não há e-mail/telefone em claro na requisição.
5. Confira `generate_lead`/`purchase` no DebugView da propriedade correta. O recebimento do evento, isoladamente, não comprova UPD nem correspondência. Diagnósticos de EC podem levar tempo e dependem da configuração/qualidade dos dados; dados fictícios não demonstram match.
6. Crie um novo caso para novo envio. A interface bloqueia clique repetido no mesmo caso; a nova compra recebe outro transaction_id. Isso não é uma garantia geral de deduplicação em todos os destinos.
7. Exporte evidências locais. O arquivo contém metadados dos pushes e autoavaliação dos exercícios, sem e-mail, telefone ou hashes. Acrescente suas evidências externas separadamente.
8. Após validar no Preview, publique a versão do contêiner se quiser testar sem Preview. Publicar código na Vercel não publica seu GTM.

## 5. Seis tarefas para reforçar o aprendizado

1. **Normalizar:** compare entrada com maiúsculas/espaços à forma normalizada. Rode a verificação local. Explique por que alterar um caractere muda o hash.
2. **Negar consentimento:** recuse tudo e envie lead. Evidência: variável UPD vazia naquele evento, lab_upd_allowed=false. Diferencie ausência de identidade de ausência de qualquer ping.
3. **Lead com UPD:** conceda os sinais necessários e envie novo caso. Evidências: variável preenchida, tag disparada, requisição correta e evento no DebugView. Registre cada etapa separadamente.
4. **Raw versus hash:** envie dois novos casos com a mesma identidade fictícia. Compare nomes dos campos e o hash final na requisição. Investigue divergência ou processamento duplo.
5. **Compra:** envie compra, tente repetir e crie novo caso. Evidências: bloqueio local, IDs diferentes, valor 49.90 BRL e item LAB-EC-001. Se tiver Ads, verifique também sua tag de teste, sem esperar atribuição.
6. **Erros e limpeza:** após envio com telefone, envie apenas e-mail; depois teste e-mail inválido e revogue ad_user_data. Evidências: telefone não reaparece, inválido não gera evento e nova identidade é omitida após revogação.

Marque as tarefas na interface só depois de observar o resultado. Os checkboxes são autoavaliação, não validação automática das contas Google.

## 6. Diagnóstico rápido

- Sem Initialization: confira ID/configuração do site, carregamento do contêiner, extensões e CSP. Não simule gtm.init.
- Evento existe, tag não dispara: confira nome exato do acionador, exceções, consentimento e workspace no Preview.
- Tag dispara, GA4 vazio: confira ID de destino, Network, bloqueadores e DebugView. O selo local não comprova entrega.
- UPD vazio com consentimento concedido: confira os dois habilitadores de coleta, variável Código, nomes dos campos e momento do evento.
- Nenhum envio pela interface: confira modo GTM, confirmação do ambiente, erros de dados, HTTPS e criação de novo caso.
- Eventos duplicados: revise gtag direto + GTM, acionadores genéricos, tags repetidas e objetivos nativos/importados.

## Documentação oficial

- [Habilitar UPD no GA4](https://support.google.com/analytics/answer/14077171?hl=pt-BR)
- [Configuração UPD com código no GTM](https://support.google.com/analytics/answer/14179230?hl=pt-BR)
- [Verificar UPD](https://support.google.com/analytics/answer/14171683?hl=pt-BR)
- [Conversões otimizadas no GA4](https://support.google.com/analytics/answer/14252663?hl=pt-BR)
- [EC do Google Ads com GTM](https://support.google.com/google-ads/answer/13262500?hl=pt-BR)

Os nomes das opções podem variar com idioma e atualizações da interface. Consulte a documentação vigente antes de usar a configuração em produção.
