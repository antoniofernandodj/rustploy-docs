---
title: Hospedar Poke com Rustploy
description: "Plataforma privada focada em compartilhamento de vídeos mantendo anonimato. Crie Poke em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Poke**: Plataforma privada focada em compartilhamento de vídeos mantendo anonimato. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `poke` |
| **Containers** | 1 (`poke`) |
| **Imagens** | `codeberg.org/poketube/poke:amd64` |
| **Porta da interface** | 6003, no serviço `poke` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Poke** e selecione.
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
| `poke` | 6003 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/poketube/config.json`

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  poke:
    image: codeberg.org/poketube/poke:amd64
    restart: unless-stopped
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
