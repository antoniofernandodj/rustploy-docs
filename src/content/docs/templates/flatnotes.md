---
title: Hospedar Flatnotes com Rustploy
description: "Bloco de notas que salva arquivos diretamente em Markdown puro. Crie Flatnotes em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Flatnotes**: Bloco de notas que salva arquivos diretamente em Markdown puro. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `flatnotes` |
| **Containers** | 1 (`flatnotes`) |
| **Imagens** | `dullage/flatnotes:latest` |
| **Porta da interface** | 8080, no serviço `flatnotes` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Flatnotes** e selecione.
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

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `PUID` | 1000 |
| `PGID` | 1000 |
| `FLATNOTES_AUTH_TYPE` | password |
| `FLATNOTES_USERNAME` | *usuário gerado* |
| `FLATNOTES_PASSWORD` | *senha aleatória* |
| `FLATNOTES_SECRET_KEY` | ${secret_key} |
| `FLATNOTES_SESSION_EXPIRY_DAYS` | 30 |
| `FLATNOTES_TOTP_KEY` |  |
| `FLATNOTES_PATH_PREFIX` |  |
| `FLATNOTES_QUICK_ACCESS_HIDE` | false |
| `FLATNOTES_QUICK_ACCESS_TITLE` | RECENTLY MODIFIED |
| `FLATNOTES_QUICK_ACCESS_TERM` | * |
| `FLATNOTES_QUICK_ACCESS_SORT` | lastModified |
| `FLATNOTES_QUICK_ACCESS_LIMIT` | 4 |

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
      FLATNOTES_AUTH_TYPE: ${FLATNOTES_AUTH_TYPE}
      FLATNOTES_USERNAME: ${FLATNOTES_USERNAME}
      FLATNOTES_PASSWORD: ${FLATNOTES_PASSWORD}
      FLATNOTES_SECRET_KEY: ${FLATNOTES_SECRET_KEY}
      FLATNOTES_SESSION_EXPIRY_DAYS: ${FLATNOTES_SESSION_EXPIRY_DAYS}
      FLATNOTES_TOTP_KEY: ${FLATNOTES_TOTP_KEY}
      FLATNOTES_PATH_PREFIX: ${FLATNOTES_PATH_PREFIX}
      FLATNOTES_QUICK_ACCESS_HIDE: ${FLATNOTES_QUICK_ACCESS_HIDE}
      FLATNOTES_QUICK_ACCESS_TITLE: ${FLATNOTES_QUICK_ACCESS_TITLE}
      FLATNOTES_QUICK_ACCESS_TERM: ${FLATNOTES_QUICK_ACCESS_TERM}
      FLATNOTES_QUICK_ACCESS_SORT: ${FLATNOTES_QUICK_ACCESS_SORT}
      FLATNOTES_QUICK_ACCESS_LIMIT: ${FLATNOTES_QUICK_ACCESS_LIMIT}
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
