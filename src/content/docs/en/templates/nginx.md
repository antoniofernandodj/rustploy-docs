---
title: Host Nginx with Rustploy
description: "The classic, very-high-performance web server and reverse proxy. Create Nginx in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Nginx**: The classic, very-high-performance web server and reverse proxy. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `nginx` |
| **Containers** | 1 (`nginx`) |
| **Images** | `nginx:latest` |
| **UI port** | 80, on service `nginx` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Nginx** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

## Domains

| Service | Port | Host |
|---|---|---|
| `nginx` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  nginx:
    image: nginx:latest
    restart: unless-stopped
    ports:
      - 80
      - 443
    volumes:
      - nginx-config:/etc/nginx
      - nginx-html:/usr/share/nginx/html
volumes:
  nginx-config: {}
  nginx-html: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
