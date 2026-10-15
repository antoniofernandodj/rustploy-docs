---
title: Hospedar DataLens com Rustploy
description: "Ferramenta escalável de Business Intelligence (BI) e visualização de dados. Crie DataLens em um clique no Rustploy: 6 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**DataLens**: Ferramenta escalável de Business Intelligence (BI) e visualização de dados. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `datalens` |
| **Containers** | 6 (`pg-compeng`, `control-api`, `data-api`, `pg-us`, `us`, `datalens`) |
| **Imagens** | `postgres:16-alpine`, `ghcr.io/datalens-tech/datalens-control-api:0.2192.0`, `ghcr.io/datalens-tech/datalens-data-api:0.2192.0`, `ghcr.io/datalens-tech/datalens-us:0.310.0`, `ghcr.io/datalens-tech/datalens-ui:0.2601.0` |
| **Porta da interface** | 8080, no serviço `datalens` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **DataLens** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `HC` | 1 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `datalens` | 8080 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
