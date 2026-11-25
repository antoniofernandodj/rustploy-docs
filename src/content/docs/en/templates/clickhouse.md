---
title: Host ClickHouse with Rustploy
description: "Extremely fast column-oriented analytical (OLAP) database. Create ClickHouse in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**ClickHouse**: Extremely fast column-oriented analytical (OLAP) database. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `clickhouse` |
| **Containers** | 1 (`clickhouse`) |
| **Images** | `clickhouse/clickhouse-server:latest` |
| **UI port** | 8123, on service `clickhouse` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **ClickHouse** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `clickhouse_user` | default |
| `clickhouse_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `CLICKHOUSE_USER` | ${clickhouse_user} |
| `CLICKHOUSE_PASSWORD` | ${clickhouse_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `clickhouse` | 8123 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  clickhouse:
    image: clickhouse/clickhouse-server:latest
    restart: unless-stopped
    environment:
      - CLICKHOUSE_USER=${CLICKHOUSE_USER}
      - CLICKHOUSE_PASSWORD=${CLICKHOUSE_PASSWORD}
    volumes:
      - clickhouse-data:/var/lib/clickhouse
      - clickhouse-logs:/var/log/clickhouse-server

volumes:
  clickhouse-data:
  clickhouse-logs:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
