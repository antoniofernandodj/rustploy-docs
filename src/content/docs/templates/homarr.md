---
title: Hospedar Homarr com Rustploy
description: "Dashboard moderno de aplicativos residenciais integrado ao Docker. Crie Homarr em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Homarr**: Dashboard moderno de aplicativos residenciais integrado ao Docker. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `homarr` |
| **Containers** | 1 (`homarr`) |
| **Imagens** | `ghcr.io/homarr-labs/homarr:latest` |
| **Porta da interface** | 7575, no serviço `homarr` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Homarr** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_key` | *senha aleatória de 64 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SECRET_ENCRYPTION_KEY` | ${secret_key} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `homarr` | 7575 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  homarr:
    image: ghcr.io/homarr-labs/homarr:latest
    restart: unless-stopped
    volumes:
      # - /var/run/docker.sock:/var/run/docker.sock # Optional, only if you want docker integration
      - ../homarr/appdata:/appdata
    environment:
      - SECRET_ENCRYPTION_KEY=${SECRET_ENCRYPTION_KEY}
    ports:
      - 7575
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
