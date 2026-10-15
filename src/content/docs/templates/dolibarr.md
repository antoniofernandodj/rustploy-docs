---
title: Hospedar Dolibarr com Rustploy
description: "Pacote unificado de software ERP e CRM para gestão empresarial. Crie Dolibarr em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Dolibarr**: Pacote unificado de software ERP e CRM para gestão empresarial. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `dolibarr` |
| **Containers** | 2 (`dolibarr`, `db`) |
| **Imagens** | `dolibarr/dolibarr:21.0.0`, `mariadb:10.11` |
| **Porta da interface** | 80, no serviço `dolibarr` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Dolibarr** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_name` | dolibarr |
| `db_user` | dolibarr |
| `db_password` | *senha aleatória de 32 caracteres* |
| `db_root_password` | *senha aleatória de 32 caracteres* |
| `admin_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DOLIBARR_HOST` | ${main_domain} |
| `DB_NAME` | ${db_name} |
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |
| `DB_ROOT_PASSWORD` | ${db_root_password} |
| `ADMIN_PASSWORD` | ${admin_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `dolibarr` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  dolibarr:
    image: dolibarr/dolibarr:21.0.0
    restart: always
    environment:
      DOLI_DB_HOST: db
      DOLI_DB_NAME: $DB_NAME
      DOLI_DB_USER: $DB_USER
      DOLI_DB_PASSWORD: $DB_PASSWORD
      DOLI_URL_ROOT: ${DOLIBARR_HOST}
      DOLI_ADMIN_LOGIN: admin
      DOLI_ADMIN_PASSWORD: $ADMIN_PASSWORD
    volumes:
      - dolibarr_documents:/var/www/documents
      - dolibarr_html:/var/www/html
    depends_on:
      db:
        condition: service_healthy

  db:
    image: mariadb:10.11
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: $DB_ROOT_PASSWORD
      MYSQL_DATABASE: $DB_NAME
      MYSQL_USER: $DB_USER
      MYSQL_PASSWORD: $DB_PASSWORD
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD-SHELL", "healthcheck.sh --connect --innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

volumes:
  dolibarr_documents:
  dolibarr_html:
  db_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
