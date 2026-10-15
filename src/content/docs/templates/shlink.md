---
title: Hospedar Shlink com Rustploy
description: "Encurtador de links corporativo auto-hospedado feito para rodar sob seus próprios domínios. Crie Shlink em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Shlink**: Encurtador de links corporativo auto-hospedado feito para rodar sob seus próprios domínios. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `shlink` |
| **Containers** | 2 (`shlink`, `shlink-web`) |
| **Imagens** | `shlinkio/shlink:stable`, `shlinkio/shlink-web-client` |
| **Porta da interface** | 8080, no serviço `shlink-web` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Shlink** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `initial_api_key` | *senha aleatória de 30 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `INITIAL_API_KEY` | ${initial_api_key} |
| `DEFAULT_DOMAIN` | ${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `shlink-web` | 8080 | web-${main_domain} |
| `shlink` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  shlink:
    image: shlinkio/shlink:stable
    environment:
      - INITIAL_API_KEY=${INITIAL_API_KEY}
      - DEFAULT_DOMAIN=${DEFAULT_DOMAIN}
      # Note: you should also update SHLINK_SERVER_URL in the shlink-web service.
      - IS_HTTPS_ENABLED=false
    volumes:
      - shlink-data:/etc/shlink/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:8080/rest/v3/health"]
      interval: 30s
      timeout: 10s
      retries: 3
  shlink-web:
    image: shlinkio/shlink-web-client
    environment:
      - SHLINK_SERVER_API_KEY=${INITIAL_API_KEY}
      # Note: if you've set IS_HTTPS_ENABLED=true, change http to https.
      - SHLINK_SERVER_URL=http://${DEFAULT_DOMAIN}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:8080"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  shlink-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
