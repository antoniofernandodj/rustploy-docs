---
title: Hospedar Barrage com Rustploy
description: "Interface web minimalista e mobile-first para o cliente de torrent Deluge. Crie Barrage em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Barrage**: Interface web minimalista e mobile-first para o cliente de torrent Deluge. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `barrage` |
| **Containers** | 1 (`barrage`) |
| **Imagens** | `maulik9898/barrage:0.3.0` |
| **Porta da interface** | 3000, no serviço `barrage` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Barrage** e selecione.
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
| `NEXTAUTH_SECRET` | ${base64} |
| `NEXTAUTH_URL` | http://${main_domain} |
| `DELUGE_URL` | http://your-deluge-ip:8112 |
| `DELUGE_PASSWORD` | *senha aleatória de 16 caracteres* |
| `BARRAGE_PASSWORD` | *senha aleatória de 16 caracteres* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `barrage` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  barrage:
    image: maulik9898/barrage:0.3.0
    restart: unless-stopped
    ports:
      - 3000
    environment:
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=http://${DOMAIN}
      - DELUGE_URL=${DELUGE_URL}
      - DELUGE_PASSWORD=${DELUGE_PASSWORD}
      - BARRAGE_PASSWORD=${BARRAGE_PASSWORD}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
