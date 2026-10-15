---
title: Hospedar Anubis com Rustploy
description: "Protetor e bloqueador de bots maliciosos para sites. Crie Anubis em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Anubis**: Protetor e bloqueador de bots maliciosos para sites. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `anubis` |
| **Containers** | 1 (`anubis`) |
| **Imagens** | `ghcr.io/techarohq/anubis:latest` |
| **Porta da interface** | 8923, no serviço `anubis` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Anubis** e selecione.
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
| `COOKIE_DOMAIN` | ${main_domain} |
| `TARGET` | YOURLOCALHOST:PORT |
| `DIFFICULTY` | 5 |
| `OG_PASSTHROUGH` | true |
| `OG_EXPIRY_TIME` | 1h |
| `OG_CACHE_CONSIDER_HOST` | true |
| `SERVE_ROBOTS_TXT` | false |
| `mounts` |  |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `anubis` | 8923 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  anubis:
    image: ghcr.io/techarohq/anubis:latest
    restart: unless-stopped
    ports:
      - "8923" # Anubis default port
    environment:
      # Required: Point to your frontend service locally
      # Example: http://mydocker-wyeud:8080
      - TARGET=${TARGET}

      # Bind address
      - BIND=:8923

      # Cookie domain (set to your domain)
      - COOKIE_DOMAIN=${COOKIE_DOMAIN}

      # Challenge difficulty (1-20, default is 5)
      # Lower = easier for users, Higher = harder for bots
      - DIFFICULTY=${DIFFICULTY}

      # OpenGraph passthrough (allows social media previews to work)
      - OG_PASSTHROUGH=${OG_PASSTHROUGH}
      - OG_EXPIRY_TIME=${OG_EXPIRY_TIME}
      - OG_CACHE_CONSIDER_HOST=${OG_CACHE_CONSIDER_HOST}

      # Optional: Serve robots.txt to discourage indexing
      - SERVE_ROBOTS_TXT=${SERVE_ROBOTS_TXT} # Set to true if you don't want search engines


# Unconmment in case you want to connect the anubis container to dokploy-network
#     networks:
#       - dokploy-network

# networks:
#   dokploy-network:
#     external: true # Using existing dokploy-network to connect to your frontend locally
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
