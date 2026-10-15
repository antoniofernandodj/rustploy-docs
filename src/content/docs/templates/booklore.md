---
title: Hospedar Booklore com Rustploy
description: "Aplicação em MariaDB para gerenciar dados relacionados a livros. Crie Booklore em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Booklore**: Aplicação em MariaDB para gerenciar dados relacionados a livros. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `booklore` |
| **Containers** | 2 (`booklore`, `mariadb`) |
| **Imagens** | `ghcr.io/booklore-app/booklore:${BOOKLORE_IMAGE_TAG}`, `lscr.io/linuxserver/mariadb:latest` |
| **Porta da interface** | 6060, no serviço `booklore` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Booklore** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `app_password` | *senha aleatória de 32 caracteres* |
| `db_root_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `BOOKLORE_IMAGE_TAG` | latest |
| `PUID` | 1000 |
| `PGID` | 1000 |
| `TZ` | Etc/UTC |
| `MYSQL_DATABASE` | booklore |
| `MYSQL_USER` | booklore |
| `MYSQL_PASSWORD` | ${app_password} |
| `MYSQL_ROOT_PASSWORD` | ${db_root_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `booklore` | 6060 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  booklore:
    image: ghcr.io/booklore-app/booklore:${BOOKLORE_IMAGE_TAG}
    environment:
      - DATABASE_URL=jdbc:mariadb://mariadb:3306/${MYSQL_DATABASE}
      - DATABASE_USERNAME=${MYSQL_USER}
      - DATABASE_PASSWORD=${MYSQL_PASSWORD}
    depends_on:
      mariadb:
        condition: service_healthy
    ports:
      - 6060
    volumes:
      - booklore-data:/app/data
      - booklore-books:/books

  mariadb:
    image: lscr.io/linuxserver/mariadb:latest
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TZ}
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DATABASE}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
    volumes:
      - mariadb-config:/config
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mariadb-admin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  booklore-data: {}
  booklore-books: {}
  mariadb-config: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
