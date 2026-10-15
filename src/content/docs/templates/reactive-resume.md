---
title: Hospedar Reactive Resume com Rustploy
description: "Gerador moderno de currículos baseado em seções estruturadas com exportação limpa. Crie Reactive Resume em um clique no Rustploy: 4 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Reactive Resume**: Gerador moderno de currículos baseado em seções estruturadas com exportação limpa. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `reactive-resume` |
| **Containers** | 4 (`postgres`, `minio`, `chrome`, `app`) |
| **Imagens** | `postgres:16-alpine`, `minio/minio:latest`, `ghcr.io/browserless/chromium:v2.18.0`, `amruthpillai/reactive-resume:latest` |
| **Porta da interface** | 3000, no serviço `app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Reactive Resume** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória de 32 caracteres* |
| `minio_user` | minioadmin |
| `minio_password` | *senha aleatória de 32 caracteres* |
| `chrome_token` | *senha aleatória de 32 caracteres* |
| `access_token_secret` | *senha aleatória de 64 caracteres* |
| `refresh_token_secret` | *senha aleatória de 64 caracteres* |
| `mail_from` | noreply@${main_domain} |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `APP_DOMAIN` | ${main_domain} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `MINIO_ROOT_USER` | ${minio_user} |
| `MINIO_ROOT_PASSWORD` | ${minio_password} |
| `CHROME_TOKEN` | ${chrome_token} |
| `ACCESS_TOKEN_SECRET` | ${access_token_secret} |
| `REFRESH_TOKEN_SECRET` | ${refresh_token_secret} |
| `MAIL_FROM` | ${mail_from} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `app` | 3000 | ${main_domain} |
| `minio` | 9000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    command: server /data
    volumes:
      - minio_data:/data
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}

  chrome:
    image: ghcr.io/browserless/chromium:v2.18.0
    extra_hosts:
      - "host.docker.internal:host-gateway"
    environment:
      TIMEOUT: 10000
      CONCURRENT: 10
      TOKEN: ${CHROME_TOKEN}
      EXIT_ON_HEALTH_FAILURE: "true"
      PRE_REQUEST_HEALTH_CHECK: "true"

  app:
    image: amruthpillai/reactive-resume:latest
    depends_on:
      - postgres
      - minio
      - chrome
    environment:
      PORT: 3000
      NODE_ENV: production
      PUBLIC_URL: https://${APP_DOMAIN}
      STORAGE_URL: https://${APP_DOMAIN}/default
      CHROME_TOKEN: ${CHROME_TOKEN}
      CHROME_URL: ws://chrome:3000
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/postgres
      ACCESS_TOKEN_SECRET: ${ACCESS_TOKEN_SECRET}
      REFRESH_TOKEN_SECRET: ${REFRESH_TOKEN_SECRET}
      MAIL_FROM: ${MAIL_FROM}
      STORAGE_ENDPOINT: minio
      STORAGE_PORT: 9000
      STORAGE_REGION: us-east-1
      STORAGE_BUCKET: default
      STORAGE_ACCESS_KEY: ${MINIO_ROOT_USER}
      STORAGE_SECRET_KEY: ${MINIO_ROOT_PASSWORD}
      STORAGE_USE_SSL: "false"
      STORAGE_SKIP_BUCKET_CHECK: "false"


volumes:
  minio_data:
  postgres_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
