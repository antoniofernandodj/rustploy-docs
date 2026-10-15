---
title: Host Minio with Rustploy
description: "Distributed object storage server 100% compatible with the AWS S3 API. Create Minio in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Minio**: Distributed object storage server 100% compatible with the AWS S3 API. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `minio` |
| **Containers** | 1 (`minio`) |
| **Images** | `minio/minio` |
| **UI port** | 9001, on service `minio` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Minio** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `api_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `MINIO_ROOT_USER` | minioadmin |
| `MINIO_ROOT_PASSWORD` | *random password, 16 characters* |
| `MINIO_BROWSER_REDIRECT_URL` | http://${main_domain} |
| `MINIO_BROWSER_REDIRECT` | false |

## Domains

| Service | Port | Host |
|---|---|---|
| `minio` | 9001 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  minio:
    # after RELEASE.2025-04-22T22-12-26Z, minio removed most of the admin UI, if you want to use the admin UI, uncomment the line below
    # image: minio/minio:RELEASE.2025-04-22T22-12-26Z
    # if you uncommented the line above, comment the line below
    image: minio/minio
    restart: unless-stopped
    volumes:
      # by default, the MinIO container will use a volume named minio-data
      # to store its data. This volume is created automatically by Docker.
      # If you want to use a local directory instead, uncomment the line below
      # and specify the path to your local directory.
      # (be warned that ../files is pointing to a subdirectory of /etc/dokploy/compose in dokploy)
      # - ../files/minio-data:/data
      # if you uncommented the line above, comment the line below and the volumes section at the end
      - minio-data:/data
    environment:
      - MINIO_ROOT_USER=${MINIO_ROOT_USER}
      - MINIO_ROOT_PASSWORD=${MINIO_ROOT_PASSWORD}
      - MINIO_BROWSER_REDIRECT_URL=${MINIO_BROWSER_REDIRECT_URL}
    command: server /data --console-address ":9001"
    ports:
      # by default, the MinIO container will use port 9000 to expose its API
      # and port 9001 to expose its web console
      # minio requires port to be specified when making a request to the API
      - 9000:9000
    expose:
      - 9001

# comment the line below if you specified a local directory in the volumes section of the minio service
volumes:
  minio-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
