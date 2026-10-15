---
title: Hospedar Blender com Rustploy
description: "Suíte completa de criação, modelagem e renderização 3D. Crie Blender em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Blender**: Suíte completa de criação, modelagem e renderização 3D. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `blender` |
| **Containers** | 1 (`blender`) |
| **Imagens** | `lscr.io/linuxserver/blender:latest` |
| **Porta da interface** | 3000, no serviço `blender` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Blender** e selecione.
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
| `PUID` | 1000 |
| `PGID` | 1000 |
| `TZ` | Etc/UTC |
| `SUBFOLDER` | / |
| `NVIDIA_VISIBLE_DEVICES` | all |
| `NVIDIA_DRIVER_CAPABILITIES` | all |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `blender` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  blender:
    image: lscr.io/linuxserver/blender:latest
    runtime: nvidia
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities:
                - gpu
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - NVIDIA_DRIVER_CAPABILITIES=all
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      - SUBFOLDER=/ #optional
    ports:
      - 3000
      - 3001
    restart: unless-stopped
    shm_size: 1gb
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
