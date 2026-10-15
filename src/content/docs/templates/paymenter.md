---
title: Hospedar Paymenter com Rustploy
description: "Sistema de cobrança, faturamento automático e área do cliente focado em provedores de hospedagem. Crie Paymenter em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Paymenter**: Sistema de cobrança, faturamento automático e área do cliente focado em provedores de hospedagem. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `paymenter` |
| **Containers** | 3 (`database`, `cache`, `paymenter`) |
| **Imagens** | `mariadb:lts`, `redis:alpine`, `ghcr.io/paymenter/paymenter:latest` |
| **Porta da interface** | 80, no serviço `paymenter` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Paymenter** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `app_key` | *chave base64 aleatória (32 bytes)* |
| `mysql_password` | *senha aleatória de 16 caracteres* |
| `mysql_root_password` | *senha aleatória de 20 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `APP_URL` | https://${main_domain} |
| `APP_KEY` | base64:${app_key} |
| `MYSQL_PASSWORD` | ${mysql_password} |
| `MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |
| `MYSQL_DATABASE` | paymenter |
| `MYSQL_USER` | paymenter |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `paymenter` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  database:
    image: mariadb:lts
    restart: unless-stopped
    command: --default-authentication-plugin=mysql_native_password
    volumes:
      - paymenter-database:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DATABASE:-paymenter}
      - MYSQL_USER=${MYSQL_USER:-paymenter}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}

  cache:
    image: redis:alpine
    restart: unless-stopped
    volumes:
      - paymenter-redis:/data

  paymenter:
    image: ghcr.io/paymenter/paymenter:latest
    restart: unless-stopped
    ports:
      - 80
    depends_on:
      - database
      - cache
    volumes:
      - paymenter-storage:/app/var
      - paymenter-logs:/app/storage/logs
      - paymenter-public:/app/storage/app/public
    environment:
      - APP_ENV=${APP_ENV:-production}
      - APP_DEBUG=false
      - APP_KEY=${APP_KEY}
      - APP_URL=${APP_URL}
      - DB_CONNECTION=mysql
      - DB_HOST=database
      - DB_PORT=3306
      - DB_DATABASE=${MYSQL_DATABASE:-paymenter}
      - DB_USERNAME=${MYSQL_USER:-paymenter}
      - DB_PASSWORD=${MYSQL_PASSWORD}
      - CACHE_STORE=redis
      - REDIS_HOST=cache
      - REDIS_PORT=6379
      - TRUSTED_PROXIES=*

volumes:
  paymenter-database: {}
  paymenter-storage: {}
  paymenter-logs: {}
  paymenter-public: {}
  paymenter-redis: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
