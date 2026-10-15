---
title: Host Langflow with Rustploy
description: "Low-code interface for building RAG pipelines and AI agents. Create Langflow in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Langflow**: Low-code interface for building RAG pipelines and AI agents. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `langflow` |
| **Containers** | 2 (`langflow`, `postgres-langflow`) |
| **Images** | `langflowai/langflow:v1.1.1`, `postgres:16` |
| **UI port** | 7860, on service `langflow` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Langflow** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password* |
| `db_username` | langflow |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DB_PASSWORD` | ${db_password} |
| `DB_USERNAME` | ${db_username} |

## Domains

| Service | Port | Host |
|---|---|---|
| `langflow` | 7860 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  langflow:
    image: langflowai/langflow:v1.1.1
    ports:
      - 7860
    depends_on:
      - postgres-langflow
    environment:
      - LANGFLOW_DATABASE_URL=postgresql://${DB_USERNAME}:${DB_PASSWORD}@postgres-langflow:5432/langflow
      # This variable defines where the logs, file storage, monitor data and secret keys are stored.
    volumes:
      - langflow-data:/app/langflow


  postgres-langflow:
    image: postgres:16
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: langflow
    ports:
      - 5432
    volumes:
      - langflow-postgres:/var/lib/postgresql/data


volumes:
  langflow-postgres:
  langflow-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
