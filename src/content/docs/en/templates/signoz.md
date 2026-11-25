---
title: Host SigNoz with Rustploy
description: "Complete APM, trace and log platform (Datadog alternative). Create SigNoz in one click on Rustploy: 7 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**SigNoz**: Complete APM, trace and log platform (Datadog alternative). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `signoz` |
| **Containers** | 7 (`init-clickhouse`, `zookeeper-1`, `clickhouse`, `signoz`, `otel-collector`, `schema-migrator-sync`, `schema-migrator-async`) |
| **Images** | `clickhouse/clickhouse-server:25.5.6`, `signoz/zookeeper:3.7.1`, `signoz/signoz:v0.97.1`, `signoz/signoz-otel-collector:v0.129.7`, `signoz/signoz-schema-migrator:v0.129.7` |
| **UI port** | 8080, on service `signoz` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **SigNoz** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `jwt_secret` | *random password, 64 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SIGNOZ_JWT_SECRET` | *generated JWT* |

## Domains

| Service | Port | Host |
|---|---|---|
| `signoz` | 8080 | ${main_domain} |
| `otel-collector` | 4318 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/clickhouse/config.xml`
- `/clickhouse/cluster.xml`
- `/signoz/prometheus.xml`
- `/collector/otel-collector-config.yaml`

## The template docker-compose.yml

```yaml
x-common: &common
  networks:
    - signoz-net
  restart: unless-stopped
  logging:
    options:
      max-size: 50m
      max-file: "3"
x-clickhouse-defaults: &clickhouse-defaults
  !!merge <<: *common
  image: clickhouse/clickhouse-server:25.5.6
  tty: true
  labels:
    signoz.io/scrape: "true"
    signoz.io/port: "9363"
    signoz.io/path: "/metrics"
  depends_on:
    init-clickhouse:
      condition: service_completed_successfully
    zookeeper-1:
      condition: service_healthy
  healthcheck:
    test:
      - CMD
      - wget
      - --spider
      - -q
      - 0.0.0.0:8123/ping
    interval: 30s
    timeout: 5s
    retries: 3
  ulimits:
    nproc: 65535
    nofile:
      soft: 262144
      hard: 262144
  environment:
    - CLICKHOUSE_SKIP_USER_SETUP=1
x-zookeeper-defaults: &zookeeper-defaults
  !!merge <<: *common
  image: signoz/zookeeper:3.7.1
  user: root
  labels:
    signoz.io/scrape: "true"
    signoz.io/port: "9141"
    signoz.io/path: "/metrics"
  healthcheck:
    test:
      - CMD-SHELL
      - curl -s -m 2 http://localhost:8080/commands/ruok | grep error | grep null
    interval: 30s
    timeout: 5s
    retries: 3
x-db-depend: &db-depend
  !!merge <<: *common
  depends_on:
    clickhouse:
      condition: service_healthy
    schema-migrator-sync:
      condition: service_completed_successfully
services:
  init-clickhouse:
    !!merge <<: *common
    image: clickhouse/clickhouse-server:25.5.6
    command:
      - bash
      - -c
      - |
        version="v0.0.1"
        node_os=$$(uname -s | tr '[:upper:]' '[:lower:]')
        node_arch=$$(uname -m | sed s/aarch64/arm64/ | sed s/x86_64/amd64/)
        echo "Fetching histogram-binary for $${node_os}/$${node_arch}"
        cd /tmp
        wget -O histogram-quantile.tar.gz "https://github.com/SigNoz/signoz/releases/download/histogram-quantile%2F$${version}/histogram-quantile_$${node_os}_$${node_arch}.tar.gz"
        tar -xvzf histogram-quantile.tar.gz
        mv histogram-quantile /var/lib/clickhouse/user_scripts/histogramQuantile
    restart: on-failure
    volumes:
      - ../files/clickhouse/user_scripts:/var/lib/clickhouse/user_scripts/
  zookeeper-1:
    !!merge <<: *zookeeper-defaults
    volumes:
      - zookeeper-1:/bitnami/zookeeper
    environment:
      - ZOO_SERVER_ID=1
      - ALLOW_ANONYMOUS_LOGIN=yes
      - ZOO_AUTOPURGE_INTERVAL=1
      - ZOO_ENABLE_PROMETHEUS_METRICS=yes
      - ZOO_PROMETHEUS_METRICS_PORT_NUMBER=9141
  clickhouse:
    !!merge <<: *clickhouse-defaults
    container_name: signoz-clickhouse
    volumes:
      - ../files/clickhouse/config.xml:/etc/clickhouse-server/config.xml
      - ../files/clickhouse/user_scripts:/var/lib/clickhouse/user_scripts/
      - ../files/clickhouse/cluster.xml:/etc/clickhouse-server/config.d/cluster.xml
      - clickhouse:/var/lib/clickhouse/
  signoz:
    !!merge <<: *db-depend
    image: signoz/signoz:v0.97.1
    command:
      - --config=/root/config/prometheus.yml
    ports:
      - "8080"
    volumes:
      - ../files/signoz/prometheus.yml:/root/config/prometheus.yml
      - sqlite:/var/lib/signoz/
    environment:
      - SIGNOZ_ALERTMANAGER_PROVIDER=signoz
      - SIGNOZ_TELEMETRYSTORE_CLICKHOUSE_DSN=tcp://clickhouse:9000
      - SIGNOZ_SQLSTORE_SQLITE_PATH=/var/lib/signoz/signoz.db
      - STORAGE=clickhouse
      - TELEMETRY_ENABLED=true
      - DEPLOYMENT_TYPE=docker-standalone-amd
      - DOT_METRICS_ENABLED=true
      - SIGNOZ_JWT_SECRET=${SIGNOZ_JWT_SECRET}
    healthcheck:
      test:
        - CMD
        - wget
        - --spider
        - -q
        - localhost:8080/api/v1/health
      interval: 30s
      timeout: 5s
      retries: 3
  otel-collector:
    !!merge <<: *db-depend
    image: signoz/signoz-otel-collector:v0.129.7
    command:
      - --config=/etc/otel-collector-config.yaml
    volumes:
      - ../files/collector/otel-collector-config.yaml:/etc/otel-collector-config.yaml
    ports:
      - "4317" # OTLP gRPC receiver
      - "4318" # OTLP HTTP receiver
    depends_on:
      signoz:
        condition: service_healthy
  schema-migrator-sync:
    !!merge <<: *common
    image: signoz/signoz-schema-migrator:v0.129.7
    command:
      - sync
      - --dsn=tcp://clickhouse:9000
      - --up=
    depends_on:
      clickhouse:
        condition: service_healthy
    restart: on-failure
  schema-migrator-async:
    !!merge <<: *db-depend
    image: signoz/signoz-schema-migrator:v0.129.7
    command:
      - async
      - --dsn=tcp://clickhouse:9000
      - --up=
    restart: on-failure
networks:
  signoz-net:
    name: signoz-net
volumes:
  clickhouse:
    name: signoz-clickhouse
  sqlite:
    name: signoz-sqlite
  zookeeper-1:
    name: signoz-zookeeper-1
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
