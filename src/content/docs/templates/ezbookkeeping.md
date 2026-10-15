---
title: Hospedar EZBookkeeping com Rustploy
description: "Gerenciador contábil para finanças pessoais e microempresas. Crie EZBookkeeping em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**EZBookkeeping**: Gerenciador contábil para finanças pessoais e microempresas. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `ezbookkeeping` |
| **Containers** | 2 (`mysql`, `ezbookkeeping`) |
| **Imagens** | `mysql:8.0`, `mayswind/ezbookkeeping` |
| **Porta da interface** | 8080, no serviço `ezbookkeeping` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **EZBookkeeping** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_name` | ezbookkeeping |
| `db_user` | ezbookkeeping |
| `db_pass` | *senha aleatória de 32 caracteres* |
| `root_pass` | *senha aleatória de 32 caracteres* |
| `secret_key` | *senha aleatória de 64 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `MYSQL_ROOT_PASSWORD` | ${root_pass} |
| `MYSQL_DATABASE` | ${db_name} |
| `MYSQL_USER` | ${db_user} |
| `MYSQL_PASSWORD` | ${db_pass} |
| `EBK_SERVER_DOMAIN` | ${main_domain} |
| `EBK_SERVER_ENABLE_GZIP` | true |
| `EBK_DATABASE_TYPE` | mysql |
| `EBK_DATABASE_HOST` | mysql:3306 |
| `EBK_DATABASE_NAME` | ${db_name} |
| `EBK_DATABASE_USER` | ${db_user} |
| `EBK_DATABASE_PASSWD` | ${db_pass} |
| `EBK_LOG_MODE` | file |
| `EBK_SECURITY_SECRET_KEY` | ${secret_key} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `ezbookkeeping` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  mysql:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DATABASE}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
    volumes:
      - mysql-data:/var/lib/mysql
  ezbookkeeping:
    image: mayswind/ezbookkeeping
    restart: unless-stopped
    depends_on:
      - mysql
    environment:
      - EBK_SERVER_DOMAIN=${EBK_SERVER_DOMAIN}
      - EBK_SERVER_ENABLE_GZIP=${EBK_SERVER_ENABLE_GZIP}
      - EBK_DATABASE_TYPE=${EBK_DATABASE_TYPE}
      - EBK_DATABASE_HOST=${EBK_DATABASE_HOST}
      - EBK_DATABASE_NAME=${EBK_DATABASE_NAME}
      - EBK_DATABASE_USER=${EBK_DATABASE_USER}
      - EBK_DATABASE_PASSWD=${EBK_DATABASE_PASSWD}
      - EBK_LOG_MODE=${EBK_LOG_MODE}
      - EBK_SECURITY_SECRET_KEY=${EBK_SECURITY_SECRET_KEY}
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - storage:/ezbookkeeping/storage
      - logs:/ezbookkeeping/log
volumes:
  mysql-data: {}
  storage: {}
  logs: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
