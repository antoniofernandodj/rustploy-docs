---
title: Hospedar Mulesoft Esb com Rustploy
description: "Aplicação Mulesoft Esb. Crie Mulesoft Esb em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Mulesoft Esb**: Aplicação Mulesoft Esb. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `mulesoft-esb` |
| **Containers** | 1 (`mule`) |
| **Imagens** | `yogeshmulecraft/mulece-esb:latest` |
| **Porta da interface** | 8081, no serviço `mule` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Mulesoft Esb** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `timezone` | UTC |
| `mule_version` | 4.9.0 |
| `http_port` | 8081 |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `MULE_VERSION` | ${mule_version} |
| `HTTP_PORT` | ${http_port} |
| `MULE_HOME` | /opt/mule-standalone |
| `MULE_BASE` | /opt/mule-standalone |
| `TZ` | ${timezone} |
| `MULE_VERBOSE_EXCEPTIONS` | true |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `mule` | 8081 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  mule:
    image: yogeshmulecraft/mulece-esb:latest
    restart: unless-stopped
    ports:
      - "8081"
    environment:
      - MULE_VERSION=${MULE_VERSION:-4.9.0}
      - HTTP_PORT=${HTTP_PORT:-8081}
      - MULE_HOME=/opt/mule-standalone
      - MULE_BASE=/opt/mule-standalone
      - TZ=UTC
      - MULE_VERBOSE_EXCEPTIONS=true
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:${HTTP_PORT:-8081}/ || exit 0"]
      interval: 60s
      timeout: 20s
      retries: 5
      start_period: 120s
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
