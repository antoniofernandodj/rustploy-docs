---
title: Hospedar Pastefy com Rustploy
description: "Repositório privado de textos (Pastebin) com realce de sintaxe e login via OAuth2. Crie Pastefy em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Pastefy**: Repositório privado de textos (Pastebin) com realce de sintaxe e login via OAuth2. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `pastefy` |
| **Containers** | 2 (`db`, `pastefy`) |
| **Imagens** | `mariadb:10.11`, `interaapps/pastefy:latest` |
| **Porta da interface** | 80, no serviço `pastefy` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Pastefy** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_root_password` | *senha aleatória de 32 caracteres* |
| `db_password` | *senha aleatória de 32 caracteres* |
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

**Entregues ao container:**

| Variável | Valor |
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

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `pastefy` | 80 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
