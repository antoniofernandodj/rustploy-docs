---
title: Host Wanderer with Rustploy
description: "Maps and geolocation platform built on PocketBase and Meilisearch. Create Wanderer in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Wanderer**: Maps and geolocation platform built on PocketBase and Meilisearch. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `wanderer` |
| **Containers** | 3 (`search`, `db`, `web`) |
| **Images** | `getmeili/meilisearch:v1.11.3`, `flomp/wanderer-db`, `flomp/wanderer-web` |
| **UI port** | 3000, on service `web` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Wanderer** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `meili_master_key` | *random password, 32 characters* |
| `pocketbase_key` | *random password, 32 characters* |
| `upload_user` | *generated username* |
| `upload_password` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `MEILI_MASTER_KEY` | ${meili_master_key} |
| `POCKETBASE_ENCRYPTION_KEY` | ${pocketbase_key} |
| `UPLOAD_USER` | ${upload_user} |
| `UPLOAD_PASSWORD` | ${upload_password} |
| `ORIGIN` | http://${main_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `web` | 3000 | ${main_domain} |
| `db` | 8090 | db.${main_domain} |
| `search` | 7700 | search.${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  search:
    image: getmeili/meilisearch:v1.11.3
    environment:
      MEILI_URL: http://search:7700
      MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}
      MEILI_NO_ANALYTICS: "true"
    volumes:
      - search-data:/meili_data/data.ms
    restart: unless-stopped
    healthcheck:
      test: curl --fail http://localhost:7700/health || exit 1
      interval: 15s
      retries: 10
      start_period: 20s
      timeout: 10s

  db:
    image: flomp/wanderer-db
    depends_on:
      search:
        condition: service_healthy
    environment:
      MEILI_URL: http://search:7700
      MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}
      POCKETBASE_ENCRYPTION_KEY: ${POCKETBASE_ENCRYPTION_KEY}
      ORIGIN: ${ORIGIN}
    volumes:
      - db-data:/pb_data
    restart: unless-stopped
    healthcheck:
      test: wget --spider -q http://localhost:8090/health || exit 1
      interval: 15s
      retries: 10
      start_period: 20s
      timeout: 10s

  web:
    image: flomp/wanderer-web
    depends_on:
      search:
        condition: service_healthy
      db:
        condition: service_healthy
    environment:
      MEILI_URL: http://search:7700
      MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}
      ORIGIN: ${ORIGIN}
      BODY_SIZE_LIMIT: Infinity
      PUBLIC_POCKETBASE_URL: http://db:8090
      PUBLIC_DISABLE_SIGNUP: "false"
      UPLOAD_FOLDER: /app/uploads
      UPLOAD_USER: ${UPLOAD_USER}
      UPLOAD_PASSWORD: ${UPLOAD_PASSWORD}
      PUBLIC_VALHALLA_URL: https://valhalla1.openstreetmap.de
      PUBLIC_NOMINATIM_URL: https://nominatim.openstreetmap.org
    volumes:
      - uploads:/app/uploads
    restart: unless-stopped
    healthcheck:
      test: curl --fail http://localhost:3000/ || exit 1
      interval: 15s
      retries: 10
      start_period: 20s
      timeout: 10s

volumes:
  search-data: {}
  db-data: {}
  uploads: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
