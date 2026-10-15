---
title: Hospedar Gitea Postgres com Rustploy
description: "Aplicação Gitea Postgres. Crie Gitea Postgres em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Gitea Postgres**: Aplicação Gitea Postgres. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `gitea-postgres` |
| **Containers** | 2 (`gitea`, `postgres`) |
| **Imagens** | `docker.gitea.com/gitea:1.24.4`, `docker.io/library/postgres:14` |
| **Porta da interface** | 3000, no serviço `gitea` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Gitea Postgres** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 24 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `USER_UID` | 1000 |
| `USER_GID` | 1000 |
| `GITEA__database__DB_TYPE` | postgres |
| `GITEA__database__HOST` | postgres:5432 |
| `GITEA__database__NAME` | gitea |
| `GITEA__database__USER` | gitea |
| `GITEA__database__PASSWD` | ${db_password} |
| `GITEA_DB_PASSWORD` | ${db_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `gitea` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  gitea:
    image: docker.gitea.com/gitea:1.24.4
    restart: unless-stopped
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - GITEA__database__DB_TYPE=postgres
      - GITEA__database__HOST=postgres:5432
      - GITEA__database__NAME=gitea
      - GITEA__database__USER=gitea
      - GITEA__database__PASSWD=${GITEA_DB_PASSWORD:-gitea}
    volumes:
      - gitea-data:/data
    expose:
      - "3000"
      - "22"
    depends_on:
      - postgres
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/"]
      interval: 15s
      timeout: 5s
      retries: 10

  postgres:
    image: docker.io/library/postgres:14
    restart: unless-stopped
    environment:
      - POSTGRES_USER=gitea
      - POSTGRES_PASSWORD=${GITEA_DB_PASSWORD:-gitea}
      - POSTGRES_DB=gitea
    volumes:
      - pg-data:/var/lib/postgresql/data
    expose:
      - "5432"

volumes:
  gitea-data: {}
  pg-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
