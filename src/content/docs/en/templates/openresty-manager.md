---
title: Host OpenResty Manager with Rustploy
description: "Advanced graphical admin panel for OpenResty/Nginx servers with SSL management. Create OpenResty Manager in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**OpenResty Manager**: Advanced graphical admin panel for OpenResty/Nginx servers with SSL management. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `openresty-manager` |
| **Containers** | 1 (`openresty-manager`) |
| **Images** | `uusec/openresty-manager:latest` |
| **UI port** | 34567, on service `openresty-manager` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **OpenResty Manager** and select it.
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
| `openresty-manager` | 34567 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  openresty-manager:
   image: uusec/openresty-manager:latest
   restart: always
   volumes:
     - /etc/localtime:/etc/localtime:ro
     - /etc/resolv.conf:/etc/resolv.conf:ro
     - om_acme:/opt/om/acme
     - om_data:/opt/om/data
     - om_conf:/opt/om/nginx/conf

volumes:
  om_acme:
  om_data:
  om_conf:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
