---
title: Hospedar Rote com Rustploy
description: "Sistema de anotações pessoais estruturado em chamadas de API nativas. Crie Rote em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Rote**: Sistema de anotações pessoais estruturado em chamadas de API nativas. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `rote` |
| **Containers** | 3 (`rote-backend`, `rote-frontend`, `rote-postgres`) |
| **Imagens** | `rabithua/rote-backend:${IMAGE_TAG:-latest}`, `rabithua/rote-frontend:${IMAGE_TAG:-latest}`, `postgres:17` |
| **Porta da interface** | 80, no serviço `rote-frontend` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Rote** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `frontend_domain` | *domínio (gerado; troque pelo seu)* |
| `backend_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória de 32 caracteres* |
| `image_tag` | latest |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `IMAGE_TAG` | ${image_tag} |
| `VITE_API_BASE` | http://${backend_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `rote-frontend` | 80 | ${frontend_domain} |
| `rote-backend` | 3000 | ${backend_domain} |

## docker-compose.yml do template

```yaml
services:
  rote-backend:
    image: rabithua/rote-backend:${IMAGE_TAG:-latest}
    pull_policy: always
    environment:
      POSTGRESQL_URL: postgresql://rote:${POSTGRES_PASSWORD}@rote-postgres:5432/rote
    depends_on:
      rote-postgres:
        condition: service_healthy
    restart: unless-stopped
    command:
      [
        "sh",
        "-c",
        "sleep 15 && bun run dist/scripts/runMigrations.js && bun run dist/server.js",
      ]

  rote-frontend:
    image: rabithua/rote-frontend:${IMAGE_TAG:-latest}
    pull_policy: always
    depends_on:
      - rote-backend
    environment:
      # VITE_API_BASE must point to an address that reaches rote-backend (reverse-proxy domain or host IP:port)
      VITE_API_BASE: ${VITE_API_BASE}
    restart: unless-stopped

  rote-postgres:
    image: postgres:17
    restart: unless-stopped
    environment:
      POSTGRES_USER: rote
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: rote
    volumes:
      - rote-postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U rote -d rote"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s

volumes:
  rote-postgres-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
