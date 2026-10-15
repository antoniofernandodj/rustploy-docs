---
title: Hospedar Wanderer com Rustploy
description: "Plataforma de mapas e geolocalização estruturada em PocketBase e Meilisearch. Crie Wanderer em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Wanderer**: Plataforma de mapas e geolocalização estruturada em PocketBase e Meilisearch. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `wanderer` |
| **Containers** | 3 (`search`, `db`, `web`) |
| **Imagens** | `getmeili/meilisearch:v1.11.3`, `flomp/wanderer-db`, `flomp/wanderer-web` |
| **Porta da interface** | 3000, no serviço `web` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Wanderer** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `meili_master_key` | *senha aleatória de 32 caracteres* |
| `pocketbase_key` | *senha aleatória de 32 caracteres* |
| `upload_user` | *usuário gerado* |
| `upload_password` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `MEILI_MASTER_KEY` | ${meili_master_key} |
| `POCKETBASE_ENCRYPTION_KEY` | ${pocketbase_key} |
| `UPLOAD_USER` | ${upload_user} |
| `UPLOAD_PASSWORD` | ${upload_password} |
| `ORIGIN` | http://${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `web` | 3000 | ${main_domain} |
| `db` | 8090 | db.${main_domain} |
| `search` | 7700 | search.${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  search:
    image: getmeili/meilisearch:v1.11.3
    environment:
      MEILI_URL: http://search:7700
      MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}
      MEILI_NO_ANALYTICS: "true"
    volumes:
      - search-data:/meili_data/data.ms
    restart: unless-stopped
    healthcheck:
      test: curl --fail http://localhost:7700/health || exit 1
      interval: 15s
      retries: 10
      start_period: 20s
      timeout: 10s

  db:
    image: flomp/wanderer-db
    depends_on:
      search:
        condition: service_healthy
    environment:
      MEILI_URL: http://search:7700
      MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}
      POCKETBASE_ENCRYPTION_KEY: ${POCKETBASE_ENCRYPTION_KEY}
      ORIGIN: ${ORIGIN}
    volumes:
      - db-data:/pb_data
    restart: unless-stopped
    healthcheck:
      test: wget --spider -q http://localhost:8090/health || exit 1
      interval: 15s
      retries: 10
      start_period: 20s
      timeout: 10s

  web:
    image: flomp/wanderer-web
    depends_on:
      search:
        condition: service_healthy
      db:
        condition: service_healthy
    environment:
      MEILI_URL: http://search:7700
      MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}
      ORIGIN: ${ORIGIN}
      BODY_SIZE_LIMIT: Infinity
      PUBLIC_POCKETBASE_URL: http://db:8090
      PUBLIC_DISABLE_SIGNUP: "false"
      UPLOAD_FOLDER: /app/uploads
      UPLOAD_USER: ${UPLOAD_USER}
      UPLOAD_PASSWORD: ${UPLOAD_PASSWORD}
      PUBLIC_VALHALLA_URL: https://valhalla1.openstreetmap.de
      PUBLIC_NOMINATIM_URL: https://nominatim.openstreetmap.org
    volumes:
      - uploads:/app/uploads
    restart: unless-stopped
    healthcheck:
      test: curl --fail http://localhost:3000/ || exit 1
      interval: 15s
      retries: 10
      start_period: 20s
      timeout: 10s

volumes:
  search-data: {}
  db-data: {}
  uploads: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
