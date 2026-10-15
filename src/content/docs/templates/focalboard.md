---
title: Hospedar Focalboard com Rustploy
description: "Gerenciador de tarefas em estilo Kanban (Alternativa ao Trello/Asana). Crie Focalboard em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Focalboard**: Gerenciador de tarefas em estilo Kanban (Alternativa ao Trello/Asana). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `focalboard` |
| **Containers** | 2 (`focalboard`, `postgres`) |
| **Imagens** | `mattermost/focalboard:7.11.4`, `postgres:17` |
| **Porta da interface** | 8000, no serviço `focalboard` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Focalboard** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `VIRTUAL_HOST` | ${main_domain} |
| `VIRTUAL_PORT` | 8000 # Do Not Alter |
| `DB_TYPE` | postgres |
| `POSTGRES_USER` | focalboard |
| `POSTGRES_PASSWORD` | *senha aleatória de 32 caracteres* |
| `POSTGRES_DB` | focalboard |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `focalboard` | 8000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3'

services:
  focalboard:
    image: mattermost/focalboard:7.11.4
    restart: unless-stopped
    volumes:
      - focalboardData:/opt/focalboard/data
    environment:
      - VIRTUAL_HOST
      - VIRTUAL_PORT
      - DB_TYPE
      - DB_CONFIG=postgres://${POSTGRES_USER}:${POSTGRES_password}@postgres:5432/${postgres_db}?sslmode=disable

  postgres:
    image: postgres:17
    environment:
      - POSTGRES_USER
      - POSTGRES_PASSWORD
      - POSTGRES_DB
    volumes:
      - ./postgres_data:/var/lib/postgresql/data

volumes:
  focalboardData:
    driver: local
  focalboardPostgre:
    driver: local
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
