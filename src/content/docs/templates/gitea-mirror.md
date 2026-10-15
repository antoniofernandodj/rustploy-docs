---
title: Hospedar Gitea Mirror com Rustploy
description: "Sincronizador automático de repositórios do GitHub para instâncias Gitea. Crie Gitea Mirror em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Gitea Mirror**: Sincronizador automático de repositórios do GitHub para instâncias Gitea. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `gitea-mirror` |
| **Containers** | 1 (`gitea-mirror`) |
| **Imagens** | `ghcr.io/raylabshq/gitea-mirror:latest` |
| **Porta da interface** | 4321, no serviço `gitea-mirror` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Gitea Mirror** e selecione.
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
| `BETTER_AUTH_SECRET` | *chave base64 aleatória (64 bytes)* |
| `BETTER_AUTH_URL` | https://${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `gitea-mirror` | 4321 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  gitea-mirror:
    image: ghcr.io/raylabshq/gitea-mirror:latest
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=3", "--spider", "http://localhost:4321/api/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 15s
    environment:
      # Absolutely required - cannot be changed via UI
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - BETTER_AUTH_URL=${BETTER_AUTH_URL}
      # Core settings with defaults
      - NODE_ENV=production
      - DATABASE_URL=file:data/gitea-mirror.db
      - HOST=0.0.0.0
      - PORT=4321
    volumes:
      - gitea_mirror_data:/app/data

volumes:
  gitea_mirror_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
