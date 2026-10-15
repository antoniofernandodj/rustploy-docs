---
title: Hospedar Cup com Rustploy
description: "Interface gráfica leve para administração de containers Docker locais. Crie Cup em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Cup**: Interface gráfica leve para administração de containers Docker locais. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `cup` |
| **Containers** | 1 (`cup`) |
| **Imagens** | `ghcr.io/sergi0g/cup:latest` |
| **Porta da interface** | 8000, no serviço `cup` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Cup** e selecione.
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
| `cup` | 8000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  cup:
    image: ghcr.io/sergi0g/cup:latest
    restart: unless-stopped
    command: serve
    ports:
      - "8000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
