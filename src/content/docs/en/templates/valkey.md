---
title: Host Valkey with Rustploy
description: "The official Redis fork maintained by the Linux Foundation and major cloud providers. Create Valkey in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Valkey**: The official Redis fork maintained by the Linux Foundation and major cloud providers. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `valkey` |
| **Containers** | 1 (`valkey`) |
| **Images** | `valkey/valkey:8.1.4` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Valkey** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `valkey_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `VALKEY_PASSWORD` | ${valkey_password} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `valkey.conf`

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  valkey:
    image: valkey/valkey:8.1.4
    restart: unless-stopped
    ports:
      - 6379
    volumes:
      - ../files/valkey.conf:/etc/valkey/valkey.conf
      - valkey-data:/data
    command: valkey-server /etc/valkey/valkey.conf
    environment:
      - VALKEY_PASSWORD=${VALKEY_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "valkey-cli -a \"$$VALKEY_PASSWORD\" ping | grep PONG"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 10s

volumes:
  valkey-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
