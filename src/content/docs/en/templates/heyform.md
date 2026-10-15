---
title: Host HeyForm with Rustploy
description: "Visual builder for conversational forms, polls and quizzes. Create HeyForm in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**HeyForm**: Visual builder for conversational forms, polls and quizzes. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `heyform` |
| **Containers** | 3 (`heyform`, `mongo`, `redis`) |
| **Images** | `heyform/community-edition:latest`, `percona/percona-server-mongodb:4.4`, `redis` |
| **UI port** | 8000, on service `heyform` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **HeyForm** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `session_key` | *random base64 key (64 bytes)* |
| `form_encryption_key` | *random base64 key (64 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `APP_HOMEPAGE_URL` | http://${main_domain} |
| `SESSION_KEY` | ${session_key} |
| `FORM_ENCRYPTION_KEY` | ${form_encryption_key} |

## Domains

| Service | Port | Host |
|---|---|---|
| `heyform` | 8000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  heyform:
    image: heyform/community-edition:latest
    restart: always
    volumes:
      # Persist uploaded images
      - heyform-data:/app/static/upload
    depends_on:
      - mongo
      - redis
    ports:
      - 8000
    env_file:
      - .env
    environment:
      MONGO_URI: 'mongodb://mongo:27017/heyform'
      REDIS_HOST: redis
      REDIS_PORT: 6379
    networks:
      - heyform-network

  mongo:
    image: percona/percona-server-mongodb:4.4
    restart: always
    networks:
      - heyform-network
    volumes:
      # Persist MongoDB data
      - mongo-data:/data/db

  redis:
    image: redis
    restart: always
    command: "redis-server --appendonly yes"
    networks:
      - heyform-network
    volumes:
      # Persist KeyDB data
      - redis-data:/data

networks:
  heyform-network:
    driver: bridge

volumes:
  heyform-data:
  mongo-data:
  redis-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
