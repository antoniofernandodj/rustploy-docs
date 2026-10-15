---
title: Hospedar TRMNL BYOS Laravel com Rustploy
description: "Aplicação self-hosted em Laravel feita para gerenciar as telas de tinta eletrônica (e-ink) da TRMNL. Crie TRMNL BYOS Laravel em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**TRMNL BYOS Laravel**: Aplicação self-hosted em Laravel feita para gerenciar as telas de tinta eletrônica (e-ink) da TRMNL. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `trmnl-byos-laravel` |
| **Containers** | 1 (`trmnl-byos-laravel`) |
| **Imagens** | `ghcr.io/usetrmnl/byos_laravel:0.27.0` |
| **Porta da interface** | 8080, no serviço `trmnl-byos-laravel` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **TRMNL BYOS Laravel** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `APP_URL` | ${main_domain} |
| `PHP_OPCACHE_ENABLE` | 1 |
| `APP_TIMEZONE` | UTC |
| `REGISTRATION_ENABLED` | 1 |
| `FORCE_HTTPS` | 0 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `trmnl-byos-laravel` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  trmnl-byos-laravel:
    image: ghcr.io/usetrmnl/byos_laravel:0.27.0
    environment:
      - APP_URL=${APP_URL}
      - PHP_OPCACHE_ENABLE=${PHP_OPCACHE_ENABLE}
      - DEPLOY_VARIANT="dokploy"
      - DB_DATABASE=database/storage/database.sqlite
      - APP_TIMEZONE=${APP_TIMEZONE}
      # - APP_KEY:
      - REGISTRATION_ENABLED=${REGISTRATION_ENABLED}
      - FORCE_HTTPS=${FORCE_HTTPS}
    restart: always
    volumes:
      - trmnl-database:/var/www/html/database/storage
      - trmnl-storage:/var/www/html/storage/app/public/images/generated
volumes:
  trmnl-database:
  trmnl-storage:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
