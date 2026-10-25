---
title: Protocol commands
description: "Reference of the 109 Rustploy API commands (POST /api/rpc): name, fields, JSON example and whether the GUI or the web UI use them."
---

The whole Rustploy API goes through **one** endpoint, `POST /api/rpc`, which takes a JSON **command** and returns a **response**. This page lists the **109 commands**. The same list applies to the `rpc` tool of the [MCP](/en/agentes/ferramentas/).

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
- [Infra as Code](#infra-as-code)
- [Copy a service between servers](#copy-a-service-between-servers)
- [Jobs](#jobs)
- [Jobs (tarefas one-shot via docker-compose, agendadas ou manuais)](#jobs-tarefas-one-shot-via-docker-compose-agendadas-ou-manuais)
- [Docker](#docker)
- [Ingress](#ingress)
- [Variables backup](#variables-backup)
- [Deploy queue](#deploy-queue)
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

**Used by:** only by the API and the MCP (no screen).

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
{"SecretSet":{"project_id":"prj_…","name":"…","value":"…"}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |
| `name` | `String` |
| `value` | `String` |

**Used by:** GUI and web UI.

### SecretDelete

```json
{"SecretDelete":{"project_id":"prj_…","name":"…"}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |
| `name` | `String` |

**Used by:** GUI and web UI.

### SecretList

```json
{"SecretList":{"project_id":"prj_…"}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |

**Used by:** only by the API and the MCP (no screen).

## Infra as Code

### ManifestApply

Reconciles projects/services from YAML manifests already interpolated by the client (one `ProjectManifest` document per string). Additive: creates/updates, never deletes. Does not trigger a deploy. Manifests travel as YAML (not as structs) so the daemon receives exactly the text of the file the user edits; parsing lives in one place, with `serde_yaml`. See `docs/infra-as-code.md`.

```json
{"ManifestApply":{"manifests":[],"prune":false,"deploy":false}}
```

| Field | Type |
|---|---|
| `manifests` | `Vec<String>` |
| `prune` | `bool`<br />Deletes services that exist in the project but are not in the manifest. |
| `deploy` | `bool`<br />Triggers a deploy of the created/changed services after syncing. |

**Used by:** only by the API and the MCP (no screen).

### ManifestExport

Exports the current state of a project as a YAML manifest (secrets redacted).

```json
{"ManifestExport":{"project_id":"prj_…"}}
```

| Field | Type |
|---|---|
| `project_id` | `String` |

**Used by:** only by the API and the MCP (no screen).

### ManifestExportAll

Exports ALL projects + services in a single root manifest (`ServerManifest`). Every `Plain` env var value is redacted to `${KEY}` (the real value never goes in the YAML); `Secret` stays as `secret:NAME`. Response: `ManifestBundle` (YAML + a complementary `.env` with the real values of the `Plain` vars).

```json
"ManifestExportAll"
```

**Used by:** GUI and web UI.

### ManifestImport

Imports a root manifest (`projects:`) or a single-project one (`project:`) together with the `.env` text that resolves the `${VAR}` used in it. Interpolation runs in the daemon (reusing `ProjectManifest::interpolate`); if any `${VAR}` is left without a value in any project, nothing is applied and the response is `MissingEnvVars`. With none missing, it reconciles exactly like `ManifestApply` (additive by default; `prune`/`deploy` with the same semantics).

```json
{"ManifestImport":{"yaml":"…","dotenv":"…","prune":false,"deploy":false}}
```

| Field | Type |
|---|---|
| `yaml` | `String` |
| `dotenv` | `String` |
| `prune` | `bool`<br />Deletes services that exist in the project but are not in the manifest. |
| `deploy` | `bool`<br />Triggers a deploy of the created/changed services after syncing. |

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
