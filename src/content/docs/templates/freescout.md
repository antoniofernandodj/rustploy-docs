---
title: Hospedar FreeScout com Rustploy
description: "Central de atendimento e helpdesk (Alternativa ao HelpScout e Zendesk). Crie FreeScout em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**FreeScout**: Central de atendimento e helpdesk (Alternativa ao HelpScout e Zendesk). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `freescout` |
| **Containers** | 2 (`freescout-db`, `freescout`) |
| **Imagens** | `mariadb:10.6`, `tiredofit/freescout:latest` |
| **Porta da interface** | 80, no serviço `freescout` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **FreeScout** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `mysql_root_password` | *senha aleatória de 16 caracteres* |
| `admin_email` | *e-mail gerado* |
| `admin_password` | *senha aleatória de 16 caracteres* |
| `db_name` | freescout |
| `db_user` | freescout_user |
| `db_pass` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |
| `DB_NAME` | ${db_name} |
| `DB_USER` | ${db_user} |
| `DB_PASS` | ${db_pass} |
| `ADMIN_EMAIL` | ${admin_email} |
| `ADMIN_PASS` | ${admin_password} |
| `ADMIN_FIRST_NAME` | Admin |
| `ADMIN_LAST_NAME` | User |
| `SITE_URL` | http://${main_domain} |
| `APPLICATION_NAME` | Customer Support |
| `APP_PROXY` |  |
| `APP_TRUSTED_PROXIES` | 172.16.0.0/12,192.168.0.0/16,10.0.0.0/8 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `freescout` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  freescout-db:
    image: mariadb:10.6
    volumes:
      - freescout-db-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASS}
    healthcheck:
      test:
        [
          "CMD",
          "mysqladmin",
          "ping",
          "-h",
          "localhost",
          "-u",
          "root",
          "-p${MYSQL_ROOT_PASSWORD}",
        ]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  freescout:
    image: tiredofit/freescout:latest
    volumes:
      - freescout-data:/data
      - freescout-html:/www/html
      - freescout-logs:/www/logs
    depends_on:
      freescout-db:
        condition: service_healthy
    environment:
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASS=${ADMIN_PASS}
      - ADMIN_FIRST_NAME=${ADMIN_FIRST_NAME}
      - ADMIN_LAST_NAME=${ADMIN_LAST_NAME}
      - SITE_URL=${SITE_URL}
      - DB_HOST=freescout-db
      - DB_PORT=3306
      - DB_TYPE=mysql
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASS=${DB_PASS}
      - APPLICATION_NAME=${APPLICATION_NAME}
      - SETUP_TYPE=AUTO
      - ENABLE_AUTO_UPDATE=TRUE
      - DISPLAY_ERRORS=FALSE
      - APP_PROXY=${APP_PROXY}
      - APP_TRUSTED_PROXIES=${APP_TRUSTED_PROXIES}
    restart: unless-stopped

volumes:
  freescout-db-data:
  freescout-data:
  freescout-html:
  freescout-logs:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
