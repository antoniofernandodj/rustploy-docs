---
title: Hospedar HortusFox com Rustploy
description: "Sistema de gerenciamento de fotos, rotinas e tarefas voltado para fotógrafos. Crie HortusFox em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**HortusFox**: Sistema de gerenciamento de fotos, rotinas e tarefas voltado para fotógrafos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `hortusfox` |
| **Containers** | 2 (`app`, `db`) |
| **Imagens** | `ghcr.io/danielbrendel/hortusfox-web:latest`, `mariadb:11` |
| **Porta da interface** | 80, no serviço `app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **HortusFox** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `APP_ADMIN_EMAIL` | *e-mail gerado* |
| `APP_ADMIN_PASSWORD` | *senha aleatória de 16 caracteres* |
| `APP_TIMEZONE` | UTC |
| `DB_DATABASE` | hortusfox |
| `DB_USERNAME` | hortususer |
| `DB_PASSWORD` | *senha aleatória de 20 caracteres* |
| `MARIADB_ROOT_PASSWORD` | *senha aleatória de 24 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `APP_ADMIN_EMAIL` | ${APP_ADMIN_EMAIL} |
| `APP_ADMIN_PASSWORD` | ${APP_ADMIN_PASSWORD} |
| `APP_TIMEZONE` | ${APP_TIMEZONE} |
| `DB_DATABASE` | ${DB_DATABASE} |
| `DB_USERNAME` | ${DB_USERNAME} |
| `DB_PASSWORD` | ${DB_PASSWORD} |
| `MARIADB_ROOT_PASSWORD` | ${MARIADB_ROOT_PASSWORD} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `app` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  app:
    image: ghcr.io/danielbrendel/hortusfox-web:latest
    restart: unless-stopped
    volumes:
      - app_images:/var/www/html/public/img
      - app_logs:/var/www/html/app/logs
      - app_backup:/var/www/html/public/backup
      - app_themes:/var/www/html/public/themes
      - app_migrate:/var/www/html/app/migrations
    environment:
      APP_ADMIN_EMAIL: ${APP_ADMIN_EMAIL}
      APP_ADMIN_PASSWORD: ${APP_ADMIN_PASSWORD}
      APP_TIMEZONE: ${APP_TIMEZONE}
      DB_HOST: db
      DB_PORT: 3306
      DB_DATABASE: ${DB_DATABASE}
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_CHARSET: utf8mb4
    depends_on:
      - db

  db:
    image: mariadb:11
    restart: unless-stopped
    environment:
      MARIADB_ROOT_PASSWORD: ${MARIADB_ROOT_PASSWORD}
      MARIADB_DATABASE: ${DB_DATABASE}
      MARIADB_USER: ${DB_USERNAME}
      MARIADB_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
  app_images:
  app_logs:
  app_backup:
  app_themes:
  app_migrate:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
