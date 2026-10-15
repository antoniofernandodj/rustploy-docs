---
title: Host draw.io with Rustploy
description: "Advanced tool for drawing diagrams and whiteboards. Create draw.io in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**draw.io**: Advanced tool for drawing diagrams and whiteboards. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `drawio` |
| **Containers** | 3 (`plantuml-server`, `image-export`, `drawio`) |
| **Images** | `plantuml/plantuml-server`, `jgraph/export-server`, `jgraph/drawio:24.7.17` |
| **UI port** | 8080, on service `drawio` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **draw.io** and select it.
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
| `DRAWIO_HOST` | ${main_domain} |
| `DRAWIO_BASE_URL` | https://${main_domain} |
| `DRAWIO_SERVER_URL` | https://${main_domain}/ |

## Domains

| Service | Port | Host |
|---|---|---|
| `drawio` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3'
services:
  plantuml-server:
    image: plantuml/plantuml-server
    ports:
      - "8080"

    volumes:
      - fonts_volume:/usr/share/fonts/drawio
  image-export:
    image: jgraph/export-server
    ports:
      - "8000"

    volumes:
      - fonts_volume:/usr/share/fonts/drawio
    environment:
      - DRAWIO_BASE_URL=${DRAWIO_BASE_URL}
  drawio:
    image: jgraph/drawio:24.7.17
    ports:
      - "8080"
    links:
      - plantuml-server:plantuml-server
      - image-export:image-export
    depends_on:
      - plantuml-server
      - image-export

    environment:
      RAWIO_SELF_CONTAINED: 1
      DRAWIO_USE_HTTP: 1
      PLANTUML_URL: http://plantuml-server:8080/
      EXPORT_URL: http://image-export:8000/
      DRAWIO_BASE_URL: ${DRAWIO_BASE_URL}
      DRAWIO_SERVER_URL: ${DRAWIO_SERVER_URL}
      DRAWIO_CSP_HEADER: ${DRAWIO_CSP_HEADER}
      DRAWIO_VIEWER_URL: ${DRAWIO_VIEWER_URL}
      DRAWIO_LIGHTBOX_URL: ${DRAWIO_LIGHTBOX_URL}
      DRAWIO_CONFIG: ${DRAWIO_CONFIG}
      DRAWIO_GOOGLE_CLIENT_ID: ${DRAWIO_GOOGLE_CLIENT_ID}
      DRAWIO_GOOGLE_APP_ID: ${DRAWIO_GOOGLE_APP_ID}
      DRAWIO_GOOGLE_CLIENT_SECRET: ${DRAWIO_GOOGLE_CLIENT_SECRET}
      DRAWIO_GOOGLE_VIEWER_CLIENT_ID: ${DRAWIO_GOOGLE_VIEWER_CLIENT_ID}
      DRAWIO_GOOGLE_VIEWER_APP_ID: ${DRAWIO_GOOGLE_VIEWER_APP_ID}
      DRAWIO_GOOGLE_VIEWER_CLIENT_SECRET: ${DRAWIO_GOOGLE_VIEWER_CLIENT_SECRET}
      DRAWIO_MSGRAPH_CLIENT_ID: ${DRAWIO_MSGRAPH_CLIENT_ID}
      DRAWIO_MSGRAPH_CLIENT_SECRET: ${DRAWIO_MSGRAPH_CLIENT_SECRET}
      DRAWIO_MSGRAPH_TENANT_ID: ${DRAWIO_MSGRAPH_TENANT_ID}
      DRAWIO_GITLAB_ID: ${DRAWIO_GITLAB_ID}
      DRAWIO_GITLAB_SECRET: ${DRAWIO_GITLAB_SECRET}
      DRAWIO_GITLAB_URL: ${DRAWIO_GITLAB_URL}
      DRAWIO_CLOUD_CONVERT_APIKEY: ${DRAWIO_CLOUD_CONVERT_APIKEY}
volumes:
  fonts_volume:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
