---
title: Hospedar Evolution API com Rustploy
description: "API de WhatsApp focada em automação para pequenas empresas. Crie Evolution API em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Evolution API**: API de WhatsApp focada em automação para pequenas empresas. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `evolutionapi` |
| **Containers** | 3 (`evolution-api`, `evolution-postgres`, `evolution-redis`) |
| **Imagens** | `evoapicloud/evolution-api:latest`, `postgres:16-alpine`, `redis:alpine` |
| **Porta da interface** | 8080, no serviço `evolution-api` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Evolution API** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `api_key` | *chave base64 aleatória (64 bytes)* |
| `postgres_password` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SERVER_URL` | https://${main_domain} |
| `AUTHENTICATION_TYPE` | apikey |
| `AUTHENTICATION_API_KEY` | ${api_key} |
| `AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES` | true |
| `LANGUAGE` | en |
| `CONFIG_SESSION_PHONE_CLIENT` | Evolution API |
| `CONFIG_SESSION_PHONE_NAME` | Chrome |
| `TELEMETRY` | false |
| `TELEMETRY_URL` |  |
| `POSTGRES_DATABASE` | evolution |
| `POSTGRES_USERNAME` | postgresql |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `DATABASE_ENABLED` | true |
| `DATABASE_PROVIDER` | postgresql |
| `DATABASE_CONNECTION_URI` | postgres://postgresql:${postgres_password}@evolution-postgres:5432/evolution |
| `DATABASE_SAVE_DATA_INSTANCE` | true |
| `DATABASE_SAVE_DATA_NEW_MESSAGE` | true |
| `DATABASE_SAVE_MESSAGE_UPDATE` | true |
| `DATABASE_SAVE_DATA_CONTACTS` | true |
| `DATABASE_SAVE_DATA_CHATS` | true |
| `DATABASE_SAVE_DATA_LABELS` | true |
| `DATABASE_SAVE_DATA_HISTORIC` | true |
| `CACHE_REDIS_ENABLED` | true |
| `CACHE_REDIS_URI` | redis://evolution-redis:6379 |
| `CACHE_REDIS_PREFIX_KEY` | evolution |
| `CACHE_REDIS_SAVE_INSTANCES` | true |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `evolution-api` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  evolution-api:
    image: evoapicloud/evolution-api:latest
    restart: always
    volumes:
      - evolution-instances:/evolution/instances

    environment:
      - SERVER_URL=${SERVER_URL}
      - AUTHENTICATION_TYPE=${AUTHENTICATION_TYPE}
      - AUTHENTICATION_API_KEY=${AUTHENTICATION_API_KEY}
      - AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=${AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES}
      - LANGUAGE=${LANGUAGE}
      - CONFIG_SESSION_PHONE_CLIENT=${CONFIG_SESSION_PHONE_CLIENT}
      - CONFIG_SESSION_PHONE_NAME=${CONFIG_SESSION_PHONE_NAME}
      - TELEMETRY=${TELEMETRY}
      - TELEMETRY_URL=${TELEMETRY_URL}
      - DATABASE_ENABLED=${DATABASE_ENABLED}
      - DATABASE_PROVIDER=${DATABASE_PROVIDER}
      - DATABASE_CONNECTION_URI=${DATABASE_CONNECTION_URI}
      - DATABASE_SAVE_DATA_INSTANCE=${DATABASE_SAVE_DATA_INSTANCE}
      - DATABASE_SAVE_DATA_NEW_MESSAGE=${DATABASE_SAVE_DATA_NEW_MESSAGE}
      - DATABASE_SAVE_MESSAGE_UPDATE=${DATABASE_SAVE_MESSAGE_UPDATE}
      - DATABASE_SAVE_DATA_CONTACTS=${DATABASE_SAVE_DATA_CONTACTS}
      - DATABASE_SAVE_DATA_CHATS=${DATABASE_SAVE_DATA_CHATS}
      - DATABASE_SAVE_DATA_LABELS=${DATABASE_SAVE_DATA_LABELS}
      - DATABASE_SAVE_DATA_HISTORIC=${DATABASE_SAVE_DATA_HISTORIC}
      - CACHE_REDIS_ENABLED=${CACHE_REDIS_ENABLED}
      - CACHE_REDIS_URI=${CACHE_REDIS_URI}
      - CACHE_REDIS_PREFIX_KEY=${CACHE_REDIS_PREFIX_KEY}
      - CACHE_REDIS_SAVE_INSTANCES=${CACHE_REDIS_SAVE_INSTANCES}

  evolution-postgres:
    image: postgres:16-alpine
    restart: always
    volumes:
      - evolution-postgres-data:/var/lib/postgresql/data

    environment:
      - POSTGRES_DB=${POSTGRES_DATABASE}
      - POSTGRES_USER=${POSTGRES_USERNAME}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

  evolution-redis:
    image: redis:alpine
    restart: always
    volumes:
      - evolution-redis-data:/data

volumes:
  evolution-instances:
  evolution-postgres-data:
  evolution-redis-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
