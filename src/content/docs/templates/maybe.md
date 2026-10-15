---
title: Hospedar Maybe com Rustploy
description: "Aplicação privada e moderna para acompanhamento financeiro e despesas domésticas. Crie Maybe em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Maybe**: Aplicação privada e moderna para acompanhamento financeiro e despesas domésticas. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `maybe` |
| **Containers** | 2 (`app`, `db`) |
| **Imagens** | `ghcr.io/maybe-finance/maybe:sha-68c570eed8810fd59b5b33cca51bbad5eabb4cb4`, `postgres:16` |
| **Porta da interface** | 3000, no serviço `app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Maybe** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_key_base` | *chave base64 aleatória (64 bytes)* |
| `synth_api_key` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SECRET_KEY_BASE` | ${secret_key_base} |
| `SELF_HOSTED` | true |
| `SYNTH_API_KEY` | ${synth_api_key} |
| `RAILS_FORCE_SSL` | false |
| `RAILS_ASSUME_SSL` | false |
| `GOOD_JOB_EXECUTION_MODE` | async |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `app` | 3000 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `./uploads`

## docker-compose.yml do template

```yaml
services:
  app:
    image: ghcr.io/maybe-finance/maybe:sha-68c570eed8810fd59b5b33cca51bbad5eabb4cb4
    restart: unless-stopped
    volumes:
      - ../files/uploads:/app/uploads
    environment:
      DATABASE_URL: postgresql://maybe:maybe@db:5432/maybe
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
      SELF_HOSTED: true
      SYNTH_API_KEY: ${SYNTH_API_KEY}
      RAILS_FORCE_SSL: "false"
      RAILS_ASSUME_SSL: "false"
      GOOD_JOB_EXECUTION_MODE: async
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5

    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: maybe
      POSTGRES_USER: maybe
      POSTGRES_PASSWORD: maybe

volumes:
  db-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
