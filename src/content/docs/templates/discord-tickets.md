---
title: Hospedar Discord Tickets com Rustploy
description: "Bot corporativo para controle e abertura de chamados via Discord. Crie Discord Tickets em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Discord Tickets**: Bot corporativo para controle e abertura de chamados via Discord. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `discord-tickets` |
| **Containers** | 2 (`tickets-postgres`, `tickets-app`) |
| **Imagens** | `mysql:8`, `eartharoid/discord-tickets:4.0.21` |
| **Porta da interface** | 8169, no serviço `tickets-app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Discord Tickets** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `mysql_password` | *senha aleatória* |
| `mysql_root_password` | *senha aleatória* |
| `mysql_user` | tickets |
| `mysql_database` | tickets |
| `encryption_key` | *senha aleatória de 48 caracteres* |

**Entregues ao container:**

| Variável | Valor |
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

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `tickets-app` | 8169 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
