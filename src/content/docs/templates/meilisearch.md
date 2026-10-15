---
title: Hospedar Meilisearch com Rustploy
description: "Motor de busca textual open-source focado em velocidade extrema e experiência do usuário. Crie Meilisearch em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Meilisearch**: Motor de busca textual open-source focado em velocidade extrema e experiência do usuário. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `meilisearch` |
| **Containers** | 1 (`meilisearch`) |
| **Imagens** | `getmeili/meilisearch:v1.8.3` |
| **Porta da interface** | 7700, no serviço `meilisearch` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Meilisearch** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `master_key` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `MEILI_ENV` | development |
| `MEILI_MASTER_KEY` | ${master_key} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `meilisearch` | 7700 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  meilisearch:
    image: getmeili/meilisearch:v1.8.3
    volumes:
      - meili_data:/meili_data
    environment:
      MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}
      MEILI_ENV: ${MEILI_ENV}

volumes:
  meili_data:
    driver: local
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
