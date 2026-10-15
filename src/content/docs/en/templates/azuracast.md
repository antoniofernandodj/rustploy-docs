---
title: Host AzuraCast with Rustploy
description: "Complete all-in-one panel for managing web radio stations. Create AzuraCast in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**AzuraCast**: Complete all-in-one panel for managing web radio stations. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `azuracast` |
| **Containers** | 2 (`azuracast`, `mariadb`) |
| **Images** | `ghcr.io/azuracast/azuracast:latest`, `mariadb:11.4` |
| **UI port** | 80, on service `azuracast` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **AzuraCast** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `mysql_root_password` | *random password, 32 characters* |
| `mysql_password` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `LANG` | en_US.UTF-8 |
| `AZURACAST_DC_REVISION` | 1 |
| `MYSQL_HOST` | mariadb |
| `MYSQL_PORT` | 3306 |
| `MYSQL_USER` | azuracast |
| `MYSQL_PASSWORD` | ${mysql_password} |
| `MYSQL_DATABASE` | azuracast |
| `MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |
| `LETSENCRYPT_HOST` | ${main_domain} |
| `VIRTUAL_HOST` | ${main_domain} |
| `DISABLE_LETSENCRYPT` | true |
| `AUTO_ASSIGN_PORT_HTTP` | 80 |
| `AUTO_ASSIGN_PORT_HTTPS` | 443 |
| `NGINX_RADIO_PORTS` | 8000,8010,8020,8030,8040,8050 |
| `PREFER_RELEASE_BUILDS` | true |
| `COMPOSER_PLUGIN_MODE` | false |
| `ADDITIONAL_MEDIA_SYNC_WORKER_COUNT` | 0 |

## Domains

| Service | Port | Host |
|---|---|---|
| `azuracast` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  azuracast:
    image: ghcr.io/azuracast/azuracast:latest
    restart: unless-stopped
    ports:
      - 80
    volumes:
      - azuracast-station-data:/var/azuracast/stations
      - azuracast-data:/var/azuracast/www_tmp
      - azuracast-uploads:/var/azuracast/uploads
      - azuracast-backups:/var/azuracast/backups
    environment:
      - LANG=en_US.UTF-8
      - AZURACAST_DC_REVISION=1
      - MYSQL_HOST=mariadb
      - MYSQL_PORT=3306
      - MYSQL_USER=azuracast
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - MYSQL_DATABASE=azuracast
    depends_on:
      - mariadb

  mariadb:
    image: mariadb:11.4
    restart: unless-stopped
    volumes:
      - mariadb-data:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=azuracast
      - MYSQL_USER=azuracast
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}

volumes:
  azuracast-station-data: {}
  azuracast-data: {}
  azuracast-uploads: {}
  azuracast-backups: {}
  mariadb-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
