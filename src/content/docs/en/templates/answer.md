---
title: Host Answer with Rustploy
description: "Question-and-answer platform (private StackOverflow style). Create Answer in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Answer**: Question-and-answer platform (private StackOverflow style). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `answer` |
| **Containers** | 2 (`answer`, `db`) |
| **Images** | `apache/answer:1.4.1`, `postgres:16` |
| **UI port** | 9080, on service `answer` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Answer** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `service_hash` | *random hash* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `ANSWER_HOST` | http://${main_domain} |
| `SERVICE_HASH` | ${service_hash} |

## Domains

| Service | Port | Host |
|---|---|---|
| `answer` | 9080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  answer:
    image: apache/answer:1.4.1
    ports:
      - '80'
    restart: on-failure
    volumes:
      - answer-data:/data
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:16
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5

    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: answer
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres

volumes:
  answer-data:
  db-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
