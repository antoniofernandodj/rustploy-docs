---
title: Host Doublezero with Rustploy
description: "Doublezero application. Create Doublezero in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Doublezero**: Doublezero application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `doublezero` |
| **Containers** | 1 (`doublezero`) |
| **Images** | `liltechnomancer/double-zero:0.2.1` |
| **UI port** | 4000, on service `doublezero` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Doublezero** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret_key_base` | *random base64 key (64 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DOUBLEZERO_HOST` | ${main_domain} |
| `DOUBLEZERO_PORT` | 4000 |
| `SECRET_KEY_BASE` | ${secret_key_base} |
| `AWS_ACCESS_KEY_ID` | your-aws-access-key |
| `AWS_SECRET_ACCESS_KEY` | your-aws-secret-key |
| `AWS_REGION` | your-aws-region |
| `SQS_URL` | your-aws-sqs-url |
| `SYSTEM_EMAIL` |  |

## Domains

| Service | Port | Host |
|---|---|---|
| `doublezero` | 4000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  doublezero:
    restart: always
    image: liltechnomancer/double-zero:0.2.1
    volumes:
      - db-data:/var/lib/doublezero/data
    environment:
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_REGION: ${AWS_REGION}
      SQS_URL: ${SQS_URL}
      SYSTEM_EMAIL: ${SYSTEM_EMAIL}
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
      PHX_HOST: ${DOUBLEZERO_HOST}
      DATABASE_PATH: ./00.db

volumes:
  db-data:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
