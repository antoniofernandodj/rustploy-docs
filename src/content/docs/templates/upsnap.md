---
title: Hospedar Upsnap com Rustploy
description: "Dashboard simples integrado ao PocketBase feito para enviar pacotes Wake-on-LAN e monitorar dispositivos de rede. Crie Upsnap em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Upsnap**: Dashboard simples integrado ao PocketBase feito para enviar pacotes Wake-on-LAN e monitorar dispositivos de rede. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `upsnap` |
| **Containers** | 1 (`upsnap`) |
| **Imagens** | `ghcr.io/seriousm4x/upsnap:5` |
| **Porta da interface** | 8090, no serviço `upsnap` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Upsnap** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `upsnap_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `TZ` | Europe/Berlin |
| `UPSNAP_INTERVAL` | */10 * * * * * |
| `UPSNAP_SCAN_RANGE` | 192.168.1.0/24 |
| `UPSNAP_SCAN_TIMEOUT` | 500ms |
| `UPSNAP_PING_PRIVILEGED` | true |
| `UPSNAP_WEBSITE_TITLE` | Upsnap Network Monitor |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `upsnap` | 8090 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  upsnap:
    image: ghcr.io/seriousm4x/upsnap:5
    restart: unless-stopped
    expose:
      - 8090
    volumes:
      - upsnap-data:/app/pb_data
    environment:
      - TZ=${TZ}
      - UPSNAP_INTERVAL=${UPSNAP_INTERVAL}
      - UPSNAP_SCAN_RANGE=${UPSNAP_SCAN_RANGE}
      - UPSNAP_SCAN_TIMEOUT=${UPSNAP_SCAN_TIMEOUT}
      - UPSNAP_PING_PRIVILEGED=${UPSNAP_PING_PRIVILEGED}
      - UPSNAP_WEBSITE_TITLE=${UPSNAP_WEBSITE_TITLE}
    healthcheck:
      test: ["CMD", "curl", "-fs", "http://localhost:8090/api/health"]
      interval: 10s
      timeout: 3s
      retries: 3

volumes:
  upsnap-data:
    driver: local
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
