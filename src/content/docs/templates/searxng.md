---
title: Hospedar SearXNG com Rustploy
description: "Metamecanismo de busca privado que agrega resultados do Google/Bing sem rastrear dados. Crie SearXNG em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**SearXNG**: Metamecanismo de busca privado que agrega resultados do Google/Bing sem rastrear dados. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `searxng` |
| **Containers** | 2 (`valkey`, `searxng`) |
| **Imagens** | `valkey/valkey:8-alpine`, `searxng/searxng:latest` |
| **Porta da interface** | 8080, no serviço `searxng` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **SearXNG** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_key` | *senha aleatória de 64 caracteres* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `searxng` | 8080 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/searxng/settings.yml`

## docker-compose.yml do template

```yaml
services:
  valkey:
    image: valkey/valkey:8-alpine
    command: valkey-server --save 30 1 --loglevel warning
    restart: unless-stopped
    volumes:
      - valkey-data:/data

  searxng:
    image: searxng/searxng:latest
    restart: unless-stopped
    volumes:
      - ../files/searxng:/etc/searxng
      - searxng-data:/var/cache/searxng

volumes:
  valkey-data: {}
  searxng-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
