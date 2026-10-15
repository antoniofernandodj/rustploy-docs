---
title: Hospedar Quant-UX com Rustploy
description: "Ferramenta avançada para prototipação e análise de comportamento e testes de UX de usuários. Crie Quant-UX em um clique no Rustploy: 4 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Quant-UX**: Ferramenta avançada para prototipação e análise de comportamento e testes de UX de usuários. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `quant-ux` |
| **Containers** | 4 (`mongo`, `qux-fe`, `qux-be`, `qux-ws`) |
| **Imagens** | `mongo`, `klausenschaefersinho/quant-ux`, `klausenschaefersinho/quant-ux-backend`, `klausenschaefersinho/quant-ux-websocket` |
| **Porta da interface** | 8082, no serviço `qux-fe` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Quant-UX** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `ws_domain` | *domínio (gerado; troque pelo seu)* |
| `qux_auth` | qux |
| `qux_jwt_password` | *senha aleatória de 64 caracteres* |
| `qux_mongo_db_name` | quantux |
| `qux_mongo_table_prefix` | quantux |
| `qux_mail_user` | *e-mail gerado* |
| `qux_mail_password` | *senha aleatória de 32 caracteres* |
| `qux_mail_host` | mail.example.com |
| `qux_timezone` | America/Chicago |
| `qux_auth_service` | qux |
| `qux_user_allow_signup` | true |
| `qux_user_allowed_domains` | * |
| `qux_keycloak_realm` |  |
| `qux_keycloak_client` |  |
| `qux_keycloak_url` |  |
| `qux_keycloak_server` |  |

**Entregues ao container:**

| Variável | Valor |
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

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `qux-fe` | 8082 | ${main_domain} |
| `qux-ws` | 8086 | ${ws_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
