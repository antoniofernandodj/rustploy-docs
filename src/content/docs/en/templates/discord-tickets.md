---
title: Host Discord Tickets with Rustploy
description: "Enterprise bot for managing and opening tickets on Discord. Create Discord Tickets in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Discord Tickets**: Enterprise bot for managing and opening tickets on Discord. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `discord-tickets` |
| **Containers** | 2 (`tickets-postgres`, `tickets-app`) |
| **Images** | `mysql:8`, `eartharoid/discord-tickets:4.0.21` |
| **UI port** | 8169, on service `tickets-app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Discord Tickets** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `mysql_password` | *random password* |
| `mysql_root_password` | *random password* |
| `mysql_user` | tickets |
| `mysql_database` | tickets |
| `encryption_key` | *random password, 48 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `TICKETS_HOST` | ${main_domain} |
| `MYSQL_DATABASE` | ${mysql_database} |
| `MYSQL_PASSWORD` | ${mysql_password} |
| `MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |
| `MYSQL_USER` | ${mysql_user} |
| `ENCRYPTION_KEY` | ${encryption_key} |
| `# Follow the guide at: https://discordtickets.app/self-hosting/installation/docker/#creating-the-discord-application` |  |
| `DISCORD_SECRET` |  |
| `DISCORD_TOKEN` |  |
| `SUPER_USERS` | YOUR_DISCORD_USER_ID |

## Domains

| Service | Port | Host |
|---|---|---|
| `tickets-app` | 8169 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  tickets-postgres:
    image: mysql:8
    restart: unless-stopped

    volumes:
      - tickets-mysql-data:/var/lib/mysql
    environment:
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_USER: ${MYSQL_USER}
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u${MYSQL_USER}", "-p${MYSQL_PASSWORD}"]
      interval: 10s
      timeout: 5s
      retries: 5

  tickets-app:
    image: eartharoid/discord-tickets:4.0.21
    depends_on:
      tickets-postgres:
        condition: service_healthy
    restart: unless-stopped

    volumes:
      - tickets-app-data:/home/container/user
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    tty: true
    stdin_open: true
    environment:
      DB_CONNECTION_URL: mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@tickets-postgres/${MYSQL_DATABASE}
      DISCORD_SECRET: ${DISCORD_SECRET}
      DISCORD_TOKEN: ${DISCORD_TOKEN}
      ENCRYPTION_KEY: ${ENCRYPTION_KEY}
      DB_PROVIDER: mysql
      HTTP_EXTERNAL: https://${TICKETS_HOST}
      HTTP_HOST: 0.0.0.0
      HTTP_PORT: 8169
      HTTP_TRUST_PROXY: "true"
      PUBLIC_BOT: "false"
      PUBLISH_COMMANDS: "true"
      SUPER: ${SUPER_USERS}

volumes:
  tickets-mysql-data:
  tickets-app-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
