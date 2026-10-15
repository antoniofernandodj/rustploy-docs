---
title: Hospedar Mixpost com Rustploy
description: "Plataforma centralizada para agendamento e postagem automática em redes sociais. Crie Mixpost em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Mixpost**: Plataforma centralizada para agendamento e postagem automática em redes sociais. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `mixpost` |
| **Containers** | 3 (`mixpost`, `mysql`, `redis`) |
| **Imagens** | `inovector/mixpost:latest`, `mysql/mysql-server:8.0`, `redis:latest` |
| **Porta da interface** | 80, no serviço `mixpost` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Mixpost** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `mx_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `APP_NAME` | Mixpost |
| `APP_KEY` | base64:ygtEUxD0fB3vUchihbUYqUzN57rfNi9ER5alJ98dWiA= |
| `APP_DEBUG` | false |
| `APP_DOMAIN` | ${main_domain} |
| `APP_URL` | http://${APP_DOMAIN} |
| `DB_DATABASE` | mixpost_db |
| `DB_USERNAME` | mixpost_user |
| `DB_PASSWORD` | ${mx_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `mixpost` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
    mixpost:
        image: inovector/mixpost:latest
        environment:
            APP_NAME: ${APP_NAME}
            APP_KEY: ${APP_KEY}
            APP_DEBUG: ${APP_DEBUG}
            APP_DOMAIN: ${APP_DOMAIN}
            APP_URL: ${APP_URL}
            DB_DATABASE: ${DB_DATABASE}
            DB_USERNAME: ${DB_USERNAME}
            DB_PASSWORD: ${DB_PASSWORD}
        volumes:
            - storage:/var/www/html/storage/app
            - logs:/var/www/html/storage/logs
        depends_on:
            - mysql
            - redis 
        restart: unless-stopped
    mysql:
        image: 'mysql/mysql-server:8.0'
        environment:
            MYSQL_DATABASE: ${DB_DATABASE}
            MYSQL_USER: ${DB_USERNAME}
            MYSQL_PASSWORD: ${DB_PASSWORD}
        volumes:
            - 'mysql:/var/lib/mysql'
        healthcheck:
            test: ["CMD", "mysqladmin", "ping", "-p ${DB_PASSWORD}"]
            retries: 3
            timeout: 5s
        restart: unless-stopped
    redis:
        image: 'redis:latest'
        command: redis-server --appendonly yes --replica-read-only no
        volumes:
            - 'redis:/data'
        healthcheck:
            test: ["CMD", "redis-cli", "ping"]
            retries: 3
            timeout: 5s
        restart: unless-stopped  

volumes:
    mysql: {}
    redis: {}
    storage: {}
    logs: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
