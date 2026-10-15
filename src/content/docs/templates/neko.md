---
title: Hospedar Neko com Rustploy
description: "Navegador virtual compartilhado operando diretamente dentro de um container Docker (via WebRTC/VNC). Crie Neko em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Neko**: Navegador virtual compartilhado operando diretamente dentro de um container Docker (via WebRTC/VNC). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `neko` |
| **Containers** | 1 (`neko`) |
| **Imagens** | `ghcr.io/m1k1o/neko/firefox:latest` |
| **Porta da interface** | 8080, no serviço `neko` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Neko** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `admin_password` | *senha aleatória de 16 caracteres* |
| `user_password` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `NEKO_MEMBER_PROVIDER` | multiuser |
| `NEKO_DESKTOP_SCREEN` | 1920x1080@30 |
| `NEKO_MEMBER_MULTIUSER_USER_PASSWORD` | ${user_password} |
| `NEKO_MEMBER_MULTIUSER_ADMIN_PASSWORD` | ${admin_password} |
| `NEKO_WEBRTC_EPR` | 52000-52100 |
| `NEKO_WEBRTC_ICELITE` | 1 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `neko` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  neko:
    image: "ghcr.io/m1k1o/neko/firefox:latest"
    restart: "unless-stopped"
    shm_size: "2gb"
    ports:
      - "8080"
      - "52000-52100:52000-52100/udp"
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
