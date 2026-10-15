---
title: Host Go Whatsapp Web Multidevice with Rustploy
description: "Go Whatsapp Web Multidevice application. Create Go Whatsapp Web Multidevice in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Go Whatsapp Web Multidevice**: Go Whatsapp Web Multidevice application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `go-whatsapp-web-multidevice` |
| **Containers** | 1 (`whatsapp`) |
| **Images** | `aldinokemal2104/go-whatsapp-web-multidevice` |
| **UI port** | 3080, on service `whatsapp` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Go Whatsapp Web Multidevice** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `wa_user` | admin |
| `wa_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `WA_USER` | ${wa_user} |
| `WA_PASSWORD` | ${wa_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `whatsapp` | 3080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  whatsapp:
    image: aldinokemal2104/go-whatsapp-web-multidevice
    restart: always
    ports:
      - "3080"
    volumes:
      - whatsapp:/app/storages
    command:
      - rest
      - --basic-auth=${WA_USER}:${WA_PASSWORD}
      - --port=3080
      - --debug=true
      - --os=Chrome
      - --account-validation=false

volumes:
  whatsapp:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
