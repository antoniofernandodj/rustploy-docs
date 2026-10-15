---
title: Hospedar Lodestone com Rustploy
description: "Painel intuitivo de gerenciamento de servidores de Minecraft e jogos multiplayer. Crie Lodestone em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Lodestone**: Painel intuitivo de gerenciamento de servidores de Minecraft e jogos multiplayer. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `lodestone` |
| **Containers** | 2 (`lodestone`, `lodestone_dashboard`) |
| **Imagens** | `ghcr.io/lodestone-team/lodestone_core`, `ghcr.io/lodestone-team/lodestone_dashboard:v0.5.1` |
| **Porta da interface** | 80, no serviço `lodestone_dashboard` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Lodestone** e selecione.
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
| `lodestone_dashboard` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.8'

services:
  lodestone:
    image: ghcr.io/lodestone-team/lodestone_core
    ports:
      - "16662:16662"
      - "25565-25590:25565-25590" 
    volumes:
      - lodestone:/home/user/.lodestone
    restart: unless-stopped

  lodestone_dashboard:
    image: ghcr.io/lodestone-team/lodestone_dashboard:v0.5.1
    restart: always  

volumes:
  lodestone:
    driver: local
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
