---
title: Hospedar Listmonk com Rustploy
description: "Gerenciador de campanhas de e-mail marketing e newsletters de alta performance. Crie Listmonk em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Listmonk**: Gerenciador de campanhas de e-mail marketing e newsletters de alta performance. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `listmonk` |
| **Containers** | 2 (`db`, `app`) |
| **Imagens** | `postgres:17-alpine`, `listmonk/listmonk:v5.0.0` |
| **Porta da interface** | 9000, no serviço `app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Listmonk** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `app` | 9000 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `config.toml`

## docker-compose.yml do template

```yaml
services:
  db:
    image: postgres:17-alpine
    ports:
      - 5432
    environment:
      - POSTGRES_USER=listmonk
      - POSTGRES_PASSWORD=listmonk
      - POSTGRES_DB=listmonk
    restart: unless-stopped
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U listmonk" ]
      interval: 10s
      timeout: 5s
      retries: 6
    volumes:
      - listmonk-data:/var/lib/postgresql/data

  app:
    restart: unless-stopped
    image: listmonk/listmonk:v5.0.0
    environment:
      - LISTMONK_app__address=0.0.0.0:9000
      - LISTMONK_db__user=listmonk
      - LISTMONK_db__password=listmonk
      - LISTMONK_db__database=listmonk
      - LISTMONK_db__host=db
      - LISTMONK_db__port=5432
      - LISTMONK_db__ssl_mode=disable
      - LISTMONK_db__max_open=25
      - LISTMONK_db__max_idle=25
      - LISTMONK_db__max_lifetime=300s
      - TZ=Etc/UTC
    depends_on:
      - db
    command: [ sh, -c, "./listmonk --install --idempotent --yes --config '' && ./listmonk --upgrade --yes --config '' && ./listmonk --config ''" ]
      # --config (file) param is set to empty so that listmonk only uses the env vars (below) for config.
      # --install --idempotent ensures that DB installation happens only once on an empty DB, on the first ever start.
      # --upgrade automatically runs any DB migrations when a new image is pulled.
    volumes:
      - ../files/config.toml:/listmonk/config.toml
      - listmonk-uploads:/listmonk/uploads

volumes:
  listmonk-uploads:
  listmonk-data:
    driver: local
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
