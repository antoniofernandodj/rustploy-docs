---
title: Hospedar Zabbix com Rustploy
description: "Monitor corporativo robusto para redes, servidores e serviços com suporte a banco de dados PostgreSQL. Crie Zabbix em um clique no Rustploy: 5 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Zabbix**: Monitor corporativo robusto para redes, servidores e serviços com suporte a banco de dados PostgreSQL. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `zabbix` |
| **Containers** | 5 (`postgres`, `zabbix-java-gateway`, `zabbix-snmptraps`, `zabbix-server-pgsql`, `zabbix-web-nginx-pgsql`) |
| **Imagens** | `postgres:16-alpine`, `zabbix/zabbix-java-gateway:alpine-7.4-latest`, `zabbix/zabbix-snmptraps:alpine-7.4-latest`, `zabbix/zabbix-server-pgsql:alpine-7.4-latest`, `zabbix/zabbix-web-nginx-pgsql:alpine-7.4-latest` |
| **Porta da interface** | 8080, no serviço `zabbix-web-nginx-pgsql` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Zabbix** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_DB` | zabbix |
| `POSTGRES_USER` | zabbix |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `PHP_TZ` | UTC |
| `ZBX_SERVER_NAME` | Dokploy Zabbix Monitoring |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `zabbix-web-nginx-pgsql` | 8080 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
