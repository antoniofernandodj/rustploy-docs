---
title: Hospedar Appsmith com Rustploy
description: "Construtor low-code de ferramentas internas e painéis administrativos. Crie Appsmith em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Appsmith**: Construtor low-code de ferramentas internas e painéis administrativos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `appsmith` |
| **Containers** | 1 (`appsmith`) |
| **Imagens** | `appsmith/appsmith-ee:v1.94` |
| **Porta da interface** | 80, no serviço `appsmith` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Appsmith** e selecione.
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
| `appsmith` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  appsmith:
    image: appsmith/appsmith-ee:v1.94
    volumes:
      - appsmith-data:/appsmith-stacks
    restart: unless-stopped

volumes:
  appsmith-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
