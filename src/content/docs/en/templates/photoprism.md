---
title: Host Photoprism with Rustploy
description: "AI-powered smart photo organizer with automatic object and face recognition. Create Photoprism in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Photoprism**: AI-powered smart photo organizer with automatic object and face recognition. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `photoprism` |
| **Containers** | 2 (`photoprism`, `mariadb`) |
| **Images** | `photoprism/photoprism:latest`, `mariadb:11` |
| **UI port** | 2342, on service `photoprism` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Photoprism** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `admin_password` | *random password* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `BASE_URL` | http://${main_domain} |
| `ADMIN_PASSWORD` | ${admin_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `photoprism` | 2342 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  photoprism:
    image: photoprism/photoprism:latest
    stop_grace_period: 10s
    depends_on:
      - mariadb
    security_opt:
      - seccomp:unconfined
      - apparmor:unconfined

    environment:
      PHOTOPRISM_ADMIN_USER: "admin"
      PHOTOPRISM_ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      PHOTOPRISM_AUTH_MODE: "password"
      PHOTOPRISM_SITE_URL: "http://localhost:2342/"
      PHOTOPRISM_DISABLE_TLS: "false"
      PHOTOPRISM_DEFAULT_TLS: "false"
      PHOTOPRISM_ORIGINALS_LIMIT: 5000               # file size limit for originals in MB (increase for high-res video)
      PHOTOPRISM_HTTP_COMPRESSION: "gzip"
      PHOTOPRISM_LOG_LEVEL: "info"                   # log level: trace, debug, info, warning, error, fatal, or panic
      PHOTOPRISM_READONLY: "false"
      PHOTOPRISM_EXPERIMENTAL: "false"
      PHOTOPRISM_DISABLE_CHOWN: "false"
      PHOTOPRISM_DISABLE_WEBDAV: "false"
      PHOTOPRISM_DISABLE_SETTINGS: "false"
      PHOTOPRISM_DISABLE_TENSORFLOW: "false"
      PHOTOPRISM_DISABLE_FACES: "false"
      PHOTOPRISM_DISABLE_CLASSIFICATION: "false"
      PHOTOPRISM_DISABLE_VECTORS: "false"
      PHOTOPRISM_DISABLE_RAW: "false"
      PHOTOPRISM_RAW_PRESETS: "false"
      PHOTOPRISM_SIDECAR_YAML: "true"
      PHOTOPRISM_BACKUP_ALBUMS: "true"
      PHOTOPRISM_BACKUP_DATABASE: "true"
      PHOTOPRISM_BACKUP_SCHEDULE: "daily"
      PHOTOPRISM_INDEX_SCHEDULE: ""
      PHOTOPRISM_AUTO_INDEX: 300
      PHOTOPRISM_AUTO_IMPORT: -1
      PHOTOPRISM_DETECT_NSFW: "false"
      PHOTOPRISM_UPLOAD_NSFW: "true"
      PHOTOPRISM_DATABASE_DRIVER: "mysql"
      PHOTOPRISM_DATABASE_SERVER: "mariadb:3306"
      PHOTOPRISM_DATABASE_NAME: "photoprism"
      PHOTOPRISM_DATABASE_USER: "photoprism"
      PHOTOPRISM_DATABASE_PASSWORD: "insecure"
      PHOTOPRISM_SITE_CAPTION: "AI-Powered Photos App"
      PHOTOPRISM_SITE_DESCRIPTION: ""
      PHOTOPRISM_SITE_AUTHOR: ""
    working_dir:
      "/photoprism"
    volumes:
      - pictures:/photoprism/originals
      - storage-data:/photoprism/storage

  mariadb:
    image: mariadb:11
    restart: unless-stopped
    stop_grace_period: 5s

    security_opt:
      - seccomp:unconfined
      - apparmor:unconfined
    volumes:
      - db-data:/var/lib/mysql
    environment:
      MARIADB_AUTO_UPGRADE: "1"
      MARIADB_INITDB_SKIP_TZINFO: "1"
      MARIADB_DATABASE: "photoprism"
      MARIADB_USER: "photoprism"
      MARIADB_PASSWORD: "insecure"
      MARIADB_ROOT_PASSWORD: "insecure"

volumes:
  db-data:
  storage-data:
  pictures:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
