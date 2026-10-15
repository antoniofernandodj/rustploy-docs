---
title: Hospedar Passbolt com Rustploy
description: "Gerenciador de senhas e credenciais open-source focado na colaboração de equipes técnicas. Crie Passbolt em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Passbolt**: Gerenciador de senhas e credenciais open-source focado na colaboração de equipes técnicas. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `passbolt` |
| **Containers** | 2 (`passbolt`, `mariadb`) |
| **Imagens** | `passbolt/passbolt:latest-ce`, `mariadb:11` |
| **Porta da interface** | 80, no serviço `passbolt` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Passbolt** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 32 caracteres* |
| `db_root_password` | *senha aleatória de 32 caracteres* |
| `email_host` | smtp.example.com |
| `email_user` | noreply@example.com |
| `email_pass` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
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

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `passbolt` | 80 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
