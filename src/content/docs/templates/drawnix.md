---
title: Hospedar Drawnix com Rustploy
description: "Aplicação para renderização e gerenciamento de ativos visuais. Crie Drawnix em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Drawnix**: Aplicação para renderização e gerenciamento de ativos visuais. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `drawnix` |
| **Containers** | 1 (`drawnix`) |
| **Imagens** | `pubuzhixing/drawnix:latest` |
| **Porta da interface** | 3000, no serviço `drawnix` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Drawnix** e selecione.
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
| `drawnix` | 3000 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/app/config.txt`

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  drawnix:
    image: pubuzhixing/drawnix:latest
    restart: unless-stopped
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
