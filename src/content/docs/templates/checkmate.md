---
title: Hospedar Checkmate com Rustploy
description: "Monitor em tempo real de hardware, uptime de servidores e incidentes. Crie Checkmate em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Checkmate**: Monitor em tempo real de hardware, uptime de servidores e incidentes. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `checkmate` |
| **Containers** | 2 (`server`, `mongodb`) |
| **Imagens** | `ghcr.io/bluewave-labs/checkmate-backend-mono:latest`, `ghcr.io/bluewave-labs/checkmate-mongo:latest` |
| **Porta da interface** | 52345, no serviço `server` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Checkmate** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `jwt_secret` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `UPTIME_APP_API_BASE_URL` | http://${main_domain}:52345/api/v1 |
| `UPTIME_APP_CLIENT_HOST` | http://${main_domain} |
| `DB_CONNECTION_STRING` | mongodb://mongodb:27017/uptime_db?replicaSet=rs0 |
| `REDIS_URL` | redis://redis:6379 |
| `CLIENT_HOST` | http://${main_domain} |
| `JWT_SECRET` | *JWT gerado* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `server` | 52345 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  server:
    image: ghcr.io/bluewave-labs/checkmate-backend-mono:latest
    restart: always
    ports:
      - 52345
    environment:
      - UPTIME_APP_API_BASE_URL=${UPTIME_APP_API_BASE_URL}
      - UPTIME_APP_CLIENT_HOST=${UPTIME_APP_CLIENT_HOST}
      - DB_CONNECTION_STRING=${DB_CONNECTION_STRING}
      - REDIS_URL=${REDIS_URL}
      - CLIENT_HOST=${CLIENT_HOST}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb
  mongodb:
    image: ghcr.io/bluewave-labs/checkmate-mongo:latest
    restart: always
    command: ["mongod", "--quiet", "--replSet", "rs0", "--bind_ip_all"]
    volumes:
      - ../files/mongo-data:/data/db
    healthcheck:
      test: echo "try { rs.status() } catch (err) { rs.initiate({_id:'rs0',members:[{_id:0,host:'mongodb:27017'}]}) }" | mongosh --port 27017 --quiet
      interval: 5s
      timeout: 30s
      start_period: 0s
      start_interval: 1s
      retries: 30
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
