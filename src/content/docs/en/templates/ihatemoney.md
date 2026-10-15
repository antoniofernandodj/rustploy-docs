---
title: Host I Hate Money with Rustploy
description: "Web utility for splitting shared bills and group expenses. Create I Hate Money in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**I Hate Money**: Web utility for splitting shared bills and group expenses. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `ihatemoney` |
| **Containers** | 1 (`ihatemoney`) |
| **Images** | `ihatemoney/ihatemoney:latest` |
| **UI port** | 8000, on service `ihatemoney` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **I Hate Money** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `ADMIN_PASSWORD` | *random password, 32 characters* |
| `MAIL_USERNAME` | *generated username* |
| `MAIL_PASSWORD` | *random password, 32 characters* |
| `SECRET_KEY` | *random password, 64 characters* |

**Delivered to the container:**

| Variable | Value |
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

## Domains

| Service | Port | Host |
|---|---|---|
| `ihatemoney` | 8000 | ${main_domain} |

## The template docker-compose.yml

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

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
