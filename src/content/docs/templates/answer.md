---
title: Hospedar Answer com Rustploy
description: "Plataforma de perguntas e respostas (Estilo StackOverflow privado). Crie Answer em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Answer**: Plataforma de perguntas e respostas (Estilo StackOverflow privado). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `answer` |
| **Containers** | 2 (`answer`, `db`) |
| **Imagens** | `apache/answer:1.4.1`, `postgres:16` |
| **Porta da interface** | 9080, no serviço `answer` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Answer** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `service_hash` | *hash aleatório* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `ANSWER_HOST` | http://${main_domain} |
| `SERVICE_HASH` | ${service_hash} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `answer` | 9080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  answer:
    image: apache/answer:1.4.1
    ports:
      - '80'
    restart: on-failure
    volumes:
      - answer-data:/data
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
      POSTGRES_DB: answer
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres

volumes:
  answer-data:
  db-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
