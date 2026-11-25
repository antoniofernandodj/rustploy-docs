---
title: Hospedar Cloudflare Ddns com Rustploy
description: "Aplicação Cloudflare Ddns. Crie Cloudflare Ddns em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Cloudflare Ddns**: Aplicação Cloudflare Ddns. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `cloudflare-ddns` |
| **Containers** | 1 (`cloudflare-ddns`) |
| **Imagens** | `favonia/cloudflare-ddns:1` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Cloudflare Ddns** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domínios**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `CLOUDFLARE_API_TOKEN` | <INSERT YOUR TOKEN> |
| `DOMAINS` | example.org,www.example.org,example.io |

## docker-compose.yml do template

```yaml
# For more details, see:
# - https://github.com/favonia/cloudflare-ddns
services:
  cloudflare-ddns:
    image: favonia/cloudflare-ddns:1
    network_mode: host
    restart: unless-stopped
    user: "1000:1000"
    read_only: true
    cap_drop: [all]
    security_opt: [no-new-privileges:true]
    environment:
      - CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN:?}
      - DOMAINS=${DOMAINS:?}
      - PROXIED=false
      - IP6_PROVIDER=none
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
