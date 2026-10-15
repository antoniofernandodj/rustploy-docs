---
title: Hospedar Forgejo com Rustploy
description: "Plataforma leve e independente para hospedagem de código Git. Crie Forgejo em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Forgejo**: Plataforma leve e independente para hospedagem de código Git. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `forgejo` |
| **Containers** | 2 (`forgejo`, `db`) |
| **Imagens** | `codeberg.org/forgejo/forgejo:10`, `postgres:17` |
| **Porta da interface** | 3000, no serviço `forgejo` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Forgejo** e selecione.
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
| `USER_UID` | 1000 |
| `USER_GID` | 1000 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `forgejo` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  forgejo:
    image: codeberg.org/forgejo/forgejo:10
    environment:
      - USER_UID=${USER_UID}
      - USER_GID=${USER_GID}
      - FORGEJO__database__DB_TYPE=postgres
      - FORGEJO__database__HOST=db:5432
      - FORGEJO__database__NAME=forgejo
      - FORGEJO__database__USER=forgejo
      - FORGEJO__database__PASSWD=forgejo
    restart: always

    volumes:
      - forgejo_server:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    depends_on:
      - db

  db:
    image: postgres:17
    restart: always
    environment:
      - POSTGRES_USER=forgejo
      - POSTGRES_PASSWORD=forgejo
      - POSTGRES_DB=forgejo

    volumes:
      - forgejo_db:/var/lib/postgresql/data

volumes:
  forgejo_db:
    driver: local
  forgejo_server:
    driver: local
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
