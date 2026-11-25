---
title: Host Bluesky PDS with Rustploy
description: "Personal Data Server (PDS) for the decentralized Bluesky network. Create Bluesky PDS in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Bluesky PDS**: Personal Data Server (PDS) for the decentralized Bluesky network. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `bluesky-pds` |
| **Containers** | 1 (`pds`) |
| **Images** | `ghcr.io/bluesky-social/pds:0.4.182` |
| **UI port** | 3000, on service `pds` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Bluesky PDS** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `admin_password` | *random password, 32 characters* |
| `jwt_secret` | *generated JWT* |
| `rotation_key` | *generated JWT* |
| `data_directory` | /pds |
| `blob_upload_limit` | 104857600 |
| `log_enabled` | true |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `PDS_ADMIN_PASSWORD` | ${admin_password} |
| `PDS_HOSTNAME` | ${main_domain} |
| `PDS_JWT_SECRET` | *generated JWT* |
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

## Domains

| Service | Port | Host |
|---|---|---|
| `pds` | 3000 | ${main_domain} |

## The template docker-compose.yml

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

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
