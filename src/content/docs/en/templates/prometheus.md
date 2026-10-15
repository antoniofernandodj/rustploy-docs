---
title: Host Prometheus with Rustploy
description: "Time series database and monitoring hub that scrapes metrics. Create Prometheus in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Prometheus**: Time series database and monitoring hub that scrapes metrics. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `prometheus` |
| **Containers** | 1 (`prometheus`) |
| **Images** | `prom/prometheus:latest` |
| **UI port** | 9090, on service `prometheus` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Prometheus** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

## Domains

| Service | Port | Host |
|---|---|---|
| `prometheus` | 9090 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `prometheus.yml`

## The template docker-compose.yml

```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    restart: unless-stopped
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--web.console.libraries=/usr/share/prometheus/console_libraries"
      - "--web.console.templates=/usr/share/prometheus/consoles"
      - "--web.enable-lifecycle"
    volumes:
      - ../files/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
volumes:
  prometheus-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
