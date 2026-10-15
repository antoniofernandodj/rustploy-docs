---
title: Hospedar WG-Easy com Rustploy
description: "Interface gráfica simples e amigável para instalar e gerenciar servidores VPN baseados em WireGuard. Crie WG-Easy em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**WG-Easy**: Interface gráfica simples e amigável para instalar e gerenciar servidores VPN baseados em WireGuard. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `wg-easy` |
| **Containers** | 1 (`wg-easy`) |
| **Imagens** | `ghcr.io/wg-easy/wg-easy:15` |
| **Porta da interface** | 51821, no serviço `wg-easy` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **WG-Easy** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `wg_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `WIREGUARD_HOST` | ${main_domain} |
| `WIREGUARD_PASSWORD` | ${wg_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `wg-easy` | 51821 | ${main_domain} |

## docker-compose.yml do template

```yaml
volumes:
  etc_wireguard:

services:
  wg-easy:
    environment:
      - INIT_ENABLED=1
      - INIT_HOST=${WIREGUARD_HOST}
      - INIT_PORT=51820
      - INIT_USERNAME=admin
      - INIT_PASSWORD=${WIREGUARD_PASSWORD}
      - INIT_DNS=1.1.1.1,8.8.8.8
      - PORT=51821
    image: ghcr.io/wg-easy/wg-easy:15
    container_name: wg-easy
    volumes:
      - etc_wireguard:/etc/wireguard
      - /lib/modules:/lib/modules:ro
    ports:
      - "51820:51820/udp"
      - "51821:51821/tcp"
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
      - NET_RAW
    sysctls:
      - net.ipv4.ip_forward=1
      - net.ipv4.conf.all.src_valid_mark=1
      - net.ipv6.conf.all.disable_ipv6=0
      - net.ipv6.conf.all.forwarding=1
      - net.ipv6.conf.default.forwarding=1
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
