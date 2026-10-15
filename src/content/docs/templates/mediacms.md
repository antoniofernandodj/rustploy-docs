---
title: Hospedar MediaCMS com Rustploy
description: "CMS moderno focado em streaming de vídeo, canais e compartilhamento de mídia. Crie MediaCMS em um clique no Rustploy: 6 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**MediaCMS**: CMS moderno focado em streaming de vídeo, canais e compartilhamento de mídia. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `mediacms` |
| **Containers** | 6 (`migrations`, `web`, `celery_beat`, `celery_worker`, `db`, `redis`) |
| **Imagens** | `mediacms/mediacms:latest`, `postgres:17.2-alpine`, `redis:alpine` |
| **Porta da interface** | 80, no serviço `web` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **MediaCMS** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória* |
| `admin_password` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `ADMIN_PASSWORD` | ${admin_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `web` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3"

services:
  migrations:
    image: mediacms/mediacms:latest
    volumes:
      - mediacms_data:/home/mediacms.io/mediacms/media
      - mediacms_static:/home/mediacms.io/mediacms/staticfiles
    environment:
      ENABLE_UWSGI: 'no'
      ENABLE_NGINX: 'no'
      ENABLE_CELERY_SHORT: 'no'
      ENABLE_CELERY_LONG: 'no'
      ENABLE_CELERY_BEAT: 'no'
      ENABLE_MIGRATIONS: 'yes'
      ADMIN_USER: 'admin'
      ADMIN_EMAIL: 'admin@localhost'
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      DATABASE_HOST: db
      DATABASE_PORT: 5432
      DATABASE_USER: mediacms
      DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
      DATABASE_NAME: mediacms
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
    command: "./deploy/docker/prestart.sh"
    restart: on-failure
    depends_on:
      redis:
        condition: service_healthy
      db:
        condition: service_healthy

  web:
    image: mediacms/mediacms:latest
    deploy:
      replicas: 1
    ports:
      - 80
    volumes:
      - mediacms_data:/home/mediacms.io/mediacms/media
      - mediacms_static:/home/mediacms.io/mediacms/staticfiles
    environment:
      ENABLE_CELERY_BEAT: 'no'
      ENABLE_CELERY_SHORT: 'no'
      ENABLE_CELERY_LONG: 'no'
      ENABLE_MIGRATIONS: 'no'
      DATABASE_HOST: db
      DATABASE_PORT: 5432
      DATABASE_USER: mediacms
      DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
      DATABASE_NAME: mediacms
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      - migrations

  celery_beat:
    image: mediacms/mediacms:latest
    volumes:
      - mediacms_data:/home/mediacms.io/mediacms/media
      - mediacms_static:/home/mediacms.io/mediacms/staticfiles
    environment:
      ENABLE_UWSGI: 'no'
      ENABLE_NGINX: 'no'
      ENABLE_CELERY_SHORT: 'no'
      ENABLE_CELERY_LONG: 'no'
      ENABLE_MIGRATIONS: 'no'
      DATABASE_HOST: db
      DATABASE_PORT: 5432
      DATABASE_USER: mediacms
      DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
      DATABASE_NAME: mediacms
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      - redis

  celery_worker:
    image: mediacms/mediacms:latest
    deploy:
      replicas: 1
    volumes:
      - mediacms_data:/home/mediacms.io/mediacms/media
      - mediacms_static:/home/mediacms.io/mediacms/staticfiles
    environment:
      ENABLE_UWSGI: 'no'
      ENABLE_NGINX: 'no'
      ENABLE_CELERY_BEAT: 'no'
      ENABLE_MIGRATIONS: 'no'
      DATABASE_HOST: db
      DATABASE_PORT: 5432
      DATABASE_USER: mediacms
      DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
      DATABASE_NAME: mediacms
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      - migrations

  db:
    image: postgres:17.2-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    restart: always
    environment:
      POSTGRES_USER: mediacms
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: mediacms
      TZ: Europe/London
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: "redis:alpine"
    restart: always
    healthcheck:
      test: ["CMD", "redis-cli","ping"]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  postgres_data:
  mediacms_data:
  mediacms_static:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
