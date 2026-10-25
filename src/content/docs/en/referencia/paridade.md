---
title: Which client does what
description: "Which Rustploy commands exist only through the API and the MCP, which only in the desktop GUI and which only in the web UI - to know when to use each interface."
---

The desktop GUI and the web UI talk to the same API, but cover slightly different sets. This list is generated from the code on every release.

## Not called directly by any screen (28)

No screen fires these commands directly. Some data (the Docker lists, the jobs) shows up on the screens anyway, because it arrives in the dashboard *snapshot*. To act on them, use `curl`, the `rpc` tool of the [MCP](/en/agentes/ferramentas/) or an AI agent.

- [`ServiceList`](/en/referencia/comandos/#servicelist)
- [`RecentDeployments`](/en/referencia/comandos/#recentdeployments)
- [`LogsUnsubscribe`](/en/referencia/comandos/#logsunsubscribe)
- [`MetricsUnsubscribe`](/en/referencia/comandos/#metricsunsubscribe)
- [`SharedAccessList`](/en/referencia/comandos/#sharedaccesslist)
- [`SharedAccessGrant`](/en/referencia/comandos/#sharedaccessgrant)
- [`SharedAccessRevoke`](/en/referencia/comandos/#sharedaccessrevoke)
- [`MigrationGet`](/en/referencia/comandos/#migrationget)
- [`SecretList`](/en/referencia/comandos/#secretlist)
- [`ManifestApply`](/en/referencia/comandos/#manifestapply)
- [`ManifestExport`](/en/referencia/comandos/#manifestexport)
- [`JobListAll`](/en/referencia/comandos/#joblistall)
- [`JobRunHistory`](/en/referencia/comandos/#jobrunhistory)
- [`JobWarmStatus`](/en/referencia/comandos/#jobwarmstatus)
- [`ServiceWarmStatusList`](/en/referencia/comandos/#servicewarmstatuslist)
- [`PruneBuildCache`](/en/referencia/comandos/#prunebuildcache)
- [`DockerImages`](/en/referencia/comandos/#dockerimages)
- [`DockerVolumes`](/en/referencia/comandos/#dockervolumes)
- [`DockerNetworks`](/en/referencia/comandos/#dockernetworks)
- [`DockerContainers`](/en/referencia/comandos/#dockercontainers)
- [`IngressRoutes`](/en/referencia/comandos/#ingressroutes)
- [`IngressReconcile`](/en/referencia/comandos/#ingressreconcile)
- [`EnvBackupList`](/en/referencia/comandos/#envbackuplist)
- [`EnvBackupRestore`](/en/referencia/comandos/#envbackuprestore)
- [`Ping`](/en/referencia/comandos/#ping)
- [`DeployEngineStatus`](/en/referencia/comandos/#deployenginestatus)
- [`RegistryStatus`](/en/referencia/comandos/#registrystatus)
- [`RegistryRepoList`](/en/referencia/comandos/#registryrepolist)

## Desktop GUI only (1)

- [`JobList`](/en/referencia/comandos/#joblist)

## Web UI only (2)

- [`ServiceCreate`](/en/referencia/comandos/#servicecreate)
- [`DeployRollback`](/en/referencia/comandos/#deployrollback)

Everything else exists in both interfaces. The log and metrics subscription commands (`LogsSubscribe`, `MetricsSubscribe`) were replaced by the SSE streams and do not appear here.
