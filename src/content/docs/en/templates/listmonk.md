---
title: Host Listmonk with Rustploy
description: "High-performance email marketing campaign and newsletter manager. Create Listmonk in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Listmonk**: High-performance email marketing campaign and newsletter manager. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `listmonk` |
| **Containers** | 2 (`db`, `app`) |
| **Images** | `postgres:17-alpine`, `listmonk/listmonk:v5.0.0` |
| **UI port** | 9000, on service `app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Listmonk** and select it.
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
| `app` | 9000 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `config.toml`

## The template docker-compose.yml

```yaml
services:
  db:
    image: postgres:17-alpine
    ports:
      - 5432
    environment:
      - POSTGRES_USER=listmonk
      - POSTGRES_PASSWORD=listmonk
      - POSTGRES_DB=listmonk
    restart: unless-stopped
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U listmonk" ]
      interval: 10s
      timeout: 5s
      retries: 6
    volumes:
      - listmonk-data:/var/lib/postgresql/data

  app:
    restart: unless-stopped
    image: listmonk/listmonk:v5.0.0
    environment:
      - LISTMONK_app__address=0.0.0.0:9000
      - LISTMONK_db__user=listmonk
      - LISTMONK_db__password=listmonk
      - LISTMONK_db__database=listmonk
      - LISTMONK_db__host=db
      - LISTMONK_db__port=5432
      - LISTMONK_db__ssl_mode=disable
      - LISTMONK_db__max_open=25
      - LISTMONK_db__max_idle=25
      - LISTMONK_db__max_lifetime=300s
      - TZ=Etc/UTC
    depends_on:
      - db
    command: [ sh, -c, "./listmonk --install --idempotent --yes --config '' && ./listmonk --upgrade --yes --config '' && ./listmonk --config ''" ]
      # --config (file) param is set to empty so that listmonk only uses the env vars (below) for config.
      # --install --idempotent ensures that DB installation happens only once on an empty DB, on the first ever start.
      # --upgrade automatically runs any DB migrations when a new image is pulled.
    volumes:
      - ../files/config.toml:/listmonk/config.toml
      - listmonk-uploads:/listmonk/uploads

volumes:
  listmonk-uploads:
  listmonk-data:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
