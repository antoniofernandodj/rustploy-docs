---
title: Hospedar MCSManager com Rustploy
description: "Painel web distribuído para administração de servidores Minecraft e instâncias de jogos. Crie MCSManager em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**MCSManager**: Painel web distribuído para administração de servidores Minecraft e instâncias de jogos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `mcsmanager` |
| **Containers** | 2 (`web`, `daemon`) |
| **Imagens** | `githubyumao/mcsmanager-web:latest`, `githubyumao/mcsmanager-daemon:latest` |
| **Porta da interface** | 23333, no serviço `web` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **MCSManager** e selecione.
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
| `web` | 23333 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  web:
    image: githubyumao/mcsmanager-web:latest
    restart: unless-stopped
    ports:
      - 23333
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - mcsmanager-web-data:/opt/mcsmanager/web/data
      - mcsmanager-web-logs:/opt/mcsmanager/web/logs
  daemon:
    image: githubyumao/mcsmanager-daemon:latest
    restart: unless-stopped
    ports:
      - 24444
    environment:
      - MCSM_DOCKER_WORKSPACE_PATH=/opt/mcsmanager/daemon/data/InstanceData
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - mcsmanager-daemon-data:/opt/mcsmanager/daemon/data
      - mcsmanager-daemon-logs:/opt/mcsmanager/daemon/logs
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  mcsmanager-web-data:
  mcsmanager-web-logs:
  mcsmanager-daemon-data:
  mcsmanager-daemon-logs:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
