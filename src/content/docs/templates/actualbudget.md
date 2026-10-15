---
title: Hospedar Actual Budget com Rustploy
description: "Gerenciador de finanças pessoais rápido e privado. Crie Actual Budget em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Actual Budget**: Gerenciador de finanças pessoais rápido e privado. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `actualbudget` |
| **Containers** | 1 (`actualbudget`) |
| **Imagens** | `docker.io/actualbudget/actual-server:latest` |
| **Porta da interface** | 5006, no serviço `actualbudget` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Actual Budget** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `actualbudget` | 5006 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  actualbudget:
    image: docker.io/actualbudget/actual-server:latest
    environment:
      # See all options at https://actualbudget.org/docs/config
      - ACTUAL_PORT=5006
    volumes:
      - actual-data:/data
    restart: unless-stopped

volumes:
  actual-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
