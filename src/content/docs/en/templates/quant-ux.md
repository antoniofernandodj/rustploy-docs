---
title: Host Quant-UX with Rustploy
description: "Advanced tool for prototyping and analyzing user behavior and UX tests. Create Quant-UX in one click on Rustploy: 4 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Quant-UX**: Advanced tool for prototyping and analyzing user behavior and UX tests. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `quant-ux` |
| **Containers** | 4 (`mongo`, `qux-fe`, `qux-be`, `qux-ws`) |
| **Images** | `mongo`, `klausenschaefersinho/quant-ux`, `klausenschaefersinho/quant-ux-backend`, `klausenschaefersinho/quant-ux-websocket` |
| **UI port** | 8082, on service `qux-fe` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Quant-UX** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `ws_domain` | *domain (generated; replace it with yours)* |
| `qux_auth` | qux |
| `qux_jwt_password` | *random password, 64 characters* |
| `qux_mongo_db_name` | quantux |
| `qux_mongo_table_prefix` | quantux |
| `qux_mail_user` | *generated email* |
| `qux_mail_password` | *random password, 32 characters* |
| `qux_mail_host` | mail.example.com |
| `qux_timezone` | America/Chicago |
| `qux_auth_service` | qux |
| `qux_user_allow_signup` | true |
| `qux_user_allowed_domains` | * |
| `qux_keycloak_realm` |  |
| `qux_keycloak_client` |  |
| `qux_keycloak_url` |  |
| `qux_keycloak_server` |  |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `QUX_HTTP_HOST` | https://${main_domain} |
| `QUX_AUTH` | ${qux_auth} |
| `QUX_JWT_PASSWORD` | ${qux_jwt_password} |
| `QUX_MONGO_DB_NAME` | ${qux_mongo_db_name} |
| `QUX_MONGO_TABLE_PREFIX` | ${qux_mongo_table_prefix} |
| `QUX_MAIL_USER` | ${qux_mail_user} |
| `QUX_MAIL_PASSWORD` | ${qux_mail_password} |
| `QUX_MAIL_HOST` | ${qux_mail_host} |
| `TZ` | ${qux_timezone} |
| `QUX_AUTH_SERVICE` | ${qux_auth_service} |
| `QUX_KEYCLOAK_SERVER` | ${qux_keycloak_server} |
| `QUX_KEYCLOAK_REALM` | ${qux_keycloak_realm} |
| `QUX_KEYCLOAK_CLIENT` | ${qux_keycloak_client} |
| `QUX_KEYCLOAK_URL` | ${qux_keycloak_url} |
| `QUX_USER_ALLOW_SIGNUP` | ${qux_user_allow_signup} |
| `QUX_USER_ALLOWED_DOMAINS` | ${qux_user_allowed_domains} |
| `QUX_WS_URL` | wss://${ws_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `qux-fe` | 8082 | ${main_domain} |
| `qux-ws` | 8086 | ${ws_domain} |

## The template docker-compose.yml

```yaml
version: '3'

services:
  mongo:
    restart: always
    image: mongo
    volumes:
      - mongo_data:/data/db
  qux-fe:
    restart: always
    image: klausenschaefersinho/quant-ux
    environment:
      - QUX_PROXY_URL=http://quant-ux-backend:8080
      - QUX_AUTH=${QUX_AUTH}
      - QUX_KEYCLOAK_REALM=${QUX_KEYCLOAK_REALM}
      - QUX_KEYCLOAK_CLIENT=${QUX_KEYCLOAK_CLIENT}
      - QUX_KEYCLOAK_URL=${QUX_KEYCLOAK_URL}
      - QUX_WS_URL=${QUX_WS_URL}
    links:
      - mongo
      - qux-be
    ports:
      - 8082
    depends_on:
      - qux-be

  qux-be:
    restart: always
    image: klausenschaefersinho/quant-ux-backend
    volumes:
      - quant_ux_data:/app-data
    environment:
      - QUX_HTTP_HOST=${QUX_HTTP_HOST}
      - QUX_HTTP_PORT=8080
      - QUX_MONGO_DB_NAME=${QUX_MONGO_DB_NAME}
      - QUX_MONGO_TABLE_PREFIX=${QUX_MONGO_TABLE_PREFIX}
      - QUX_MONGO_CONNECTION_STRING=mongodb://quant-ux-mongo:27017
      - QUX_MAIL_USER=${QUX_MAIL_USER}
      - QUX_MAIL_PASSWORD=${QUX_MAIL_PASSWORD}
      - QUX_MAIL_HOST=${QUX_MAIL_HOST}
      - QUX_JWT_PASSWORD=${QUX_JWT_PASSWORD}
      - QUX_IMAGE_FOLDER_USER=/app-data/qux-images
      - QUX_IMAGE_FOLDER_APPS=/app-data/qux-image-apps
      - TZ=${TZ}
      - QUX_AUTH_SERVICE=${QUX_AUTH_SERVICE}
      - QUX_KEYCLOAK_SERVER=${QUX_KEYCLOAK_SERVER}
      - QUX_KEYCLOAK_REALM=${QUX_KEYCLOAK_REALM}
      - QUX_USER_ALLOW_SIGNUP=${QUX_USER_ALLOW_SIGNUP}
      - QUX_USER_ALLOWED_DOMAINS=${QUX_USER_ALLOWED_DOMAINS}
    depends_on:
      - mongo

  qux-ws:
    restart: always
    image: klausenschaefersinho/quant-ux-websocket
    environment:
      - QUX_SERVER=http://quant-ux-backend:8080/
      - QUX_SERVER_PORT=8086
    ports:
      - 8086
    links:
      - qux-be
    depends_on:
      - qux-be

volumes:
  mongo_data:
  quant_ux_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
