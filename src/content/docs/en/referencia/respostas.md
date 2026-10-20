---
title: Protocol responses
description: "The 61 response variants of POST /api/rpc on Rustploy, the type each one carries, and how to recognize an error."
---

Each [command](/en/referencia/comandos/) returns one of these variants. A response **with fields** is a one-key object; **without fields**, the bare string (`"Ok"`).

An error comes as `{"Err":{"code":"…","message":"…"}}`.

| Response | Carries |
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
