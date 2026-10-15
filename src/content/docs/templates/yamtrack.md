---
title: Hospedar Yamtrack com Rustploy
description: "Gerenciador pessoal de animes e mangás assistidos estruturado sob banco de dados Redis. Crie Yamtrack em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Yamtrack**: Gerenciador pessoal de animes e mangás assistidos estruturado sob banco de dados Redis. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `yamtrack` |
| **Containers** | 2 (`yamtrack`, `redis`) |
| **Imagens** | `ghcr.io/fuzzygrim/yamtrack`, `redis:7-alpine` |
| **Porta da interface** | 8000, no serviço `yamtrack` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Yamtrack** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `SECRET` | *senha aleatória de 64 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SECRET` | ${SECRET} |
| `TZ` | Europe/Berlin |
| `REDIS_URL` | redis://redis:6379 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `yamtrack` | 8000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  yamtrack:
    image: ghcr.io/fuzzygrim/yamtrack
    restart: unless-stopped
    depends_on:
      - redis
    environment:
      - TZ=Europe/Berlin
      - SECRET=${SECRET}
      - REDIS_URL=redis://redis:6379
    volumes:
      - yamtrack-db:/yamtrack/db
    expose:
      - 8000

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data

volumes:
  yamtrack-db: {}
  redis_data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
