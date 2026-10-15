---
title: Hospedar ConvertX com Rustploy
description: "Serviço utilitário de conversão de arquivos de mídia em massa. Crie ConvertX em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**ConvertX**: Serviço utilitário de conversão de arquivos de mídia em massa. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `convertx` |
| **Containers** | 1 (`convertx`) |
| **Imagens** | `ghcr.io/c4illin/convertx` |
| **Porta da interface** | 3000, no serviço `convertx` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **ConvertX** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `jwt_secret` | *JWT gerado* |
| `account_registration` | false |
| `http_allowed` | true |
| `allow_unauthenticated` | false |
| `auto_delete_every_n_hours` | 24 |
| `webroot` |  |
| `ffmpeg_args` |  |
| `hide_history` | false |
| `language` | en |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `JWT_SECRET` | *JWT gerado* |
| `ACCOUNT_REGISTRATION` | ${account_registration} |
| `HTTP_ALLOWED` | ${http_allowed} |
| `ALLOW_UNAUTHENTICATED` | ${allow_unauthenticated} |
| `AUTO_DELETE_EVERY_N_HOURS` | ${auto_delete_every_n_hours} |
| `WEBROOT` | ${webroot} |
| `FFMPEG_ARGS` | ${ffmpeg_args} |
| `HIDE_HISTORY` | ${hide_history} |
| `LANGUAGE` | ${language} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `convertx` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  convertx:
    image: ghcr.io/c4illin/convertx
    restart: unless-stopped
    ports:
      - 3000
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - ACCOUNT_REGISTRATION=${ACCOUNT_REGISTRATION}
      - HTTP_ALLOWED=${HTTP_ALLOWED}
      - ALLOW_UNAUTHENTICATED=${ALLOW_UNAUTHENTICATED}
      - AUTO_DELETE_EVERY_N_HOURS=${AUTO_DELETE_EVERY_N_HOURS}
      - WEBROOT=${WEBROOT}
      - FFMPEG_ARGS=${FFMPEG_ARGS}
      - HIDE_HISTORY=${HIDE_HISTORY}
      - LANGUAGE=${LANGUAGE}
    volumes:
      - ../files/data:/app/data
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
