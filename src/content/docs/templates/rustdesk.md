---
title: Hospedar RustDesk com Rustploy
description: "Servidor de acesso remoto e controle de telas (Alternativa aberta ao TeamViewer/Anydesk). Crie RustDesk em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**RustDesk**: Servidor de acesso remoto e controle de telas (Alternativa aberta ao TeamViewer/Anydesk). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `rustdesk` |
| **Containers** | 2 (`hbbs`, `hbbr`) |
| **Imagens** | `rustdesk/rustdesk-server:latest` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **RustDesk** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `server_domain` | *domínio (gerado; troque pelo seu)* |
| `encryption_key` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `RELAY_HOST` | ${server_domain} |
| `RUSTDESK_RELAY_SERVER` | ${server_domain}:21117 |
| `RUSTDESK_API_SERVER` | http://${server_domain}:21118 |
| `RUSTDESK_ID_SERVER` | ${server_domain}:21116 |
| `ENCRYPTION_KEY` | ${encryption_key} |

## docker-compose.yml do template

```yaml
services:
  hbbs:
    image: rustdesk/rustdesk-server:latest
    command: hbbs
    restart: unless-stopped
    volumes:
      - rustdesk-data:/root
    ports:
      - "21115:21115"
      - "21116:21116"
      - "21116:21116/udp"
    depends_on:
      - hbbr

  hbbr:
    image: rustdesk/rustdesk-server:latest
    command: hbbr
    restart: unless-stopped
    volumes:
      - rustdesk-data:/root
    ports:
      - "21117:21117"
      - "21118:21118"
      - "21119:21119"

volumes:
  rustdesk-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
