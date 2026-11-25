---
title: Host LibreChat with Rustploy
description: "Advanced, unified interface for chatting with multiple AI providers (Ollama, OpenAI, Anthropic). Create LibreChat in one click on Rustploy: 5 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**LibreChat**: Advanced, unified interface for chatting with multiple AI providers (Ollama, OpenAI, Anthropic). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `librechat` |
| **Containers** | 5 (`librechat`, `mongodb`, `meilisearch`, `vectordb`, `rag_api`) |
| **Images** | `ghcr.io/danny-avila/librechat-dev:latest`, `mongo`, `getmeili/meilisearch:v1.12.3`, `pgvector/pgvector:0.8.0-pg15-trixie`, `ghcr.io/danny-avila/librechat-rag-api-dev-lite:latest` |
| **UI port** | 3080, on service `librechat` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **LibreChat** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `jwt_secret` | *random password, 64 characters* |
| `jwt_refresh_secret` | *random password, 64 characters* |
| `creds_key` | f34be427ebb29de8d88c107a71546019685ed8b241d8f2ed00c3df97ad2566f0 |
| `creds_iv` | e2341419ec3dd3d19b13a1a87fafcbfb |
| `meili_master_key` | *random password, 32 characters* |
| `mongo_password` | *random password, 16 characters* |
| `postgresql_password` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `HOST` | 0.0.0.0 |
| `PORT` | 3080 |
| `DOMAIN_CLIENT` | https://${main_domain} |
| `DOMAIN_SERVER` | https://${main_domain} |
| `MEILI_MASTER_KEY` | ${meili_master_key} |
| `JWT_SECRET` | *generated JWT* |
| `JWT_REFRESH_SECRET` | *generated JWT* |
| `CREDS_KEY` | ${creds_key} |
| `CREDS_IV` | ${creds_iv} |
| `OPENAI_API_KEY` |  |
| `ANTHROPIC_API_KEY` |  |
| `GOOGLE_KEY` |  |
| `OPENROUTER_KEY` |  |
| `POSTGRES_DB` | librechat_db |
| `POSTGRES_USER` | librechat_user |
| `POSTGRES_PASSWORD` | ${postgresql_password} |
| `APP_TITLE` | LibreChat |
| `CUSTOM_FOOTER` | Made with ❤️ by LibreChat |
| `ALLOW_EMAIL_LOGIN` | true |
| `ALLOW_REGISTRATION` | false |
| `ALLOW_SOCIAL_LOGIN` | false |
| `RAG_OPENAI_API_KEY` |  |
| `RAG_GOOGLE_API_KEY` |  |
| `EMBEDDINGS_PROVIDER` | openai |
| `EMBEDDINGS_MODEL` | text-embedding-3-small |
| `CHUNK_SIZE` | 1500 |
| `CHUNK_OVERLAP` | 100 |

## Domains

| Service | Port | Host |
|---|---|---|
| `librechat` | 3080 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `librechat.yaml`

## The template docker-compose.yml

```yaml
# LibreChat Docker Compose for Dokploy Template
# Setting up authentication: "npm run create-user", refer to https://www.librechat.ai/docs/configuration/authentication

services:
  librechat:
    image: ghcr.io/danny-avila/librechat-dev:latest
    restart: always
    depends_on:
      - mongodb
      - rag_api
    environment:
      # Server Configuration
      - HOST=0.0.0.0
      - PORT=${PORT:-3080}
      # Domain Configuration
      - DOMAIN_CLIENT=${DOMAIN_CLIENT}
      - DOMAIN_SERVER=${DOMAIN_SERVER}
      # Database and Search Configuration
      - MONGO_URI=mongodb://mongodb:27017/LibreChat
      - MEILI_HOST=http://meilisearch:7700
      - SEARCH=true
      - NO_INDEX=true
      - MEILI_NO_ANALYTICS=true
      - MEILI_MASTER_KEY=${MEILI_MASTER_KEY}
      # Security & Sessions
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - CREDS_KEY=${CREDS_KEY}
      - CREDS_IV=${CREDS_IV}
      - RAG_PORT=${RAG_PORT:-8000}
      - RAG_API_URL=http://rag_api:${RAG_PORT:-8000}
      # API Keys and Secrets
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPENROUTER_KEY=${OPENROUTER_KEY}
      - GOOGLE_KEY=${GOOGLE_KEY}
      - ENDPOINTS=google,openAI,assistants,azureOpenAI,anthropic
      # ... Additional Endpoints
      # UI
      - APP_TITLE=${APP_TITLE:-LibreChat}
      - CUSTOM_FOOTER=${CUSTOM_FOOTER:-Made with ❤️ by LibreChat}
      - ALLOW_EMAIL_LOGIN=${ALLOW_EMAIL_LOGIN:-true}
      - ALLOW_SOCIAL_LOGIN=${ALLOW_SOCIAL_LOGIN:-false}
      - ALLOW_REGISTRATION=${ALLOW_REGISTRATION:-false}
    volumes:
      - type: bind
        source: ../files/librechat.yaml
        target: /app/librechat.yaml
      - librechat_data:/app/client/public/images
      - librechat_data:/app/uploads
      - librechat_data:/app/logs

  mongodb:
    image: mongo
    restart: always
    volumes:
      - mongo_data:/data/db
    command: mongod --noauth

  meilisearch:
    image: getmeili/meilisearch:v1.12.3
    restart: always
    environment:
      - MEILI_HOST=http://meilisearch:7700
      - MEILI_NO_ANALYTICS=true
      - MEILI_MASTER_KEY=${MEILI_MASTER_KEY}
    volumes:
      - meili_data:/meili_data

  vectordb:
    image: pgvector/pgvector:0.8.0-pg15-trixie
    environment:
      - POSTGRES_DB=${POSTGRES_DB:-mydatabase}
      - POSTGRES_USER=${POSTGRES_USER:-myuser}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-mypassword}
    restart: always
    volumes:
      - postgres_data:/var/lib/postgresql/data

  rag_api:
    image: ghcr.io/danny-avila/librechat-rag-api-dev-lite:latest
    environment:
      - DB_HOST=vectordb
      - VECTOR_DB_TYPE=pgvector
      - POSTGRES_DB=${POSTGRES_DB:-mydatabase}
      - POSTGRES_USER=${POSTGRES_USER:-myuser}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-mypassword}
      - RAG_PORT=${RAG_PORT:-8000}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - RAG_OPENAI_API_KEY=${RAG_OPENAI_API_KEY}
      - GOOGLE_KEY=${GOOGLE_KEY}
      - RAG_GOOGLE_API_KEY=${RAG_GOOGLE_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - COLLECTION_NAME=${COLLECTION_NAME:-librechat_collection}
      - CHUNK_SIZE=${CHUNK_SIZE:-1500}
      - CHUNK_OVERLAP=${CHUNK_OVERLAP:-100}
      - EMBEDDINGS_PROVIDER=${EMBEDDINGS_PROVIDER:-openai}
      - EMBEDDINGS_MODEL=${EMBEDDINGS_MODEL:-text-embedding-3-small}
      - DEBUG_RAG_API=false
      - DEBUG_PGVECTOR_QUERIES=false
      - CONSOLE_JSON=false
    restart: always
    depends_on:
      - vectordb

volumes:
  mongo_data:
  meili_data:
  postgres_data:
  librechat_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
