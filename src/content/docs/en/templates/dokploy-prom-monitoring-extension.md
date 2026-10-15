---
title: Host Dokploy Prom Monitoring Extension with Rustploy
description: "Dokploy Prom Monitoring Extension application. Create Dokploy Prom Monitoring Extension in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Dokploy Prom Monitoring Extension**: Dokploy Prom Monitoring Extension application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `dokploy-prom-monitoring-extension` |
| **Containers** | 1 (`dokploy-monitoring`) |
| **Images** | `dokploy/monitoring:canary` |
| **UI port** | 3001, on service `dokploy-monitoring` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Dokploy Prom Monitoring Extension** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `monitoring_token` | *random password, 32 characters* |
| `callback_url` | http://dokploy:3000/api/trpc/notification.receiveNotification |
| `server_type` | Dokploy |
| `refresh_rate` | 30 |
| `retention_days` | 7 |
| `cpu_threshold` | 80 |
| `memory_threshold` | 85 |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `METRICS_CONFIG` | {"server":{"refreshRate":${refresh_rate},"port":3001,"type":"${server_type}","token":"${monitoring_token}","urlCallback":"${callback_url}","retentionDays":${retention_days},"cronJob":"0 0 * * *","thresholds":{"cpu":${cpu_threshold},"memory":${memory_threshold}},"prometheus":{"enabled":true}},"containers":{"refreshRate":${refresh_rate},"services":{"include":[],"exclude":[]}}} |

## Domains

| Service | Port | Host |
|---|---|---|
| `dokploy-monitoring` | 3001 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  dokploy-monitoring:
    image: dokploy/monitoring:canary
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - monitoring-data:/app/data
volumes:
  monitoring-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
