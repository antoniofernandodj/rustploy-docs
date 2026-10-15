---
title: Hospedar DumbBudget com Rustploy
description: "Controle financeiro minimalista protegido por PIN (sem banco de dados). Crie DumbBudget em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**DumbBudget**: Controle financeiro minimalista protegido por PIN (sem banco de dados). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `dumbbudget` |
| **Containers** | 1 (`dumbbudget`) |
| **Imagens** | `dumbwareio/dumbbudget:latest` |
| **Porta da interface** | 3000, no serviço `dumbbudget` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **DumbBudget** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `dumbbudget_pin` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DUMBBUDGET_PIN` | ${dumbbudget_pin} |
| `BASE_URL` | ${main_domain} |
| `CURRENCY` | USD |
| `SITE_TITLE` | DumbBudget |
| `INSTANCE_NAME` |  |
| `ALLOWED_ORIGINS` | ${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `dumbbudget` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  dumbbudget:
    image: dumbwareio/dumbbudget:latest
    restart: unless-stopped
    ports:
      - 3000
    volumes:
      - dumbbudget-data:/app/data

volumes:
  dumbbudget-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
