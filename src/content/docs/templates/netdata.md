---
title: Hospedar Netdata com Rustploy
description: "Monitor analítico de infraestrutura em tempo real com métricas detalhadas por segundo. Crie Netdata em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Netdata**: Monitor analítico de infraestrutura em tempo real com métricas detalhadas por segundo. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `netdata` |
| **Containers** | 1 (`netdata`) |
| **Imagens** | `netdata/netdata:latest` |
| **Porta da interface** | 19999, no serviço `netdata` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Netdata** e selecione.
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
| `netdata` | 19999 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  netdata:
    image: netdata/netdata:latest
    restart: unless-stopped
    cap_add:
      - SYS_PTRACE
      - SYS_ADMIN
    security_opt:
      - apparmor:unconfined
    volumes:
      - netdata-config:/etc/netdata
      - netdata-lib:/var/lib/netdata
      - netdata-cache:/var/cache/netdata
      - /etc/passwd:/host/etc/passwd:ro
      - /etc/group:/host/etc/group:ro
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /etc/os-release:/host/etc/os-release:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      - NETDATA_CLAIM_TOKEN=${NETDATA_CLAIM_TOKEN:-}
      - NETDATA_CLAIM_URL=${NETDATA_CLAIM_URL:-}
      - NETDATA_CLAIM_ROOMS=${NETDATA_CLAIM_ROOMS:-}
    ports:
      - "19999"

volumes:
  netdata-config:
  netdata-lib:
  netdata-cache:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
