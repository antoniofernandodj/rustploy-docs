---
title: Hospedar YOURLS com Rustploy
description: "Sistema em PHP clássico para criação de encurtadores de links privados sob controle total do usuário. Crie YOURLS em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**YOURLS**: Sistema em PHP clássico para criação de encurtadores de links privados sob controle total do usuário. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `yourls` |
| **Containers** | 2 (`yourls-app`, `yourls-mysql`) |
| **Imagens** | `yourls:1.9.2`, `mysql:5.7` |
| **Porta da interface** | 80, no serviço `yourls-app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **YOURLS** e selecione.
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
| `admin_password` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `YOURLS_HOST` | ${main_domain} |
| `YOURLS_ADMIN_USER` | admin |
| `YOURLS_ADMIN_PASSWORD` | ${admin_password} |
| `MYSQL_PASSWORD` | ${mysql_password} |
| `MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `yourls-app` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.7'

services:
  yourls-app:
    image: yourls:1.9.2

    environment:
      YOURLS_SITE: https://${YOURLS_HOST}
      YOURLS_USER: ${YOURLS_ADMIN_USER}
      YOURLS_PASS: ${YOURLS_ADMIN_PASSWORD}
      YOURLS_DB_HOST: yourls-mysql
      YOURLS_DB_USER: yourls
      YOURLS_DB_PASS: ${MYSQL_PASSWORD}
      YOURLS_DB_NAME: yourls
    volumes:
      - yourls-data:/var/www/html
    depends_on:
      yourls-mysql:
        condition: service_healthy
    restart: always

  yourls-mysql:
    image: mysql:5.7

    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: yourls
      MYSQL_USER: yourls
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - yourls-mysql-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u$$MYSQL_USER", "-p$$MYSQL_PASSWORD"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

volumes:
  yourls-data:
  yourls-mysql-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
