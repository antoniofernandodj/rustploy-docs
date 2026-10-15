---
title: Hospedar Gitea (SQLite) com Rustploy
description: "Versão simplificada do Gitea rodando em um único container com SQLite. Crie Gitea (SQLite) em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Gitea (SQLite)**: Versão simplificada do Gitea rodando em um único container com SQLite. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `gitea-sqlite` |
| **Containers** | 1 (`gitea`) |
| **Imagens** | `docker.gitea.com/gitea:1.24.4` |
| **Porta da interface** | 3000, no serviço `gitea` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Gitea (SQLite)** e selecione.
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
| `USER_UID` | 1000 |
| `USER_GID` | 1000 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `gitea` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  gitea:
    image: docker.gitea.com/gitea:1.24.4
    restart: unless-stopped
    environment:
      - USER_UID=1000
      - USER_GID=1000
      # SQLite (default) lives at /data/gitea
      # Example optional overrides (set in template.toml env or UI):
      # - GITEA__mailer__ENABLED=true
    volumes:
      - gitea-data:/data
    expose:
      - "3000" # Web UI
      - "22" # SSH (internal only)
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/"]
      interval: 15s
      timeout: 5s
      retries: 10

volumes:
  gitea-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
