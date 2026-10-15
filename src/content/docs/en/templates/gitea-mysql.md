---
title: Host Gitea (MySQL) with Rustploy
description: "Gitea Git server configured with a MySQL database. Create Gitea (MySQL) in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Gitea (MySQL)**: Gitea Git server configured with a MySQL database. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `gitea-mysql` |
| **Containers** | 2 (`gitea`, `mysql`) |
| **Images** | `docker.gitea.com/gitea:1.24.4`, `docker.io/library/mysql:8` |
| **UI port** | 3000, on service `gitea` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Gitea (MySQL)** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 24 characters* |
| `db_root_password` | *random password, 24 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `USER_UID` | 1000 |
| `USER_GID` | 1000 |
| `GITEA__database__DB_TYPE` | mysql |
| `GITEA__database__HOST` | mysql:3306 |
| `GITEA__database__NAME` | gitea |
| `GITEA__database__USER` | gitea |
| `GITEA__database__PASSWD` | ${db_password} |
| `GITEA_DB_PASSWORD` | ${db_password} |
| `MYSQL_ROOT_PASSWORD` | ${db_root_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `gitea` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  gitea:
    image: docker.gitea.com/gitea:1.24.4
    restart: unless-stopped
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - GITEA__database__DB_TYPE=mysql
      - GITEA__database__HOST=mysql:3306
      - GITEA__database__NAME=gitea
      - GITEA__database__USER=gitea
      - GITEA__database__PASSWD=${GITEA_DB_PASSWORD:-gitea}
    volumes:
      - gitea-data:/data
    expose:
      - "3000"
      - "22"
    depends_on:
      - mysql
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/"]
      interval: 15s
      timeout: 5s
      retries: 10

  mysql:
    image: docker.io/library/mysql:8
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD:-gitea}
      - MYSQL_USER=gitea
      - MYSQL_PASSWORD=${GITEA_DB_PASSWORD:-gitea}
      - MYSQL_DATABASE=gitea
    command: ["--default-authentication-plugin=mysql_native_password"]
    volumes:
      - mysql-data:/var/lib/mysql
    expose:
      - "3306"

volumes:
  gitea-data: {}
  mysql-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
