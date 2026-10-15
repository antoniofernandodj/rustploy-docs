---
title: Hospedar Ojs com Rustploy
description: "Aplicação Ojs. Crie Ojs em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Ojs**: Aplicação Ojs. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `ojs` |
| **Containers** | 2 (`db`, `ojs`) |
| **Imagens** | `mariadb:11.4`, `pkpofficial/ojs:3_3_0-21` |
| **Porta da interface** | 80, no serviço `ojs` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Ojs** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `ojs_password` | *senha aleatória de 16 caracteres* |
| `mysql_root_password` | *senha aleatória de 16 caracteres* |
| `ojs_db_password` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `COMPOSE_PROJECT_NAME` | ojs |
| `MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |
| `OJS_DB_NAME` | ojs |
| `OJS_DB_USER` | ojs |
| `OJS_DB_PASSWORD` | ${ojs_db_password} |
| `OJS_DB_HOST` | db |
| `OJS_DB_DRIVER` | mysqli |
| `OJS_CLI_INSTALL` | 0 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `ojs` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  db:
    image: mariadb:11.4
    environment:
      MYSQL_ROOT_PASSWORD: "${MYSQL_ROOT_PASSWORD}"
      MYSQL_DATABASE: "${OJS_DB_NAME}"
      MYSQL_USER: "${OJS_DB_USER}"
      MYSQL_PASSWORD: "${OJS_DB_PASSWORD}"
    volumes:
      - ojs-db-data:/var/lib/mysql
    restart: unless-stopped

  ojs:
    image: "pkpofficial/ojs:3_3_0-21"
    hostname: "${COMPOSE_PROJECT_NAME}"
    ports:
      - 80
      - 443
    volumes:
      - /etc/localtime:/etc/localtime
      - ojs-private-files:/var/www/files
      - ojs-public-files:/var/www/html/public
    depends_on:
      - db
    restart: unless-stopped

volumes:
  ojs-db-data: {}
  ojs-private-files: {}
  ojs-public-files: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
