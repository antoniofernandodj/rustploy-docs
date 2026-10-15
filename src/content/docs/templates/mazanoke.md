---
title: Hospedar MAZANOKE com Rustploy
description: "Plataforma ágil e minimalista para hospedagem e compartilhamento de álbuns de fotos. Crie MAZANOKE em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**MAZANOKE**: Plataforma ágil e minimalista para hospedagem e compartilhamento de álbuns de fotos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `mazanoke` |
| **Containers** | 1 (`mazanoke`) |
| **Imagens** | `ghcr.io/civilblur/mazanoke:latest` |
| **Porta da interface** | 80, no serviço `mazanoke` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **MAZANOKE** e selecione.
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
| `mazanoke` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  mazanoke:
    image: ghcr.io/civilblur/mazanoke:latest
    restart: unless-stopped
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
