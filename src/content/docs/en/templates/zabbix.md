---
title: Host Zabbix with Rustploy
description: "Robust enterprise monitor for networks, servers and services with PostgreSQL support. Create Zabbix in one click on Rustploy: 5 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Zabbix**: Robust enterprise monitor for networks, servers and services with PostgreSQL support. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `zabbix` |
| **Containers** | 5 (`postgres`, `zabbix-java-gateway`, `zabbix-snmptraps`, `zabbix-server-pgsql`, `zabbix-web-nginx-pgsql`) |
| **Images** | `postgres:16-alpine`, `zabbix/zabbix-java-gateway:alpine-7.4-latest`, `zabbix/zabbix-snmptraps:alpine-7.4-latest`, `zabbix/zabbix-server-pgsql:alpine-7.4-latest`, `zabbix/zabbix-web-nginx-pgsql:alpine-7.4-latest` |
| **UI port** | 8080, on service `zabbix-web-nginx-pgsql` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Zabbix** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_DB` | zabbix |
| `POSTGRES_USER` | zabbix |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `PHP_TZ` | UTC |
| `ZBX_SERVER_NAME` | Dokploy Zabbix Monitoring |

## Domains

| Service | Port | Host |
|---|---|---|
| `zabbix-web-nginx-pgsql` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - zabbix-postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  zabbix-java-gateway:
    image: zabbix/zabbix-java-gateway:alpine-7.4-latest
    restart: unless-stopped

  zabbix-snmptraps:
    image: zabbix/zabbix-snmptraps:alpine-7.4-latest
    restart: unless-stopped
    volumes:
      - zabbix-snmptraps:/var/lib/zabbix/snmptraps
      - zabbix-mibs:/var/lib/zabbix/mibs

  zabbix-server-pgsql:
    image: zabbix/zabbix-server-pgsql:alpine-7.4-latest
    restart: unless-stopped
    environment:
      DB_SERVER_HOST: postgres
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
      ZBX_ENABLE_SNMP_TRAPS: "true"
      ZBX_JAVAGATEWAY: zabbix-java-gateway
    depends_on:
      postgres:
        condition: service_healthy
      zabbix-java-gateway:
        condition: service_started
      zabbix-snmptraps:
        condition: service_started
    volumes:
      - zabbix-server-data:/var/lib/zabbix
      - zabbix-snmptraps:/var/lib/zabbix/snmptraps
      - zabbix-mibs:/var/lib/zabbix/mibs
    expose:
      - 10051
    healthcheck:
      test: ["CMD", "pgrep", "zabbix_server"]
      interval: 10s
      timeout: 5s
      retries: 5

  zabbix-web-nginx-pgsql:
    image: zabbix/zabbix-web-nginx-pgsql:alpine-7.4-latest
    restart: unless-stopped
    environment:
      DB_SERVER_HOST: postgres
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
      ZBX_SERVER_HOST: zabbix-server-pgsql
      PHP_TZ: ${PHP_TZ}
      ZBX_SERVER_NAME: ${ZBX_SERVER_NAME}
    depends_on:
      zabbix-server-pgsql:
        condition: service_healthy
    expose:
      - 8080
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  zabbix-postgres-data:
  zabbix-server-data:
  zabbix-snmptraps:
  zabbix-mibs:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
