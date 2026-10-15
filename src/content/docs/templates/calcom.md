---
title: Hospedar Calcom com Rustploy
description: "Agendador de reuniões e marcação de horários (Alternativa ao Calendly). Crie Calcom em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Calcom**: Agendador de reuniões e marcação de horários (Alternativa ao Calendly). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `calcom` |
| **Containers** | 2 (`postgres`, `calcom`) |
| **Imagens** | `postgres:16-alpine`, `calcom/cal.com:v2.7.6` |
| **Porta da interface** | 3000, no serviço `calcom` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Calcom** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `calcom_encryption_key` | *chave base64 aleatória (32 bytes)* |
| `nextauth_secret` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `CALCOM_HOST` | ${main_domain} |
| `NEXTAUTH_SECRET` | ${nextauth_secret} |
| `CALENDSO_ENCRYPTION_KEY` | ${calcom_encryption_key} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `calcom` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  postgres:
    image: postgres:16-alpine

    volumes:
      - calcom-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=db
      - DATABASE_URL=postgres://postgres:password@postgres:5432/db

  calcom:
    image: calcom/cal.com:v2.7.6
    depends_on:
      - postgres
    environment:
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - CALENDSO_ENCRYPTION_KEY=${CALENDSO_ENCRYPTION_KEY}
      - DATABASE_URL=postgres://postgres:password@postgres:5432/db
      - NEXT_PUBLIC_WEBAPP_URL=http://${CALCOM_HOST}
      - NEXTAUTH_URL=http://${CALCOM_HOST}/api/auth

volumes:
  calcom-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
