---
title: Host Keycloak with Rustploy
description: "Robust enterprise identity management and authentication provider. Create Keycloak in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Keycloak**: Robust enterprise identity management and authentication provider. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `keycloak` |
| **Containers** | 2 (`postgres`, `keycloak`) |
| **Images** | `postgres:16.2`, `quay.io/keycloak/keycloak:26.3.5` |
| **UI port** | 8080, on service `keycloak` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Keycloak** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `POSTGRES_DB` | keycloak |
| `POSTGRES_USER` | keycloakuser |
| `POSTGRES_PASSWORD` | *random password, 32 characters* |
| `KEYCLOAK_ADMIN` | admin |
| `KEYCLOAK_ADMIN_PASSWORD` | *random password, 32 characters* |
| `KC_HOSTNAME` | ${main_domain} |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_DB` | ${POSTGRES_DB} |
| `POSTGRES_USER` | ${POSTGRES_USER} |
| `POSTGRES_PASSWORD` | ${POSTGRES_PASSWORD} |
| `KEYCLOAK_ADMIN` | ${KEYCLOAK_ADMIN} |
| `KEYCLOAK_ADMIN_PASSWORD` | ${KEYCLOAK_ADMIN_PASSWORD} |
| `KC_HOSTNAME` | ${KC_HOSTNAME} |

## Domains

| Service | Port | Host |
|---|---|---|
| `keycloak` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:16.2
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always
    
  keycloak:
    image: quay.io/keycloak/keycloak:26.3.5
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/${POSTGRES_DB}
      KC_DB_USERNAME: ${POSTGRES_USER}
      KC_DB_PASSWORD: ${POSTGRES_PASSWORD}
      KC_BOOTSTRAP_ADMIN_USERNAME: ${KEYCLOAK_ADMIN}
      KC_BOOTSTRAP_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
      KC_HOSTNAME: ${KC_HOSTNAME}      
      KC_HTTP_ENABLED: "true"               
      KC_HEALTH_ENABLED: "true"
      KC_PROXY_HEADERS: "xforwarded"
    command: start-dev
    restart: always

volumes:
  postgres_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
