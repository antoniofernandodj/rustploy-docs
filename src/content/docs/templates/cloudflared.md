---
title: Hospedar Cloudflared com Rustploy
description: "Daemon para conectar serviços locais à internet de forma segura via Cloudflare Tunnel. Crie Cloudflared em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Cloudflared**: Daemon para conectar serviços locais à internet de forma segura via Cloudflare Tunnel. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `cloudflared` |
| **Containers** | 1 (`cloudflared`) |
| **Imagens** | `cloudflare/cloudflared:latest` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Cloudflared** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `CLOUDFLARE_TUNNEL_TOKEN` |  |

## docker-compose.yml do template

```yaml
services:
  cloudflared:
    image: 'cloudflare/cloudflared:latest'
    environment:
      # Don't forget to set this in your Dokploy Environment
      - 'TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN:?}'
    network_mode: host
    restart: unless-stopped
    command: [
      "tunnel",

      # More tunnel run parameters here:
      # https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/cloudflared-parameters/run-parameters/
      "--no-autoupdate",
      #"--protocol", "http2",

      "run"
    ]
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
