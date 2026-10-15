---
title: Real-time events (SSE)
description: "The 14 events the Rustploy daemon publishes on GET /api/events (Server-Sent Events): deploy state changes, build logs, metrics and service status."
---

`GET /api/events` is an **SSE** stream. It delivers a full dashboard **snapshot** every 2 seconds and the **events** below as soon as they happen. Each record carries a `kind` field in the JSON `data`: `"snapshot"` or `"bus"`.

```bash
curl -N -H "Authorization: Bearer $TOKEN" https://SERVIDOR:9797/api/events
```

The browser cannot use `EventSource` here, because it does not allow sending the `Authorization` header: the web UI reads the stream with `fetch`.

If the internal channel fills up, an event is **silently dropped**: the periodic snapshot corrects the screen.

## Events

### DeployStateChanged

| Field | Type |
|---|---|
| `deployment_id` | `String` |
| `service_id` | `String` |
| `state` | `DeployState` |
| `timestamp` | `chrono::DateTime<chrono::Utc>` |
| `message` | `Option<String>` |

### DeployProgress

| Field | Type |
|---|---|
| `deployment_id` | `String` |
| `service_id` | `String` |
| `phase` | `String` |
| `percent` | `u8` |
| `description` | `String` |

### BuildLog

Output from `docker build` — belongs to a specific deployment.

| Field | Type |
|---|---|
| `deployment_id` | `String` |
| `service_id` | `String` |
| `line` | `String` |
| `timestamp` | `chrono::DateTime<chrono::Utc>` |

### LogLine

stdout/stderr of the running container — belongs to the service.

| Field | Type |
|---|---|
| `service_id` | `String` |
| `container_id` | `String` |
| `stream` | `LogStream` |
| `line` | `String` |
| `timestamp` | `chrono::DateTime<chrono::Utc>` |

### ContainerMetrics

Carries a `ContainerMetricsPoint`.

### SystemMetrics

Carries a `SystemMetricsPoint`.

### ServiceStatusChanged

| Field | Type |
|---|---|
| `service_id` | `String` |
| `status` | `ServiceStatus` |

### DaemonReady

| Field | Type |
|---|---|
| `version` | `String` |

### Error

| Field | Type |
|---|---|
| `code` | `String` |
| `message` | `String` |

### JobLogLine

A stdout/stderr line from the `docker compose` of a `JobRun` (same shape as `Event::BuildLog`).

| Field | Type |
|---|---|
| `job_run_id` | `String` |
| `job_id` | `String` |
| `line` | `String` |
| `timestamp` | `chrono::DateTime<chrono::Utc>` |
| `stream` | `LogStream` |

### JobRunStateChanged

Start/end of a job run.

| Field | Type |
|---|---|
| `job_id` | `String` |
| `job_run_id` | `String` |
| `running` | `bool` |
| `success` | `Option<bool>` |

### DeployQueueChanged

The global deploy queue changed (queued, started, finished, reordered, cancelled or paused/resumed). A light signal: the client re-fetches `DeployEngineStatus` when it receives it. Deliberately appended at the end of the enum.

### DockerCleanupCompleted

An automatic cleanup (or "Run now") finished — triggered by `maintenance::scheduler_loop` or by `Command::DockerCleanupRunNow`. It is not per-service, so it falls in the "always true" arm of `matches`.

| Field | Type |
|---|---|
| `at` | `chrono::DateTime<chrono::Utc>` |
| `results` | `Vec<DockerCleanupResourceResult>` |

### JobWarmChanged

A job warm-up started (`warming: true`) or finished (`warming: false`, with `success` and, on failure, `error`).

| Field | Type |
|---|---|
| `job_id` | `String` |
| `warming` | `bool` |
| `success` | `Option<bool>` |
| `error` | `Option<String>` |
