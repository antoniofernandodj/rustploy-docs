---
title: Hospedar Outline com Rustploy
description: "Base de conhecimento corporativa moderna e extremamente limpa para equipes ágeis. Crie Outline em um clique no Rustploy: 4 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Outline**: Base de conhecimento corporativa moderna e extremamente limpa para equipes ágeis. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `outline` |
| **Containers** | 4 (`outline`, `dex`, `postgres`, `redis`) |
| **Imagens** | `outlinewiki/outline:0.82.0`, `ghcr.io/dexidp/dex:v2.37.0`, `postgres:15`, `redis:latest` |
| **Porta da interface** | 3000, no serviço `outline` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Outline** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `dex_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_key` | *hash aleatório* |
| `utils_secret` | *chave base64 aleatória (32 bytes)* |
| `client_secret` | *chave base64 aleatória (32 bytes)* |
| `postgres_password` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `URL` | http://${main_domain} |
| `DEX_URL` | http://${dex_domain} |
| `DOMAIN_NAME` | ${main_domain} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `SECRET_KEY` | ${secret_key} |
| `UTILS_SECRET` | ${utils_secret} |
| `CLIENT_SECRET` | ${client_secret} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `outline` | 3000 | ${main_domain} |
| `dex` | 5556 | ${dex_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/etc/dex/config.yaml`

## docker-compose.yml do template

```yaml
services:
  outline:
    image: outlinewiki/outline:0.82.0
    restart: always
    depends_on:
      - postgres
      - redis
      - dex
    ports:
      - 3000
    environment:
      NODE_ENV: production
      URL: ${URL}
      FORCE_HTTPS: 'false'
      SECRET_KEY: ${SECRET_KEY}
      UTILS_SECRET: ${UTILS_SECRET}
      DATABASE_URL: postgres://outline:${POSTGRES_PASSWORD}@postgres:5432/outline
      PGSSLMODE: disable
      REDIS_URL: redis://redis:6379
      OIDC_CLIENT_ID: outline
      OIDC_CLIENT_SECRET: ${CLIENT_SECRET}
      OIDC_AUTH_URI: ${DEX_URL}/auth
      OIDC_TOKEN_URI: ${DEX_URL}/token
      OIDC_USERINFO_URI: ${DEX_URL}/userinfo

  dex:
    image: ghcr.io/dexidp/dex:v2.37.0
    restart: always
    volumes:
      - ../files/etc/dex/config.yaml:/etc/dex/config.yaml
    command:
      - dex
      - serve
      - /etc/dex/config.yaml
    ports:
      - 5556

  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_DB: outline
      POSTGRES_USER: outline
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data-test-outline-khufpx:/var/lib/postgresql/data

  redis:
    image: redis:latest
    restart: always
    command: redis-server --appendonly yes
    volumes:
      - redis_data-test-outline-khufpx:/data
    
volumes:
  postgres_data-test-outline-khufpx:
  redis_data-test-outline-khufpx:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
