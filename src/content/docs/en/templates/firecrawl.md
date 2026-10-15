---
title: Host Firecrawl with Rustploy
description: "Web scraping API that turns any URL into clean Markdown for LLMs. Create Firecrawl in one click on Rustploy: 6 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Firecrawl**: Web scraping API that turns any URL into clean Markdown for LLMs. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `firecrawl` |
| **Containers** | 6 (`playwright-service`, `api`, `worker`, `extract-worker`, `redis`, `nuq-postgres`) |
| **Images** | `ghcr.io/firecrawl/playwright-service:latest`, `redis:alpine` |
| **UI port** | 3002, on service `api` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Firecrawl** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `openai_api_key` | ${OPENAI_API_KEY} |
| `openai_base_url` | ${OPENAI_BASE_URL} |
| `ollama_base_url` | ${OLLAMA_BASE_URL} |
| `model_name` | ${MODEL_NAME} |
| `model_embedding_name` | ${MODEL_EMBEDDING_NAME} |
| `proxy_server` | ${PROXY_SERVER} |
| `proxy_username` | ${PROXY_USERNAME} |
| `proxy_password` | ${PROXY_PASSWORD} |
| `searxng_endpoint` | ${SEARXNG_ENDPOINT} |
| `searxng_engines` | ${SEARXNG_ENGINES} |
| `searxng_categories` | ${SEARXNG_CATEGORIES} |
| `supabase_anon_token` | ${SUPABASE_ANON_TOKEN} |
| `supabase_url` | ${SUPABASE_URL} |
| `supabase_service_token` | ${SUPABASE_SERVICE_TOKEN} |
| `test_api_key` | ${TEST_API_KEY} |
| `bull_auth_key` | *random password, 32 characters* |
| `llamaparse_api_key` | ${LLAMAPARSE_API_KEY} |
| `slack_webhook_url` | ${SLACK_WEBHOOK_URL} |
| `posthog_api_key` | ${POSTHOG_API_KEY} |
| `posthog_host` | ${POSTHOG_HOST} |
| `max_cpu` | ${MAX_CPU} |
| `max_ram` | ${MAX_RAM} |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `PORT` | 3002 |
| `HOST` | 0.0.0.0 |
| `USE_DB_AUTHENTICATION` | false |
| `BULL_AUTH_KEY` | ${bull_auth_key} |
| `PLAYWRIGHT_MICROSERVICE_URL` | http://playwright-service:3000/scrape |
| `REDIS_URL` | redis://redis:6379 |
| `REDIS_RATE_LIMIT_URL` | redis://redis:6379 |
| `OPENAI_API_KEY` | ${openai_api_key} |
| `OPENAI_BASE_URL` | ${openai_base_url} |
| `OLLAMA_BASE_URL` | ${ollama_base_url} |
| `MODEL_NAME` | ${model_name} |
| `MODEL_EMBEDDING_NAME` | ${model_embedding_name} |
| `PROXY_SERVER` | ${proxy_server} |
| `PROXY_USERNAME` | ${proxy_username} |
| `PROXY_PASSWORD` | ${proxy_password} |
| `SEARXNG_ENDPOINT` | ${searxng_endpoint} |
| `SEARXNG_ENGINES` | ${searxng_engines} |
| `SEARXNG_CATEGORIES` | ${searxng_categories} |
| `SUPABASE_ANON_TOKEN` | ${supabase_anon_token} |
| `SUPABASE_URL` | ${supabase_url} |
| `SUPABASE_SERVICE_TOKEN` | ${supabase_service_token} |
| `TEST_API_KEY` | ${test_api_key} |
| `LLAMAPARSE_API_KEY` | ${llamaparse_api_key} |
| `SLACK_WEBHOOK_URL` | ${slack_webhook_url} |
| `POSTHOG_API_KEY` | ${posthog_api_key} |
| `POSTHOG_HOST` | ${posthog_host} |
| `MAX_CPU` | 0.8 |
| `MAX_RAM` | 0.8 |

## Domains

| Service | Port | Host |
|---|---|---|
| `api` | 3002 | ${main_domain} |

## The template docker-compose.yml

```yaml
name: firecrawl
 
x-common-service: &common-service
  image: ghcr.io/firecrawl/firecrawl:latest
  ulimits:
    nofile:
      soft: 65535
      hard: 65535
  extra_hosts:
    - "host.docker.internal:host-gateway"
 
x-common-env: &common-env
  REDIS_URL: ${REDIS_URL:-redis://redis:6379}
  REDIS_RATE_LIMIT_URL: ${REDIS_RATE_LIMIT_URL:-redis://redis:6379}
  PLAYWRIGHT_MICROSERVICE_URL: ${PLAYWRIGHT_MICROSERVICE_URL:-http://playwright-service:3000/scrape}
  NUQ_DATABASE_URL: ${NUQ_DATABASE_URL:-postgres://postgres:postgres@nuq-postgres:5432/postgres}
  USE_DB_AUTHENTICATION: ${USE_DB_AUTHENTICATION:-}
  OPENAI_API_KEY: ${OPENAI_API_KEY:-}
  OPENAI_BASE_URL: ${OPENAI_BASE_URL:-}
  MODEL_NAME: ${MODEL_NAME:-}
  MODEL_EMBEDDING_NAME: ${MODEL_EMBEDDING_NAME:-}
  OLLAMA_BASE_URL: ${OLLAMA_BASE_URL:-}
  SLACK_WEBHOOK_URL: ${SLACK_WEBHOOK_URL:-}
  BULL_AUTH_KEY: ${BULL_AUTH_KEY:-}
  TEST_API_KEY: ${TEST_API_KEY:-}
  POSTHOG_API_KEY: ${POSTHOG_API_KEY:-}
  POSTHOG_HOST: ${POSTHOG_HOST:-}
  SUPABASE_ANON_TOKEN: ${SUPABASE_ANON_TOKEN:-}
  SUPABASE_URL: ${SUPABASE_URL:-}
  SUPABASE_SERVICE_TOKEN: ${SUPABASE_SERVICE_TOKEN:-}
  SELF_HOSTED_WEBHOOK_URL: ${SELF_HOSTED_WEBHOOK_URL:-}
  SERPER_API_KEY: ${SERPER_API_KEY:-}
  SEARCHAPI_API_KEY: ${SEARCHAPI_API_KEY:-}
  LOGGING_LEVEL: ${LOGGING_LEVEL:-INFO}
  PROXY_SERVER: ${PROXY_SERVER:-}
  PROXY_USERNAME: ${PROXY_USERNAME:-}
  PROXY_PASSWORD: ${PROXY_PASSWORD:-}
  NO_PROXY: ${NO_PROXY:-localhost,127.0.0.1,redis,nuq-postgres,playwright-service,host.docker.internal}
  SEARXNG_ENDPOINT: ${SEARXNG_ENDPOINT:-}
  SEARXNG_ENGINES: ${SEARXNG_ENGINES:-}
  SEARXNG_CATEGORIES: ${SEARXNG_CATEGORIES:-}
 
services:
  playwright-service:
    image: ghcr.io/firecrawl/playwright-service:latest
    shm_size: "1g"
    restart: unless-stopped
    environment:
      PORT: 3000
      PROXY_SERVER: ${PROXY_SERVER:-}
      PROXY_USERNAME: ${PROXY_USERNAME:-}
      PROXY_PASSWORD: ${PROXY_PASSWORD:-}
      BLOCK_MEDIA: ${BLOCK_MEDIA:-}
      NO_PROXY: ${NO_PROXY:-localhost,127.0.0.1,redis,nuq-postgres,playwright-service,host.docker.internal}
 
  api:
    <<: *common-service
    restart: unless-stopped
    ports:
      - "3002"
    environment:
      <<: *common-env
      HOST: "0.0.0.0"
      PORT: 3002
      WORKER_PORT: 3005
      ENV: local
    depends_on:
      redis:
        condition: service_started
      playwright-service:
        condition: service_started
      nuq-postgres:
        condition: service_healthy
    command: node --import ./dist/src/otel.js dist/src/index.js
 
  worker:
    <<: *common-service
    restart: unless-stopped
    environment:
      <<: *common-env
      HOST: "0.0.0.0"
      PORT: 3005
      ENV: local
    depends_on:
      redis:
        condition: service_started
      nuq-postgres:
        condition: service_healthy
    command: node --import ./dist/src/otel.js dist/src/services/queue-worker.js
 
  extract-worker:
    <<: *common-service
    restart: unless-stopped
    environment:
      <<: *common-env
      HOST: "0.0.0.0"
      PORT: 3004
      ENV: local
    depends_on:
      redis:
        condition: service_started
      nuq-postgres:
        condition: service_healthy
    command: node --import ./dist/src/otel.js dist/src/services/extract-worker.js
 
  redis:
    image: redis:alpine
    command: redis-server --bind 0.0.0.0
 
  nuq-postgres:
    build:
      context: "https://github.com/firecrawl/firecrawl.git#main:apps/nuq-postgres"
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    volumes:
      - nuq_pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      start_period: 30s
      interval: 10s
      timeout: 5s
      retries: 10
 
volumes:
  nuq_pg_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
