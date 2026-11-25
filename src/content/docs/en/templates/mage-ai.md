---
title: Host Mage AI with Rustploy
description: "Modern data engineering tool to build, run and monitor pipelines. Create Mage AI in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Mage AI**: Modern data engineering tool to build, run and monitor pipelines. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `mage-ai` |
| **Containers** | 1 (`mage-ai`) |
| **Images** | `mageai/mageai:0.9.78` |
| **UI port** | 6789, on service `mage-ai` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Mage AI** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `PROJECT_NAME` | mage-ai |
| `ENV` | production |

## Domains

| Service | Port | Host |
|---|---|---|
| `mage-ai` | 6789 | ${main_domain} |

## The template docker-compose.yml

```yaml
# https://docs.mage.ai/getting-started/setup#docker-compose
#
# The default credentials are:
#     USERNAME: admin@admin.com
#     PASSWORD: admin

services:
  mage-ai:
    image: mageai/mageai:0.9.78
    command: mage start ${PROJECT_NAME}
    environment:
      USER_CODE_PATH: /home/src/${PROJECT_NAME}
      ENV: ${ENV}
    expose:
      - 6789
    volumes:
      - mageai_data:/home/src/
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-s", "-f", "-o", "/dev/null", "http://localhost:6789"]
      interval: 30s
      timeout: 10s
      retries: 5

volumes:
  mageai_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
