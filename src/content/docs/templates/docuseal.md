---
title: Hospedar Docuseal com Rustploy
description: "Sistema de gestão de documentos com foco em assinatura eletrônica. Crie Docuseal em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Docuseal**: Sistema de gestão de documentos com foco em assinatura eletrônica. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `docuseal` |
| **Containers** | 3 (`app`, `docu-postgres`, `docu-redis`) |
| **Imagens** | `docuseal/docuseal:latest`, `postgres:latest`, `redis:alpine` |
| **Porta da interface** | 3000, no serviço `app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Docuseal** e selecione.
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
| `POSTGRES_USER` | postgres |
| `POSTGRES_PASSWORD` | postgres |
| `POSTGRES_DB` | docuseal |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `app` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  app:
    image: docuseal/docuseal:latest
    volumes:
      - docuseal:/data/docuseal
    depends_on:
      docu-postgres:
        condition: service_healthy
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER:-docuseal}:${POSTGRES_PASSWORD}@docu-postgres:5432/${POSTGRES_DB:-docuseal}
      
  docu-postgres:
    image: postgres:latest
    volumes:
      - docuseal-db:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-docuseal} -d ${POSTGRES_DB:-docuseal}"]
      interval: 10s
      timeout: 5s
      retries: 5
      
  docu-redis:
    image: redis:alpine
    restart: always
    volumes:
      - docuseal-redis-data:/data
      
    
volumes:
  docuseal:
  docuseal-db:
  docuseal-redis-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
