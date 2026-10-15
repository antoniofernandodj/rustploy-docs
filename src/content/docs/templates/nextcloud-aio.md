---
title: Hospedar Nextcloud Aio com Rustploy
description: "Aplicação Nextcloud Aio. Crie Nextcloud Aio em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Nextcloud Aio**: Aplicação Nextcloud Aio. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `nextcloud-aio` |
| **Containers** | 3 (`nextcloud`, `nextcloud_db`, `nextcloud_redis`) |
| **Imagens** | `nextcloud:stable`, `mariadb:10.11`, `redis:alpine` |
| **Porta da interface** | 80, no serviço `nextcloud` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Nextcloud Aio** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `domain_name` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 32 caracteres* |
| `db_root_password` | *senha aleatória de 32 caracteres* |
| `region` | DE |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `MYSQL_PASSWORD` | ${db_password} |
| `MYSQL_ROOT_PASSWORD` | ${db_root_password} |
| `DEFAULT_PHONE_REGION` | ${region} |
| `NEXTCLOUD_DOMAIN` | ${domain_name} |
| `OVERWRITEPROTOCOL` | https |
| `TRUSTED_PROXIES` | 10.0.0.0/8 172.16.0.0/12 |
| `REDIS_HOST` | nextcloud_redis |
| `MYSQL_DATABASE` | nextcloud |
| `MYSQL_USER` | nextcloud |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `nextcloud` | 80 | ${domain_name} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `fix-nextcloud.sh`

## docker-compose.yml do template

```yaml
services:
  nextcloud:
    image: nextcloud:stable
    restart: always
    volumes:
      - nextcloud_data:/var/www/html
      - ../files/fix-nextcloud.sh:/usr/local/bin/fix-nextcloud.sh:ro
    environment:
      - MYSQL_HOST=nextcloud_db
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
    depends_on:
      - nextcloud_db
      - nextcloud_redis

  nextcloud_db:
    image: mariadb:10.11
    restart: always
    volumes:
      - nextcloud_db_data:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}

  nextcloud_redis:
    image: redis:alpine
    restart: always

volumes:
  nextcloud_data:
  nextcloud_db_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
