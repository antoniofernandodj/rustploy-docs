---
title: Host Roundcube with Rustploy
description: "Traditional PHP-based webmail client for IMAP mailboxes. Create Roundcube in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Roundcube**: Traditional PHP-based webmail client for IMAP mailboxes. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `roundcube` |
| **Containers** | 1 (`roundcubemail`) |
| **Images** | `roundcube/roundcubemail:1.6.9-apache` |
| **UI port** | 80, on service `roundcubemail` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Roundcube** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DEFAULT_HOST` | tls://mail.example.com |
| `SMTP_SERVER` | tls://mail.example.com |

## Domains

| Service | Port | Host |
|---|---|---|
| `roundcubemail` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  roundcubemail:
    image: roundcube/roundcubemail:1.6.9-apache
    volumes:
      - ./www:/var/www/html
      - ./db/sqlite:/var/roundcube/db
    environment:
      - ROUNDCUBEMAIL_DB_TYPE=sqlite
      - ROUNDCUBEMAIL_SKIN=elastic
      - ROUNDCUBEMAIL_DEFAULT_HOST=${DEFAULT_HOST}
      - ROUNDCUBEMAIL_SMTP_SERVER=${SMTP_SERVER}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
