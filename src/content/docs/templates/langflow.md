---
title: Hospedar Langflow com Rustploy
description: "Interface low-code focada na criação de pipelines de RAG e agentes de IA. Crie Langflow em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Langflow**: Interface low-code focada na criação de pipelines de RAG e agentes de IA. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `langflow` |
| **Containers** | 2 (`langflow`, `postgres-langflow`) |
| **Imagens** | `langflowai/langflow:v1.1.1`, `postgres:16` |
| **Porta da interface** | 7860, no serviço `langflow` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Langflow** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória* |
| `db_username` | langflow |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DB_PASSWORD` | ${db_password} |
| `DB_USERNAME` | ${db_username} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `langflow` | 7860 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
