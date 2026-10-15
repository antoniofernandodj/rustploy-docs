---
title: Hospedar Plausible com Rustploy
description: "Analisador leve de tráfego web sem cookies focado na privacidade do usuário. Crie Plausible em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Plausible**: Analisador leve de tráfego web sem cookies focado na privacidade do usuário. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `plausible` |
| **Containers** | 3 (`plausible_db`, `plausible_events_db`, `plausible`) |
| **Imagens** | `postgres:16-alpine`, `clickhouse/clickhouse-server:24.3.3.102-alpine`, `ghcr.io/plausible/community-edition:v2.1.5` |
| **Porta da interface** | 8000, no serviço `plausible` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Plausible** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_base` | *chave base64 aleatória (64 bytes)* |
| `totp_key` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `BASE_URL` | http://${main_domain} |
| `SECRET_KEY_BASE` | ${secret_base} |
| `TOTP_VAULT_KEY` | ${totp_key} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `plausible` | 8000 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/clickhouse/clickhouse-config.xml`
- `/clickhouse/clickhouse-user-config.xml`

## docker-compose.yml do template

```yaml
services:
  plausible_db:
    image: postgres:16-alpine
    restart: always

    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=postgres

  plausible_events_db:
    image: clickhouse/clickhouse-server:24.3.3.102-alpine
    restart: always

    volumes:
      - event-data:/var/lib/clickhouse
      - event-logs:/var/log/clickhouse-server
      - ../files/clickhouse/clickhouse-config.xml:/etc/clickhouse-server/config.d/logging.xml:ro
      - ../files/clickhouse/clickhouse-user-config.xml:/etc/clickhouse-server/users.d/logging.xml:ro
    ulimits:
      nofile:
        soft: 262144
        hard: 262144

  plausible:
    image: ghcr.io/plausible/community-edition:v2.1.5
    restart: always
    command: sh -c "sleep 10 && /entrypoint.sh db createdb && /entrypoint.sh db migrate && /entrypoint.sh run"
    depends_on:
      - plausible_db
      - plausible_events_db
    env_file:
      - .env

volumes:
  db-data:
    driver: local
  event-data:
    driver: local
  event-logs:
    driver: local
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
