---
title: Hospedar OpenHands com Rustploy
description: "Ambiente centralizado voltado para a orquestração e deploy de agentes autônomos de IA. Crie OpenHands em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**OpenHands**: Ambiente centralizado voltado para a orquestração e deploy de agentes autônomos de IA. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `openhands` |
| **Containers** | 1 (`openhands`) |
| **Imagens** | `docker.all-hands.dev/all-hands-ai/openhands:latest` |
| **Porta da interface** | 3000, no serviço `openhands` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **OpenHands** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `openhands_api_key` | *senha aleatória de 64 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SANDBOX_RUNTIME_CONTAINER_IMAGE` | docker.all-hands.dev/all-hands-ai/runtime:0.50-nikolaik |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `openhands` | 3000 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/.openhands/config.toml`

## docker-compose.yml do template

```yaml
# The 'version' attribute is obsolete and has been removed.
services:
  openhands:
    # Corrected the Docker image to what appears to be the official registry path.
    # This was the cause of the "pull access denied" error.
    image: docker.all-hands.dev/all-hands-ai/openhands:latest
    restart: unless-stopped

    # The port is exposed without mapping. Dokploy handles the routing via the domain.
    ports:
      - "3000"

    # Environment variables are sourced from the template.toml file.
    environment:
      - SANDBOX_RUNTIME_CONTAINER_IMAGE=${SANDBOX_RUNTIME_CONTAINER_IMAGE}
      - WORKSPACE_MOUNT_PATH=/opt/workspace_base

    # Allows the container to communicate with the host's Docker daemon.
    extra_hosts:
      - "host.docker.internal:host-gateway"

    # Volumes for persistent data. Named volumes are used instead of host mounts.
    # The docker socket is mounted to allow OpenHands to manage other containers.
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - openhands-config:/.openhands
      - openhands-workspace:/opt/workspace_base

    # These flags are necessary for the interactive shell functionality of OpenHands.
    stdin_open: true
    tty: true

# Named volumes are defined here to persist configuration and workspace data.
volumes:
  openhands-config: {}
  openhands-workspace: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
