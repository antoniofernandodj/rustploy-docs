---
title: Host RabbitMQ with Rustploy
description: "Multi-protocol messaging broker widely used for asynchronous communication. Create RabbitMQ in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**RabbitMQ**: Multi-protocol messaging broker widely used for asynchronous communication. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `rabbitmq` |
| **Containers** | 1 (`rabbitmq`) |
| **Images** | `rabbitmq:4.1-management` |
| **UI port** | 15672, on service `rabbitmq` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **RabbitMQ** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `management_domain` | *domain (generated; replace it with yours)* |
| `default_user` | admin |
| `default_pass` | *random password, 8 characters* |
| `disk_free_limit` | 2147483648 |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `RABBITMQ_DEFAULT_USER` | ${default_user} |
| `RABBITMQ_DEFAULT_PASS` | ${default_pass} |
| `RABBITMQ_DISK_FREE_LIMIT` | ${disk_free_limit} |

## Domains

| Service | Port | Host |
|---|---|---|
| `rabbitmq` | 15672 | ${main_domain} |
| `rabbitmq` | 5672 | ${management_domain} |

## The template docker-compose.yml

```yaml
services:
  rabbitmq:
    image: rabbitmq:4.1-management
    hostname: rabbitmq
    restart: unless-stopped
    environment:
      - RABBITMQ_DEFAULT_USER=${RABBITMQ_DEFAULT_USER}
      - RABBITMQ_DEFAULT_PASS=${RABBITMQ_DEFAULT_PASS}
      - RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS=-rabbit log_levels [{connection,error},{default,error}] disk_free_limit ${RABBITMQ_DISK_FREE_LIMIT}
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq
    ports:
      - 15672
      - 5672

volumes:
  rabbitmq-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
