---
title: Host Minepanel with Rustploy
description: "Docker panel for creating, monitoring and controlling Minecraft instances. Create Minepanel in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Minepanel**: Docker panel for creating, monitoring and controlling Minecraft instances. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `minepanel` |
| **Containers** | 2 (`backend`, `frontend`) |
| **Images** | `ketbom/minepanel-backend:1.7.1`, `ketbom/minepanel-frontend:1.7.1` |
| **UI port** | 3000, on service `frontend` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Minepanel** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `jwt_secret` | *random base64 key (32 bytes)* |
| `client_username` | admin |
| `client_password` | *random password, 16 characters* |
| `default_language` | en |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `JWT_SECRET` | *generated JWT* |
| `CLIENT_USERNAME` | ${client_username} |
| `CLIENT_PASSWORD` | ${client_password} |
| `FRONTEND_URL` | http://${main_domain} |
| `NEXT_PUBLIC_BACKEND_URL` | http://api-${main_domain} |
| `NEXT_PUBLIC_DEFAULT_LANGUAGE` | ${default_language} |
| `BASE_DIR` | /app |

## Domains

| Service | Port | Host |
|---|---|---|
| `frontend` | 3000 | ${main_domain} |
| `backend` | 8091 | api-${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  backend:
    image: ketbom/minepanel-backend:1.7.1
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - FRONTEND_URL=${FRONTEND_URL}
      - JWT_SECRET=${JWT_SECRET}
      - CLIENT_PASSWORD=${CLIENT_PASSWORD}
      - CLIENT_USERNAME=${CLIENT_USERNAME}
      - BASE_DIR=${BASE_DIR}
    volumes:
      - minepanel-servers:/app/servers
      - minepanel-data:/app/data
      - /var/run/docker.sock:/var/run/docker.sock

  frontend:
    image: ketbom/minepanel-frontend:1.7.1
    restart: unless-stopped
    environment:
      - NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
      - NEXT_PUBLIC_DEFAULT_LANGUAGE=${NEXT_PUBLIC_DEFAULT_LANGUAGE}
    depends_on:
      - backend

volumes:
  minepanel-servers:
  minepanel-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
