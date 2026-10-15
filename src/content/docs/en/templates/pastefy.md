---
title: Host Pastefy with Rustploy
description: "Private text repository (Pastebin) with syntax highlighting and OAuth2 login. Create Pastefy in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Pastefy**: Private text repository (Pastebin) with syntax highlighting and OAuth2 login. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `pastefy` |
| **Containers** | 2 (`db`, `pastefy`) |
| **Images** | `mariadb:10.11`, `interaapps/pastefy:latest` |
| **UI port** | 80, on service `pastefy` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Pastefy** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_root_password` | *random password, 32 characters* |
| `db_password` | *random password, 32 characters* |
| `db_user` | pastefy |
| `db_name` | pastefy |
| `http_server_cors` | * |
| `server_name` | https://${main_domain} |
| `oauth2_interaapps_client_id` | NONE |
| `oauth2_interaapps_client_secret` |  |
| `oauth2_github_client_id` | NONE |
| `oauth2_github_client_secret` |  |
| `oauth2_google_client_id` | NONE |
| `oauth2_google_client_secret` |  |
| `oauth2_discord_client_id` | NONE |
| `oauth2_discord_client_secret` |  |
| `oauth2_twitch_client_id` | NONE |
| `oauth2_twitch_client_secret` |  |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DB_ROOT_PASSWORD` | ${db_root_password} |
| `DB_NAME` | ${db_name} |
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |
| `HTTP_SERVER_CORS` | ${http_server_cors} |
| `SERVER_NAME` | ${server_name} |
| `OAUTH2_INTERAAPPS_CLIENT_ID` | ${oauth2_interaapps_client_id} # Interaapps API Key (optional) |
| `OAUTH2_INTERAAPPS_CLIENT_SECRET` | ${oauth2_interaapps_client_secret} # Interaapps API Secret (optional) |
| `OAUTH2_GITHUB_CLIENT_ID` | ${oauth2_github_client_id} # GitHub API Key (optional) |
| `OAUTH2_GITHUB_CLIENT_SECRET` | ${oauth2_github_client_secret} # GitHub API Secret (optional) |
| `OAUTH2_GOOGLE_CLIENT_ID` | ${oauth2_google_client_id} # Google API Key (optional) |
| `OAUTH2_GOOGLE_CLIENT_SECRET` | ${oauth2_google_client_secret} # Google API Secret (optional) |
| `OAUTH2_DISCORD_CLIENT_ID` | ${oauth2_discord_client_id} # Discord API Key (optional) |
| `OAUTH2_DISCORD_CLIENT_SECRET` | ${oauth2_discord_client_secret} # Discord API Secret (optional) |
| `OAUTH2_TWITCH_CLIENT_ID` | ${oauth2_twitch_client_id} # Twitch API Key (optional) |
| `OAUTH2_TWITCH_CLIENT_SECRET` | ${oauth2_twitch_client_secret} # Twitch API Secret (optional) |

## Domains

| Service | Port | Host |
|---|---|---|
| `pastefy` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  db:
    image: mariadb:10.11
    restart: unless-stopped
    volumes:
      - "../files/db:/var/lib/mysql"
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
  pastefy:
    image: interaapps/pastefy:latest
    restart: unless-stopped
    depends_on:
      - db
    expose:
      - "80"
    environment:
      HTTP_SERVER_PORT: 80
      HTTP_SERVER_CORS: ${HTTP_SERVER_CORS}
      DATABASE_DRIVER: mysql
      DATABASE_NAME: ${DB_NAME}
      DATABASE_USER: ${DB_USER}
      DATABASE_PASSWORD: ${DB_PASSWORD}
      DATABASE_HOST: db
      DATABASE_PORT: 3306
      SERVER_NAME: ${SERVER_NAME}
      OAUTH2_INTERAAPPS_CLIENT_ID: ${OAUTH2_INTERAAPPS_CLIENT_ID}
      OAUTH2_INTERAAPPS_CLIENT_SECRET: ${OAUTH2_INTERAAPPS_CLIENT_SECRET}
      OAUTH2_GITHUB_CLIENT_ID: ${OAUTH2_GITHUB_CLIENT_ID}
      OAUTH2_GITHUB_CLIENT_SECRET: ${OAUTH2_GITHUB_CLIENT_SECRET}
      OAUTH2_GOOGLE_CLIENT_ID: ${OAUTH2_GOOGLE_CLIENT_ID}
      OAUTH2_GOOGLE_CLIENT_SECRET: ${OAUTH2_GOOGLE_CLIENT_SECRET}
      OAUTH2_DISCORD_CLIENT_ID: ${OAUTH2_DISCORD_CLIENT_ID}
      OAUTH2_DISCORD_CLIENT_SECRET: ${OAUTH2_DISCORD_CLIENT_SECRET}
      OAUTH2_TWITCH_CLIENT_ID: ${OAUTH2_TWITCH_CLIENT_ID}
      OAUTH2_TWITCH_CLIENT_SECRET: ${OAUTH2_TWITCH_CLIENT_SECRET}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
