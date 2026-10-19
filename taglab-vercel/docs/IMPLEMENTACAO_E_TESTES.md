# Execução do plano e evidências

Data: 19/10/2026. Base: `46bd841ef979e61554530bde174a023ee1375144`.

## Entregas por item do plano

| Item | Implementação no código | Verificação e limite |
| --- | --- | --- |
| COR 01 | Adaptador comum e fallback em memória; boot, tema e módulos preservados | Storage com leitura, gravação, remoção, quota e JSON inválido; aplicação completa no navegador |
| COR 02 | Guia alinhado com Inicialização e roteiro do modelo em Consent Initialization | Revisão do conteúdo; Preview do contêiner real pendente |
| COR 03 | Bridge por modo e código de modelo com APIs oficiais | Ordem e revogação em core e browser; código do modelo executado com mocks; conta real pendente |
| COR 04 | Tipo comum de evidência, exportações e declarações manuais | Nenhuma inferência de destino por script, healthy ou corretor local |
| COR 05 | README, documentação atual, guias e relatórios históricos identificados | Banco v3 e progresso preservados; material original de onboarding não alterado |
| AP 01 | Cinco missões, requisitos orientativos e evidência explicada | Compra, captura, autoavaliação e início das questões no navegador |
| AP 02 | Sete competências e sete decisões de ferramentas | Filtros, revisão de erros, justificativa e uso de consulta |
| PR 01 | Contratos purchase e add_to_cart com divergência por campo | Ausências, tipos, centavos, valor zero, duplicidade e imutabilidade |
| PR 02 | Quatro casos isolados de defeito | Defeito/correção; revogação preservada; sair encerra o cenário; não injeta falhas na coleta real |
| PR 03 | Três funções, treze vetores, Worker em sandbox e CSP | Saídas, laço infinito, DOM/storage ausentes, bloqueio de rede, saída excessiva e limpeza do iframe |
| PR 04 | CSV com mapeamento, validação por linha e exportação | BOM, aspas, quebra interna, calendário/fuso, decimal, IDs, dados sintéticos e revogação |
| RE 01 | Oito cenários de API e roteiro de prática externa | Relógio virtual, 403, 429 minuto/dia, 503, avisos, PROCESSING/FAILED e teto; integração real pendente |
| RE 02 | Três incidentes GTG e roteiro do domínio controlado | Saúde separada de geografia, scripts, hits e destino; provisionamento e tráfego real pendentes |
| RE 03 | Preparação de revisão, rubrica e exportação | Autoavaliação identificada; revisão protegida e portal com turmas continuam fora do site |

## Testes automatizados

Conjunto local: **59 testes**, incluindo os 41 existentes. Conjunto de navegador: **9 fluxos de integração**, com Chromium e recursos Google interceptados. Os nove fluxos também percorrem os treze vetores das três funções. Os comandos para reprodução estão no README e em [PROJETO.md](PROJETO.md).

O navegador valida boot completo, modos exclusivos, ligação do consentimento, compra e missão, filtro por competência, restauração de cenário, CSV com revogação, execução isolada, API, gateway, exportação de tutoria e viewport móvel com tema escuro. O teste de rede usa um endpoint local sentinela e confere ausência de chamada, mantendo a política de segurança do navegador.

O teste local de Chromium usou executável 153.0.8010.0 com Playwright 1.62.1. O workflow configura o Chromium distribuído pelo Playwright e precisa ter seu resultado acompanhado no GitHub. Não foram validados Firefox ou Safari nesta entrega.

## Roteiro manual externo ainda necessário

1. Instalar o modelo no GTM de teste e conferir permissões, Consent Initialization, Initialization, grant, revoke e evento seguinte no Preview.
2. Usar propriedade GA4 de teste e conferir contrato, request e DebugView; revisar medição otimizada e duplicação.
3. Ativar UPD/EC apenas conforme as capacidades da propriedade e conferir variável, tag e coleta com os dados sintéticos permitidos.
4. Para Data Manager, definir destino e autenticação fora da página, executar validação e separar eventual ingestão/diagnóstico.
5. Em domínio controlado, conferir gateway, localização, scripts, hits e destino; registrar revisão de CDN.
6. Fazer o piloto com aluno e tutor, registrar ajuda usada e repetir uma tarefa equivalente com variação. Desenhar portal protegido apenas se o piloto mostrar necessidade.

Esses itens dependem de contas, acessos, infraestrutura e participantes. Os testes locais não os substituem e a interface não os marca como verificados automaticamente.

## Liberação e reversão

Revisar PR e Preview, confirmar suíte/CI e fazer smoke do deployment. A publicação só deve ser considerada conferida depois de verificar a versão e a URL resultante. Reverter o commit ou deployment se houver regressão; GTM e CDN exigem reversão própria. As chaves anteriores não são apagadas e os novos módulos têm chaves próprias versionadas.
