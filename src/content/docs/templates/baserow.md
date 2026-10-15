---
title: Hospedar Baserow com Rustploy
description: "Banco de dados relacional com interface de planilha (Alternativa ao Airtable). Crie Baserow em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Baserow**: Banco de dados relacional com interface de planilha (Alternativa ao Airtable). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `baserow` |
| **Containers** | 1 (`baserow`) |
| **Imagens** | `baserow/baserow:1.25.2` |
| **Porta da interface** | 80, no serviço `baserow` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Baserow** e selecione.
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
| `BASEROW_HOST` | ${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `baserow` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  baserow:
    image: baserow/baserow:1.25.2
    environment:
      BASEROW_PUBLIC_URL: "http://${BASEROW_HOST}"
    volumes:
      - baserow_data:/baserow/data
volumes:
  baserow_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
