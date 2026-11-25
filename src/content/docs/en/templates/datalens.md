---
title: Host DataLens with Rustploy
description: "Scalable Business Intelligence (BI) and data visualization tool. Create DataLens in one click on Rustploy: 6 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**DataLens**: Scalable Business Intelligence (BI) and data visualization tool. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `datalens` |
| **Containers** | 6 (`pg-compeng`, `control-api`, `data-api`, `pg-us`, `us`, `datalens`) |
| **Images** | `postgres:16-alpine`, `ghcr.io/datalens-tech/datalens-control-api:0.2192.0`, `ghcr.io/datalens-tech/datalens-data-api:0.2192.0`, `ghcr.io/datalens-tech/datalens-us:0.310.0`, `ghcr.io/datalens-tech/datalens-ui:0.2601.0` |
| **UI port** | 8080, on service `datalens` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **DataLens** and select it.
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
| `HC` | 1 |

## Domains

| Service | Port | Host |
|---|---|---|
| `datalens` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  pg-compeng:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_PASSWORD: "postgres"
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres

  control-api:
    image: ghcr.io/datalens-tech/datalens-control-api:0.2192.0
    restart: always
    environment:
      BI_API_UWSGI_WORKERS_COUNT: 4
      CONNECTOR_AVAILABILITY_VISIBLE: "clickhouse,postgres,chyt,ydb,mysql,greenplum,mssql,appmetrica_api,metrika_api"
      RQE_FORCE_OFF: 1
      DL_CRY_ACTUAL_KEY_ID: key_1
      DL_CRY_KEY_VAL_ID_key_1: "h1ZpilcYLYRdWp7Nk8X1M1kBPiUi8rdjz9oBfHyUKIk="
      RQE_SECRET_KEY: ""
      US_HOST: "http://us:8083"
      US_MASTER_TOKEN: "fake-us-master-token"
    depends_on:
      - us

  data-api:
    container_name: datalens-data-api
    image: ghcr.io/datalens-tech/datalens-data-api:0.2192.0
    restart: always
    environment:
      GUNICORN_WORKERS_COUNT: 5
      RQE_FORCE_OFF: 1
      CACHES_ON: 0
      MUTATIONS_CACHES_ON: 0
      RQE_SECRET_KEY: ""
      DL_CRY_ACTUAL_KEY_ID: key_1
      DL_CRY_KEY_VAL_ID_key_1: "h1ZpilcYLYRdWp7Nk8X1M1kBPiUi8rdjz9oBfHyUKIk="
      BI_COMPENG_PG_ON: 1
      BI_COMPENG_PG_URL: "postgresql://postgres:postgres@pg-compeng:5432/postgres"
      US_HOST: "http://us:8083"
      US_MASTER_TOKEN: "fake-us-master-token"
    depends_on:
      - us
      - pg-compeng

  pg-us:
    container_name: datalens-pg-us
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: us-db-ci_purgeable
      POSTGRES_USER: us
      POSTGRES_PASSWORD: us
    volumes:
      - ${VOLUME_US:-./metadata}:/var/lib/postgresql/data

  us:
    image: ghcr.io/datalens-tech/datalens-us:0.310.0
    restart: always
    depends_on:
      - pg-us
    environment:
      APP_INSTALLATION: "opensource"
      APP_ENV: "prod"
      MASTER_TOKEN: "fake-us-master-token"
      POSTGRES_DSN_LIST: ${METADATA_POSTGRES_DSN_LIST:-postgres://us:us@pg-us:5432/us-db-ci_purgeable}
      SKIP_INSTALL_DB_EXTENSIONS: ${METADATA_SKIP_INSTALL_DB_EXTENSIONS:-0}
      USE_DEMO_DATA: ${USE_DEMO_DATA:-0}
      HC: ${HC:-0}
      NODE_EXTRA_CA_CERTS: /certs/root.crt
    extra_hosts:
      - "host.docker.internal:host-gateway"
    volumes:
      - ./certs:/certs

  datalens:
    image: ghcr.io/datalens-tech/datalens-ui:0.2601.0
    restart: always
    ports:
      - ${UI_PORT:-8080}:8080
    depends_on:
      - us
      - control-api
      - data-api
    environment:
      APP_MODE: "full"
      APP_ENV: "production"
      APP_INSTALLATION: "opensource"
      AUTH_POLICY: "disabled"
      US_ENDPOINT: "http://us:8083"
      BI_API_ENDPOINT: "http://control-api:8080"
      BI_DATA_ENDPOINT: "http://data-api:8080"
      US_MASTER_TOKEN: "fake-us-master-token"
      NODE_EXTRA_CA_CERTS: "/usr/local/share/ca-certificates/cert.pem"
      HC: ${HC:-0}
      YANDEX_MAP_ENABLED: ${YANDEX_MAP_ENABLED:-0}
      YANDEX_MAP_TOKEN: ${YANDEX_MAP_TOKEN:-0}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
