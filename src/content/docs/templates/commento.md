---
title: Hospedar Commento++ com Rustploy
description: "Caixa de comentários leve para sites estáticos com moderação de spam. Crie Commento++ em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Commento++**: Caixa de comentários leve para sites estáticos com moderação de spam. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `commento` |
| **Containers** | 2 (`commento`, `postgres`) |
| **Imagens** | `registry.gitlab.com/commento/commento:v1.8.0`, `postgres:11` |
| **Porta da interface** | 8080, no serviço `commento` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Commento++** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `DOMAIN` | *domínio (gerado; troque pelo seu)* |
| `POSTGRES_PASSWORD` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `COMMENTO_ORIGIN` | http://${DOMAIN} |
| `COMMENTO_POSTGRES` | postgres://postgres:${POSTGRES_PASSWORD}@postgres:5432/postgres?sslmode=disable |
| `POSTGRES_PASSWORD` | ${POSTGRES_PASSWORD} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `commento` | 8080 | ${DOMAIN} |

## docker-compose.yml do template

```yaml
version: "3"

services:
  commento:
    image: registry.gitlab.com/commento/commento:v1.8.0
    ports:
      - "8080"
    environment:
      - COMMENTO_ORIGIN=${COMMENTO_ORIGIN}
      - COMMENTO_POSTGRES=${COMMENTO_POSTGRES}
    depends_on:
      - postgres

  postgres:
    image: postgres:11
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
