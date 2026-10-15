---
title: Host Passbolt with Rustploy
description: "Open-source password and credential manager focused on technical team collaboration. Create Passbolt in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Passbolt**: Open-source password and credential manager focused on technical team collaboration. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `passbolt` |
| **Containers** | 2 (`passbolt`, `mariadb`) |
| **Images** | `passbolt/passbolt:latest-ce`, `mariadb:11` |
| **UI port** | 80, on service `passbolt` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Passbolt** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 32 characters* |
| `db_root_password` | *random password, 32 characters* |
| `email_host` | smtp.example.com |
| `email_user` | noreply@example.com |
| `email_pass` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `PASSBOLT_APP_FULL_BASE_URL` | http://${main_domain} |
| `PASSBOLT_DB_HOST` | mariadb |
| `PASSBOLT_DB_PORT` | 3306 |
| `PASSBOLT_DB_NAME` | passbolt |
| `PASSBOLT_DB_USER` | passbolt |
| `PASSBOLT_DB_PASSWORD` | ${db_password} |
| `PASSBOLT_DB_ROOT_PASSWORD` | ${db_root_password} |
| `PASSBOLT_PLUGINS_JWT_AUTHENTICATION_ENABLED` | true |
| `PASSBOLT_EMAIL_FROM` | passbolt@${main_domain} |
| `PASSBOLT_EMAIL_HOST` | ${email_host} |
| `PASSBOLT_EMAIL_PORT` | 587 |
| `PASSBOLT_EMAIL_USER` | ${email_user} |
| `PASSBOLT_EMAIL_PASS` | ${email_pass} |
| `PASSBOLT_EMAIL_TLS` | true |

## Domains

| Service | Port | Host |
|---|---|---|
| `passbolt` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
# =============================================================================
# PASSBOLT TEMPLATE - SETUP INSTRUCTIONS
# =============================================================================
#
# After successful deployment, you need to create an admin user:
#
# 1. Go to your Dokploy dashboard
# 2. Navigate to your Passbolt application
# 3. Wait for both containers to be healthy - check the "Monitoring" tab
# 4. Go to the "General" tab and click "Open Terminal" button
# 5. In the terminal, run this command to create admin user:
#    su -s /bin/bash -c "/usr/share/php/passbolt/bin/cake passbolt register_user -u youremail@example.com -f FirstName -l LastName -r admin" www-data
# 6. Replace youremail@example.com, FirstName, LastName with your actual details
# 7. The command will output a registration link - copy and paste it in your browser to complete setup
#
# NOTE: If you change the domain after deployment, you will need to manually
# update the PASSBOLT_APP_FULL_BASE_URL environment variable in the "Environment" tab.
# =============================================================================

services:
  passbolt:
    image: passbolt/passbolt:latest-ce
    environment:
      APP_FULL_BASE_URL: ${PASSBOLT_APP_FULL_BASE_URL}
      DATASOURCES_DEFAULT_HOST: ${PASSBOLT_DB_HOST}
      DATASOURCES_DEFAULT_PORT: ${PASSBOLT_DB_PORT}
      DATASOURCES_DEFAULT_USERNAME: ${PASSBOLT_DB_USER}
      DATASOURCES_DEFAULT_PASSWORD: ${PASSBOLT_DB_PASSWORD}
      DATASOURCES_DEFAULT_DATABASE: ${PASSBOLT_DB_NAME}
      PASSBOLT_PLUGINS_JWT_AUTHENTICATION_ENABLED: ${PASSBOLT_PLUGINS_JWT_AUTHENTICATION_ENABLED}

      EMAIL_DEFAULT_FROM: ${PASSBOLT_EMAIL_FROM}
      EMAIL_TRANSPORT_DEFAULT_HOST: ${PASSBOLT_EMAIL_HOST}
      EMAIL_TRANSPORT_DEFAULT_PORT: ${PASSBOLT_EMAIL_PORT}
      EMAIL_TRANSPORT_DEFAULT_USERNAME: ${PASSBOLT_EMAIL_USER}
      EMAIL_TRANSPORT_DEFAULT_PASSWORD: ${PASSBOLT_EMAIL_PASS}
      EMAIL_TRANSPORT_DEFAULT_TLS: ${PASSBOLT_EMAIL_TLS}

    volumes:
      - gpg_volume:/etc/passbolt/gpg
      - jwt_volume:/etc/passbolt/jwt

    command:
      - /usr/bin/wait-for.sh
      - "-t"
      - "0"
      - "${PASSBOLT_DB_HOST}:${PASSBOLT_DB_PORT}"
      - "--"
      - /docker-entrypoint.sh

    depends_on:
      mariadb:
        condition: service_healthy

    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:80"]
      interval: 5s
      timeout: 20s
      retries: 10

  mariadb:
    image: mariadb:11
    environment:
      MARIADB_ROOT_PASSWORD: ${PASSBOLT_DB_ROOT_PASSWORD}
      MARIADB_DATABASE: ${PASSBOLT_DB_NAME}
      MARIADB_USER: ${PASSBOLT_DB_USER}
      MARIADB_PASSWORD: ${PASSBOLT_DB_PASSWORD}
    volumes:
      - passbolt_mariadb_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mariadb-admin", "ping", "-h", "localhost", "--silent"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  gpg_volume: {}
  jwt_volume: {}
  passbolt_mariadb_data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
