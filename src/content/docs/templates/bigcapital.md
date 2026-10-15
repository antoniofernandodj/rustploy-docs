---
title: Hospedar BigCapital com Rustploy
description: "Sistema ERP e contábil corporativo (Alternativa ao QuickBooks). Crie BigCapital em um clique no Rustploy: 6 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**BigCapital**: Sistema ERP e contábil corporativo (Alternativa ao QuickBooks). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `bigcapital` |
| **Containers** | 6 (`webapp`, `server`, `mysql`, `mongo`, `redis`, `gotenberg`) |
| **Imagens** | `bigcapitalhq/webapp:latest`, `bigcapitalhq/server:latest`, `mariadb:10.11`, `mongo:7`, `redis:7-alpine`, `gotenberg/gotenberg:7` |
| **Porta da interface** | 80, no serviço `webapp` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **BigCapital** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `base_url` | https://${main_domain} |
| `db_user` | bigcapital |
| `db_password` | *senha aleatória de 32 caracteres* |
| `db_root_password` | *senha aleatória de 32 caracteres* |
| `db_charset` | utf8mb4 |
| `system_db_name` | bigcapital |
| `tenant_db_name_prefix` | bigcapital_tenant_ |
| `jwt_secret` | *hash aleatório* |
| `mail_host` |  |
| `mail_username` |  |
| `mail_password` |  |
| `mail_port` | 587 |
| `mail_secure` | false |
| `mail_from_name` | BigCapital |
| `mail_from_address` | noreply@${main_domain} |
| `agendash_auth_user` | admin |
| `agendash_auth_password` | *senha aleatória de 24 caracteres* |
| `signup_disabled` | false |
| `signup_allowed_domains` |  |
| `signup_allowed_emails` |  |
| `signup_email_confirmation` | false |
| `gotenberg_url` | http://gotenberg:9000 |
| `gotenberg_docs_url` | http://gotenberg:9000 |
| `exchange_rate_service` | openexchangerates |
| `open_exchange_rate_app_id` |  |
| `banking_connect` | false |
| `plaid_env` | sandbox |
| `plaid_client_id` |  |
| `plaid_secret` |  |
| `plaid_link_webhook` |  |
| `lemonsqueezy_api_key` |  |
| `lemonsqueezy_store_id` |  |
| `lemonsqueezy_webhook_secret` |  |
| `hosted_on_bigcapital_cloud` | false |
| `new_relic_distributed_tracing_enabled` | false |
| `new_relic_log` | false |
| `new_relic_ai_monitoring_enabled` | false |
| `new_relic_custom_insights_events_max_samples_stored` | 10000 |
| `new_relic_span_events_max_samples_stored` | 10000 |
| `new_relic_license_key` |  |
| `new_relic_app_name` | BigCapital |
| `s3_region` |  |
| `s3_access_key_id` |  |
| `s3_secret_access_key` |  |
| `s3_endpoint` |  |
| `s3_bucket` |  |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `MAIL_HOST` | ${mail_host} |
| `MAIL_USERNAME` | ${mail_username} |
| `MAIL_PASSWORD` | ${mail_password} |
| `MAIL_PORT` | ${mail_port} |
| `MAIL_SECURE` | ${mail_secure} |
| `MAIL_FROM_NAME` | ${mail_from_name} |
| `MAIL_FROM_ADDRESS` | ${mail_from_address} |
| `DB_HOST` | mysql |
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |
| `DB_CHARSET` | ${db_charset} |
| `SYSTEM_DB_NAME` | ${system_db_name} |
| `TENANT_DB_NAME_PERFIX` | ${tenant_db_name_prefix} |
| `JWT_SECRET` | *JWT gerado* |
| `MONGODB_DATABASE_URL` | mongodb://mongo/bigcapital |
| `BASE_URL` | ${base_url} |
| `AGENDASH_AUTH_USER` | ${agendash_auth_user} |
| `AGENDASH_AUTH_PASSWORD` | ${agendash_auth_password} |
| `SIGNUP_DISABLED` | ${signup_disabled} |
| `SIGNUP_ALLOWED_DOMAINS` | ${signup_allowed_domains} |
| `SIGNUP_ALLOWED_EMAILS` | ${signup_allowed_emails} |
| `SIGNUP_EMAIL_CONFIRMATION` | ${signup_email_confirmation} |
| `GOTENBERG_URL` | ${gotenberg_url} |
| `GOTENBERG_DOCS_URL` | ${gotenberg_docs_url} |
| `EXCHANGE_RATE_SERVICE` | ${exchange_rate_service} |
| `OPEN_EXCHANGE_RATE_APP_ID` | ${open_exchange_rate_app_id} |
| `BANKING_CONNECT` | ${banking_connect} |
| `PLAID_ENV` | ${plaid_env} |
| `PLAID_CLIENT_ID` | ${plaid_client_id} |
| `PLAID_SECRET` | ${plaid_secret} |
| `PLAID_LINK_WEBHOOK` | ${plaid_link_webhook} |
| `LEMONSQUEEZY_API_KEY` | ${lemonsqueezy_api_key} |
| `LEMONSQUEEZY_STORE_ID` | ${lemonsqueezy_store_id} |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | ${lemonsqueezy_webhook_secret} |
| `HOSTED_ON_BIGCAPITAL_CLOUD` | ${hosted_on_bigcapital_cloud} |
| `NEW_RELIC_DISTRIBUTED_TRACING_ENABLED` | ${new_relic_distributed_tracing_enabled} |
| `NEW_RELIC_LOG` | ${new_relic_log} |
| `NEW_RELIC_AI_MONITORING_ENABLED` | ${new_relic_ai_monitoring_enabled} |
| `NEW_RELIC_CUSTOM_INSIGHTS_EVENTS_MAX_SAMPLES_STORED` | ${new_relic_custom_insights_events_max_samples_stored} |
| `NEW_RELIC_SPAN_EVENTS_MAX_SAMPLES_STORED` | ${new_relic_span_events_max_samples_stored} |
| `NEW_RELIC_LICENSE_KEY` | ${new_relic_license_key} |
| `NEW_RELIC_APP_NAME` | ${new_relic_app_name} |
| `S3_REGION` | ${s3_region} |
| `S3_ACCESS_KEY_ID` | ${s3_access_key_id} |
| `S3_SECRET_ACCESS_KEY` | ${s3_secret_access_key} |
| `S3_ENDPOINT` | ${s3_endpoint} |
| `S3_BUCKET` | ${s3_bucket} |
| `MYSQL_DATABASE` | ${system_db_name} |
| `MYSQL_USER` | ${db_user} |
| `MYSQL_PASSWORD` | ${db_password} |
| `MYSQL_ROOT_PASSWORD` | ${db_root_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `webapp` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  webapp:
    image: bigcapitalhq/webapp:latest
    restart: unless-stopped
    depends_on:
      - server
    ports:
      - '80'


  server:
    image: bigcapitalhq/server:latest
    restart: unless-stopped
    depends_on:
      mysql:
        condition: service_healthy
      mongo:
        condition: service_started
      redis:
        condition: service_started
    ports:
      - '3000'

    environment:
      # Mail
      - MAIL_HOST=${MAIL_HOST}
      - MAIL_USERNAME=${MAIL_USERNAME}
      - MAIL_PASSWORD=${MAIL_PASSWORD}
      - MAIL_PORT=${MAIL_PORT}
      - MAIL_SECURE=${MAIL_SECURE}
      - MAIL_FROM_NAME=${MAIL_FROM_NAME}
      - MAIL_FROM_ADDRESS=${MAIL_FROM_ADDRESS}
      # Database
      - DB_HOST=mysql
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_CHARSET=${DB_CHARSET}
      # System database
      - SYSTEM_DB_NAME=${SYSTEM_DB_NAME}
      # Tenants databases
      - TENANT_DB_NAME_PERFIX=${TENANT_DB_NAME_PERFIX}
      # Authentication
      - JWT_SECRET=${JWT_SECRET}
      # MongoDB
      - MONGODB_DATABASE_URL=mongodb://mongo/bigcapital
      # Application
      - BASE_URL=${BASE_URL}
      # Agendash
      - AGENDASH_AUTH_USER=${AGENDASH_AUTH_USER}
      - AGENDASH_AUTH_PASSWORD=${AGENDASH_AUTH_PASSWORD}
      # Sign-up restrictions
      - SIGNUP_DISABLED=${SIGNUP_DISABLED}
      - SIGNUP_ALLOWED_DOMAINS=${SIGNUP_ALLOWED_DOMAINS}
      - SIGNUP_ALLOWED_EMAILS=${SIGNUP_ALLOWED_EMAILS}
      # Sign-up email confirmation
      - SIGNUP_EMAIL_CONFIRMATION=${SIGNUP_EMAIL_CONFIRMATION}
      # Gotenberg (Pdf generator)
      - GOTENBERG_URL=${GOTENBERG_URL}
      - GOTENBERG_DOCS_URL=${GOTENBERG_DOCS_URL}
      # Exchange Rate
      - EXCHANGE_RATE_SERVICE=${EXCHANGE_RATE_SERVICE}
      - OPEN_EXCHANGE_RATE_APP_ID=${OPEN_EXCHANGE_RATE_APP_ID}
      # Bank Sync
      - BANKING_CONNECT=${BANKING_CONNECT}
      # Plaid
      - PLAID_ENV=${PLAID_ENV}
      - PLAID_CLIENT_ID=${PLAID_CLIENT_ID}
      - PLAID_SECRET=${PLAID_SECRET}
      - PLAID_LINK_WEBHOOK=${PLAID_LINK_WEBHOOK}
      # Lemon Squeez
      - LEMONSQUEEZY_API_KEY=${LEMONSQUEEZY_API_KEY}
      - LEMONSQUEEZY_STORE_ID=${LEMONSQUEEZY_STORE_ID}
      - LEMONSQUEEZY_WEBHOOK_SECRET=${LEMONSQUEEZY_WEBHOOK_SECRET}
      - HOSTED_ON_BIGCAPITAL_CLOUD=${HOSTED_ON_BIGCAPITAL_CLOUD}
      # New Relic metrics tracking
      - NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=${NEW_RELIC_DISTRIBUTED_TRACING_ENABLED}
      - NEW_RELIC_LOG=${NEW_RELIC_LOG}
      - NEW_RELIC_AI_MONITORING_ENABLED=${NEW_RELIC_AI_MONITORING_ENABLED}
      - NEW_RELIC_CUSTOM_INSIGHTS_EVENTS_MAX_SAMPLES_STORED=${NEW_RELIC_CUSTOM_INSIGHTS_EVENTS_MAX_SAMPLES_STORED}
      - NEW_RELIC_SPAN_EVENTS_MAX_SAMPLES_STORED=${NEW_RELIC_SPAN_EVENTS_MAX_SAMPLES_STORED}
      - NEW_RELIC_LICENSE_KEY=${NEW_RELIC_LICENSE_KEY}
      - NEW_RELIC_APP_NAME=${NEW_RELIC_APP_NAME}
      # S3
      - S3_REGION=${S3_REGION}
      - S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}
      - S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}
      - S3_ENDPOINT=${S3_ENDPOINT}
      - S3_BUCKET=${S3_BUCKET}

  mysql:
    image: mariadb:10.11
    restart: unless-stopped
    environment:
      - MYSQL_DATABASE=${SYSTEM_DB_NAME}
      - MYSQL_USER=${DB_USER}
      - MYSQL_PASSWORD=${DB_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
    volumes:
      - mysql:/var/lib/mysql
    ports:
      - '3306'

    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h localhost -u root -p$$MYSQL_ROOT_PASSWORD || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  mongo:
    image: mongo:7
    restart: unless-stopped
    ports:
      - '27017'
    volumes:
      - mongo:/data/db


  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - '6379'
    volumes:
      - redis:/data

    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  gotenberg:
    image: gotenberg/gotenberg:7
    restart: unless-stopped
    ports:
      - '9000'


volumes:
  mysql:
    name: bigcapital_mysql
    driver: local
  mongo:
    name: bigcapital_mongo
    driver: local
  redis:
    name: bigcapital_redis
    driver: local
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
