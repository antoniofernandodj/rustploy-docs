---
title: Eventos em tempo real (SSE)
description: "Os 15 eventos que o daemon do Rustploy publica em GET /api/events (Server-Sent Events): mudança de estado de deploy, logs de build, métricas e status de serviço."
---

`GET /api/events` é um stream **SSE**. Ele entrega um **snapshot** completo do painel a cada 2 segundos e os **eventos** abaixo assim que acontecem. Cada registro traz um campo `kind` no `data` JSON: `"snapshot"` ou `"bus"`.

```bash
curl -N -H "Authorization: Bearer $TOKEN" https://SERVIDOR:9797/api/events
```

O navegador não consegue usar `EventSource` aqui, porque ele não permite enviar o cabeçalho `Authorization`: a web UI lê o stream com `fetch`.

Se o canal interno encher, um evento é **descartado em silêncio**: o snapshot periódico corrige a tela.

## Eventos

### DeployStateChanged

| Campo | Tipo |
|---|---|
| `deployment_id` | `String` |
| `service_id` | `String` |
| `state` | `DeployState` |
| `timestamp` | `chrono::DateTime<chrono::Utc>` |
| `message` | `Option<String>` |

### DeployProgress

| Campo | Tipo |
|---|---|
| `deployment_id` | `String` |
| `service_id` | `String` |
| `phase` | `String` |
| `percent` | `u8` |
| `description` | `String` |

### BuildLog

Output from `docker build` — belongs to a specific deployment.

| Campo | Tipo |
|---|---|
| `deployment_id` | `String` |
| `service_id` | `String` |
| `line` | `String` |
| `timestamp` | `chrono::DateTime<chrono::Utc>` |

### LogLine

stdout/stderr of the running container — belongs to the service.

| Campo | Tipo |
|---|---|
| `service_id` | `String` |
| `container_id` | `String` |
| `stream` | `LogStream` |
| `line` | `String` |
| `timestamp` | `chrono::DateTime<chrono::Utc>` |

### ContainerMetrics

Carrega um `ContainerMetricsPoint`.

### SystemMetrics

Carrega um `SystemMetricsPoint`.

### ServiceStatusChanged

| Campo | Tipo |
|---|---|
| `service_id` | `String` |
| `status` | `ServiceStatus` |

### DaemonReady

| Campo | Tipo |
|---|---|
| `version` | `String` |

### Error

| Campo | Tipo |
|---|---|
| `code` | `String` |
| `message` | `String` |

### JobLogLine

Uma linha de stdout/stderr do `docker compose` de um `JobRun` (mesma forma de `Event::BuildLog`).

| Campo | Tipo |
|---|---|
| `job_run_id` | `String` |
| `job_id` | `String` |
| `line` | `String` |
| `timestamp` | `chrono::DateTime<chrono::Utc>` |
| `stream` | `LogStream` |

### JobRunStateChanged

Início/fim de uma execução de job.

| Campo | Tipo |
|---|---|
| `job_id` | `String` |
| `job_run_id` | `String` |
| `running` | `bool` |
| `success` | `Option<bool>` |

### DeployQueueChanged

A fila global de deploys mudou (enfileirou, começou, terminou, reordenou, cancelou ou pausou/retomou). Sinal leve: o cliente refaz o `DeployEngineStatus` ao recebê-lo. Anexado no fim do enum de propósito.

### DockerCleanupCompleted

Uma limpeza automática (ou "Executar agora") terminou — disparada pelo `maintenance::scheduler_loop` ou por `Command::DockerCleanupRunNow`. Não é por-serviço, então cai no braço "sempre true" de `matches`.

| Campo | Tipo |
|---|---|
| `at` | `chrono::DateTime<chrono::Utc>` |
| `results` | `Vec<DockerCleanupResourceResult>` |

### JobWarmChanged

Um aquecimento de job começou (`warming: true`) ou terminou (`warming: false`, com `success` e, na falha, `error`).

| Campo | Tipo |
|---|---|
| `job_id` | `String` |
| `warming` | `bool` |
| `success` | `Option<bool>` |
| `error` | `Option<String>` |

### ServiceWarmChanged

Um aquecimento de serviço começou (`warming: true`) ou terminou (`warming: false`, com `success` e, na falha, `error`). Vale pra todos os clientes (não filtra por serviço): a tela de lista precisa dele.

| Campo | Tipo |
|---|---|
| `service_id` | `String` |
| `warming` | `bool` |
| `success` | `Option<bool>` |
| `error` | `Option<String>` |
