---
title: Host Conduit with Rustploy
description: "Ultra-fast Matrix chat server written in Rust. Create Conduit in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Conduit**: Ultra-fast Matrix chat server written in Rust. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `conduit` |
| **Containers** | 1 (`homeserver`) |
| **Images** | `registry.gitlab.com/famedly/conduit/matrix-conduit:v0.9.0` |
| **UI port** | 6167, on service `homeserver` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Conduit** and select it.
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
| `MATRIX_SUBDOMAIN` | ${main_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `homeserver` | 6167 | ${main_domain} |

## The template docker-compose.yml

```yaml
# From Conduit's official documentation: https://docs.conduit.rs/deploying/docker.html#docker-compose
version: '3'

services:
    homeserver:
        image: registry.gitlab.com/famedly/conduit/matrix-conduit:v0.9.0
        restart: unless-stopped
        volumes:
            - db:/var/lib/matrix-conduit/
        environment:
            CONDUIT_SERVER_NAME: ${MATRIX_SUBDOMAIN}
            CONDUIT_DATABASE_PATH: /var/lib/matrix-conduit/
            CONDUIT_DATABASE_BACKEND: rocksdb
            CONDUIT_PORT: 6167
            CONDUIT_MAX_REQUEST_SIZE: 20000000 # in bytes, ~20 MB
            CONDUIT_ALLOW_REGISTRATION: 'true'
            #CONDUIT_REGISTRATION_TOKEN: '' # require password for registration
            CONDUIT_ALLOW_FEDERATION: 'true'
            CONDUIT_ALLOW_CHECK_FOR_UPDATES: 'true'
            CONDUIT_TRUSTED_SERVERS: '["matrix.org"]'
            #CONDUIT_MAX_CONCURRENT_REQUESTS: 100
            CONDUIT_ADDRESS: 0.0.0.0
            CONDUIT_CONFIG: '' # Ignore this
volumes:
    db:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
