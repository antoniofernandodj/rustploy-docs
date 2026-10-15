---
title: Hospedar Glance com Rustploy
description: "Feed unificado para reunir feeds RSS, clima, bookmarks e monitoramento. Crie Glance em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Glance**: Feed unificado para reunir feeds RSS, clima, bookmarks e monitoramento. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `glance` |
| **Containers** | 1 (`glance`) |
| **Imagens** | `glanceapp/glance` |
| **Porta da interface** | 8080, no serviço `glance` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Glance** e selecione.
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
| `glance` | 8080 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/app/config/glance.yml`

## docker-compose.yml do template

```yaml
services:
  glance:
    image: glanceapp/glance
    volumes:
      - ../files/app/config/:/app/config
      - ../files/app/assets:/app/assets
      # Optionally, also mount docker socket if you want to use the docker containers widget
      # - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - 8080
    env_file: .env
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
