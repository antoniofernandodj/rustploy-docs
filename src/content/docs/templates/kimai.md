---
title: Hospedar Kimai com Rustploy
description: "Sistema multiusuário para controle e monitoramento de horas trabalhadas (Time-tracking). Crie Kimai em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Kimai**: Sistema multiusuário para controle e monitoramento de horas trabalhadas (Time-tracking). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `kimai` |
| **Containers** | 2 (`app`, `db`) |
| **Imagens** | `kimai/kimai2:apache-2.31.0`, `mariadb:10.11` |
| **Porta da interface** | 8001, no serviço `app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Kimai** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `admin_password` | *senha aleatória de 32 caracteres* |
| `mysql_password` | *senha aleatória de 32 caracteres* |
| `mysql_root_password` | *senha aleatória de 32 caracteres* |
| `app_secret` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `KI_HOST` | ${main_domain} |
| `KI_ADMINMAIL` | admin@kimai.local |
| `KI_ADMINPASS` | ${admin_password} |
| `KI_MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |
| `KI_MYSQL_PASSWORD` | ${mysql_password} |
| `KI_APP_SECRET` | ${app_secret} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `app` | 8001 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  app:
    image: kimai/kimai2:apache-2.31.0
    restart: unless-stopped
    environment:
      APP_ENV: prod
      DATABASE_URL: mysql://kimai:${KI_MYSQL_PASSWORD:-kimai}@db/kimai
      TRUSTED_PROXIES: localhost
      APP_SECRET: ${KI_APP_SECRET}
      MAILER_FROM: ${KI_MAILER_FROM:-admin@kimai.local}
      MAILER_URL: ${KI_MAILER_URL:-null://null}
      ADMINMAIL: ${KI_ADMINMAIL:-admin@kimai.local}
      ADMINPASS: ${KI_ADMINPASS}
    volumes:
      - kimai-data:/opt/kimai/var
    depends_on:
      db:
        condition: service_healthy

  db:
    image: mariadb:10.11
    restart: unless-stopped
    environment:
      - MYSQL_DATABASE=kimai
      - MYSQL_USER=kimai
      - MYSQL_PASSWORD=${KI_MYSQL_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${KI_MYSQL_ROOT_PASSWORD}
    volumes:
      - mysql-data:/var/lib/mysql
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
      - --innodb-buffer-pool-size=256M
      - --innodb-flush-log-at-trx-commit=2
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "kimai", "-p${KI_MYSQL_PASSWORD}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s


volumes:
  kimai-data:
  mysql-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
