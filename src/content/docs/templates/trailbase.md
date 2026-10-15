---
title: Hospedar TrailBase com Rustploy
description: "Servidor de aplicações veloz em Rust e SQLite equipado com runtime nativo de WebAssembly. Crie TrailBase em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**TrailBase**: Servidor de aplicações veloz em Rust e SQLite equipado com runtime nativo de WebAssembly. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `trailbase` |
| **Containers** | 1 (`trailbase`) |
| **Imagens** | `trailbase/trailbase:latest` |
| **Porta da interface** | 4000, no serviço `trailbase` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **TrailBase** e selecione.
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
| `trailbase` | 4000 | ${main_domain} |

## docker-compose.yml do template

```yaml
# IMPORTANT: The initial admin credentials will be printed in the logs after the container starts
# Access TrailBase Admin UI at: https://your-domain.com/_/admin (replace with your configured domain)

version: "3.8"

services:
  trailbase:
    image: trailbase/trailbase:latest
    restart: unless-stopped
    volumes:
      - trailbase-data:/app/traildepot
      # If you want to use a local directory instead, uncomment the line below and specify the path to your local
      # directory. Make sure this directory is writable by the trailbase user (UID 1000) and the group (GID 1000) i.e.
      # chown -R 1000:1000 /path/to/your/local/directory
      # - /path/to/your/local/directory:/app/traildepot
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:4000/api/healthcheck"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  # comment the line below if you specified a local directory in the volumes section of the trailbase service
  trailbase-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
