---
title: Hospedar Gitingest com Rustploy
description: "App utilitário integrado com S3, Sentry e coleta de métricas via Prometheus. Crie Gitingest em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Gitingest**: App utilitário integrado com S3, Sentry e coleta de métricas via Prometheus. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `gitingest` |
| **Containers** | 1 (`gitingest`) |
| **Imagens** | `elestio/gitingest:${SOFTWARE_VERSION_TAG}` |
| **Porta da interface** | 8000, no serviço `gitingest` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Gitingest** e selecione.
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
| `SOFTWARE_VERSION_TAG` | latest |
| `ALLOWED_HOSTS` | ${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `gitingest` | 8000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  gitingest:
    image: elestio/gitingest:${SOFTWARE_VERSION_TAG}
    restart: unless-stopped
    expose:
      - 8000
    environment:
      - ALLOWED_HOSTS=${ALLOWED_HOSTS}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
