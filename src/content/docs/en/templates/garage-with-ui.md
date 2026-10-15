---
title: Host Garage With Ui with Rustploy
description: "Garage With Ui application. Create Garage With Ui in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Garage With Ui**: Garage With Ui application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `garage-with-ui` |
| **Containers** | 2 (`garage`, `garage-webui`) |
| **Images** | `dxflrs/garage:v2.0.0`, `khairul169/garage-webui:1.1.0` |
| **UI port** | 3900, on service `garage` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Garage With Ui** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `webui_domain` | web-ui.*domain (generated; replace it with yours)* |
| `admin_token` | *random base64 key (32 bytes)* |
| `metrics_token` | *random base64 key (32 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `API_BASE_URL` | http://garage:3903 |
| `S3_ENDPOINT_URL` | http://garage:3900 |
| `` |  |
| `# To set up auth for the web-ui please go here: https://github.com/khairul169/garage-webui?tab` | readme-ov-file#authentication |
| `# or run this command: htpasswd -nbBC 10 'YOUR_USERNAME' 'YOUR_PASSWORD' and paste the output in here.` |  |
| `AUTH_USER_PASS` |  |

## Domains

| Service | Port | Host |
|---|---|---|
| `garage` | 3900 | ${main_domain} |
| `garage-webui` | 3909 | ${webui_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `garage.toml`

## The template docker-compose.yml

```yaml
services:
  garage:
    image: dxflrs/garage:v2.0.0
    volumes:
      - ../files/garage.toml:/etc/garage.toml
      - garage-storage:/var/lib/garage
      - garage-storage:/var/lib/garage
    restart: unless-stopped
    ports:
      - 3900
      - 3901
      - 3902
      - 3903

  garage-webui:
    image: khairul169/garage-webui:1.1.0
    restart: unless-stopped
    volumes:
      - ../files/garage.toml:/etc/garage.toml:ro
    ports:
      - 3909
    environment:
      - AUTH_USER_PASS
      - API_BASE_URL
      - S3_ENDPOINT_URL

volumes:
  garage-storage: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
