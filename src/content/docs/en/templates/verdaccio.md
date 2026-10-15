---
title: Host Verdaccio with Rustploy
description: "Local, private proxy server for Node.js (npm) repositories and packages. Create Verdaccio in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Verdaccio**: Local, private proxy server for Node.js (npm) repositories and packages. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `verdaccio` |
| **Containers** | 1 (`verdaccio`) |
| **Images** | `verdaccio/verdaccio:6` |
| **UI port** | 4873, on service `verdaccio` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Verdaccio** and select it.
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
| `verdaccio` | 4873 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/conf/config.yaml`

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  verdaccio:
    image: verdaccio/verdaccio:6
    environment:
      - VERDACCIO_PORT=4873
    ports:
      - 4873
    volumes:
      - verdaccio_storage:/verdaccio/storage
      - verdaccio_plugins:/verdaccio/plugins
      - ../files/conf:/verdaccio/conf

volumes:
  verdaccio_storage:
  verdaccio_plugins:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
