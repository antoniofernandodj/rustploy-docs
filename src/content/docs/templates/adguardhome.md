---
title: Hospedar AdGuard Home com Rustploy
description: "Bloqueador de anúncios e rastreadores em nível de rede DNS. Crie AdGuard Home em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**AdGuard Home**: Bloqueador de anúncios e rastreadores em nível de rede DNS. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `adguardhome` |
| **Containers** | 1 (`adguardhome`) |
| **Imagens** | `adguard/adguardhome:latest` |
| **Porta da interface** | 3000, no serviço `adguardhome` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **AdGuard Home** e selecione.
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
| `adguardhome` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  adguardhome:
    image: adguard/adguardhome:latest
    restart: unless-stopped
    ports:
      - "53:53/tcp" # DNS
      - "53:53/udp" # DNS
      - "67:67/udp" # DHCP Server
      - "68:68/tcp" # DHCP Client
      - "853:853/tcp" # DNS over TLS, DNS-over-QUIC
      - "853:853/udp" # DNS over TLS, DNS-over-QUIC
      - "6060:6060/tcp" # HTTP (pprof)
    volumes:
      - adguardhome-work:/opt/adguardhome/work
      - adguardhome-conf:/opt/adguardhome/conf

volumes:
  adguardhome-work: {}
  adguardhome-conf: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
