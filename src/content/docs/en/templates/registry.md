---
title: Host Registry with Rustploy
description: "Registry application. Create Registry in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Registry**: Registry application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `registry` |
| **Containers** | 1 (`registry`) |
| **Images** | `registry:2` |
| **UI port** | 5000, on service `registry` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Registry** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `registry_http_secret` | *random password, 30 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `REGISTRY_HTTP_SECRET` | ${registry_http_secret} |

## Domains

| Service | Port | Host |
|---|---|---|
| `registry` | 5000 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/auth/registry.password`

## The template docker-compose.yml

```yaml
services:
  registry:
    restart: always
    image: registry:2
    ports:
      - 5000
    volumes:
      - ../files/auth/registry.password:/auth/registry.password
      - registry-data:/var/lib/registry
    environment:
      REGISTRY_STORAGE_DELETE_ENABLED: true
      REGISTRY_HEALTH_STORAGEDRIVER_ENABLED: false
      REGISTRY_HTTP_SECRET: ${REGISTRY_HTTP_SECRET}
      REGISTRY_AUTH: htpasswd
      REGISTRY_AUTH_HTPASSWD_REALM: Registry Realm
      REGISTRY_AUTH_HTPASSWD_PATH: /auth/registry.password

volumes:
  registry-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
