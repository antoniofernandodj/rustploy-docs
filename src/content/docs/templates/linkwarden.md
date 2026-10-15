---
title: Hospedar Linkwarden com Rustploy
description: "Gerenciador de links focado em arquivamento completo e preservação de páginas web. Crie Linkwarden em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Linkwarden**: Gerenciador de links focado em arquivamento completo e preservação de páginas web. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `linkwarden` |
| **Containers** | 2 (`linkwarden`, `postgres`) |
| **Imagens** | `ghcr.io/linkwarden/linkwarden:v2.9.3`, `postgres:17-alpine` |
| **Porta da interface** | 3000, no serviço `linkwarden` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Linkwarden** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória* |
| `next_secret` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `NEXTAUTH_SECRET` | ${next_secret} |
| `NEXTAUTH_URL` | http://${main_domain}/api/v1/auth |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `linkwarden` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  linkwarden:
    environment:
      - NEXTAUTH_SECRET
      - NEXTAUTH_URL
      - DATABASE_URL=postgresql://linkwarden:${POSTGRES_PASSWORD}@postgres:5432/linkwarden
    restart: unless-stopped
    image: ghcr.io/linkwarden/linkwarden:v2.9.3
    ports:
      - 3000
    volumes:
      - linkwarden-data:/data/data
    depends_on:
      - postgres
    healthcheck:
      test: curl --fail http://localhost:3000 || exit 1
      interval: 60s
      retries: 2
      start_period: 60s
      timeout: 15s

  postgres:
    image: postgres:17-alpine
    restart: unless-stopped
    user: postgres
    environment:
      POSTGRES_USER: linkwarden
      POSTGRES_DB: linkwarden
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  linkwarden-data:
  postgres-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
