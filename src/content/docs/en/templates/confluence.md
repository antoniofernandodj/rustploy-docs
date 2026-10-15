---
title: Host Confluence with Rustploy
description: "Corporate space for sharing knowledge and project documentation. Create Confluence in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Confluence**: Corporate space for sharing knowledge and project documentation. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `confluence` |
| **Containers** | 1 (`confluence`) |
| **Images** | `atlassian/confluence-server:8.6-ubuntu-jdk17` |
| **UI port** | 8090, on service `confluence` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Confluence** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `DOMAIN` | *domain (generated; replace it with yours)* |
| `JVM_MIN_MEM` | 2048m |
| `JVM_MAX_MEM` | 4096m |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `JVM_MINIMUM_MEMORY` | ${JVM_MIN_MEM} |
| `JVM_MAXIMUM_MEMORY` | ${JVM_MAX_MEM} |
| `CATALINA_CONNECTOR_PROXYNAME` | ${DOMAIN} |
| `CATALINA_CONNECTOR_SCHEME` | http |
| `CATALINA_CONNECTOR_SECURE` | true |

## Domains

| Service | Port | Host |
|---|---|---|
| `confluence` | 8090 | ${DOMAIN} |

## The template docker-compose.yml

```yaml
version: "3"

services:
  confluence:
    image: atlassian/confluence-server:8.6-ubuntu-jdk17
    ports:
      - "8090"
    volumes:
      - confluence-data:/var/atlassian/application-data/confluence
    environment:
      - JVM_MINIMUM_MEMORY=${JVM_MIN_MEM}
      - JVM_MAXIMUM_MEMORY=${JVM_MAX_MEM}
      - CATALINA_CONNECTOR_PROXYNAME=${DOMAIN}
      - CATALINA_CONNECTOR_SCHEME=http
      - CATALINA_CONNECTOR_SECURE=true

volumes:
  confluence-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
