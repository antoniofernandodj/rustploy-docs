---
title: Hospedar BookStack com Rustploy
description: "Plataforma wiki para criação de documentações corporativas e manuais. Crie BookStack em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**BookStack**: Plataforma wiki para criação de documentações corporativas e manuais. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `bookstack` |
| **Containers** | 2 (`bookstack`, `bookstack-db`) |
| **Imagens** | `lscr.io/linuxserver/bookstack:24.12.1`, `mariadb:10.11` |
| **Porta da interface** | 80, no serviço `bookstack` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **BookStack** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 16 caracteres* |
| `app_key` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DOMAIN` | ${main_domain} |
| `DB_PASSWORD` | ${db_password} |
| `APP_KEY` | ${app_key} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `bookstack` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  bookstack:
    image: lscr.io/linuxserver/bookstack:24.12.1
    restart: unless-stopped
    ports:
      - 80
    environment:
      - PUID=1000
      - PGID=1000
      - APP_URL=http://${DOMAIN}
      - DB_HOST=bookstack-db
      - DB_USERNAME=mariadb
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_DATABASE=bookstack
      - APP_KEY=${APP_KEY}
    volumes:
      - config:/config
    depends_on:
      - bookstack-db

  bookstack-db:
    image: mariadb:10.11
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_PASSWORD}
      - MYSQL_DATABASE=bookstack
      - MYSQL_USER=mariadb
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql

volumes:
  config: {}
  db_data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
