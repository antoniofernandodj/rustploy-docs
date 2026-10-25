---
title: Respostas do protocolo
description: "As 63 variantes de resposta de POST /api/rpc no Rustploy, com o tipo que cada uma carrega, e como reconhecer um erro."
---

Cada [comando](/referencia/comandos/) devolve uma destas variantes. Uma resposta **com campos** é um objeto de uma chave; **sem campos**, a string nua (`"Ok"`).

Um erro vem como `{"Err":{"code":"…","message":"…"}}`.

| Resposta | Carrega |
|---|---|
| `Ok` | — |
| `Project` | `Project` |
| `Projects` | `Vec<Project>` |
| `Service` | `Service` |
| `Services` | `Vec<Service>` |
| `Deployment` | `Deployment` |
| `Deployments` | `Vec<Deployment>` |
| `Logs` | `Vec<LogEntry>` |
| `BuildLogs` | `Vec<BuildLogLine>` |
| `DeploymentSummaries` | `Vec<DeploymentSummary>` |
| `DaemonStatus` | `DaemonStatus` |
| `UpdateInfo` | `UpdateInfo` |
| `UpdateProgress` | `UpdateProgress` |
| `DeployEngineStatus` | `DeployEngineSummary` |
| `Pong` | `uptime_secs: u64` |
| `WebhookUrl` | `Option<String>` |
| `SharedAccessList` | `Vec<SharedAccess>` |
| `Migration` | `Migration` |
| `Migrations` | `Vec<Migration>` |
| `ManagedDatabases` | `Vec<ManagedDatabase>` |
| `ConnectionInfo` | `host: String`, `internal_url: String` |
| `DaemonSettings` | `public_base_url: String`, `acme_email: Option<String>`, `registry_domain: Option<String>` |
| `SecretNames` | `Vec<String>` |
| `ManifestReport` | `ApplyReport` |
| `Manifest` | `String` |
| `ManifestBundle` | `yaml: String`, `dotenv: String` |
| `ServiceExportPlan` | `ServiceExportPlan` |
| `ServiceBundleYaml` | `yaml: String`, `filename: String` |
| `ServiceImportReport` | `ServiceImportReport` |
| `MissingEnvVars` | `Vec<String>` |
| `GitProviders` | `Vec<GitProvider>` |
| `GitProviderInfo` | `GitProvider` |
| `OAuthUrl` | `String` |
| `GitRepos` | `Vec<GitRepo>` |
| `GitBranches` | `Vec<GitBranch>` |
| `PruneResult` | `count: u32`, `reclaimed_bytes: u64` |
| `DockerCleanupConfig` | `config: DockerCleanupConfig`, `last_run: Option<DockerCleanupLastRun>` |
| `EnvBackupSnapshots` | `Vec<String>` |
| `DockerImages` | `Vec<DockerImageInfo>` |
| `DockerVolumes` | `Vec<DockerVolumeInfo>` |
| `DockerNetworks` | `Vec<DockerNetworkInfo>` |
| `DockerContainers` | `Vec<DockerContainerInfo>` |
| `StopAllResult` | `count: u32` |
| `IngressRoutes` | `IngressSnapshot` |
| `WizardCatalog` | `dbs: String`, `brokers: String`, `templates: String` |
| `Snapshot` | `String` |
| `Job` | `Job` |
| `Jobs` | `Vec<Job>` |
| `JobSummaries` | `Vec<JobSummary>` |
| `JobRun` | `JobRun` |
| `JobRuns` | `Vec<JobRun>` |
| `JobLogs` | `Vec<BuildLogLine>` |
| `JobWarmStatus` | `JobWarmStatus` |
| `JobWarmRequested` | `already_warm: bool` |
| `ServiceWarmStatuses` | `Vec<ServiceWarmStatus>` |
| `ServiceWarmRequested` | `already_warm: bool` |
| `RegistryStatus` | `RegistryStatusInfo` |
| `RegistryRepos` | `Vec<RegistryRepoInfo>` |
| `RegistryTags` | `Vec<RegistryTagInfo>` |
| `RegistryGcResult` | `blobs_removed: u64`, `bytes_freed: u64` |
| `RegistryTokenCreated` | `name: String`, `secret: String` |
| `RegistryTokens` | `Vec<RegistryTokenInfo>` |
| `Err` | `code: String`, `message: String` |
