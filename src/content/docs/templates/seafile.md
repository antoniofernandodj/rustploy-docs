---
title: Hospedar Seafile com Rustploy
description: "Nuvem privada para armazenamento, sincronização e compartilhamento de arquivos com foco corporativo. Crie Seafile em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Seafile**: Nuvem privada para armazenamento, sincronização e compartilhamento de arquivos com foco corporativo. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `seafile` |
| **Containers** | 3 (`seafile-db`, `memcached`, `seafile`) |
| **Imagens** | `mariadb:10.11`, `memcached:1.6.29`, `seafileltd/seafile-mc:12.0-latest` |
| **Porta da interface** | 80, no serviço `seafile` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Seafile** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `mysql_root_password` | *senha aleatória de 32 caracteres* |
| `mysql_user_password` | *senha aleatória de 32 caracteres* |
| `admin_password` | *senha aleatória de 32 caracteres* |
| `jwt_private_key` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SEAFILE_MYSQL_DB_HOST` | seafile-db |
| `SEAFILE_MYSQL_DB_USER` | seafile |
| `SEAFILE_MYSQL_DB_PASSWORD` | ${mysql_user_password} |
| `INIT_SEAFILE_MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |
| `TIME_ZONE` | Etc/UTC |
| `JWT_PRIVATE_KEY` | *JWT gerado* |
| `SEAFILE_SERVER_PROTOCOL` | https |
| `SEAFILE_SERVER_HOSTNAME` | ${main_domain} |
| `INIT_SEAFILE_ADMIN_EMAIL` | admin@example.com |
| `INIT_SEAFILE_ADMIN_PASSWORD` | ${admin_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `seafile` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
# https://manual.seafile.com/12.0/setup/setup_ce_by_docker
#
# This Dokploy template for seafile sets the default credentials to:
#   USERNAME: admin@example.com
#   PASSWORD: <SECRET GENERATED IN ENVIRONMENT VARIABLES>
#
# !!! IMPORTANT !!!
#     Please look at the environment variable settings and tweak
#     them prior to the first deployment!
#
#     If you have already deployed once, changes to some environment
#     variables may not take effect. For example, initial passwords.

services:
  seafile-db:
    image: mariadb:10.11
    environment:
      - MYSQL_ROOT_PASSWORD=${INIT_SEAFILE_MYSQL_ROOT_PASSWORD:-}
      - MYSQL_LOG_CONSOLE=true
      - MARIADB_AUTO_UPGRADE=1
    volumes:
      - seafile-mysql-db:/var/lib/mysql"
    networks:
      - seafile-net
    healthcheck:
      test:
        [
          "CMD",
          "/usr/local/bin/healthcheck.sh",
          "--connect",
          "--mariadbupgrade",
          "--innodb_initialized",
        ]
      interval: 20s
      start_period: 30s
      timeout: 5s
      retries: 10

  memcached:
    image: memcached:1.6.29
    entrypoint: memcached -m 256
    networks:
      - seafile-net
    healthcheck:
      test:
        [
          "CMD-SHELL",
          'bash -c "echo version | (exec 3<>/dev/tcp/localhost/11211; cat >&3; timeout 0.5 cat <&3; exec 3<&-)"',
        ]
      interval: 20s
      timeout: 5s
      retries: 10

  seafile:
    image: seafileltd/seafile-mc:12.0-latest
    volumes:
      - seafile-data:/shared
    environment:
      - DB_HOST=${SEAFILE_MYSQL_DB_HOST:-seafile-db}
      - DB_PORT=${SEAFILE_MYSQL_DB_PORT:-3306}
      - DB_USER=${SEAFILE_MYSQL_DB_USER:-seafile}
      - DB_ROOT_PASSWD=${INIT_SEAFILE_MYSQL_ROOT_PASSWORD:-}
      - DB_PASSWORD=${SEAFILE_MYSQL_DB_PASSWORD:?Variable is not set or empty}
      - SEAFILE_MYSQL_DB_CCNET_DB_NAME=${SEAFILE_MYSQL_DB_CCNET_DB_NAME:-ccnet_db}
      - SEAFILE_MYSQL_DB_SEAFILE_DB_NAME=${SEAFILE_MYSQL_DB_SEAFILE_DB_NAME:-seafile_db}
      - SEAFILE_MYSQL_DB_SEAHUB_DB_NAME=${SEAFILE_MYSQL_DB_SEAHUB_DB_NAME:-seahub_db}
      - TIME_ZONE=${TIME_ZONE:-Etc/UTC}
      - INIT_SEAFILE_ADMIN_EMAIL=${INIT_SEAFILE_ADMIN_EMAIL:-me@example.com}
      - INIT_SEAFILE_ADMIN_PASSWORD=${INIT_SEAFILE_ADMIN_PASSWORD:-asecret}
      - SEAFILE_SERVER_HOSTNAME=${SEAFILE_SERVER_HOSTNAME:?Variable is not set or empty}
      - SEAFILE_SERVER_PROTOCOL=${SEAFILE_SERVER_PROTOCOL:-http}
      - SITE_ROOT=${SITE_ROOT:-/}
      - NON_ROOT=${NON_ROOT:-false}
      - JWT_PRIVATE_KEY=${JWT_PRIVATE_KEY:?Variable is not set or empty}
      - SEAFILE_LOG_TO_STDOUT=${SEAFILE_LOG_TO_STDOUT:-true}
    depends_on:
      seafile-db:
        condition: service_healthy
      memcached:
        condition: service_started
    networks:
      - seafile-net
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:80/api2/ping"]
      interval: 20s
      timeout: 5s
      retries: 10

networks:
  seafile-net:
    name: seafile-net

volumes:
  seafile-mysql-db:
  seafile-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
