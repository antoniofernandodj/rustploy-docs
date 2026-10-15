---
title: Hospedar Chibisafe com Rustploy
description: "Cofre de arquivos pessoal de alta performance baseado em nuvem. Crie Chibisafe em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Chibisafe**: Cofre de arquivos pessoal de alta performance baseado em nuvem. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `chibisafe` |
| **Containers** | 3 (`chibisafe`, `chibisafe_server`, `caddy`) |
| **Imagens** | `chibisafe/chibisafe:latest`, `chibisafe/chibisafe-server:latest`, `caddy:2-alpine` |
| **Porta da interface** | 80, no serviço `caddy` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Chibisafe** e selecione.
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
| `caddy` | 80 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `./Caddyfile`

## docker-compose.yml do template

```yaml
# https://chibisafe.app/docs/intro
#
# Default Credentials
#   USERNAME: admin
#   PASSWORD: admin
services:
  chibisafe:
    image: chibisafe/chibisafe:latest
    networks:
      - chibinet
    environment:
      - BASE_API_URL=http://chibisafe_server:8000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "--quiet", "http://127.0.0.1:8001"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  chibisafe_server:
    image: chibisafe/chibisafe-server:latest
    networks:
      - chibinet
    volumes:
      - database:/app/database:rw
      - uploads:/app/uploads:rw
      - logs:/app/logs:rw
    restart: unless-stopped
    healthcheck:
      test:
        [
          "CMD",
          "wget",
          "--spider",
          "--quiet",
          "http://127.0.0.1:8000/api/health",
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  caddy:
    image: caddy:2-alpine
    networks:
      - chibinet
    volumes:
      - ../files/Caddyfile:/etc/caddy/Caddyfile:ro
      - uploads:/app/uploads:ro
    environment:
      - BASE_URL=":80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "--quiet", "http://127.0.0.1:80"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

volumes:
  database:
  uploads:
  logs:

networks:
  chibinet:
    driver: bridge
    internal: true
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
