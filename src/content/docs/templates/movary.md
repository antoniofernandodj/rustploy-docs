---
title: Hospedar Movary com Rustploy
description: "Rastreador pessoal de histórico de filmes assistidos integrado à base de dados do TMDB. Crie Movary em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Movary**: Rastreador pessoal de histórico de filmes assistidos integrado à base de dados do TMDB. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `movary` |
| **Containers** | 2 (`movary`, `mysql`) |
| **Imagens** | `leepeuker/movary:${MOVARY_VERSION:-latest}`, `mysql:${MYSQL_VERSION:-8.0}` |
| **Porta da interface** | 8080, no serviço `movary` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Movary** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `tmdb_api_key` |  |
| `mysql_password` | *senha aleatória de 32 caracteres* |
| `mysql_root_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `MOVARY_VERSION` | latest |
| `MYSQL_VERSION` | 8.0 |
| `TMDB_API_KEY` | ${tmdb_api_key} |
| `MYSQL_PASSWORD` | ${mysql_password} |
| `MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |
| `APP_URL` | http://${main_domain} |
| `APP_ENV` | production |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `movary` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  movary:
    image: leepeuker/movary:${MOVARY_VERSION:-latest}
    restart: unless-stopped
    ports:
      - "8080"
    environment:
      # TMDB API configuration
      TMDB_API_KEY: ${TMDB_API_KEY}
      # Database configuration
      DATABASE_MODE: "mysql"
      DATABASE_MYSQL_HOST: "mysql"
      DATABASE_MYSQL_NAME: "movary"
      DATABASE_MYSQL_USER: "movary_user"
      DATABASE_MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      # Application settings
      APP_URL: ${APP_URL:-http://localhost:8080}
      APP_ENV: ${APP_ENV:-production}
    volumes:
      - movary_storage:/app/storage
    depends_on:
      - mysql

  mysql:
    image: mysql:${MYSQL_VERSION:-8.0}
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: "movary"
      MYSQL_USER: "movary_user"
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      # MySQL optimization
      MYSQL_INNODB_BUFFER_POOL_SIZE: "128M"
      MYSQL_INNODB_LOG_FILE_SIZE: "64M"
    volumes:
      - movary_db:/var/lib/mysql
    command: --default-authentication-plugin=mysql_native_password

volumes:
  movary_db:
  movary_storage:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
