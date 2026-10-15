---
title: Host drizzle gateway with Rustploy
description: "Native database gateway of the Drizzle ORM ecosystem. Create drizzle gateway in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**drizzle gateway**: Native database gateway of the Drizzle ORM ecosystem. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `drizzle-gateway` |
| **Containers** | 1 (`drizzle-gateway`) |
| **Images** | `ghcr.io/drizzle-team/gateway:latest` |
| **UI port** | 4983, on service `drizzle-gateway` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **drizzle gateway** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `masterpass` | *random base64 key (32 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `MASTERPASS` | ${masterpass} |

## Domains

| Service | Port | Host |
|---|---|---|
| `drizzle-gateway` | 4983 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  drizzle-gateway:
    image: ghcr.io/drizzle-team/gateway:latest
    restart: always
    environment:
      PORT: "4983"
      STORE_PATH: "/app"
      MASTERPASS: ${MASTERPASS}
    volumes:
      - drizzle-gateway:/app
    networks:
      - dokploy-network

volumes:
  drizzle-gateway:

networks:
  dokploy-network:
    external: true
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
