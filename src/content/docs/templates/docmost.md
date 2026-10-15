---
title: Hospedar Docmost com Rustploy
description: "Wiki colaborativa de código aberto para documentações de equipes. Crie Docmost em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Docmost**: Wiki colaborativa de código aberto para documentações de equipes. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `docmost` |
| **Containers** | 3 (`docmost`, `db`, `redis`) |
| **Imagens** | `docmost/docmost:0.4.1`, `postgres:16-alpine`, `redis:7.2-alpine` |
| **Porta da interface** | 3000, no serviço `docmost` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Docmost** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória* |
| `app_secret` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_DB` | docmost |
| `POSTGRES_USER` | docmost |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `APP_URL` | http://${main_domain}:3000 |
| `APP_SECRET` | ${app_secret} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `docmost` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3"

services:
  docmost:
    image: docmost/docmost:0.4.1
    depends_on:
      - db
      - redis
    environment:
      - APP_URL
      - APP_SECRET
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public
      - REDIS_URL=redis://redis:6379
    restart: unless-stopped

    volumes:
      - docmost:/app/data/storage

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB
      - POSTGRES_USER
      - POSTGRES_PASSWORD
    restart: unless-stopped

    volumes:
      - db_docmost_data:/var/lib/postgresql/data

  redis:
    image: redis:7.2-alpine
    restart: unless-stopped

    volumes:
      - redis_docmost_data:/data

volumes:
  docmost:
  db_docmost_data:
  redis_docmost_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
