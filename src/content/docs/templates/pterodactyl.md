---
title: Hospedar Pterodactyl com Rustploy
description: "Painel avançado e robusto focado no gerenciamento massivo de servidores de jogos em Docker. Crie Pterodactyl em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Pterodactyl**: Painel avançado e robusto focado no gerenciamento massivo de servidores de jogos em Docker. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `pterodactyl` |
| **Containers** | 3 (`database`, `cache`, `panel`) |
| **Imagens** | `mariadb:10.5`, `redis:alpine`, `ghcr.io/pterodactyl/panel:latest` |
| **Porta da interface** | 80, no serviço `panel` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Pterodactyl** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 32 caracteres* |
| `db_root_password` | *senha aleatória de 32 caracteres* |
| `secret_key` | *chave base64 aleatória (48 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `Domain` | ${main_domain} |
| `APP_URL` | {$main_domain} |
| `APP_TIMEZONE` | UTC |
| `APP_SERVICE_AUTHOR` | noreply@example.com |
| `MAIL_FROM` | noreply@example.com |
| `MAIL_DRIVER` | smtp |
| `MAIL_HOST` | mail |
| `MAIL_PORT` | 1025 |
| `MAIL_USERNAME` |  |
| `MAIL_PASSWORD` |  |
| `MAIL_ENCRYPTION` | true |
| `MYSQL_PASSWORD` | ${db_password} |
| `MYSQL_ROOT_PASSWORD` | ${db_root_password} |
| `DB_PORT` | 3306 |
| `CACHE_DRIVER` | redis |
| `SESSION_DRIVER` | redis |
| `QUEUE_DRIVER` | redis |
| `REDIS_HOST` | cache |
| `DB_HOST` | database |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `panel` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  database:
    image: mariadb:10.5
    restart: always
    command: --default-authentication-plugin=mysql_native_password
    volumes:
      - "pterodb:/var/lib/mysql"
    environment:
      MYSQL_DATABASE: "panel"
      MYSQL_USER: "pterodactyl"
      MYSQL_PASSWORD:
      MYSQL_ROOT_PASSWORD:
  cache:
    image: redis:alpine
    restart: always
  panel:
    image: ghcr.io/pterodactyl/panel:latest
    restart: always
    links:
      - database
      - cache
    volumes:
      - "pterovar:/app/var/"
      - "pteronginx:/etc/nginx/http.d/"
      - "pterocerts:/etc/letsencrypt/"
      - "pterologs:/app/storage/logs"
    environment:
      APP_ENV: "production"
      APP_ENVIRONMENT_ONLY: "false"
      CACHE_DRIVER:
      SESSION_DRIVER:
      QUEUE_DRIVER:
      REDIS_HOST:
      DB_HOST:
      DB_PASSWORD: ${MYSQL_PASSWORD}
      DB_PORT:
      MYSQL_PASSWORD:
      MYSQL_ROOT_PASSWORD:
      DB_CONNECTION: "mysql"

networks:
  default:
    ipam:
      config:
        - subnet: 172.20.0.0/16

volumes:
  pterodb:
  pterovar:
  pteronginx:
  pterocerts:
  pterologs:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
