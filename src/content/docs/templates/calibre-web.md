---
title: Hospedar Calibre-Web com Rustploy
description: "Interface moderna para ler e navegar em e-books do Calibre via navegador. Crie Calibre-Web em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Calibre-Web**: Interface moderna para ler e navegar em e-books do Calibre via navegador. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `calibre-web` |
| **Containers** | 1 (`calibre-web`) |
| **Imagens** | `lscr.io/linuxserver/calibre-web:latest` |
| **Porta da interface** | 8083, no serviço `calibre-web` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Calibre-Web** e selecione.
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
| `PUID` | 1000 |
| `PGID` | 1000 |
| `TZ` | Etc/UTC |
| `DOCKER_MODS` | linuxserver/mods:universal-calibre |
| `OAUTHLIB_RELAX_TOKEN_SCOPE` | 1 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `calibre-web` | 8083 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `startup-scripts/metadata-db-generator.sh`

## docker-compose.yml do template

```yaml
services:
  calibre-web:
    image: lscr.io/linuxserver/calibre-web:latest
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      # - DOCKER_MODS=linuxserver/mods:universal-calibre # optional
      - OAUTHLIB_RELAX_TOKEN_SCOPE=1 # optional
    volumes:
      - calibre-config:/config
      - calibre-books:/books
      - ../files/startup-scripts:/custom-cont-init.d:ro # optional, comment out if you have your own metadata.db file, otherwise it will be created

volumes:
  calibre-config: {}
  calibre-books: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
