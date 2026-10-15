---
title: Hospedar Baikal com Rustploy
description: "Servidor leve para sincronização de Calendários (CalDAV) e Contatos (CardDAV). Crie Baikal em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Baikal**: Servidor leve para sincronização de Calendários (CalDAV) e Contatos (CardDAV). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `baikal` |
| **Containers** | 1 (`baikal`) |
| **Imagens** | `ckulka/baikal:nginx-php8.2` |
| **Porta da interface** | 80, no serviço `baikal` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Baikal** e selecione.
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
| `baikal` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  baikal:
    image: ckulka/baikal:nginx-php8.2
    restart: unless-stopped
    ports:
      - 80
    environment:
      - TZ=UTC
    volumes:
      - config:/var/www/baikal/config
      - data:/var/www/baikal/Specific

volumes:
  config: {}
  data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
