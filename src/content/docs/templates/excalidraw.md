---
title: Hospedar Excalidraw com Rustploy
description: "Quadro branco virtual para esboços e diagramas desenhados à mão. Crie Excalidraw em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Excalidraw**: Quadro branco virtual para esboços e diagramas desenhados à mão. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `excalidraw` |
| **Containers** | 1 (`excalidraw`) |
| **Imagens** | `excalidraw/excalidraw:latest` |
| **Porta da interface** | 80, no serviço `excalidraw` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Excalidraw** e selecione.
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
| `excalidraw` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  excalidraw:
    restart: unless-stopped
    image: excalidraw/excalidraw:latest
    healthcheck:
      test:
        - CMD
        - wget
        - '--spider'
        - '--quiet'
        - 'http://localhost'
      interval: 30s
      timeout: 5s
      retries: 3
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
