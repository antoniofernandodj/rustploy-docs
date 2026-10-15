---
title: Hospedar Tailscale Exitnode com Rustploy
description: "Aplicação Tailscale Exitnode. Crie Tailscale Exitnode em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Tailscale Exitnode**: Aplicação Tailscale Exitnode. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `tailscale-exitnode` |
| **Containers** | 1 (`tailscale-exitnode`) |
| **Imagens** | `tailscale/tailscale:latest` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Tailscale Exitnode** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `TAILSCALE_HOSTNAME` |  |
| `TAILSCALE_AUTHKEY` |  |

## docker-compose.yml do template

```yaml
services:
  tailscale-exitnode:
    image: tailscale/tailscale:latest
    hostname: ${TAILSCALE_HOSTNAME}
    environment:
      - TS_AUTHKEY=${TAILSCALE_AUTHKEY}
      - TS_EXTRA_ARGS=--advertise-exit-node
      - TS_STATE_DIR=/var/lib/tailscale
      - TS_USERSPACE=true
    volumes:
      - tailscale_exitnode_data:/var/lib/tailscale
    restart: always

volumes:
  tailscale_exitnode_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
