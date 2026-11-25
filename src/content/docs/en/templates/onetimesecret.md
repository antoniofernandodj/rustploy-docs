---
title: Host One Time Secret with Rustploy
description: "Secure sharing of secrets and passwords through links that self-destruct after viewing. Create One Time Secret in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**One Time Secret**: Secure sharing of secrets and passwords through links that self-destruct after viewing. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `onetimesecret` |
| **Containers** | 2 (`onetimesecret-redis`, `onetimesecret`) |
| **Images** | `redis:7-alpine`, `onetimesecret/onetimesecret:latest` |
| **UI port** | 3000, on service `onetimesecret` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **One Time Secret** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret` | *random password, 30 characters* |
| `redis_password` | *random password, 30 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `COLONEL` | admin@example.com |
| `HOST` | ${main_domain} |
| `REDIS_PASSWORD` | ${redis_password} |
| `SECRET` | ${secret} |

## Domains

| Service | Port | Host |
|---|---|---|
| `onetimesecret` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  onetimesecret-redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    restart: unless-stopped
    healthcheck:
      test:
        - CMD
        - redis-cli
        - ping
      interval: 30s
      timeout: 10s
      retries: 3

  onetimesecret:
    image: 'onetimesecret/onetimesecret:latest'
    restart: unless-stopped
    environment:
      # To see all available environment variables, visit:
      # https://github.com/onetimesecret/onetimesecret/blob/develop/etc/config.example.yaml
      - AUTH_AUTOVERIFY=true
      - AUTH_SIGNUP=true

      # Accounts created with this email address will have admin access
      - COLONEL=${COLONEL}

      # If you change your domain, make sure to update the HOST environment variable.
      - HOST=${HOST}

      - RACK_ENV=production
      - REDIS_URL=redis://:${REDIS_PASSWORD}@onetimesecret-redis:6379/0
      - SECRET=${SECRET}
      - SSL=true
    depends_on:
      - onetimesecret-redis
    healthcheck:
      test:
        - CMD
        - ruby
        - '-rnet/http'
        - '-e'
        - "exit(Net::HTTP.get_response(URI('http://localhost:3000')).is_a?(Net::HTTPSuccess) ? 0 : 1)"
      interval: 30s
      timeout: 10s
      retries: 3
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
