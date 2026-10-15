---
title: Hospedar Backrest com Rustploy
description: "Interface web para gerenciamento e automação de backups via restic. Crie Backrest em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Backrest**: Interface web para gerenciamento e automação de backups via restic. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `backrest` |
| **Containers** | 1 (`backrest`) |
| **Imagens** | `garethgeorge/backrest:v1.7.3` |
| **Porta da interface** | 9898, no serviço `backrest` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Backrest** e selecione.
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
| `TZ` | Europe/Paris |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `backrest` | 9898 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  backrest:
    image: garethgeorge/backrest:v1.7.3
    restart: unless-stopped
    ports:
      - 9898
    environment:
      - BACKREST_PORT=9898
      - BACKREST_DATA=/data # where it stores current state data
      - BACKREST_CONFIG=/config/config.json # where it stores backup configurations
      - XDG_CACHE_HOME=/cache # backup cache
      - TZ=${TZ}
    volumes:
      - backrest/data:/data
      - backrest/config:/config
      - backrest/config:/cache # to preserve backup cache between restarts
      - /:/userdata:ro # we mount /mnt/data to /userdata (that we want to backup)

volumes:
  backrest: 
  backrest-cache:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
