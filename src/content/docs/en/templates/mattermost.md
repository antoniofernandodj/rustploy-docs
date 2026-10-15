---
title: Host Mattermost with Rustploy
description: "Enterprise chat and technical collaboration platform focused on DevOps. Create Mattermost in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Mattermost**: Enterprise chat and technical collaboration platform focused on DevOps. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `mattermost` |
| **Containers** | 2 (`postgres`, `mattermost`) |
| **Images** | `postgres:17`, `mattermost/mattermost-team-edition:10.6.1` |
| **UI port** | 8065, on service `mattermost` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Mattermost** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `Domain` | ${main_domain} |
| `POSTGRES_USER` | mmuser |
| `POSTGRES_PASSWORD` | *random password, 32 characters* |
| `POSTGRES_DB` | mattermost |
| `MM_SQLSETTINGS_DRIVERNAME` | postgres |
| `MM_SQLSETTINGS_DATASOURCE` | postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?sslmode=disable&connect_timeout=10 |
| `APP_PORT` | 8065 |
| `TZ` | UTC |

## Domains

| Service | Port | Host |
|---|---|---|
| `mattermost` | 8065 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:17
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    pids_limit: 100
    read_only: true
    tmpfs:
      - /tmp
      - /var/run/postgresql
    volumes:
      - mattermostDbData:/var/lib/postgresql/data
    environment:
      - TZ
      - POSTGRES_USER
      - POSTGRES_PASSWORD
      - POSTGRES_DB

  mattermost:
    depends_on:
      - postgres
    image: mattermost/mattermost-team-edition:10.6.1
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    pids_limit: 200
    read_only: false
    tmpfs:
      - /tmp
    volumes:
      - mattermostconf:/mattermost/config:rw
      - mattermostdata:/mattermost/data:rw
      - mattermostlogs:/mattermost/logs:rw
      - mattermostplugsin:/mattermost/plugins:rw
      - mattermostclientplugins:/mattermost/client/plugins:rw
      - mattermostBleveIndexes:/mattermost/bleve-indexes:rw
      
    environment:
      - DOMAIN
      - TZ
      - POSTGRES_USER
      - POSTGRES_PASSWORD
      - POSTGRES_DB
      - MM_SQLSETTINGS_DRIVERNAME
      - MM_SQLSETTINGS_DATASOURCE
      - MM_BLEVESETTINGS_INDEXDIR
      - MM_SERVICESETTINGS_SITEURL
      - APP_PORT


volumes:
  mattermostDbData:
    driver: local
  mattermostconf:
    driver: local
  mattermostdata:
    driver: local
  mattermostlogs:
    driver: local
  mattermostplugsin:
    driver: local
  mattermostclientplugins:
    driver: local
  mattermostBleveIndexes:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
