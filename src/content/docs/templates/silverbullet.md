---
title: Hospedar SilverBullet com Rustploy
description: "Bloco de notas extensível operando como uma base pessoal de conhecimento dinâmico. Crie SilverBullet em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**SilverBullet**: Bloco de notas extensível operando como uma base pessoal de conhecimento dinâmico. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `silverbullet` |
| **Containers** | 2 (`silverbullet`, `watchtower`) |
| **Imagens** | `ghcr.io/silverbulletmd/silverbullet:v2`, `containrrr/watchtower` |
| **Porta da interface** | 3000, no serviço `silverbullet` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **SilverBullet** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `sb_user` | admin:*senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SB_USER` | ${sb_user} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `silverbullet` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  silverbullet:
    image: ghcr.io/silverbulletmd/silverbullet:v2
    restart: unless-stopped
    environment:
      - SB_USER=${SB_USER}
    volumes:
      - silverbullet-space:/space
    expose:
      - 3000

  watchtower:
    image: containrrr/watchtower
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  silverbullet-space: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
