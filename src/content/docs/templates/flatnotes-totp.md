---
title: Hospedar Flatnotes (TOTP) com Rustploy
description: "Versão do Flatnotes com camada de autenticação em duas etapas (2FA). Crie Flatnotes (TOTP) em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Flatnotes (TOTP)**: Versão do Flatnotes com camada de autenticação em duas etapas (2FA). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `flatnotes-totp` |
| **Containers** | 1 (`flatnotes`) |
| **Imagens** | `dullage/flatnotes:latest` |
| **Porta da interface** | 8080, no serviço `flatnotes` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Flatnotes (TOTP)** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `username` | *usuário gerado* |
| `password` | *senha aleatória de 16 caracteres* |
| `secret_key` | *senha aleatória de 32 caracteres* |
| `totp_key` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `PUID` | 1000 |
| `PGID` | 1000 |
| `FLATNOTES_AUTH_TYPE` | totp |
| `FLATNOTES_USERNAME` | *usuário gerado* |
| `FLATNOTES_PASSWORD` | *senha aleatória* |
| `FLATNOTES_SECRET_KEY` | ${secret_key} |
| `FLATNOTES_TOTP_KEY` | ${totp_key} |
| `FLATNOTES_SESSION_EXPIRY_DAYS` | 30 |
| `FLATNOTES_PATH_PREFIX` |  |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `flatnotes` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  flatnotes:
    image: dullage/flatnotes:latest
    restart: unless-stopped
    environment:
      PUID: ${PUID}
      PGID: ${PGID}
      FLATNOTES_AUTH_TYPE: "totp"
      FLATNOTES_USERNAME: ${FLATNOTES_USERNAME}
      FLATNOTES_PASSWORD: ${FLATNOTES_PASSWORD}
      FLATNOTES_SECRET_KEY: ${FLATNOTES_SECRET_KEY}
      FLATNOTES_TOTP_KEY: ${FLATNOTES_TOTP_KEY}
      FLATNOTES_SESSION_EXPIRY_DAYS: ${FLATNOTES_SESSION_EXPIRY_DAYS}
      FLATNOTES_PATH_PREFIX: ${FLATNOTES_PATH_PREFIX}
    expose:
      - 8080
    volumes:
      - flatnotes-data:/data

volumes:
  flatnotes-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
