---
title: Hospedar Kaneo com Rustploy
description: "Plataforma limpa e simplificada de gerenciamento de projetos. Crie Kaneo em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Kaneo**: Plataforma limpa e simplificada de gerenciamento de projetos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `kaneo` |
| **Containers** | 3 (`postgres`, `backend`, `frontend`) |
| **Imagens** | `postgres:16-alpine`, `ghcr.io/usekaneo/api:latest`, `ghcr.io/usekaneo/web:latest` |
| **Porta da interface** | 5173, no serviço `frontend` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Kaneo** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `backend_domain` | *domínio (gerado; troque pelo seu)* |
| `frontend_domain` | *domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `BACKEND_HOST` | ${backend_domain} |
| `KANEO_DB` | kaneo |
| `KANEO_DB_USER` | *usuário gerado* |
| `KANEO_DB_PASSWORD` | *senha aleatória* |
| `KANEO_JWT_ACCESS` | *hash aleatório* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `frontend` | 5173 | ${frontend_domain} |
| `backend` | 1337 | ${backend_domain} |

## docker-compose.yml do template

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${KANEO_DB}
      POSTGRES_USER: ${KANEO_DB_USER}
      POSTGRES_PASSWORD: ${KANEO_DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  backend:
    image: ghcr.io/usekaneo/api:latest
    environment:
      JWT_ACCESS: ${KANEO_JWT_ACCESS}
      DATABASE_URL: "postgresql://${KANEO_DB_USER}:${KANEO_DB_PASSWORD}@postgres:5432/${KANEO_DB}"
    ports:
      - 1337
    depends_on:
      postgres:
        condition: service_started
    restart: unless-stopped

  frontend:
    image: ghcr.io/usekaneo/web:latest
    environment:
      KANEO_API_URL: "http://${BACKEND_HOST}"
    ports:
      - 5173
    depends_on:
      backend:
        condition: service_started
    restart: unless-stopped

volumes:
  postgres_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
