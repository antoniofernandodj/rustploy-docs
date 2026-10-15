---
title: Hospedar InstantDB com Rustploy
description: "Banco de dados em tempo real com sincronização instantânea de estado em clients. Crie InstantDB em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**InstantDB**: Banco de dados em tempo real com sincronização instantânea de estado em clients. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `instantdb` |
| **Containers** | 2 (`postgres`, `server`) |
| **Imagens** | `ghcr.io/instantdb/postgresql:postgresql-16-pg-hint-plan`, `hari1367709/instantdb-server:latest` |
| **Porta da interface** | 8888, no serviço `server` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **InstantDB** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória de 32 caracteres* |
| `postgres_user` | instant |
| `postgres_db` | instant |
| `aws_access_key_id` | FILL-YOUR-CREDENTIALS |
| `aws_secret_access_key` | FILL-YOUR-CREDENTIALS |
| `aws_region` | us-east-1 |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_DB` | ${postgres_db} |
| `DATABASE_URL` | postgresql://${postgres_user}:${postgres_password}@postgres:5432/${postgres_db} |
| `NREPL_BIND_ADDRESS` | 0.0.0.0 |
| `PORT` | 8888 |
| `HOST` | 0.0.0.0 |
| `AWS_ACCESS_KEY_ID` | ${aws_access_key_id} |
| `AWS_SECRET_ACCESS_KEY` | ${aws_secret_access_key} |
| `AWS_REGION` | ${aws_region} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `server` | 8888 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  postgres:
    image: ghcr.io/instantdb/postgresql:postgresql-16-pg-hint-plan
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - backend-db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    command:
      - "postgres"
      - "-c"
      - "wal_level=logical"
      - "-c"
      - "max_replication_slots=4"
      - "-c"
      - "max_wal_senders=4"
      - "-c"
      - "shared_preload_libraries=pg_hint_plan"
      - "-c"
      - "random_page_cost=1.1"
  server:
    depends_on:
      postgres:
        condition: service_healthy
    image: hari1367709/instantdb-server:latest
    restart: unless-stopped
    working_dir: /app
    environment:
      DATABASE_URL: "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}"
      NREPL_BIND_ADDRESS: "0.0.0.0"
      PORT: "8888"
      HOST: "0.0.0.0"
      # AWS Credentials for KMS (required for InstantDB)
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_REGION: ${AWS_REGION:-us-east-1}
      # Force unbuffered output for logs
      PYTHONUNBUFFERED: "1"
      NODE_ENV: "production"
    command: ["java", "-Djava.awt.headless=true", "-server", "-jar", "target/instant-standalone.jar"]
    ports:
      - "8888"
      - "6005"
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8888/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
volumes:
  backend-db:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
