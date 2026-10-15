---
title: Hospedar DumbAssets com Rustploy
description: "Rastreador de ativos estáticos sem necessidade de banco de dados. Crie DumbAssets em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**DumbAssets**: Rastreador de ativos estáticos sem necessidade de banco de dados. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `dumbassets` |
| **Containers** | 1 (`dumbassets`) |
| **Imagens** | `dumbwareio/dumbassets:latest` |
| **Porta da interface** | 3000, no serviço `dumbassets` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **DumbAssets** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `default_pin` | *senha aleatória de 4 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `NODE_ENV` | production |
| `DEBUG` | false |
| `SITE_TITLE` | DumbAssets |
| `BASE_URL` | https://${main_domain} |
| `DUMBASSETS_PIN` | ${default_pin} |
| `ALLOWED_ORIGINS` | * |
| `DEMO_MODE` | false |
| `APPRISE_URL` |  |
| `CURRENCY_CODE` | USD |
| `CURRENCY_LOCALE` | en-US |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `dumbassets` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  dumbassets:
    image: dumbwareio/dumbassets:latest
    restart: unless-stopped
    ports:
      - 3000
    volumes:
      - dumbassets-data:/app/data

volumes:
  dumbassets-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
