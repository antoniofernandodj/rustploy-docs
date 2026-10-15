---
title: Hospedar Blinko com Rustploy
description: "Aplicativo moderno de anotações rápidas e organização de fluxos. Crie Blinko em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Blinko**: Aplicativo moderno de anotações rápidas e organização de fluxos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `blinko` |
| **Containers** | 2 (`blinko-website`, `blinko-postgres`) |
| **Imagens** | `blinkospace/blinko:1.6.3`, `postgres:14` |
| **Porta da interface** | 1111, no serviço `blinko-website` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Blinko** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória de 32 caracteres* |
| `nextauth_secret` | *senha aleatória de 32 caracteres* |
| `database_url` | postgresql://postgres:${postgres_password}@blinko-postgres:5432/postgres |
| `nextauth_url` | http://${main_domain} |
| `next_public_base_url` | http://${main_domain} |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `NEXTAUTH_SECRET` | ${nextauth_secret} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `DATABASE_URL` | ${database_url} |
| `NEXTAUTH_URL` | ${nextauth_url} |
| `NEXT_PUBLIC_BASE_URL` | ${next_public_base_url} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `blinko-website` | 1111 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  blinko-website:
    image: blinkospace/blinko:1.6.3
    environment:
      NODE_ENV: production
      # API Key for NextAuth
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      DATABASE_URL: ${DATABASE_URL}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
      NEXT_PUBLIC_BASE_URL: ${NEXT_PUBLIC_BASE_URL}
    depends_on:
      blinko-postgres:
        condition: service_healthy
    restart: always
    logging:
      options:
        max-size: "10m"
        max-file: "3"
    ports:
      - 1111

  blinko-postgres:
    image: postgres:14
    restart: always
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      TZ: Asia/Shanghai
    volumes:
      - blinko-db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres", "-d", "postgres"]
      interval: 5s
      timeout: 10s
      retries: 5

volumes:
  blinko-db: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
