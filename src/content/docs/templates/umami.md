---
title: Hospedar Umami com Rustploy
description: "O clássico e popular analytics web focado em privacidade e em ser uma alternativa limpa ao Google Analytics. Crie Umami em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Umami**: O clássico e popular analytics web focado em privacidade e em ser uma alternativa limpa ao Google Analytics. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `umami` |
| **Containers** | 2 (`umami`, `db`) |
| **Imagens** | `ghcr.io/umami-software/umami:3.0.3`, `postgres:15-alpine` |
| **Porta da interface** | 3000, no serviço `umami` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Umami** e selecione.
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
| `APP_SECRET` | *chave base64 aleatória (64 bytes)* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `umami` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  umami:
    image: ghcr.io/umami-software/umami:3.0.3
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "curl http://localhost:3000/api/heartbeat"]
      interval: 5s
      timeout: 5s
      retries: 5
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://umami:umami@db:5432/umami
      DATABASE_TYPE: postgresql
      APP_SECRET: ${APP_SECRET}
  db:
    image: postgres:15-alpine
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5

    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: umami

volumes:
  db-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
