---
title: Hospedar Calibre com Rustploy
description: "Gerenciador e organizador completo de bibliotecas de e-books. Crie Calibre em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Calibre**: Gerenciador e organizador completo de bibliotecas de e-books. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `calibre` |
| **Containers** | 1 (`calibre`) |
| **Imagens** | `linuxserver/calibre:7.26.0` |
| **Porta da interface** | 8080, no serviço `calibre` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Calibre** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `password` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `PASSWORD` | *senha aleatória* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `calibre` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.8'

services:
  calibre:
    image: linuxserver/calibre:7.26.0
    restart: unless-stopped
    environment:
      - PASSWORD=${PASSWORD}
      - TZ=Etc/UTC
      - PUID=1000
      - PGID=1000
    ports:
      - 8080
    volumes:
      - books:/books
      - data:/config

volumes:
  books:
  data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
