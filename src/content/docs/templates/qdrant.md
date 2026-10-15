---
title: Hospedar Qdrant com Rustploy
description: "Banco de dados vetorial focado em busca de similaridade e armazenamento de embeddings em alta performance. Crie Qdrant em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Qdrant**: Banco de dados vetorial focado em busca de similaridade e armazenamento de embeddings em alta performance. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `qdrant` |
| **Containers** | 1 (`qdrant`) |
| **Imagens** | `qdrant/qdrant:latest` |
| **Porta da interface** | 6333, no serviço `qdrant` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Qdrant** e selecione.
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
| `QDRANT_API_KEY` | *senha aleatória de 32 caracteres* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `qdrant` | 6333 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  qdrant:
    image: "qdrant/qdrant:latest"
    environment:
      - SERVICE_FQDN_QDRANT_6333
      - QDRANT__SERVICE__API_KEY=${QDRANT_API_KEY}
    expose:
      - "6333"
    volumes:
      - "qdrant_data:/qdrant/storage"
    healthcheck:
      test:
        - CMD-SHELL
        - bash -c ':> /dev/tcp/127.0.0.1/6333' || exit 1
      interval: 5s
      timeout: 5s
      retries: 3

volumes:
  qdrant_data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
