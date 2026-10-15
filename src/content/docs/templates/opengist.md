---
title: Hospedar OpenGist com Rustploy
description: "Alternativa auto-hospedada ao GitHub Gist para compartilhamento público ou privado de trechos de código. Crie OpenGist em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**OpenGist**: Alternativa auto-hospedada ao GitHub Gist para compartilhamento público ou privado de trechos de código. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `opengist` |
| **Containers** | 1 (`opengist`) |
| **Imagens** | `ghcr.io/thomiceli/opengist:1` |
| **Porta da interface** | 6157, no serviço `opengist` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **OpenGist** e selecione.
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
| `UID` | 1001 |
| `GID` | 1001 |
| `OG_LOG_LEVEL` | info |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `opengist` | 6157 | ${main_domain} |

## docker-compose.yml do template

```yaml
# docker-compose.yml
version: "3.8"
services:
  opengist:
    image: ghcr.io/thomiceli/opengist:1
    restart: unless-stopped
    ports:
      - 6157 # HTTP port
      - 2222 # SSH port (optional)
    volumes:
      - opengist-data:/opengist
    environment:
      - UID=${UID}
      - GID=${GID}
      - OG_LOG_LEVEL=${OG_LOG_LEVEL}
volumes:
  opengist-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
