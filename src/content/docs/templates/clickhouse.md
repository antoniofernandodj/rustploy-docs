---
title: Hospedar ClickHouse com Rustploy
description: "Banco de dados analítico (OLAP) orientado a colunas extremamente veloz. Crie ClickHouse em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**ClickHouse**: Banco de dados analítico (OLAP) orientado a colunas extremamente veloz. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `clickhouse` |
| **Containers** | 1 (`clickhouse`) |
| **Imagens** | `clickhouse/clickhouse-server:latest` |
| **Porta da interface** | 8123, no serviço `clickhouse` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **ClickHouse** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `clickhouse_user` | default |
| `clickhouse_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `CLICKHOUSE_USER` | ${clickhouse_user} |
| `CLICKHOUSE_PASSWORD` | ${clickhouse_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `clickhouse` | 8123 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  clickhouse:
    image: clickhouse/clickhouse-server:latest
    restart: unless-stopped
    environment:
      - CLICKHOUSE_USER=${CLICKHOUSE_USER}
      - CLICKHOUSE_PASSWORD=${CLICKHOUSE_PASSWORD}
    volumes:
      - clickhouse-data:/var/lib/clickhouse
      - clickhouse-logs:/var/log/clickhouse-server

volumes:
  clickhouse-data:
  clickhouse-logs:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
