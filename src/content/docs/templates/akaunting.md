---
title: Hospedar Akaunting com Rustploy
description: "Software de contabilidade open-source para pequenas empresas. Crie Akaunting em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Akaunting**: Software de contabilidade open-source para pequenas empresas. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `akaunting` |
| **Containers** | 2 (`akaunting`, `akaunting-db`) |
| **Imagens** | `docker.io/akaunting/akaunting:latest`, `mariadb:10.11` |
| **Porta da interface** | 80, no serviço `akaunting` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Akaunting** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `locale` | en-US |
| `db_name` | akaunting |
| `db_user` | admin |
| `mysql_password` | *senha aleatória de 24 caracteres* |
| `company_name` | My Company |
| `company_email` | *e-mail gerado* |
| `admin_email` | *e-mail gerado* |
| `admin_password` | *senha aleatória de 24 caracteres* |
| `db_prefix` | *hash aleatório*_ |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `APP_URL` | ${main_domain} |
| `LOCALE` | ${locale} |
| `DB_HOST` | akaunting-db |
| `DB_PORT` | 3306 |
| `DB_NAME` | ${db_name} |
| `DB_USERNAME` | ${db_user} |
| `DB_PASSWORD` | ${mysql_password} |
| `DB_PREFIX` | ${db_prefix} |
| `COMPANY_NAME` | ${company_name} |
| `COMPANY_EMAIL` | ${company_email} |
| `ADMIN_EMAIL` | ${admin_email} |
| `ADMIN_PASSWORD` | ${admin_password} |
| `MYSQL_DATABASE` | ${db_name} |
| `MYSQL_USER` | ${db_user} |
| `MYSQL_PASSWORD` | ${mysql_password} |
| `MYSQL_RANDOM_ROOT_PASSWORD` | yes |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `akaunting` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  akaunting:
    image: docker.io/akaunting/akaunting:latest
    restart: unless-stopped
    depends_on:
      akaunting-db:
        condition: service_healthy
    environment:
      # App config
      APP_URL: ${APP_URL}
      LOCALE: ${LOCALE}

      # Database connection
      DB_HOST: akaunting-db
      DB_PORT: 3306
      DB_NAME: ${DB_NAME}
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_PREFIX: ${DB_PREFIX}

      # First-run bootstrap (company + admin)
      COMPANY_NAME: ${COMPANY_NAME}
      COMPANY_EMAIL: ${COMPANY_EMAIL}
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}

    # Expose only to internal network; domain routing handled by Dokploy/Traefik
    expose:
      - "80"

    volumes:
      - akaunting-data:/var/www/html

  akaunting-db:
    image: mariadb:10.11
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      # Randomizes root password on each deployment (recommended)
      MYSQL_RANDOM_ROOT_PASSWORD: "yes"
    volumes:
      - akaunting-db:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  akaunting-data: {}
  akaunting-db: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
