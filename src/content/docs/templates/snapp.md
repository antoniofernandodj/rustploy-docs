---
title: Hospedar Snapp com Rustploy
description: "Servidor ágil para captura, upload e compartilhamento de prints e imagens com controle de acessos. Crie Snapp em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Snapp**: Servidor ágil para captura, upload e compartilhamento de prints e imagens com controle de acessos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `snapp` |
| **Containers** | 1 (`snapp`) |
| **Imagens** | `uraniadev/snapp:0.9-rc-020` |
| **Porta da interface** | 3000, no serviço `snapp` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Snapp** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `token_secret` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DATABASE_URL` | file:./db.sqlite |
| `DATABASE_PROVIDER` | sqlite |
| `DISABLED_EMAIL_AND_PASSWORD` | false |
| `LOG_LEVEL` | debug |
| `ORIGIN` | http://${main_domain} |
| `PORT` | 3000 |
| `ADMIN_USERNAME` | admin |
| `ADMIN_EMAIL` | info@example.org |
| `ADMIN_PASSWORD` | *senha aleatória de 16 caracteres* |
| `TOKEN_SECRET` | ${token_secret} |
| `ENABLE_SIGNUP` | true |
| `ENABLED_MFA` | false |
| `PUBLIC_URL` | ${main_domain} |
| `APPNAME` | Snapp |
| `PUBLIC_EXTRA_GROUPS_EDITABLE` | true |
| `URLS_VIA_GROUPS_ONLY` | false |
| `HOST` | 0.0.0.0 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `snapp` | 3000 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/files/snapp-db/db.sqlite`

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  snapp:
    image: uraniadev/snapp:0.9-rc-020
    ports:
      - 3000
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - DATABASE_PROVIDER=${DATABASE_PROVIDER}
      - TOKEN_SECRET=${TOKEN_SECRET} # API Key for authentication token
      - ORIGIN=${ORIGIN}
      - DISABLED_EMAIL_AND_PASSWORD=${DISABLED_EMAIL_AND_PASSWORD}
      - LOG_LEVEL=${LOG_LEVEL}
      - PORT=${PORT}
      - ADMIN_USERNAME=${ADMIN_USERNAME}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - ENABLE_SIGNUP=${ENABLE_SIGNUP}
      - ENABLED_MFA=${ENABLED_MFA}
      - PUBLIC_URL=${PUBLIC_URL}
      - APPNAME=${APPNAME}
      - PUBLIC_EXTRA_GROUPS_EDITABLE=${PUBLIC_EXTRA_GROUPS_EDITABLE}
      - URLS_VIA_GROUPS_ONLY=${URLS_VIA_GROUPS_ONLY}
      - HOST=${HOST}
    volumes:
      - ../files/snapp-db:/app/db.sqlite
volumes:
  snapp-db: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
