---
title: Hospedar Qbitwebui com Rustploy
description: "Aplicação Qbitwebui. Crie Qbitwebui em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Qbitwebui**: Aplicação Qbitwebui. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `qbitwebui` |
| **Containers** | 1 (`qbitwebui`) |
| **Imagens** | `ghcr.io/maciejonos/qbitwebui:latest` |
| **Porta da interface** | 3000, no serviço `qbitwebui` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Qbitwebui** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `encryption_key` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `ENCRYPTION_KEY` | ${encryption_key} |
| `PORT` | 3000 |
| `DATABASE_PATH` | /data/qbitwebui.db |
| `SALT_PATH` | /data/.salt |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `qbitwebui` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  qbitwebui:
    image: ghcr.io/maciejonos/qbitwebui:latest
    restart: unless-stopped
    environment:
      # Required: Encryption key for storing credentials (min 32 chars)
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      # Optional: Server port (default: 3000)
      - PORT=${PORT:-3000}
      # Optional: Database location (default: ./data/qbitwebui.db)
      - DATABASE_PATH=${DATABASE_PATH:-/data/qbitwebui.db}
      # Optional: Salt file location (default: ./data/.salt)
      - SALT_PATH=${SALT_PATH:-/data/.salt}
      # Optional: Allow self-signed certificates for qBittorrent instances (default: false)
      # - ALLOW_SELF_SIGNED_CERTS=${ALLOW_SELF_SIGNED_CERTS:-false}
      # Optional: Disable authentication/login (single-user mode) (default: false)
      # - DISABLE_AUTH=${DISABLE_AUTH:-false}
      # Optional: Disable new registrations, creates default admin account (default: false)
      # - DISABLE_REGISTRATION=${DISABLE_REGISTRATION:-false}
      # Optional: Enable file browser by setting downloads path
      # - DOWNLOADS_PATH=/downloads
    volumes:
      - qbitwebui_data:/data
      # Optional: Mount downloads directory for file browser feature
      # Read-only mount (browse & download only):
      # - /path/to/your/downloads:/downloads:ro
      # Or read-write mount (enables delete/move/copy/rename):
      # - /path/to/your/downloads:/downloads
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s

volumes:
  qbitwebui_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
