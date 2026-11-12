---
title: Protocol commands
description: "Reference of the 147 Rustploy API commands (POST /api/rpc): name, fields, JSON example and whether the GUI or the web UI use them."
---

The whole Rustploy API goes through **one** endpoint, `POST /api/rpc`, which takes a JSON **command** and returns a **response**. This page lists the **147 commands**. The same list applies to the `rpc` tool of the [MCP](/en/agentes/ferramentas/).

## How to call

The encoding is *externally tagged*: a command **with fields** is a one-key object; a command **without fields** is the bare string. The same goes for responses.

```bash
# no fields
curl -s -H "Authorization: Bearer $TOKEN" https://SERVIDOR:9797/api/rpc -d '"ProjectList"'

# with fields
curl -s -H "Authorization: Bearer $TOKEN" https://SERVIDOR:9797/api/rpc \
  -d '{"DeployStart":{"service_id":"svc_01J…"}}'
```

A failure comes as `{"Err":{"code":"…","message":"…"}}`. The examples below use `…` and `{…}` as placeholders: replace them with real values. To learn the shape of a composite type (such as `ServiceSpec`), read an existing one with `ServiceGet` and use it as a template.

**Destructive commands do not ask for confirmation:** `ServiceDelete`, `Prune*`, `Remove*`, `StopAllManaged`, `RegistryRepoDelete`, `ManagedDatabaseDelete` and `MigrationDiscard`. And `ServiceUpdate` **replaces** the whole service; it is not a patch.

## Groups

- [Projects](#projects)
- [Services](#services)
- [Deploys](#deploys)
- [Logs and metrics](#logs-and-metrics)
- [Shared database](#shared-database)
- [Database migration](#database-migration)
- [Webhooks](#webhooks)
- [Daemon](#daemon)
- [Secrets](#secrets)
- [Infra (download)](#infra-download)
- [Copy a service between servers](#copy-a-service-between-servers)
- [Pacote de serviço (copiar um serviço entre servidores)](#pacote-de-servico-copiar-um-servico-entre-servidores)
- [Jobs](#jobs)
- [Jobs (tarefas one-shot via docker-compose, agendadas ou manuais)](#jobs-tarefas-one-shot-via-docker-compose-agendadas-ou-manuais)
- [Docker](#docker)
- [Ingress](#ingress)
- [Variables backup](#variables-backup)
- [Deploy queue](#deploy-queue)
- [Infrastructure](#infrastructure)
- [Git providers](#git-providers)
- [Wizard and templates](#wizard-and-templates)
- [Built-in registry](#built-in-registry)

## Projects

### ProjectCreate

```json
{"ProjectCreate":{"name":"…","description":null}}
```

| Field | Type |
|---|---|
| `name` | `String` |
| `description` | `Option<String>` |

**Used by:** GUI and web UI.

### ProjectDelete

```json
{"ProjectDelete":{"id":"prj_…"}}
```

| Field | Type |
|---|---|
| `id` | `String` |

**Used by:** GUI and web UI.

### ProjectUpdate

```json
{"ProjectUpdate":{"id":"prj_…","name":"…","description":null}}
```

| Field | Type |
|---|---|
| `id` | `String` |
| `name` | `String` |
| `description` | `Option<String>` |

**Used by:** GUI and web UI.

### ProjectList

```json
"ProjectList"
```

**Used by:** GUI and web UI.

### ProjectServicesReorder

Sets the display order of a project's services: `service_ids` in the desired order, saved in the project's own `project.yml` (`service_order`) and therefore in git. Ids left out stay at the end in the order they already had; an id that is not from the project, or is repeated, is an error. Response: `Ok`.

```json
{"ProjectServicesReorder":{"project_id":"prj_…","service_ids":[]}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |
| `service_ids` | `Vec<String>` |

**Used by:** GUI and web UI.

### ProjectEnvSet

```json
{"ProjectEnvSet":{"project_id":"prj_…","env_vars":[],"env_comments":[]}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |
| `env_vars` | `Vec<EnvVar>` |
| `env_comments` | `Vec<EnvComment>` |

**Used by:** GUI and web UI.

### ProjectDeploy

Deploys **every service of the project** and its dependencies, queued in the order that makes everything work (dependency waves). `skip_running: true` leaves out services that are already running. Response: `DeployBatch`.

```json
{"ProjectDeploy":{"project_id":"prj_…","skip_running":false}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |
| `skip_running` | `bool` |

**Used by:** GUI and web UI.

### ProjectDeployPlan

Dry run of `ProjectDeploy`: returns the order in which each service would be queued, without queueing anything. Response: `DeployBatch`.

```json
{"ProjectDeployPlan":{"project_id":"prj_…","skip_running":false}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |
| `skip_running` | `bool` |

**Used by:** GUI and web UI.

## Services

### ServiceCreate

```json
{"ServiceCreate":{…}}
```

The value is a `ServiceSpec`.

**Used by:** web UI.

### ServiceUpdate

```json
{"ServiceUpdate":{"id":"svc_…","spec":"{…}"}}
```

| Field | Type |
|---|---|
| `id` | `String` |
| `spec` | `ServiceSpec` |

**Used by:** GUI and web UI.

### ServiceDelete

```json
{"ServiceDelete":{"id":"svc_…"}}
```

| Field | Type |
|---|---|
| `id` | `String` |

**Used by:** GUI and web UI.

### ServiceList

```json
{"ServiceList":{"project_id":"prj_…"}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |

**Used by:** GUI.

### ServiceGet

```json
{"ServiceGet":{"id":"svc_…"}}
```

| Field | Type |
|---|---|
| `id` | `String` |

**Used by:** GUI and web UI.

### ServiceStop

```json
{"ServiceStop":{"service_id":"svc_…"}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |

**Used by:** GUI and web UI.

### ServiceReload

```json
{"ServiceReload":{"service_id":"svc_…"}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |

**Used by:** GUI and web UI.

### ServiceConnectionInfo

Host and connection URL **inside** the project Docker network (assembled in the daemon by `shared::connection`, so the GUI and the web UI never diverge).

```json
{"ServiceConnectionInfo":{"service_id":"svc_…"}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |

**Used by:** GUI and web UI.

## Deploys

### DeployStart

```json
{"DeployStart":{"service_id":"svc_…"}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |

**Used by:** GUI and web UI.

### DeployWithDependencies

Deploys the service **and its whole dependency tree** (`depends_on` plus the implicit edges from shared-database access): queues everything in dependency order and, if a dependency fails, the services that wait for it are skipped. `skip_running: true` leaves out services that are already running. Response: `DeployBatch`.

```json
{"DeployWithDependencies":{"service_id":"svc_…","skip_running":false}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |
| `skip_running` | `bool` |

**Used by:** GUI and web UI.

### DeployWithDependenciesPlan

Dry run of `DeployWithDependencies`: returns the order in which each service would be queued, without queueing anything. Response: `DeployBatch`.

```json
{"DeployWithDependenciesPlan":{"service_id":"svc_…","skip_running":false}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |
| `skip_running` | `bool` |

**Used by:** GUI and web UI.

### DeployAbort

```json
{"DeployAbort":{"deployment_id":"dep_…"}}
```

| Field | Type |
|---|---|
| `deployment_id` | `String` |

**Used by:** GUI and web UI.

### DeployRollback

```json
{"DeployRollback":{"service_id":"svc_…"}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |

**Used by:** web UI.

### DeployHistory

```json
{"DeployHistory":{"service_id":"svc_…","limit":20}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |
| `limit` | `usize` |

**Used by:** GUI and web UI.

### DeployDelete

```json
{"DeployDelete":{"deployment_id":"dep_…"}}
```

| Field | Type |
|---|---|
| `deployment_id` | `String` |

**Used by:** GUI and web UI.

### RecentDeployments

```json
{"RecentDeployments":{"limit":20}}
```

| Field | Type |
|---|---|
| `limit` | `usize` |

**Used by:** only by the API and the MCP (no screen).

### GetBuildLogs

```json
{"GetBuildLogs":{"deployment_id":"dep_…"}}
```

| Field | Type |
|---|---|
| `deployment_id` | `String` |

**Used by:** GUI and web UI.

## Logs and metrics

### LogsGet

```json
{"LogsGet":{"service_id":"svc_…","tail":20}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |
| `tail` | `usize` |

**Used by:** GUI and web UI.

### LogsHistory

Persisted runtime log of the service (survives the container swap on deploy and rollbacks). Returns up to `limit` lines in chronological order, older than `before` (or the most recent ones); to page backwards, repeat with the response `next_before`. `container_id` filters by one container (short id); `container_ids` by several at once (one execution with replicas). Does not cover Compose services (live only, via `LogsGet`).

```json
{"LogsHistory":{"service_id":"svc_…","before":null,"limit":20,"container_id":null,"container_ids":[]}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |
| `before` | `Option<chrono::DateTime<chrono::Utc>>` |
| `limit` | `usize` |
| `container_id` | `Option<String>` |
| `container_ids` | `Vec<String>`<br />Vários containers de uma vez (uma execução com réplicas); soma-se a `container_id`. Vazio (e sem `container_id`) = o serviço inteiro. |

**Used by:** GUI and web UI.

### LogsExecutions

The executions (one container = one execution) with a stored log, newest first: start/end, deploy, image, lines, bytes, whether it is the current one and the deploy outcome. Response: `LogsExecutions`. Does not cover Compose services.

```json
{"LogsExecutions":{"service_id":"svc_…"}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |

**Used by:** GUI and web UI.

### LogsExecutionDelete

Deletes the stored log of executions (irreversible; several at once). The current execution is refused (`ExecutionRunning`); an unknown id is ignored. Response: `LogsExecutionsDeleted`.

```json
{"LogsExecutionDelete":{"service_id":"svc_…","container_ids":[]}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |
| `container_ids` | `Vec<String>` |

**Used by:** GUI and web UI.

### LogsSubscribe

```json
{"LogsSubscribe":{"service_id":"svc_…","tail":20}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |
| `tail` | `usize` |

**Used by:** only by the API and the MCP (no screen).

### LogsUnsubscribe

```json
{"LogsUnsubscribe":{"service_id":"svc_…"}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |

**Used by:** only by the API and the MCP (no screen).

### MetricsSubscribe

```json
{"MetricsSubscribe":{"service_id":"svc_…"}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |

**Used by:** only by the API and the MCP (no screen).

### MetricsUnsubscribe

```json
{"MetricsUnsubscribe":{"service_id":"svc_…"}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |

**Used by:** only by the API and the MCP (no screen).

## Shared database

### SharedAccessList

Projects authorized to reach a shared database server.

```json
{"SharedAccessList":{"server_service_id":"svc_…"}}
```

| Field | Type |
|---|---|
| `server_service_id` | `String` |

**Used by:** only by the API and the MCP (no screen).

### SharedAccessGrant

Authorizes a project: connects the server to its network under the global alias.

```json
{"SharedAccessGrant":{"server_service_id":"svc_…","project_id":"prj_…"}}
```

| Field | Type |
|---|---|
| `server_service_id` | `String` |
| `project_id` | `String` |

**Used by:** only by the API and the MCP (no screen).

### SharedAccessRevoke

```json
{"SharedAccessRevoke":{"server_service_id":"svc_…","project_id":"prj_…"}}
```

| Field | Type |
|---|---|
| `server_service_id` | `String` |
| `project_id` | `String` |

**Used by:** only by the API and the MCP (no screen).

### ManagedDatabaseList

Managed databases of a shared server.

```json
{"ManagedDatabaseList":{"server_service_id":"svc_…"}}
```

| Field | Type |
|---|---|
| `server_service_id` | `String` |

**Used by:** GUI and web UI.

### ManagedDatabaseCreate

Creates a database + user, authorizes the project and writes the env var into it.

```json
{"ManagedDatabaseCreate":{…}}
```

The value is a `crate::ManagedDatabaseCreateReq`.

**Used by:** GUI and web UI.

### ManagedDatabaseDelete

Removes the database + user from the server (**deletes the data**).

```json
{"ManagedDatabaseDelete":{"id":"…"}}
```

| Field | Type |
|---|---|
| `id` | `String` |

**Used by:** GUI and web UI.

### ManagedDatabaseListAll

All managed databases (from all servers).

```json
"ManagedDatabaseListAll"
```

**Used by:** GUI and web UI.

## Database migration

### MigrationStart

Starts the migration (runs in the background; follow it with `MigrationGet`).

```json
{"MigrationStart":{…}}
```

The value is a `crate::MigrationStartReq`.

**Used by:** GUI and web UI.

### MigrationGet

```json
{"MigrationGet":{"id":"…"}}
```

| Field | Type |
|---|---|
| `id` | `String` |

**Used by:** only by the API and the MCP (no screen).

### MigrationList

```json
{"MigrationList":{"project_id":"prj_…"}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |

**Used by:** GUI and web UI.

### MigrationRollback

Points the app back to the old database (env var + services).

```json
{"MigrationRollback":{"id":"…"}}
```

| Field | Type |
|---|---|
| `id` | `String` |

**Used by:** GUI and web UI.

### MigrationDiscard

Removes the old database (**deletes its data**) after the observation period.

```json
{"MigrationDiscard":{"id":"…"}}
```

| Field | Type |
|---|---|
| `id` | `String` |

**Used by:** GUI and web UI.

## Webhooks

### GetWebhookUrl

```json
{"GetWebhookUrl":{"service_id":"svc_…"}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |

**Used by:** GUI and web UI.

### RegenerateWebhookToken

```json
{"RegenerateWebhookToken":{"service_id":"svc_…"}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |

**Used by:** GUI and web UI.

## Daemon

### GetDaemonSettings

```json
"GetDaemonSettings"
```

**Used by:** GUI and web UI.

### SetDaemonSettings

```json
{"SetDaemonSettings":{"acme_email":null,"registry_domain":null}}
```

| Field | Type |
|---|---|
| `acme_email` | `Option<String>` |
| `registry_domain` | `Option<String>` |

**Used by:** GUI and web UI.

### Ping

```json
"Ping"
```

**Used by:** only by the API and the MCP (no screen).

### DaemonStatus

```json
"DaemonStatus"
```

**Used by:** GUI and web UI.

### Snapshot

Full dashboard snapshot as JSON (the same one the SSE `/api/events` pushes every 2s). The client uses it after a mutation to reflect the change right away, without waiting for the next tick. Response: `Snapshot(String)`.

```json
"Snapshot"
```

**Used by:** GUI and web UI.

## Secrets

### SecretSet

```json
{"SecretSet":{"project_id":"prj_…","service_id":null,"job_id":null,"name":"…","value":"…"}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |
| `service_id` | `Option<String>` |
| `job_id` | `Option<String>`<br />Escopo de **job** (`Some` = secret/env daquele job; exige `service_id: None`). Na resolução de um secret do job vale o do job, depois o do serviço gatilho, depois o do projeto. |
| `name` | `String` |
| `value` | `String` |

**Used by:** GUI and web UI.

### SecretDelete

```json
{"SecretDelete":{"project_id":"prj_…","service_id":null,"job_id":null,"name":"…"}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |
| `service_id` | `Option<String>` |
| `job_id` | `Option<String>`<br />Escopo de **job** (`Some` = secret/env daquele job; exige `service_id: None`). Na resolução de um secret do job vale o do job, depois o do serviço gatilho, depois o do projeto. |
| `name` | `String` |

**Used by:** GUI and web UI.

### SecretList

```json
{"SecretList":{"project_id":"prj_…","service_id":null,"job_id":null}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |
| `service_id` | `Option<String>` |
| `job_id` | `Option<String>`<br />Escopo de **job** (`Some` = secret/env daquele job; exige `service_id: None`). Na resolução de um secret do job vale o do job, depois o do serviço gatilho, depois o do projeto. |

**Used by:** GUI and web UI.

### SecretReveal

Devolve o **valor** de um secret (botão "ver valor"). Fica fora do MCP/`rpc` do agente e grava uma linha de auditoria (quem, qual secret, quando — nunca o valor).

```json
{"SecretReveal":{"project_id":"prj_…","service_id":null,"job_id":null,"name":"…"}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |
| `service_id` | `Option<String>` |
| `job_id` | `Option<String>`<br />Escopo de **job** (`Some` = secret/env daquele job; exige `service_id: None`). Na resolução de um secret do job vale o do job, depois o do serviço gatilho, depois o do projeto. |
| `name` | `String` |

**Used by:** GUI and web UI.

### InfraAudit

Lista o que está em claro (ou parece estar) no estado de infra — a trava para ligar a sincronização com git, e o guia de "o que ainda falta mover para secret". Nunca devolve valores.

```json
"InfraAudit"
```

**Used by:** only by the API and the MCP (no screen).

### StateGitStatus

Situação da sincronização do estado de infra com o git.

```json
"StateGitStatus"
```

**Used by:** only by the API and the MCP (no screen).

### StateGitConfigure

Liga/desliga/configura a sincronização. `mode`: `off` | `commit` | `sync`. Ligar (`commit`/`sync`) é **recusado** enquanto houver valor em claro no estado (ver `InfraAudit`). `remote` só em `https://` (a credencial vem do `provider_id`) ou `file://` (testes/cópia local).

```json
{"StateGitConfigure":{"mode":"…","remote":null,"branch":null,"provider_id":null}}
```

| Field | Type |
|---|---|
| `mode` | `String` |
| `remote` | `Option<String>` |
| `branch` | `Option<String>` |
| `provider_id` | `Option<String>` |

**Used by:** GUI and web UI.

### StateGitSyncNow

"Sincronizar agora": faz o commit pendente e, em `sync`, o `fetch`, a aplicação do que veio de fora e o `push`.

```json
"StateGitSyncNow"
```

**Used by:** GUI and web UI.

### StateGitResume

Retoma a sincronização pausada por histórico divergido (depois de resolver no repositório).

```json
"StateGitResume"
```

**Used by:** GUI and web UI.

### StateGitResolve

Resolve a divergência **sem usar o terminal**: descarta um dos lados, com cópia de segurança do que for descartado (ver `StateGitResolveChoice`). Só vale com a sincronização pausada.

```json
{"StateGitResolve":{"choice":"{…}"}}
```

| Field | Type |
|---|---|
| `choice` | `StateGitResolveChoice` |

**Used by:** GUI and web UI.

### StateGitDismissRemoval

Esquece uma marca de "removido no git" (`id` vem em `StateGitStatus.removed_in_git`).

```json
{"StateGitDismissRemoval":{"id":"…"}}
```

| Field | Type |
|---|---|
| `id` | `String` |

**Used by:** GUI and web UI.

### InfraAuditAllow

Marca (ou desmarca) uma **suspeita** da auditoria como "não é segredo", para não travar o git. Certezas (senha de banco, webhook…) não podem ser liberadas.

```json
{"InfraAuditAllow":{"project":"…","scope":"…","what":"…","allowed":false}}
```

| Field | Type |
|---|---|
| `project` | `String` |
| `scope` | `String` |
| `what` | `String` |
| `allowed` | `bool` |

**Used by:** GUI and web UI.

### StopContainer

Para um container (`id` completo, vindo de `DockerContainers`). **Recusa** container que ainda pertence a um serviço do estado: esses se param pelo serviço. Serve ao container órfão ("removido no git"): parar aqui e depois `RemoveContainer`.

```json
{"StopContainer":{"id":"…"}}
```

| Field | Type |
|---|---|
| `id` | `String` |

**Used by:** GUI and web UI.

### SecretMove

Moves an item between env and secret, or between scopes. Always atomic: either everything changes or nothing does. Fails if the destination already has an item with the same name. The agent (MCP) cannot use `SecretToEnv`, which would expose the value.

```json
{"SecretMove":{"project_id":"prj_…","service_id":null,"job_id":null,"name":"…","op":"{…}"}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |
| `service_id` | `Option<String>`<br />Depende da operação (ver `SecretMoveOp`). |
| `job_id` | `Option<String>`<br />Escopo de **job** (`Some` = secret/env daquele job; exige `service_id: None`). Na resolução de um secret do job vale o do job, depois o do serviço gatilho, depois o do projeto. |
| `name` | `String`<br />Nome do secret — ou a chave da env, em `SecretMoveOp::EnvToSecret`. |
| `op` | `SecretMoveOp` |

**Used by:** GUI and web UI.

### EnvKeyRename

Renames the **key** of an env var (project-wide, or a service's if `service_id` is given) keeping its value — `Plain` or `Secret` — without the value passing through the caller, and carrying along the `.env` editor comments anchored to it. Fails if `from` does not exist or `to` already exists in the scope. Response: `Ok`.

```json
{"EnvKeyRename":{"project_id":"prj_…","service_id":null,"job_id":null,"from":"…","to":"…"}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |
| `service_id` | `Option<String>` |
| `job_id` | `Option<String>`<br />Escopo de **job** (`Some` = secret/env daquele job; exige `service_id: None`). Na resolução de um secret do job vale o do job, depois o do serviço gatilho, depois o do projeto. |
| `from` | `String` |
| `to` | `String` |

**Used by:** GUI and web UI.

### EnvValueSet

Changes only the **value** of an existing env var (project-wide, or a service's if `service_id` is given), at the same position in the list — an "in place" edit, without resending the whole list like `ProjectEnvSet`/`ServiceUpdate` (which replace everything and lose what the client does not know). `value` is `{"Plain":"…"}` or `{"Secret":"NAME"}`; a `Secret` must exist in the scope (the service's or, falling back, the project's). Fails if the key does not exist, if the value is the `***` mask (a copy from a screen that hid the secret) or if the secret does not exist. Response: `Ok`.

```json
{"EnvValueSet":{"project_id":"prj_…","service_id":null,"job_id":null,"key":"…","value":"{…}"}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |
| `service_id` | `Option<String>` |
| `job_id` | `Option<String>`<br />Escopo de **job** (`Some` = secret/env daquele job; exige `service_id: None`). Na resolução de um secret do job vale o do job, depois o do serviço gatilho, depois o do projeto. |
| `key` | `String` |
| `value` | `EnvVarValue` |

**Used by:** GUI and web UI.

### SecretRename

Renames a **secret** (project-wide, or a service's if `service_id` is given) and, in the same transaction, repoints every `Secret(from)` env var that resolved to it. The encrypted value is not read. Fails if `from` does not exist or `to` already exists in the scope. Response: `Ok`.

```json
{"SecretRename":{"project_id":"prj_…","service_id":null,"job_id":null,"from":"…","to":"…"}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |
| `service_id` | `Option<String>` |
| `job_id` | `Option<String>`<br />Escopo de **job** (`Some` = secret/env daquele job; exige `service_id: None`). Na resolução de um secret do job vale o do job, depois o do serviço gatilho, depois o do projeto. |
| `from` | `String` |
| `to` | `String` |

**Used by:** GUI and web UI.

## Infra (download)

### InfraDownload

Downloads the infra: the same files git sync writes to the repository (`settings.yml`, `providers.yml`, `projects/<id>/project.yml`), with secrets as `ENC[age:…]`. Refused while there is a plaintext value that would block the git commit (see `InfraAudit`). Response: `InfraFiles`.

```json
"InfraDownload"
```

**Used by:** GUI and web UI.

## Copy a service between servers

### ServiceExportPlan

What can be taken from the service: its variables and the project ones (with the suggested pre-selection). Never returns values. Response: `ServiceExportPlan`.

```json
{"ServiceExportPlan":{"service_id":"svc_…"}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |

**Used by:** GUI and web UI.

### ServiceExport

Generates the service package (YAML). `project_env_keys` are the project variables the user ticked (the others stay out of the file); `include_values: false` carries only the names (`${KEY}`). Response: `ServiceBundleYaml`.

```json
{"ServiceExport":{"service_id":"svc_…","include_values":false,"project_env_keys":[]}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |
| `include_values` | `bool` |
| `project_env_keys` | `Vec<String>` |

**Used by:** GUI and web UI.

### ServiceImport

Creates ONE new service from a package, overwriting nothing. `dry_run` only returns the report. Response: `ServiceImportReport`.

```json
{"ServiceImport":{…}}
```

The value is a `ServiceImportReq`.

**Used by:** GUI and web UI.

## Pacote de serviço (copiar um serviço entre servidores)

### ServiceDataPlan

Dados do serviço (volumes): o que um export levaria. Só olha, não muda nada. Os bytes vão por `GET /api/services/<id>/data/export` e `POST /api/services/<id>/data/import`. Resposta: `ServiceDataPlan`.

```json
{"ServiceDataPlan":{"service_id":"svc_…"}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |

**Used by:** GUI and web UI.

### BackupDestinationGet

O destino S3 dos backups de dados (sem a chave secreta). Resposta: `BackupDestination`.

```json
"BackupDestinationGet"
```

**Used by:** GUI and web UI.

### BackupDestinationSet

Grava o destino S3. `secret_key: None` mantém a chave já gravada. Confere os campos, mas não conecta (use `BackupDestinationTest`). Resposta: `BackupDestination`.

```json
{"BackupDestinationSet":{"destination":"{…}"}}
```

| Field | Type |
|---|---|
| `destination` | `BackupDestination` |

**Used by:** GUI and web UI.

### BackupDestinationClear

Apaga o destino gravado (os backups já enviados ficam no S3). Resposta: `Ok`.

```json
"BackupDestinationClear"
```

**Used by:** GUI and web UI.

### BackupDestinationTest

Testa a conexão: grava, lê e apaga um objeto pequeno. `destination: None` testa o gravado; com valor, testa o rascunho da tela (e `secret_key: None` usa a chave gravada). Resposta: `Ok`.

```json
{"BackupDestinationTest":{"destination":null}}
```

| Field | Type |
|---|---|
| `destination` | `Option<BackupDestination>` |

**Used by:** GUI and web UI.

### ServiceBackupList

Os backups de dados de um serviço no S3 e a última operação. Resposta: `ServiceBackups`.

```json
{"ServiceBackupList":{"service_id":"svc_…"}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |

**Used by:** GUI and web UI.

### ServiceBackupNow

Faz o backup dos dados do serviço para o S3 **em segundo plano** (volumes e bancos, cifrado com a chave de recuperação). Responde `Ok` assim que começa; o andamento e o resultado vêm em `ServiceBackupList(.last_run)`. `stop`: parar o serviço durante a cópia de volume (padrão `true`; banco não para). `keep`: depois de enviar, manter só os `keep` mais novos.

```json
{"ServiceBackupNow":{"service_id":"svc_…","stop":false,"keep":null}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |
| `stop` | `bool` |
| `keep` | `Option<u32>` |

**Used by:** GUI and web UI.

### ServiceBackupRestore

Restaura um backup do S3 **substituindo** os dados atuais do serviço, em segundo plano (o mesmo caminho e a mesma rede de segurança da importação). Exige `confirm: true`. Resposta: `Ok`.

```json
{"ServiceBackupRestore":{"service_id":"svc_…","key":"…","confirm":false}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |
| `key` | `String` |
| `confirm` | `bool` |

**Used by:** GUI and web UI.

### ServiceBackupDelete

Apaga um backup do S3. Resposta: `Ok`.

```json
{"ServiceBackupDelete":{"service_id":"svc_…","key":"…"}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |
| `key` | `String` |

**Used by:** GUI and web UI.

### ServiceBackupPolicySet

Grava (ou, com `None`, apaga) a política de backup automático do serviço. Ligar exige o destino S3 configurado e a chave de recuperação. Resposta: `ServiceBackups` (já com a política e o próximo disparo).

```json
{"ServiceBackupPolicySet":{"service_id":"svc_…","policy":null}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |
| `policy` | `Option<BackupPolicy>` |

**Used by:** GUI and web UI.

### ServerRecoverStart

**Recuperar este servidor** (passo 1): num servidor **limpo**, traz a infra do repositório git e recifra os segredos para este servidor, **sem** mexer nos dados nem subir nada. A chave privada de recuperação fica só na memória (até `ServerRecoverRun`, `ServerRecoverCancel` ou 1 hora). Resposta: `ServerRecover` (`phase: "ready"`, com o que foi achado e os backups por serviço).

```json
{"ServerRecoverStart":{"remote":"…","token":"…","branch":null,"recovery_key":"…"}}
```

| Field | Type |
|---|---|
| `remote` | `String`<br />Endereço do repositório da infra: `https://…`, `file://…` ou um caminho absoluto. |
| `token` | `String`<br />Token de acesso ao repositório (vira um provider git deste servidor). Dispensável num remoto local (`file://…` ou caminho absoluto). |
| `branch` | `Option<String>` |
| `recovery_key` | `String`<br />A chave privada de recuperação (`AGE-SECRET-KEY-1…`). |

**Used by:** GUI and web UI.

### ServerRecoverStatus

Em que ponto a recuperação está. Resposta: `ServerRecover`.

```json
"ServerRecoverStatus"
```

**Used by:** GUI and web UI.

### ServerRecoverRun

Recuperação (passo 2): restaura os dados e sobe cada serviço na ordem das dependências (volumes antes de subir, bancos depois). Em segundo plano; acompanhe por `ServerRecoverStatus`. Resposta: `Ok`.

```json
"ServerRecoverRun"
```

**Used by:** GUI and web UI.

### ServerRecoverCancel

Desiste: esquece a chave de recuperação da memória. A infra restaurada continua no servidor. Resposta: `ServerRecover`.

```json
"ServerRecoverCancel"
```

**Used by:** GUI and web UI.

## Jobs

### JobCreate

```json
{"JobCreate":{"project_id":"prj_…","trigger_service_id":"svc_…","name":"…","compose":"…","git_source":null,"main_service":"…","env_vars":[],"env_comments":[],"recurrence":null}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |
| `trigger_service_id` | `String` |
| `name` | `String` |
| `compose` | `String` |
| `git_source` | `Option<JobGitSource>`<br />`Some` = clones this repo on every run instead of using `compose` (the client sends `compose: ""` in that case). `#[serde(default)]`: clients only include this key in Git mode (a Luau/JS table constructor with a Lua/JS `nil`/`undefined` value does not produce the key). |
| `main_service` | `String` |
| `env_vars` | `Vec<EnvVar>` |
| `env_comments` | `Vec<EnvComment>` |
| `recurrence` | `Option<Recurrence>` |

**Used by:** GUI and web UI.

### JobUpdate

```json
{"JobUpdate":{"id":"…","name":"…","compose":"…","git_source":null,"main_service":"…","env_vars":[],"env_comments":[],"enabled":false,"recurrence":null}}
```

| Field | Type |
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

**Used by:** GUI and web UI.

### JobDelete

```json
{"JobDelete":{"id":"…"}}
```

| Field | Type |
|---|---|
| `id` | `String` |

**Used by:** GUI and web UI.

### JobList

Jobs of a single project (the project "Jobs" tab).

```json
{"JobList":{"project_id":"prj_…"}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |

**Used by:** GUI.

### JobListAll

All jobs, from all projects (the global "Schedules" screen in the sidebar).

```json
"JobListAll"
```

**Used by:** only by the API and the MCP (no screen).

### JobRunNow

Runs the job immediately, outside its schedule.

```json
{"JobRunNow":{"id":"…"}}
```

| Field | Type |
|---|---|
| `id` | `String` |

**Used by:** GUI and web UI.

### JobRunCancel

Cancels a running `job_run`: really kills the `docker compose up` process (not just the task) — see `AppState::active_jobs`. `NotFound` error if the run is no longer registered as running (it finished, or the id never existed).

```json
{"JobRunCancel":{"job_run_id":"…"}}
```

| Field | Type |
|---|---|
| `job_run_id` | `String` |

**Used by:** GUI and web UI.

### JobRunHistory

```json
{"JobRunHistory":{"job_id":"…","limit":20}}
```

| Field | Type |
|---|---|
| `job_id` | `String` |
| `limit` | `usize` |

**Used by:** only by the API and the MCP (no screen).

### GetJobLogs

```json
{"GetJobLogs":{"job_run_id":"…"}}
```

| Field | Type |
|---|---|
| `job_run_id` | `String` |

**Used by:** GUI and web UI.

### JobWarmStatus

Single source of truth for "is this job warm?": checks whether its images and build cache are still on the host. Response: `JobWarmStatus`.

```json
{"JobWarmStatus":{"job_id":"…"}}
```

| Field | Type |
|---|---|
| `job_id` | `String` |

**Used by:** only by the API and the MCP (no screen).

### JobWarm

Warms the job (pulls the missing images and fills the build cache) without running it. If already warm: does nothing and says so. Otherwise the single queue slot is contended in the background and the end arrives in `Event::JobWarmChanged`. Response: `JobWarmRequested`.

```json
{"JobWarm":{"job_id":"…","force":false}}
```

| Field | Type |
|---|---|
| `job_id` | `String` |
| `force` | `bool` |

**Used by:** GUI and web UI.

## Jobs (tarefas one-shot via docker-compose, agendadas ou manuais)

### ServiceWarmStatusList

The warm-up status (`ServiceWarmStatus`) of every service with a Git or zip source. Response: `ServiceWarmStatuses`.

```json
"ServiceWarmStatusList"
```

**Used by:** only by the API and the MCP (no screen).

### ServiceWarm

Warms the service: builds its image in the single queue slot so the next deploy finds a warm cache. If already warm: does nothing and says so (unless `force`, which rebuilds without cache). The end arrives in `Event::ServiceWarmChanged`. Response: `ServiceWarmRequested`.

```json
{"ServiceWarm":{"service_id":"svc_…","force":false}}
```

| Field | Type |
|---|---|
| `service_id` | `String` |
| `force` | `bool` |

**Used by:** GUI and web UI.

## Docker

### PruneContainers

```json
"PruneContainers"
```

**Used by:** GUI and web UI.

### PruneVolumes

`all=true` removes volumes even if they are not anonymous (equivalent to `docker volume prune --all`); `false` is the Docker default.

```json
{"PruneVolumes":{"all":false}}
```

| Field | Type |
|---|---|
| `all` | `bool` |

**Used by:** GUI and web UI.

### PruneImages

`all=true` removes every unused image, not just dangling/untagged ones (equivalent to `docker image prune -a`); `false` is the Docker default.

```json
{"PruneImages":{"all":false}}
```

| Field | Type |
|---|---|
| `all` | `bool` |

**Used by:** GUI and web UI.

### PruneBuildCache

```json
"PruneBuildCache"
```

**Used by:** only by the API and the MCP (no screen).

### PruneNetworks

```json
"PruneNetworks"
```

**Used by:** GUI and web UI.

### DockerCleanupConfigGet

```json
"DockerCleanupConfigGet"
```

**Used by:** GUI and web UI.

### DockerCleanupConfigSet

```json
{"DockerCleanupConfigSet":{"config":"{…}"}}
```

| Field | Type |
|---|---|
| `config` | `DockerCleanupConfig` |

**Used by:** GUI and web UI.

### DockerCleanupRunNow

```json
"DockerCleanupRunNow"
```

**Used by:** GUI and web UI.

### DockerImages

```json
"DockerImages"
```

**Used by:** only by the API and the MCP (no screen).

### DockerVolumes

```json
"DockerVolumes"
```

**Used by:** only by the API and the MCP (no screen).

### DockerNetworks

```json
"DockerNetworks"
```

**Used by:** only by the API and the MCP (no screen).

### DockerContainers

Every container on the host (running + stopped), for the Containers sub-tab.

```json
"DockerContainers"
```

**Used by:** only by the API and the MCP (no screen).

### RemoveContainer

```json
{"RemoveContainer":{"id":"…"}}
```

| Field | Type |
|---|---|
| `id` | `String` |

**Used by:** GUI and web UI.

### RemoveImage

```json
{"RemoveImage":{"id":"…"}}
```

| Field | Type |
|---|---|
| `id` | `String` |

**Used by:** GUI and web UI.

### RemoveVolume

```json
{"RemoveVolume":{"name":"…"}}
```

| Field | Type |
|---|---|
| `name` | `String` |

**Used by:** GUI and web UI.

### RemoveNetwork

```json
{"RemoveNetwork":{"id":"…"}}
```

| Field | Type |
|---|---|
| `id` | `String` |

**Used by:** GUI and web UI.

### StopAllManaged

Stops every container labeled `rustploy.managed=true`, regardless of what the DB's service status currently says (more robust than looping over `Service` rows one `ServiceStop` at a time — see `Command::ServiceStop`). Scoped to rustploy's own containers; never touches unrelated containers on the same Docker host.

```json
"StopAllManaged"
```

**Used by:** GUI and web UI.

## Ingress

### IngressRoutes

Reads the ingress route table (domains + ports). 502 diagnosis: does the route exist? Which `ip:port` does it point to?

```json
"IngressRoutes"
```

**Used by:** only by the API and the MCP (no screen).

### IngressReconcile

Recomputes the routes from the containers that actually exist in Docker, without redeploying. `service_id = None` sweeps all services. It is the same path as the boot reconcile, exposed on demand.

```json
{"IngressReconcile":{"service_id":null}}
```

| Field | Type |
|---|---|
| `service_id` | `Option<String>` |

**Used by:** only by the API and the MCP (no screen).

## Variables backup

### EnvBackupList

Lists the available snapshots (returns Vec&lt;String&gt; with file names).

```json
"EnvBackupList"
```

**Used by:** only by the API and the MCP (no screen).

### EnvBackupRestore

Restores the snapshot with the given name (path relative to backup_dir).

```json
{"EnvBackupRestore":{"snapshot":"…"}}
```

| Field | Type |
|---|---|
| `snapshot` | `String` |

**Used by:** only by the API and the MCP (no screen).

## Deploy queue

### DeployEngineStatus

```json
"DeployEngineStatus"
```

**Used by:** only by the API and the MCP (no screen).

### DeployQueuePromote

Moves a queued deploy to the front of the queue ("jump the queue"). No effect if the id is not in the queue (e.g. already running/finished). Response: `Ok`.

```json
{"DeployQueuePromote":{"deployment_id":"dep_…"}}
```

| Field | Type |
|---|---|
| `deployment_id` | `String` |

**Used by:** GUI and web UI.

### DeployQueueReorder

Reorders the queue to exactly the given order (deployment ids). Missing/unknown ids are ignored; omitted queued items go to the end keeping their relative order. Used by the GUI drag-and-drop. Response: `Ok`.

```json
{"DeployQueueReorder":{"order":[]}}
```

| Field | Type |
|---|---|
| `order` | `Vec<String>` |

**Used by:** GUI and web UI.

### DeployQueuePause

Pauses (`true`) or resumes (`false`) the global queue. While paused, the worker does not pull the next deploy; whatever is already running goes on to the end. Response: `Ok`.

```json
{"DeployQueuePause":{"paused":false}}
```

| Field | Type |
|---|---|
| `paused` | `bool` |

**Used by:** GUI and web UI.

## Infrastructure

### CheckUpdate

Pergunta ao GitHub se há release mais nova que o daemon. Só leitura: não instala nada. O resultado fica em cache no daemon (o GitHub limita a API anônima a 60 req/h por IP); `force` ignora o cache, mas o daemon ainda espaça consultas forçadas em ~1 min. Resposta: `UpdateInfo` (ou `Err` com `UpdateCheckFailed` se o GitHub não responder).

```json
{"CheckUpdate":{"force":false}}
```

| Field | Type |
|---|---|
| `force` | `bool` |

**Used by:** GUI and web UI.

### ApplyUpdate

Atualiza o daemon para a última release **estável** (a que o `CheckUpdate` vê): baixa o pacote e a assinatura, tira um snapshot do banco e pede a instalação ao helper root, que só instala o que estiver assinado. O daemon reinicia no meio; acompanhe com `UpdateStatus`. Recusa se há deploy em andamento ou na fila, a menos que `allow_active_deploys`. O agente MCP só pode usar se `[update] allow_agent_apply = true`. Resposta: `Ok`.

```json
{"ApplyUpdate":{"allow_active_deploys":false}}
```

| Field | Type |
|---|---|
| `allow_active_deploys` | `bool` |

**Used by:** GUI and web UI.

### UpdateStatus

Estado da atualização em curso, ou o resultado da última. Resposta: `UpdateProgress`.

```json
"UpdateStatus"
```

**Used by:** GUI and web UI.

### UpdateRollback

Volta os binários para os do backup da última atualização (o único caminho que aceita uma versão menor). Mesma trava do agente MCP que `ApplyUpdate`. Resposta: `Ok`.

```json
"UpdateRollback"
```

**Used by:** GUI and web UI.

## Git providers

### GitProviderList

```json
"GitProviderList"
```

**Used by:** GUI and web UI.

### GitProviderCreate

```json
{"GitProviderCreate":{"kind":"{…}","name":"…","base_url":"…","auth_mode":"{…}","oauth_client_id":null,"oauth_client_secret":null,"pat":null}}
```

| Field | Type |
|---|---|
| `kind` | `GitProviderKind` |
| `name` | `String` |
| `base_url` | `String` |
| `auth_mode` | `GitAuthMode` |
| `oauth_client_id` | `Option<String>` |
| `oauth_client_secret` | `Option<String>` |
| `pat` | `Option<String>`<br />Personal Access Token, when `auth_mode == Pat`. |

**Used by:** GUI and web UI.

### GitProviderDelete

```json
{"GitProviderDelete":{"id":"…"}}
```

| Field | Type |
|---|---|
| `id` | `String` |

**Used by:** GUI and web UI.

### GitOAuthStart

Returns the Gitea authorization URL for the client to open in a browser.

```json
{"GitOAuthStart":{"provider_id":"…"}}
```

| Field | Type |
|---|---|
| `provider_id` | `String` |

**Used by:** GUI and web UI.

### GitRepoList

```json
{"GitRepoList":{"provider_id":"…"}}
```

| Field | Type |
|---|---|
| `provider_id` | `String` |

**Used by:** GUI and web UI.

### GitBranchList

```json
{"GitBranchList":{"provider_id":"…","repo_full_name":"…"}}
```

| Field | Type |
|---|---|
| `provider_id` | `String` |
| `repo_full_name` | `String` |

**Used by:** GUI and web UI.

## Wizard and templates

### WizardCatalog

```json
{"WizardCatalog":{"search":"…"}}
```

| Field | Type |
|---|---|
| `search` | `String` |

**Used by:** GUI and web UI.

### WizardCreate

```json
{"WizardCreate":{…}}
```

The value is a `WizardCreateReq`.

**Used by:** GUI and web UI.

## Built-in registry

### RegistryStatus

```json
"RegistryStatus"
```

**Used by:** only by the API and the MCP (no screen).

### RegistryRepoList

```json
"RegistryRepoList"
```

**Used by:** only by the API and the MCP (no screen).

### RegistryTagList

```json
{"RegistryTagList":{"repo":"…"}}
```

| Field | Type |
|---|---|
| `repo` | `String` |

**Used by:** GUI and web UI.

### RegistryTagDelete

Removes the tag; if another tag points to the same digest (same manifest), it is removed too — same semantics as the OCI spec DELETE (by digest, not by tag).

```json
{"RegistryTagDelete":{"repo":"…","tag":"…"}}
```

| Field | Type |
|---|---|
| `repo` | `String` |
| `tag` | `String` |

**Used by:** GUI and web UI.

### RegistryRepoDelete

```json
{"RegistryRepoDelete":{"repo":"…"}}
```

| Field | Type |
|---|---|
| `repo` | `String` |

**Used by:** GUI and web UI.

### RegistryGc

Registry garbage collection: removes dangling manifests (no tag and not referenced by any index), orphan blobs (metadata + CAS files) and uploads abandoned for more than 24 h. Response: `RegistryGcResult`.

```json
"RegistryGc"
```

**Used by:** GUI and web UI.

### RegistryRetentionSet

Grava a política de retenção de tags (ligar/desligar e quantas manter). A leitura vem em `RegistryStatus(.retention)`. Resposta: `Ok`.

```json
{"RegistryRetentionSet":{"config":"{…}"}}
```

| Field | Type |
|---|---|
| `config` | `crate::RegistryRetentionConfig` |

**Used by:** GUI and web UI.

### RegistryTokenCreate

Creates an access token (Basic auth) — `scope` is `"pull"` or `"push"`. The response carries the secret in plain text ONLY ONCE.

```json
{"RegistryTokenCreate":{"name":"…","scope":"…"}}
```

| Field | Type |
|---|---|
| `name` | `String` |
| `scope` | `String` |

**Used by:** GUI and web UI.

### RegistryTokenList

```json
"RegistryTokenList"
```

**Used by:** GUI and web UI.

### RegistryTokenRevoke

```json
{"RegistryTokenRevoke":{"name":"…"}}
```

| Field | Type |
|---|---|
| `name` | `String` |

**Used by:** GUI and web UI.
