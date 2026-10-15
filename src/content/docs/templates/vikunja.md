---
title: Hospedar Vikunja com Rustploy
description: "Organizador completo de tarefas e listas de afazeres com suporte a Kanbans e visualizações de Gantt. Crie Vikunja em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Vikunja**: Organizador completo de tarefas e listas de afazeres com suporte a Kanbans e visualizações de Gantt. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `vikunja` |
| **Containers** | 2 (`vikunja`, `db`) |
| **Imagens** | `vikunja/vikunja`, `postgres:17` |
| **Porta da interface** | 3456, no serviço `vikunja` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Vikunja** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 32 caracteres* |
| `jwt_secret` | *JWT gerado* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `VIKUNJA_SERVICE_PUBLICURL` | https://${main_domain} |
| `VIKUNJA_DATABASE_HOST` | db |
| `VIKUNJA_DATABASE_PASSWORD` | ${db_password} |
| `VIKUNJA_DATABASE_TYPE` | postgres |
| `VIKUNJA_DATABASE_USER` | vikunja |
| `VIKUNJA_DATABASE_DATABASE` | vikunja |
| `VIKUNJA_SERVICE_JWTSECRET` | *JWT gerado* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `vikunja` | 3456 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  vikunja:
    image: vikunja/vikunja
    user: "0:0"
    environment:
      VIKUNJA_SERVICE_PUBLICURL: ${VIKUNJA_SERVICE_PUBLICURL}
      VIKUNJA_PUBLIC_PORT: ${VIKUNJA_PUBLIC_PORT}
      VIKUNJA_DATABASE_HOST: ${VIKUNJA_DATABASE_HOST}
      VIKUNJA_DATABASE_PASSWORD: ${VIKUNJA_DATABASE_PASSWORD}
      VIKUNJA_DATABASE_TYPE: ${VIKUNJA_DATABASE_TYPE}
      VIKUNJA_DATABASE_USER: ${VIKUNJA_DATABASE_USER}
      VIKUNJA_DATABASE_DATABASE: ${VIKUNJA_DATABASE_DATABASE}
      VIKUNJA_SERVICE_JWTSECRET: ${VIKUNJA_SERVICE_JWTSECRET}
    ports:
      - 3456
    volumes:
      - vikunja-files:/app/vikunja/files
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: ${VIKUNJA_DATABASE_PASSWORD}
      POSTGRES_USER: ${VIKUNJA_DATABASE_USER}
      POSTGRES_DB: ${VIKUNJA_DATABASE_DATABASE}
    volumes:
      - vikunja-db:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready", "-U", "${VIKUNJA_DATABASE_USER}",  "-d", "${VIKUNJA_DATABASE_DATABASE}"]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  vikunja-files: {}
  vikunja-db: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
