---
title: Hospedar Linkding com Rustploy
description: "Gerenciador de favoritos veloz com uma interface minimalista livre de distrações. Crie Linkding em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Linkding**: Gerenciador de favoritos veloz com uma interface minimalista livre de distrações. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `linkding` |
| **Containers** | 1 (`linkding`) |
| **Imagens** | `sissbruecker/linkding:latest` |
| **Porta da interface** | 9090, no serviço `linkding` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Linkding** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `superuser_password` | *senha aleatória de 32 caracteres* |
| `csrf_trusted_origins` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `LD_CONTEXT_PATH` |  |
| `LD_SUPERUSER_NAME` |  |
| `LD_SUPERUSER_PASSWORD` | ${superuser_password} |
| `LD_DISABLE_BACKGROUND_TASKS` | False |
| `LD_DISABLE_URL_VALIDATION` | False |
| `LD_ENABLE_AUTH_PROXY` | False |
| `LD_AUTH_PROXY_USERNAME_HEADER` |  |
| `LD_AUTH_PROXY_LOGOUT_URL` |  |
| `LD_CSRF_TRUSTED_ORIGINS` | ${csrf_trusted_origins} |
| `LD_DB_ENGINE` |  |
| `LD_DB_DATABASE` |  |
| `LD_DB_USER` |  |
| `LD_DB_PASSWORD` | ${db_password} |
| `LD_DB_HOST` |  |
| `LD_DB_PORT` |  |
| `LD_DB_OPTIONS` | {} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `linkding` | 9090 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  linkding:
    image: sissbruecker/linkding:latest
    restart: unless-stopped
    ports:
      - 9090
    volumes:
      - ../files/linkding-data:/etc/linkding/data
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
