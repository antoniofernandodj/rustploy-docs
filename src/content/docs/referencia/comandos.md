---
title: Comandos do protocolo
description: "Referência dos 113 comandos da API do Rustploy (POST /api/rpc): nome, campos, exemplo JSON e se a GUI ou a web UI os usam."
---

Toda a API do Rustploy passa por **um** endpoint, `POST /api/rpc`, que recebe um **comando** em JSON e devolve uma **resposta**. Esta página lista os **113 comandos**. A mesma lista vale para a ferramenta `rpc` do [MCP](/agentes/ferramentas/).

## Como chamar

A codificação é *externally tagged*: um comando **com campos** é um objeto de uma chave; um comando **sem campos** é a string nua. O mesmo vale para as respostas.

```bash
# sem campos
curl -s -H "Authorization: Bearer $TOKEN" https://SERVIDOR:9797/api/rpc -d '"ProjectList"'

# com campos
curl -s -H "Authorization: Bearer $TOKEN" https://SERVIDOR:9797/api/rpc \
  -d '{"DeployStart":{"service_id":"svc_01J…"}}'
```

Uma falha vem como `{"Err":{"code":"…","message":"…"}}`. Os exemplos abaixo usam `…` e `{…}` como marcadores: troque pelos valores reais. Para saber a forma de um tipo composto (como `ServiceSpec`), leia um existente com `ServiceGet` e use-o de molde.

**Comandos destrutivos não pedem confirmação:** `ServiceDelete`, `Prune*`, `Remove*`, `StopAllManaged`, `RegistryRepoDelete`, `ManagedDatabaseDelete` e `MigrationDiscard`. E `ServiceUpdate` **substitui** o serviço inteiro, não é um patch.

## Grupos

- [Projetos](#projetos)
- [Serviços](#servicos)
- [Deploys](#deploys)
- [Logs e métricas](#logs-e-metricas)
- [Banco compartilhado](#banco-compartilhado)
- [Migração de banco](#migracao-de-banco)
- [Webhooks](#webhooks)
- [Daemon](#daemon)
- [Secrets](#secrets)
- [Infra as Code](#infra-as-code)
- [Copiar serviço entre servidores](#copiar-servico-entre-servidores)
- [Jobs](#jobs)
- [Jobs (tarefas one-shot via docker-compose, agendadas ou manuais)](#jobs-tarefas-one-shot-via-docker-compose-agendadas-ou-manuais)
- [Docker](#docker)
- [Ingress](#ingress)
- [Backup de variáveis](#backup-de-variaveis)
- [Fila de deploys](#fila-de-deploys)
- [Infraestrutura](#infraestrutura)
- [Provedores Git](#provedores-git)
- [Assistente e templates](#assistente-e-templates)
- [Registry embutido](#registry-embutido)

## Projetos

### ProjectCreate

```json
{"ProjectCreate":{"name":"…","description":null}}
```

| Campo | Tipo |
|---|---|
| `name` | `String` |
| `description` | `Option<String>` |

**Usado por:** GUI e web UI.

### ProjectDelete

```json
{"ProjectDelete":{"id":"prj_…"}}
```

| Campo | Tipo |
|---|---|
| `id` | `String` |

**Usado por:** GUI e web UI.

### ProjectUpdate

```json
{"ProjectUpdate":{"id":"prj_…","name":"…","description":null}}
```

| Campo | Tipo |
|---|---|
| `id` | `String` |
| `name` | `String` |
| `description` | `Option<String>` |

**Usado por:** GUI e web UI.

### ProjectList

```json
"ProjectList"
```

**Usado por:** GUI e web UI.

### ProjectEnvSet

```json
{"ProjectEnvSet":{"project_id":"prj_…","env_vars":[],"env_comments":[]}}
```

| Campo | Tipo |
|---|---|
| `project_id` | `String` |
| `env_vars` | `Vec<EnvVar>` |
| `env_comments` | `Vec<EnvComment>` |

**Usado por:** GUI e web UI.

## Serviços

### ServiceCreate

```json
{"ServiceCreate":{…}}
```

O valor é um `ServiceSpec`.

**Usado por:** web UI.

### ServiceUpdate

```json
{"ServiceUpdate":{"id":"svc_…","spec":"{…}"}}
```

| Campo | Tipo |
|---|---|
| `id` | `String` |
| `spec` | `ServiceSpec` |

**Usado por:** GUI e web UI.

### ServiceDelete

```json
{"ServiceDelete":{"id":"svc_…"}}
```

| Campo | Tipo |
|---|---|
| `id` | `String` |

**Usado por:** GUI e web UI.

### ServiceList

```json
{"ServiceList":{"project_id":"prj_…"}}
```

| Campo | Tipo |
|---|---|
| `project_id` | `String` |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### ServiceGet

```json
{"ServiceGet":{"id":"svc_…"}}
```

| Campo | Tipo |
|---|---|
| `id` | `String` |

**Usado por:** GUI e web UI.

### ServiceStop

```json
{"ServiceStop":{"service_id":"svc_…"}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `String` |

**Usado por:** GUI e web UI.

### ServiceReload

```json
{"ServiceReload":{"service_id":"svc_…"}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `String` |

**Usado por:** GUI e web UI.

### ServiceConnectionInfo

Host e URL de conexão **dentro** da rede Docker do projeto (montada no daemon por `shared::connection`, para GUI e webui não divergirem).

```json
{"ServiceConnectionInfo":{"service_id":"svc_…"}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `String` |

**Usado por:** GUI e web UI.

## Deploys

### DeployStart

```json
{"DeployStart":{"service_id":"svc_…"}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `String` |

**Usado por:** GUI e web UI.

### DeployAbort

```json
{"DeployAbort":{"deployment_id":"dep_…"}}
```

| Campo | Tipo |
|---|---|
| `deployment_id` | `String` |

**Usado por:** GUI e web UI.

### DeployRollback

```json
{"DeployRollback":{"service_id":"svc_…"}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `String` |

**Usado por:** web UI.

### DeployHistory

```json
{"DeployHistory":{"service_id":"svc_…","limit":20}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `String` |
| `limit` | `usize` |

**Usado por:** GUI e web UI.

### DeployDelete

```json
{"DeployDelete":{"deployment_id":"dep_…"}}
```

| Campo | Tipo |
|---|---|
| `deployment_id` | `String` |

**Usado por:** GUI e web UI.

### RecentDeployments

```json
{"RecentDeployments":{"limit":20}}
```

| Campo | Tipo |
|---|---|
| `limit` | `usize` |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### GetBuildLogs

```json
{"GetBuildLogs":{"deployment_id":"dep_…"}}
```

| Campo | Tipo |
|---|---|
| `deployment_id` | `String` |

**Usado por:** GUI e web UI.

## Logs e métricas

### LogsGet

```json
{"LogsGet":{"service_id":"svc_…","tail":20}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `String` |
| `tail` | `usize` |

**Usado por:** GUI e web UI.

### LogsSubscribe

```json
{"LogsSubscribe":{"service_id":"svc_…","tail":20}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `String` |
| `tail` | `usize` |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### LogsUnsubscribe

```json
{"LogsUnsubscribe":{"service_id":"svc_…"}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `String` |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### MetricsSubscribe

```json
{"MetricsSubscribe":{"service_id":"svc_…"}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `String` |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### MetricsUnsubscribe

```json
{"MetricsUnsubscribe":{"service_id":"svc_…"}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `String` |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

## Banco compartilhado

### SharedAccessList

Projetos autorizados a alcançar um servidor de banco compartilhado.

```json
{"SharedAccessList":{"server_service_id":"svc_…"}}
```

| Campo | Tipo |
|---|---|
| `server_service_id` | `String` |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### SharedAccessGrant

Autoriza um projeto: conecta o servidor à rede dele sob o alias global.

```json
{"SharedAccessGrant":{"server_service_id":"svc_…","project_id":"prj_…"}}
```

| Campo | Tipo |
|---|---|
| `server_service_id` | `String` |
| `project_id` | `String` |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### SharedAccessRevoke

```json
{"SharedAccessRevoke":{"server_service_id":"svc_…","project_id":"prj_…"}}
```

| Campo | Tipo |
|---|---|
| `server_service_id` | `String` |
| `project_id` | `String` |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### ManagedDatabaseList

Databases gerenciados de um servidor compartilhado.

```json
{"ManagedDatabaseList":{"server_service_id":"svc_…"}}
```

| Campo | Tipo |
|---|---|
| `server_service_id` | `String` |

**Usado por:** GUI e web UI.

### ManagedDatabaseCreate

Cria database + usuário, autoriza o projeto e grava a env var nele.

```json
{"ManagedDatabaseCreate":{…}}
```

O valor é um `crate::ManagedDatabaseCreateReq`.

**Usado por:** GUI e web UI.

### ManagedDatabaseDelete

Remove database + usuário do servidor (**apaga os dados**).

```json
{"ManagedDatabaseDelete":{"id":"…"}}
```

| Campo | Tipo |
|---|---|
| `id` | `String` |

**Usado por:** GUI e web UI.

### ManagedDatabaseListAll

Todos os databases gerenciados (de todos os servidores).

```json
"ManagedDatabaseListAll"
```

**Usado por:** GUI e web UI.

## Migração de banco

### MigrationStart

Inicia a migração (corre em segundo plano; acompanhe com `MigrationGet`).

```json
{"MigrationStart":{…}}
```

O valor é um `crate::MigrationStartReq`.

**Usado por:** GUI e web UI.

### MigrationGet

```json
{"MigrationGet":{"id":"…"}}
```

| Campo | Tipo |
|---|---|
| `id` | `String` |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### MigrationList

```json
{"MigrationList":{"project_id":"prj_…"}}
```

| Campo | Tipo |
|---|---|
| `project_id` | `String` |

**Usado por:** GUI e web UI.

### MigrationRollback

Volta a app para o banco antigo (env var + serviços).

```json
{"MigrationRollback":{"id":"…"}}
```

| Campo | Tipo |
|---|---|
| `id` | `String` |

**Usado por:** GUI e web UI.

### MigrationDiscard

Remove o banco antigo (**apaga os dados dele**) após o período de observação.

```json
{"MigrationDiscard":{"id":"…"}}
```

| Campo | Tipo |
|---|---|
| `id` | `String` |

**Usado por:** GUI e web UI.

## Webhooks

### GetWebhookUrl

```json
{"GetWebhookUrl":{"service_id":"svc_…"}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `String` |

**Usado por:** GUI e web UI.

### RegenerateWebhookToken

```json
{"RegenerateWebhookToken":{"service_id":"svc_…"}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `String` |

**Usado por:** GUI e web UI.

## Daemon

### GetDaemonSettings

```json
"GetDaemonSettings"
```

**Usado por:** GUI e web UI.

### SetDaemonSettings

```json
{"SetDaemonSettings":{"acme_email":null,"registry_domain":null}}
```

| Campo | Tipo |
|---|---|
| `acme_email` | `Option<String>` |
| `registry_domain` | `Option<String>` |

**Usado por:** GUI e web UI.

### Ping

```json
"Ping"
```

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### DaemonStatus

```json
"DaemonStatus"
```

**Usado por:** GUI e web UI.

### Snapshot

Snapshot completo do dashboard como JSON (o mesmo que o SSE `/api/events` empurra a cada 2s). O cliente usa após uma mutação para refletir a mudança na hora, sem esperar o próximo tick. Resposta: `Snapshot(String)`.

```json
"Snapshot"
```

**Usado por:** GUI e web UI.

## Secrets

### SecretSet

```json
{"SecretSet":{"project_id":"prj_…","name":"…","value":"…"}}
```

| Campo | Tipo |
|---|---|
| `project_id` | `String` |
| `name` | `String` |
| `value` | `String` |

**Usado por:** GUI e web UI.

### SecretDelete

```json
{"SecretDelete":{"project_id":"prj_…","name":"…"}}
```

| Campo | Tipo |
|---|---|
| `project_id` | `String` |
| `name` | `String` |

**Usado por:** GUI e web UI.

### SecretList

```json
{"SecretList":{"project_id":"prj_…"}}
```

| Campo | Tipo |
|---|---|
| `project_id` | `String` |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

## Infra as Code

### ManifestApply

Reconcilia projetos/serviços a partir de manifestos YAML já interpolados pelo cliente (um documento `ProjectManifest` por string). Aditivo: cria/atualiza, nunca deleta. Não dispara deploy. Os manifestos trafegam como YAML (e não como structs) para que o daemon receba exatamente o texto do arquivo que o usuário edita; o parse fica num lugar só, com `serde_yaml`. Ver `docs/infra-as-code.md`.

```json
{"ManifestApply":{"manifests":[],"prune":false,"deploy":false}}
```

| Campo | Tipo |
|---|---|
| `manifests` | `Vec<String>` |
| `prune` | `bool`<br />Deleta serviços que existem no projeto mas não constam no manifesto. |
| `deploy` | `bool`<br />Dispara deploy dos serviços criados/alterados após sincronizar. |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### ManifestExport

Exporta o estado atual de um projeto como manifesto YAML (secrets redigidos).

```json
{"ManifestExport":{"project_id":"prj_…"}}
```

| Campo | Tipo |
|---|---|
| `project_id` | `String` |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### ManifestExportAll

Exporta TODOS os projetos+serviços num único manifesto raiz (`ServerManifest`). Todo valor de env var `Plain` é redigido para `${KEY}` (nunca o valor real no YAML); `Secret` continua como `secret:NOME`. Resposta: `ManifestBundle` (YAML + `.env` complementar com os valores reais das vars `Plain`).

```json
"ManifestExportAll"
```

**Usado por:** GUI e web UI.

### ManifestImport

Importa um manifesto raiz (`projects:`) ou de projeto único (`project:`) junto com o texto `.env` que resolve os `${VAR}` nele usados. A interpolação roda no daemon (reaproveita `ProjectManifest::interpolate`); se sobrar alguma `${VAR}` sem valor em qualquer projeto, nada é aplicado e a resposta é `MissingEnvVars`. Sem faltantes, reconcilia exatamente como `ManifestApply` (aditivo por padrão; `prune`/`deploy` com a mesma semântica).

```json
{"ManifestImport":{"yaml":"…","dotenv":"…","prune":false,"deploy":false}}
```

| Campo | Tipo |
|---|---|
| `yaml` | `String` |
| `dotenv` | `String` |
| `prune` | `bool` |
| `deploy` | `bool` |

**Usado por:** GUI e web UI.

## Copiar serviço entre servidores

### ServiceExportPlan

O que dá para levar do serviço: suas variáveis e as do projeto (com a sugestão de pré-marcação). Nunca devolve valores. Resposta: `ServiceExportPlan`.

```json
{"ServiceExportPlan":{"service_id":"svc_…"}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `String` |

**Usado por:** GUI e web UI.

### ServiceExport

Gera o pacote (YAML) do serviço. `project_env_keys` são as variáveis do projeto marcadas pelo usuário (as demais não entram no arquivo); `include_values: false` leva só os nomes (`${CHAVE}`). Resposta: `ServiceBundleYaml`.

```json
{"ServiceExport":{"service_id":"svc_…","include_values":false,"project_env_keys":[]}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `String` |
| `include_values` | `bool` |
| `project_env_keys` | `Vec<String>` |

**Usado por:** GUI e web UI.

### ServiceImport

Cria UM serviço novo a partir de um pacote, sem sobrescrever nada. `dry_run` só devolve o relatório. Resposta: `ServiceImportReport`.

```json
{"ServiceImport":{…}}
```

O valor é um `ServiceImportReq`.

**Usado por:** GUI e web UI.

## Jobs

### JobCreate

```json
{"JobCreate":{"project_id":"prj_…","trigger_service_id":"svc_…","name":"…","compose":"…","git_source":null,"main_service":"…","env_vars":[],"env_comments":[],"recurrence":null}}
```

| Campo | Tipo |
|---|---|
| `project_id` | `String` |
| `trigger_service_id` | `String` |
| `name` | `String` |
| `compose` | `String` |
| `git_source` | `Option<JobGitSource>`<br />`Some` = clona esse repo a cada execução em vez de usar `compose` (cliente manda `compose: ""` nesse caso). `#[serde(default)]`: os clientes só incluem esta chave no modo Git (Luau/JS table constructor com valor Lua/JS `nil`/`undefined` não gera a chave). |
| `main_service` | `String` |
| `env_vars` | `Vec<EnvVar>` |
| `env_comments` | `Vec<EnvComment>` |
| `recurrence` | `Option<Recurrence>` |

**Usado por:** GUI e web UI.

### JobUpdate

```json
{"JobUpdate":{"id":"…","name":"…","compose":"…","git_source":null,"main_service":"…","env_vars":[],"env_comments":[],"enabled":false,"recurrence":null}}
```

| Campo | Tipo |
|---|---|
| `id` | `String` |
| `name` | `String` |
| `compose` | `String` |
| `git_source` | `Option<JobGitSource>` |
| `main_service` | `String` |
| `env_vars` | `Vec<EnvVar>` |
| `env_comments` | `Vec<EnvComment>` |
| `enabled` | `bool` |
| `recurrence` | `Option<Recurrence>` |

**Usado por:** GUI e web UI.

### JobDelete

```json
{"JobDelete":{"id":"…"}}
```

| Campo | Tipo |
|---|---|
| `id` | `String` |

**Usado por:** GUI e web UI.

### JobList

Jobs de um único projeto (aba "Jobs" do projeto).

```json
{"JobList":{"project_id":"prj_…"}}
```

| Campo | Tipo |
|---|---|
| `project_id` | `String` |

**Usado por:** GUI.

### JobListAll

Todos os jobs, de todos os projetos (tela global da sidebar "Schedules").

```json
"JobListAll"
```

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### JobRunNow

Dispara o job imediatamente, fora do agendamento.

```json
{"JobRunNow":{"id":"…"}}
```

| Campo | Tipo |
|---|---|
| `id` | `String` |

**Usado por:** GUI e web UI.

### JobRunCancel

Cancela um `job_run` em andamento: mata o processo `docker compose up` de verdade (não só a task) — ver `AppState::active_jobs`. Erro `NotFound` se o run já não estiver mais registrado como em execução (terminou, ou o id nunca existiu).

```json
{"JobRunCancel":{"job_run_id":"…"}}
```

| Campo | Tipo |
|---|---|
| `job_run_id` | `String` |

**Usado por:** GUI e web UI.

### JobRunHistory

```json
{"JobRunHistory":{"job_id":"…","limit":20}}
```

| Campo | Tipo |
|---|---|
| `job_id` | `String` |
| `limit` | `usize` |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### GetJobLogs

```json
{"GetJobLogs":{"job_run_id":"…"}}
```

| Campo | Tipo |
|---|---|
| `job_run_id` | `String` |

**Usado por:** GUI e web UI.

### JobWarmStatus

Fonte única da verdade de "este job está quente?": confere se as imagens e o cache de build dele ainda estão no host. Resposta: `JobWarmStatus`.

```json
{"JobWarmStatus":{"job_id":"…"}}
```

| Campo | Tipo |
|---|---|
| `job_id` | `String` |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### JobWarm

Aquece o job (baixa as imagens que faltam e popula o cache de build) sem executá-lo. Já quente: não faz nada e avisa. Senão a vaga única da fila é disputada em segundo plano e o fim chega em `Event::JobWarmChanged`. `force = true` **reconstrói do zero** mesmo com o job quente: rebaixa as imagens de registry e roda o build sem cache (`--no-cache --pull`), para pegar imagem base nova ou refazer um `RUN` que buscou algo externo. Ausente no JSON (clientes antigos) vale `false`. Resposta: `JobWarmRequested`.

```json
{"JobWarm":{"job_id":"…","force":false}}
```

| Campo | Tipo |
|---|---|
| `job_id` | `String` |
| `force` | `bool` |

**Usado por:** GUI e web UI.

## Jobs (tarefas one-shot via docker-compose, agendadas ou manuais)

### ServiceWarmStatusList

O status de aquecimento (`ServiceWarmStatus`) de todos os serviços com fonte Git ou zip. Resposta: `ServiceWarmStatuses`.

```json
"ServiceWarmStatusList"
```

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### ServiceWarm

Aquece o serviço: constrói a imagem dele na vaga única da fila, para o próximo deploy achar o cache quente. Já quente: não faz nada e avisa (a menos que `force`, que reconstrói sem cache). O fim chega em `Event::ServiceWarmChanged`. Resposta: `ServiceWarmRequested`.

```json
{"ServiceWarm":{"service_id":"svc_…","force":false}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `String` |
| `force` | `bool` |

**Usado por:** GUI e web UI.

## Docker

### PruneContainers

```json
"PruneContainers"
```

**Usado por:** GUI e web UI.

### PruneVolumes

`all=true` remove volumes mesmo que não sejam anônimos (equivalente ao `docker volume prune --all`); `false` é o padrão do Docker.

```json
{"PruneVolumes":{"all":false}}
```

| Campo | Tipo |
|---|---|
| `all` | `bool` |

**Usado por:** GUI e web UI.

### PruneImages

`all=true` remove toda imagem sem uso, não só as dangling/untagged (equivalente ao `docker image prune -a`); `false` é o padrão do Docker.

```json
{"PruneImages":{"all":false}}
```

| Campo | Tipo |
|---|---|
| `all` | `bool` |

**Usado por:** GUI e web UI.

### PruneBuildCache

```json
"PruneBuildCache"
```

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### PruneNetworks

```json
"PruneNetworks"
```

**Usado por:** GUI e web UI.

### DockerCleanupConfigGet

```json
"DockerCleanupConfigGet"
```

**Usado por:** GUI e web UI.

### DockerCleanupConfigSet

```json
{"DockerCleanupConfigSet":{"config":"{…}"}}
```

| Campo | Tipo |
|---|---|
| `config` | `DockerCleanupConfig` |

**Usado por:** GUI e web UI.

### DockerCleanupRunNow

```json
"DockerCleanupRunNow"
```

**Usado por:** GUI e web UI.

### DockerImages

```json
"DockerImages"
```

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### DockerVolumes

```json
"DockerVolumes"
```

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### DockerNetworks

```json
"DockerNetworks"
```

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### DockerContainers

Todo container do host (rodando + parado), para a sub-aba Containers.

```json
"DockerContainers"
```

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### RemoveContainer

```json
{"RemoveContainer":{"id":"…"}}
```

| Campo | Tipo |
|---|---|
| `id` | `String` |

**Usado por:** GUI e web UI.

### RemoveImage

```json
{"RemoveImage":{"id":"…"}}
```

| Campo | Tipo |
|---|---|
| `id` | `String` |

**Usado por:** GUI e web UI.

### RemoveVolume

```json
{"RemoveVolume":{"name":"…"}}
```

| Campo | Tipo |
|---|---|
| `name` | `String` |

**Usado por:** GUI e web UI.

### RemoveNetwork

```json
{"RemoveNetwork":{"id":"…"}}
```

| Campo | Tipo |
|---|---|
| `id` | `String` |

**Usado por:** GUI e web UI.

### StopAllManaged

Stops every container labeled `rustploy.managed=true`, regardless of what the DB's service status currently says (more robust than looping over `Service` rows one `ServiceStop` at a time — see `Command::ServiceStop`). Scoped to rustploy's own containers; never touches unrelated containers on the same Docker host.

```json
"StopAllManaged"
```

**Usado por:** GUI e web UI.

## Ingress

### IngressRoutes

Lê a tabela de rotas do ingress (domínios + portas). Diagnóstico de 502: a rota existe? para qual `ip:porta` ela aponta?

```json
"IngressRoutes"
```

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### IngressReconcile

Recalcula as rotas a partir dos containers que realmente existem no Docker, sem redeployar. `service_id = None` varre todos os serviços. É o mesmo caminho do reconcile de boot, exposto sob demanda.

```json
{"IngressReconcile":{"service_id":null}}
```

| Campo | Tipo |
|---|---|
| `service_id` | `Option<String>` |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

## Backup de variáveis

### EnvBackupList

Lista os snapshots disponíveis (retorna Vec&lt;String&gt; com nomes de ficheiro).

```json
"EnvBackupList"
```

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### EnvBackupRestore

Restaura o snapshot com o nome dado (caminho relativo ao backup_dir).

```json
{"EnvBackupRestore":{"snapshot":"…"}}
```

| Campo | Tipo |
|---|---|
| `snapshot` | `String` |

**Usado por:** só pela API e pelo MCP (nenhuma tela).

## Fila de deploys

### DeployEngineStatus

```json
"DeployEngineStatus"
```

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### DeployQueuePromote

Move um deploy enfileirado para o início da fila ("furar fila"). Sem efeito se o id não estiver na fila (ex.: já rodando/terminado). Resposta: `Ok`.

```json
{"DeployQueuePromote":{"deployment_id":"dep_…"}}
```

| Campo | Tipo |
|---|---|
| `deployment_id` | `String` |

**Usado por:** GUI e web UI.

### DeployQueueReorder

Reordena a fila para exatamente a ordem dada (ids de deployment). Ids ausentes/desconhecidos são ignorados; enfileirados omitidos ficam ao fim preservando a ordem relativa. Usado pelo drag-and-drop da GUI. Resposta: `Ok`.

```json
{"DeployQueueReorder":{"order":[]}}
```

| Campo | Tipo |
|---|---|
| `order` | `Vec<String>` |

**Usado por:** GUI e web UI.

### DeployQueuePause

Pausa (`true`) ou retoma (`false`) a fila global. Pausada, o worker não puxa o próximo deploy; o que já estiver rodando segue até o fim. Resposta: `Ok`.

```json
{"DeployQueuePause":{"paused":false}}
```

| Campo | Tipo |
|---|---|
| `paused` | `bool` |

**Usado por:** GUI e web UI.

## Infraestrutura

### CheckUpdate

Pergunta ao GitHub se há release mais nova que o daemon. Só leitura: não instala nada. O resultado fica em cache no daemon (o GitHub limita a API anônima a 60 req/h por IP); `force` ignora o cache, mas o daemon ainda espaça consultas forçadas em ~1 min. Resposta: `UpdateInfo` (ou `Err` com `UpdateCheckFailed` se o GitHub não responder).

```json
{"CheckUpdate":{"force":false}}
```

| Campo | Tipo |
|---|---|
| `force` | `bool` |

**Usado por:** GUI e web UI.

### ApplyUpdate

Atualiza o daemon para a última release **estável** (a que o `CheckUpdate` vê): baixa o pacote e a assinatura, tira um snapshot do banco e pede a instalação ao helper root, que só instala o que estiver assinado. O daemon reinicia no meio; acompanhe com `UpdateStatus`. Recusa se há deploy em andamento ou na fila, a menos que `allow_active_deploys`. O agente MCP só pode usar se `[update] allow_agent_apply = true`. Resposta: `Ok`.

```json
{"ApplyUpdate":{"allow_active_deploys":false}}
```

| Campo | Tipo |
|---|---|
| `allow_active_deploys` | `bool` |

**Usado por:** GUI e web UI.

### UpdateStatus

Estado da atualização em curso, ou o resultado da última. Resposta: `UpdateProgress`.

```json
"UpdateStatus"
```

**Usado por:** GUI e web UI.

### UpdateRollback

Volta os binários para os do backup da última atualização (o único caminho que aceita uma versão menor). Mesma trava do agente MCP que `ApplyUpdate`. Resposta: `Ok`.

```json
"UpdateRollback"
```

**Usado por:** GUI e web UI.

## Provedores Git

### GitProviderList

```json
"GitProviderList"
```

**Usado por:** GUI e web UI.

### GitProviderCreate

```json
{"GitProviderCreate":{"kind":"{…}","name":"…","base_url":"…","auth_mode":"{…}","oauth_client_id":null,"oauth_client_secret":null,"pat":null}}
```

| Campo | Tipo |
|---|---|
| `kind` | `GitProviderKind` |
| `name` | `String` |
| `base_url` | `String` |
| `auth_mode` | `GitAuthMode` |
| `oauth_client_id` | `Option<String>` |
| `oauth_client_secret` | `Option<String>` |
| `pat` | `Option<String>`<br />Personal Access Token, when `auth_mode == Pat`. |

**Usado por:** GUI e web UI.

### GitProviderDelete

```json
{"GitProviderDelete":{"id":"…"}}
```

| Campo | Tipo |
|---|---|
| `id` | `String` |

**Usado por:** GUI e web UI.

### GitOAuthStart

Returns the Gitea authorization URL for the client to open in a browser.

```json
{"GitOAuthStart":{"provider_id":"…"}}
```

| Campo | Tipo |
|---|---|
| `provider_id` | `String` |

**Usado por:** GUI e web UI.

### GitRepoList

```json
{"GitRepoList":{"provider_id":"…"}}
```

| Campo | Tipo |
|---|---|
| `provider_id` | `String` |

**Usado por:** GUI e web UI.

### GitBranchList

```json
{"GitBranchList":{"provider_id":"…","repo_full_name":"…"}}
```

| Campo | Tipo |
|---|---|
| `provider_id` | `String` |
| `repo_full_name` | `String` |

**Usado por:** GUI e web UI.

## Assistente e templates

### WizardCatalog

```json
{"WizardCatalog":{"search":"…"}}
```

| Campo | Tipo |
|---|---|
| `search` | `String` |

**Usado por:** GUI e web UI.

### WizardCreate

```json
{"WizardCreate":{…}}
```

O valor é um `WizardCreateReq`.

**Usado por:** GUI e web UI.

## Registry embutido

### RegistryStatus

```json
"RegistryStatus"
```

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### RegistryRepoList

```json
"RegistryRepoList"
```

**Usado por:** só pela API e pelo MCP (nenhuma tela).

### RegistryTagList

```json
{"RegistryTagList":{"repo":"…"}}
```

| Campo | Tipo |
|---|---|
| `repo` | `String` |

**Usado por:** GUI e web UI.

### RegistryTagDelete

Remove a tag; se outra tag apontar pro mesmo digest (mesmo manifest), ela também é removida — mesma semântica do DELETE da OCI spec (por digest, não por tag).

```json
{"RegistryTagDelete":{"repo":"…","tag":"…"}}
```

| Campo | Tipo |
|---|---|
| `repo` | `String` |
| `tag` | `String` |

**Usado por:** GUI e web UI.

### RegistryRepoDelete

```json
{"RegistryRepoDelete":{"repo":"…"}}
```

| Campo | Tipo |
|---|---|
| `repo` | `String` |

**Usado por:** GUI e web UI.

### RegistryGc

Garbage collection do registry: remove manifests pendurados (sem tag e não referenciados por nenhum index), blobs órfãos (metadados + arquivos do CAS) e uploads abandonados há mais de 24 h. Resposta: `RegistryGcResult`.

```json
"RegistryGc"
```

**Usado por:** GUI e web UI.

### RegistryTokenCreate

Cria um token de acesso (Basic auth) — `scope` é `"pull"` ou `"push"`. Resposta traz o segredo em texto plano UMA ÚNICA VEZ.

```json
{"RegistryTokenCreate":{"name":"…","scope":"…"}}
```

| Campo | Tipo |
|---|---|
| `name` | `String` |
| `scope` | `String` |

**Usado por:** GUI e web UI.

### RegistryTokenList

```json
"RegistryTokenList"
```

**Usado por:** GUI e web UI.

### RegistryTokenRevoke

```json
{"RegistryTokenRevoke":{"name":"…"}}
```

| Campo | Tipo |
|---|---|
| `name` | `String` |

**Usado por:** GUI e web UI.
