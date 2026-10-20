---
title: Qual cliente faz o quê
description: "Quais comandos do Rustploy existem só pela API e pelo MCP, quais só na GUI desktop e quais só na web UI - para saber quando usar cada interface."
---

A GUI desktop e a web UI falam com a mesma API, mas cobrem conjuntos um pouco diferentes. Esta lista é gerada do código a cada versão.

## Sem chamada direta de nenhuma tela (29)

Nenhuma tela dispara estes comandos diretamente. Alguns dados (as listas do Docker, os jobs) aparecem nas telas mesmo assim, porque chegam no *snapshot* do painel. Para agir sobre eles, use `curl`, a ferramenta `rpc` do [MCP](/agentes/ferramentas/) ou um agente de IA.

- [`ServiceList`](/referencia/comandos/#servicelist)
- [`RecentDeployments`](/referencia/comandos/#recentdeployments)
- [`LogsUnsubscribe`](/referencia/comandos/#logsunsubscribe)
- [`MetricsUnsubscribe`](/referencia/comandos/#metricsunsubscribe)
- [`SharedAccessList`](/referencia/comandos/#sharedaccesslist)
- [`SharedAccessGrant`](/referencia/comandos/#sharedaccessgrant)
- [`SharedAccessRevoke`](/referencia/comandos/#sharedaccessrevoke)
- [`MigrationGet`](/referencia/comandos/#migrationget)
- [`SecretList`](/referencia/comandos/#secretlist)
- [`ManifestApply`](/referencia/comandos/#manifestapply)
- [`ManifestExport`](/referencia/comandos/#manifestexport)
- [`JobListAll`](/referencia/comandos/#joblistall)
- [`JobRunHistory`](/referencia/comandos/#jobrunhistory)
- [`JobWarmStatus`](/referencia/comandos/#jobwarmstatus)
- [`ServiceWarmStatusList`](/referencia/comandos/#servicewarmstatuslist)
- [`ServiceWarm`](/referencia/comandos/#servicewarm)
- [`PruneBuildCache`](/referencia/comandos/#prunebuildcache)
- [`DockerImages`](/referencia/comandos/#dockerimages)
- [`DockerVolumes`](/referencia/comandos/#dockervolumes)
- [`DockerNetworks`](/referencia/comandos/#dockernetworks)
- [`DockerContainers`](/referencia/comandos/#dockercontainers)
- [`IngressRoutes`](/referencia/comandos/#ingressroutes)
- [`IngressReconcile`](/referencia/comandos/#ingressreconcile)
- [`EnvBackupList`](/referencia/comandos/#envbackuplist)
- [`EnvBackupRestore`](/referencia/comandos/#envbackuprestore)
- [`Ping`](/referencia/comandos/#ping)
- [`DeployEngineStatus`](/referencia/comandos/#deployenginestatus)
- [`RegistryStatus`](/referencia/comandos/#registrystatus)
- [`RegistryRepoList`](/referencia/comandos/#registryrepolist)

## Só na GUI desktop (1)

- [`JobList`](/referencia/comandos/#joblist)

## Só na web UI (2)

- [`ServiceCreate`](/referencia/comandos/#servicecreate)
- [`DeployRollback`](/referencia/comandos/#deployrollback)

Todo o resto existe nas duas interfaces. Os comandos de assinatura de logs e métricas (`LogsSubscribe`, `MetricsSubscribe`) foram trocados pelos streams SSE e não aparecem aqui.
