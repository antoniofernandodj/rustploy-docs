---
title: Hospedar I Hate Money com Rustploy
description: "Utilitário web focado na divisão de contas compartilhadas e despesas em grupo. Crie I Hate Money em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**I Hate Money**: Utilitário web focado na divisão de contas compartilhadas e despesas em grupo. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `ihatemoney` |
| **Containers** | 1 (`ihatemoney`) |
| **Imagens** | `ihatemoney/ihatemoney:latest` |
| **Porta da interface** | 8000, no serviço `ihatemoney` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **I Hate Money** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `ADMIN_PASSWORD` | *senha aleatória de 32 caracteres* |
| `MAIL_USERNAME` | *usuário gerado* |
| `MAIL_PASSWORD` | *senha aleatória de 32 caracteres* |
| `SECRET_KEY` | *senha aleatória de 64 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DEBUG` | False |
| `ACTIVATE_DEMO_PROJECT` | True |
| `ACTIVATE_ADMIN_DASHBOARD` | False |
| `ADMIN_PASSWORD` | ${ADMIN_PASSWORD} |
| `ALLOW_PUBLIC_PROJECT_CREATION` | True |
| `BABEL_DEFAULT_TIMEZONE` | UTC |
| `GREENLET_TEST_CPP` | no |
| `MAIL_DEFAULT_SENDER` | Budget manager <admin@example.com> |
| `MAIL_PASSWORD` | ${MAIL_PASSWORD} |
| `MAIL_PORT` | 25 |
| `MAIL_SERVER` | localhost |
| `MAIL_USE_SSL` | False |
| `MAIL_USE_TLS` | False |
| `MAIL_USERNAME` | ${MAIL_USERNAME} |
| `SECRET_KEY` | ${SECRET_KEY} |
| `SESSION_COOKIE_SECURE` | True |
| `SHOW_ADMIN_EMAIL` | True |
| `SQLALCHEMY_DATABASE_URI` | sqlite:////database/ihatemoney.db |
| `SQLALCHEMY_TRACK_MODIFICATIONS` | False |
| `APPLICATION_ROOT` | / |
| `ENABLE_CAPTCHA` | False |
| `LEGAL_LINK` |  |
| `PORT` | 8000 |
| `PUID` | 0 |
| `PGID` | 0 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `ihatemoney` | 8000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.9"

services:
  ihatemoney:
    image: ihatemoney/ihatemoney:latest
    environment:
      - DEBUG=False
      - ACTIVATE_DEMO_PROJECT=True
      - ACTIVATE_ADMIN_DASHBOARD=False
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - ALLOW_PUBLIC_PROJECT_CREATION=True
      - BABEL_DEFAULT_TIMEZONE=UTC
      - GREENLET_TEST_CPP=no
      - MAIL_DEFAULT_SENDER=Budget manager <admin@example.com>
      - MAIL_PASSWORD=${MAIL_PASSWORD} # used for mail service auth
      - MAIL_PORT=25
      - MAIL_SERVER=localhost
      - MAIL_USE_SSL=False
      - MAIL_USE_TLS=False
      - MAIL_USERNAME=${MAIL_USERNAME} # used for mail service auth
      - SECRET_KEY=${SECRET_KEY} # used for session security
      - SESSION_COOKIE_SECURE=True
      - SHOW_ADMIN_EMAIL=True
      - SQLALCHEMY_DATABASE_URI=sqlite:////database/ihatemoney.db
      - SQLALCHEMY_TRACK_MODIFICATIONS=False
      - APPLICATION_ROOT=/
      - ENABLE_CAPTCHA=False
      - LEGAL_LINK=
      - PORT=8000
      - PUID=0
      - PGID=0
    volumes:
      - ../files/sqlite-db:/database
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
