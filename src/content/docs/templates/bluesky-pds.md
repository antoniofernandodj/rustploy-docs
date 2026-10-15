---
title: Hospedar Bluesky PDS com Rustploy
description: "Servidor de Dados Pessoais (PDS) para a rede descentralizada Bluesky. Crie Bluesky PDS em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Bluesky PDS**: Servidor de Dados Pessoais (PDS) para a rede descentralizada Bluesky. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `bluesky-pds` |
| **Containers** | 1 (`pds`) |
| **Imagens** | `ghcr.io/bluesky-social/pds:0.4.182` |
| **Porta da interface** | 3000, no serviço `pds` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Bluesky PDS** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `admin_password` | *senha aleatória de 32 caracteres* |
| `jwt_secret` | *JWT gerado* |
| `rotation_key` | *JWT gerado* |
| `data_directory` | /pds |
| `blob_upload_limit` | 104857600 |
| `log_enabled` | true |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `PDS_ADMIN_PASSWORD` | ${admin_password} |
| `PDS_HOSTNAME` | ${main_domain} |
| `PDS_JWT_SECRET` | *JWT gerado* |
| `PDS_PLC_ROTATION_KEY_K256_PRIVATE_KEY_HEX` | ${rotation_key} |
| `PDS_ADMIN_EMAIL` |  |
| `PDS_EMAIL_FROM_ADDRESS` |  |
| `PDS_EMAIL_SMTP_URL` |  |
| `PDS_DATA_DIRECTORY` | ${data_directory} |
| `PDS_BLOBSTORE_DISK_LOCATION` | ${data_directory}/blocks |
| `PDS_BLOB_UPLOAD_LIMIT` | ${blob_upload_limit} |
| `PDS_DID_PLC_URL` | https://plc.directory |
| `PDS_BSKY_APP_VIEW_URL` | https://api.bsky.app |
| `PDS_BSKY_APP_VIEW_DID` | did:web:api.bsky.app |
| `PDS_REPORT_SERVICE_URL` | https://mod.bsky.app/xrpc/com.atproto.moderation.createReport |
| `PDS_REPORT_SERVICE_DID` | did:plc:ar7c4by46qjdydhdevvrndac |
| `PDS_CRAWLERS` | https://bsky.network |
| `LOG_ENABLED` | ${log_enabled} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `pds` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  pds:
    image: 'ghcr.io/bluesky-social/pds:0.4.182'
    volumes:
      - pds-data:/pds
    environment:
      - SERVICE_URL_PDS_3000
      - PDS_HOSTNAME
      - PDS_JWT_SECRET
      - PDS_ADMIN_PASSWORD
      - 'PDS_ADMIN_EMAIL=${PDS_ADMIN_EMAIL}'
      - PDS_PLC_ROTATION_KEY_K256_PRIVATE_KEY_HEX
      - 'PDS_DATA_DIRECTORY=${PDS_DATA_DIRECTORY:-/pds}'
      - 'PDS_BLOBSTORE_DISK_LOCATION=${PDS_DATA_DIRECTORY:-/pds}/blocks'
      - 'PDS_BLOB_UPLOAD_LIMIT=${PDS_BLOB_UPLOAD_LIMIT:-104857600}'
      - 'PDS_DID_PLC_URL=${PDS_DID_PLC_URL:-https://plc.directory}'
      - 'PDS_EMAIL_FROM_ADDRESS=${PDS_EMAIL_FROM_ADDRESS}'
      - 'PDS_EMAIL_SMTP_URL=${PDS_EMAIL_SMTP_URL}'
      - 'PDS_BSKY_APP_VIEW_URL=${PDS_BSKY_APP_VIEW_URL:-https://api.bsky.app}'
      - 'PDS_BSKY_APP_VIEW_DID=${PDS_BSKY_APP_VIEW_DID:-did:web:api.bsky.app}'
      - 'PDS_REPORT_SERVICE_URL=${PDS_REPORT_SERVICE_URL:-https://mod.bsky.app/xrpc/com.atproto.moderation.createReport}'
      - 'PDS_REPORT_SERVICE_DID=${PDS_REPORT_SERVICE_DID:-did:plc:ar7c4by46qjdydhdevvrndac}'
      - 'PDS_CRAWLERS=${PDS_CRAWLERS:-https://bsky.network}'
      - 'LOG_ENABLED=${LOG_ENABLED:-true}'
    command: |
      sh -c '
        set -euo pipefail
        echo "Installing required packages and pdsadmin..."
        apk add --no-cache openssl curl bash jq coreutils gnupg util-linux-misc >/dev/null
        curl -o /usr/local/bin/pdsadmin.sh https://raw.githubusercontent.com/bluesky-social/pds/main/pdsadmin.sh
        chmod 700 /usr/local/bin/pdsadmin.sh
        ln -sf /usr/local/bin/pdsadmin.sh /usr/local/bin/pdsadmin
        echo "Creating an empty pds.env file so pdsadmin works..."
        touch /pds/pds.env
        echo "Launching PDS, enjoy!..."
        exec node --enable-source-maps index.js
      '
    healthcheck:
      test:
        - CMD
        - wget
        - '--spider'
        - 'http://127.0.0.1:3000/xrpc/_health'
      interval: 5s
      timeout: 10s
      retries: 10
volumes: 
  pds-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
