---
title: Hospedar Web-Check com Rustploy
description: "Analisador web \"all-in-one\" para levantar dados de infraestrutura, DNS e segurança de qualquer domínio. Crie Web-Check em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Web-Check**: Analisador web "all-in-one" para levantar dados de infraestrutura, DNS e segurança de qualquer domínio. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `web-check` |
| **Containers** | 1 (`web-check`) |
| **Imagens** | `lissy93/web-check` |
| **Porta da interface** | 3000, no serviço `web-check` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Web-Check** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `GOOGLE_CLOUD_API_KEY` |  |
| `TORRENT_IP_API_KEY` |  |
| `SECURITY_TRAILS_API_KEY` |  |
| `BUILT_WITH_API_KEY` |  |
| `URL_SCAN_API_KEY` |  |
| `TRANCO_USERNAME` |  |
| `TRANCO_API_KEY` |  |
| `CLOUDMERSIVE_API_KEY` |  |
| `REACT_APP_SHODAN_API_KEY` |  |
| `REACT_APP_WHO_API_KEY` |  |
| `PORT` | 3000 |
| `DISABLE_GUI` | false |
| `API_TIMEOUT_LIMIT` | 10000 |
| `API_CORS_ORIGIN` | * |
| `API_ENABLE_RATE_LIMIT` | true |
| `ENABLE_ANALYTICS` | false |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `web-check` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.9'
services:
  web-check:
    image: lissy93/web-check
    ports:
      - 3000
    restart: unless-stopped
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
