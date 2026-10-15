---
title: Hospedar ClassicPress com Rustploy
description: "CMS focado em criadores (Fork estável do WordPress com editor clássico). Crie ClassicPress em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**ClassicPress**: CMS focado em criadores (Fork estável do WordPress com editor clássico). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `classicpress` |
| **Containers** | 2 (`classicpress`, `db`) |
| **Imagens** | `classicpress/classicpress:php8.3-apache`, `mariadb:10.6` |
| **Porta da interface** | 80, no serviço `classicpress` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **ClassicPress** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `DB_PASSWORD` | *senha aleatória de 16 caracteres* |
| `DB_ROOT_PASSWORD` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DB_PASSWORD` | ${DB_PASSWORD} |
| `DB_ROOT_PASSWORD` | ${DB_ROOT_PASSWORD} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `classicpress` | 80 | *domínio (gerado; troque pelo seu)* |

## docker-compose.yml do template

```yaml
version: "3"

services:
  classicpress:
    image: classicpress/classicpress:php8.3-apache
    ports:
      - "80"
    environment:
      - WORDPRESS_DB_HOST=db
      - WORDPRESS_DB_USER=wordpress
      - WORDPRESS_DB_PASSWORD=${DB_PASSWORD}
      - WORDPRESS_DB_NAME=wordpress
    volumes:
      - wordpress-data:/var/www/html
    depends_on:
      - db

  db:
    image: mariadb:10.6
    environment:
      - MYSQL_DATABASE=wordpress
      - MYSQL_USER=wordpress
      - MYSQL_PASSWORD=${DB_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
    volumes:
      - db-data:/var/lib/mysql

volumes:
  wordpress-data:
  db-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
