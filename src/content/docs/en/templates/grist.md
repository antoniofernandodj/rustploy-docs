---
title: Host Grist with Rustploy
description: "Smart open-source spreadsheet integrated with a relational database structure. Create Grist in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Grist**: Smart open-source spreadsheet integrated with a relational database structure. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `grist` |
| **Containers** | 1 (`grist`) |
| **Images** | `gristlabs/grist:latest` |
| **UI port** | 8484, on service `grist` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Grist** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `default_email` | *generated email* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `GRIST_DEFAULT_EMAIL` | ${default_email} |

## Domains

| Service | Port | Host |
|---|---|---|
| `grist` | 8484 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  grist:
    image: gristlabs/grist:latest
    restart: unless-stopped
    ports:
      - 8484
    volumes:
      - grist_data:/persist
    environment:
      GRIST_DEFAULT_EMAIL: ${GRIST_DEFAULT_EMAIL:-}
      GRIST_SESSION_SECRET: ${GRIST_SESSION_SECRET:-}
      GRIST_SINGLE_ORG: ${GRIST_SINGLE_ORG:-}
      GRIST_HOME_INSTANCE: ${GRIST_HOME_INSTANCE:-}

volumes:
  grist_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
