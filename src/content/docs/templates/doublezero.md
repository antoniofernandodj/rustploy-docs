---
title: Hospedar Doublezero com Rustploy
description: "Aplicação Doublezero. Crie Doublezero em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Doublezero**: Aplicação Doublezero. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `doublezero` |
| **Containers** | 1 (`doublezero`) |
| **Imagens** | `liltechnomancer/double-zero:0.2.1` |
| **Porta da interface** | 4000, no serviço `doublezero` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Doublezero** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_key_base` | *chave base64 aleatória (64 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DOUBLEZERO_HOST` | ${main_domain} |
| `DOUBLEZERO_PORT` | 4000 |
| `SECRET_KEY_BASE` | ${secret_key_base} |
| `AWS_ACCESS_KEY_ID` | your-aws-access-key |
| `AWS_SECRET_ACCESS_KEY` | your-aws-secret-key |
| `AWS_REGION` | your-aws-region |
| `SQS_URL` | your-aws-sqs-url |
| `SYSTEM_EMAIL` |  |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `doublezero` | 4000 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  doublezero:
    restart: always
    image: liltechnomancer/double-zero:0.2.1
    volumes:
      - db-data:/var/lib/doublezero/data
    environment:
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_REGION: ${AWS_REGION}
      SQS_URL: ${SQS_URL}
      SYSTEM_EMAIL: ${SYSTEM_EMAIL}
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
      PHX_HOST: ${DOUBLEZERO_HOST}
      DATABASE_PATH: ./00.db

volumes:
  db-data:
    driver: local
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
