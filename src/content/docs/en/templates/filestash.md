---
title: Host Filestash with Rustploy
description: "Web client that connects multiple storages to identity providers. Create Filestash in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Filestash**: Web client that connects multiple storages to identity providers. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `filestash` |
| **Containers** | 2 (`app`, `wopi_server`) |
| **Images** | `machines/filestash:latest`, `collabora/code:24.04.10.2.1` |
| **UI port** | 8334, on service `app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Filestash** and select it.
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
| `APPLICATION_URL` | ${main_domain} |
| `CANARY` | true |
| `OFFICE_URL` | http://wopi_server:9980 |
| `OFFICE_FILESTASH_URL` | http://app:8334 |
| `OFFICE_REWRITE_URL` | http://127.0.0.1:9980 |

## Domains

| Service | Port | Host |
|---|---|---|
| `app` | 8334 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    image: machines/filestash:latest
    restart: always
    environment:
      - APPLICATION_URL=${APPLICATION_URL}
      - CANARY=${CANARY}
      - OFFICE_URL=${OFFICE_URL}
      - OFFICE_FILESTASH_URL=${OFFICE_FILESTASH_URL}
      - OFFICE_REWRITE_URL=${OFFICE_REWRITE_URL}
    ports:
      - 8334
    volumes:
      - filestash:/app/data/state/

  wopi_server:
    image: collabora/code:24.04.10.2.1
    restart: always
    environment:
      # Set below to "true" if you are using custom domain and want to enable SSL
      - extra_params=--o:ssl.enable=false
      - aliasgroup1=https://.*:443
    command:
      - /bin/bash
      - -c
      - |
          curl -o /usr/share/coolwsd/browser/dist/branding-desktop.css https://gist.githubusercontent.com/mickael-kerjean/bc1f57cd312cf04731d30185cc4e7ba2/raw/d706dcdf23c21441e5af289d871b33defc2770ea/destop.css
          /bin/su -s /bin/bash -c '/start-collabora-online.sh' cool
    user: root
    ports:
      - 9980

volumes:
  filestash:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
