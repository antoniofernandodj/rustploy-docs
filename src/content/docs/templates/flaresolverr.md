---
title: Hospedar FlareSolverr com Rustploy
description: "Proxy para contornar proteções do Cloudflare e DDoS-GUARD. Crie FlareSolverr em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**FlareSolverr**: Proxy para contornar proteções do Cloudflare e DDoS-GUARD. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `flaresolverr` |
| **Containers** | 1 (`flaresolverr`) |
| **Imagens** | `ghcr.io/flaresolverr/flaresolverr:latest` |
| **Porta da interface** | 8191, no serviço `flaresolverr` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **FlareSolverr** e selecione.
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
| `LOG_LEVEL` | info |
| `LOG_HTML` | false |
| `CAPTCHA_SOLVER` | none |
| `TZ` | Europe/London |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `flaresolverr` | 8191 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  flaresolverr:
    image: ghcr.io/flaresolverr/flaresolverr:latest
    ports:
      - 8191
    restart: unless-stopped
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
