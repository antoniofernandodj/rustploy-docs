---
title: Hospedar Wordpress com Rustploy
description: "O CMS mais utilizado no mundo para criação e gerenciamento de sites e blogs. Crie Wordpress em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Wordpress**: O CMS mais utilizado no mundo para criação e gerenciamento de sites e blogs. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `wordpress` |
| **Containers** | 2 (`wordpress`, `wp_db`) |
| **Imagens** | `wordpress:latest`, `mysql:8.4` |
| **Porta da interface** | 80, no serviço `wordpress` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Wordpress** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_name` | wordpress |
| `db_user` | wordpress |
| `db_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `WORDPRESS_DEBUG` | 0 |
| `DB_NAME` | ${db_name} |
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `wordpress` | 80 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `uploads.ini`

## docker-compose.yml do template

```yaml
services:
  wordpress:
    image: wordpress:latest
    volumes:
      - wp_app:/var/www/html
      - ../files/uploads.ini:/usr/local/etc/php/conf.d/uploads.ini
    environment:
      WORDPRESS_DB_HOST: wp_db
      WORDPRESS_DB_NAME: $DB_NAME
      WORDPRESS_DB_USER: root
      WORDPRESS_DB_PASSWORD: $DB_PASSWORD
      WORDPRESS_DEBUG: ${WORDPRESS_DEBUG:-0}
      WORDPRESS_CONFIG_EXTRA: |
        define('WP_MEMORY_LIMIT', '256M');
        define('DISALLOW_FILE_EDIT', true);
    depends_on:
      wp_db:
        condition: service_healthy
    restart: unless-stopped

  wp_db:
    image: mysql:8.4
    restart: unless-stopped
    volumes:
      - wp_data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: $DB_PASSWORD
      MYSQL_DATABASE: $DB_NAME
    healthcheck:
      test: ["CMD-SHELL", "exit | mysql -h localhost -P 3306 -u root -p$$MYSQL_ROOT_PASSWORD"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

volumes:
  wp_app:
  wp_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
