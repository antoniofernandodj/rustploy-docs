---
title: Hospedar Lowcoder com Rustploy
description: "Construtor visual rápido de aplicações e painéis de dados corporativos. Crie Lowcoder em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Lowcoder**: Construtor visual rápido de aplicações e painéis de dados corporativos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `lowcoder` |
| **Containers** | 1 (`lowcoder-api-service`) |
| **Imagens** | `lowcoderorg/lowcoder-ce:2.6.4` |
| **Porta da interface** | 3000, no serviço `lowcoder-api-service` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Lowcoder** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `encryption_password` | *senha aleatória de 32 caracteres* |
| `encryption_salt` | *senha aleatória de 32 caracteres* |
| `api_secret` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `ENABLE_USER_SIGN_UP` | false |
| `ENCRYPTION_PASSWORD` | ${encryption_password} |
| `ENCRYPTION_SALT` | ${encryption_salt} |
| `CORS_ALLOWED_DOMAINS` | * |
| `LOWCODER_API_KEY_SECRET` | ${api_secret} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `lowcoder-api-service` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3"

services:
  ## Start Lowcoder (all-in-one)
  lowcoder-api-service:
    image: lowcoderorg/lowcoder-ce:2.6.4
    environment:
      REDIS_ENABLED: "true"
      MONGODB_ENABLED: "true"
      API_SERVICE_ENABLED: "true"
      NODE_SERVICE_ENABLED: "true"
      FRONTEND_ENABLED: "true"
      PUID: "1000"
      PGID: "1000"
      DEFAULT_ORGS_PER_USER: 100
      DEFAULT_ORG_MEMBER_COUNT: 1000
      DEFAULT_ORG_GROUP_COUNT: 100
      DEFAULT_ORG_APP_COUNT: 1000
      DEFAULT_DEVELOPER_COUNT: 50
      MONGODB_URL: "mongodb://localhost:27017/lowcoder?authSource=admin"
      REDIS_URL: "redis://localhost:6379"
      ENABLE_USER_SIGN_UP: ${ENABLE_USER_SIGN_UP}
      ENCRYPTION_PASSWORD: ${ENCRYPTION_PASSWORD}
      ENCRYPTION_SALT: ${ENCRYPTION_SALT}
      CORS_ALLOWED_DOMAINS: ${CORS_ALLOWED_DOMAINS}
      LOWCODER_API_KEY_SECRET: ${LOWCODER_API_KEY_SECRET}
      LOWCODER_API_SERVICE_URL: "http://localhost:8080"
      LOWCODER_NODE_SERVICE_URL: "http://localhost:6060"
    volumes:
      - ../files/volumes/lowcoder-stacks:/lowcoder-stacks
    restart: unless-stopped
    expose: 
      - 3000
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
