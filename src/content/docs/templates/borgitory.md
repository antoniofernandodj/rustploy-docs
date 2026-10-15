---
title: Hospedar Borgitory com Rustploy
description: "Interface web para visualizar e gerenciar repositórios BorgBackup. Crie Borgitory em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Borgitory**: Interface web para visualizar e gerenciar repositórios BorgBackup. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `borgitory` |
| **Containers** | 1 (`borgitory`) |
| **Imagens** | `mlapaglia/borgitory:latest` |
| **Porta da interface** | 8000, no serviço `borgitory` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Borgitory** e selecione.
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
| `borgitory` | 8000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  borgitory:
    image: mlapaglia/borgitory:latest
    restart: unless-stopped
    expose:
      - 8000
    cap_add:
      - SYS_ADMIN
    devices:
      - /dev/fuse
    volumes:
      - borgitory-data:/app/data
      - borgitory-sources:/mnt/sources:ro
      - borgitory-repos:/mnt/repos:ro

volumes:
  borgitory-data: {}
  borgitory-sources: {}
  borgitory-repos: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
