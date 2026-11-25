---
title: Host FreshRSS with Rustploy
description: "Fast, lightweight, customizable RSS feed aggregator and reader. Create FreshRSS in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**FreshRSS**: Fast, lightweight, customizable RSS feed aggregator and reader. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `freshrss` |
| **Containers** | 1 (`freshrss`) |
| **Images** | `freshrss/freshrss:${FRESHRSS_VERSION:-latest}` |
| **UI port** | 80, on service `freshrss` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **FreshRSS** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `timezone` | UTC |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `FRESHRSS_VERSION` | latest |
| `TZ` | ${timezone} |
| `CRON_MIN` | 13,43 |
| `FRESHRSS_ENV` | production |
| `COPY_LOG_TO_SYSLOG` | On |
| `COPY_SYSLOG_TO_STDERR` | On |

## Domains

| Service | Port | Host |
|---|---|---|
| `freshrss` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  freshrss:
    image: freshrss/freshrss:${FRESHRSS_VERSION:-latest}
    restart: unless-stopped
    volumes:
      # FreshRSS persistent data such as configuration and SQLite databases
      - freshrss_data:/var/www/FreshRSS/data
      # Optional volume for storing third-party extensions
      - freshrss_extensions:/var/www/FreshRSS/extensions
    ports:
      - "80"
    environment:
      # Server timezone
      TZ: ${TZ:-UTC}
      # Cron job to refresh feeds at specified minutes
      CRON_MIN: ${CRON_MIN:-13,43}
      # Production or development mode
      FRESHRSS_ENV: ${FRESHRSS_ENV:-production}
      # Copy logs to syslog
      COPY_LOG_TO_SYSLOG: ${COPY_LOG_TO_SYSLOG:-On}
      # Copy syslog to stderr for docker logs
      COPY_SYSLOG_TO_STDERR: ${COPY_SYSLOG_TO_STDERR:-On}
      # Optional auto-install parameters
      FRESHRSS_INSTALL: ${FRESHRSS_INSTALL:-}
      # Optional auto-create user parameters
      FRESHRSS_USER: ${FRESHRSS_USER:-}

volumes:
  freshrss_data:
  freshrss_extensions:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
