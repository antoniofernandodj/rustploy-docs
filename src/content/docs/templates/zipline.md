---
title: Hospedar Zipline com Rustploy
description: "Servidor de upload rápido de arquivos otimizado para integração com ferramentas como ShareX. Crie Zipline em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Zipline**: Servidor de upload rápido de arquivos otimizado para integração com ferramentas como ShareX. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `zipline` |
| **Containers** | 2 (`postgres`, `zipline`) |
| **Imagens** | `postgres:15`, `ghcr.io/diced/zipline:v4` |
| **Porta da interface** | 3000, no serviço `zipline` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Zipline** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_base` | *chave base64 aleatória (64 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `ZIPLINE_PORT` | 3000 |
| `ZIPLINE_SECRET` | ${secret_base} |
| `ZIPLINE_RETURN_HTTPS` | false |
| `ZIPLINE_LOGGER` | true |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `zipline` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  postgres:
    image: postgres:15
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DATABASE=postgres
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  zipline:
    image: ghcr.io/diced/zipline:v4
    restart: unless-stopped
    environment:
      - CORE_RETURN_HTTPS=${ZIPLINE_RETURN_HTTPS}
      - CORE_SECRET=${ZIPLINE_SECRET}
      - CORE_HOSTNAME=0.0.0.0
      - CORE_PORT=${ZIPLINE_PORT}
      - DATABASE_URL=postgres://postgres:postgres@postgres/postgres
      - CORE_LOGGER=${ZIPLINE_LOGGER}
      - DATASOURCE_TYPE=local
      - DATASOURCE_LOCAL_DIRECTORY=./uploads
    volumes:
      - "../files/uploads:/zipline/uploads"
      - "../files/public:/zipline/public"
    depends_on:
      - "postgres"

volumes:
  pg_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
