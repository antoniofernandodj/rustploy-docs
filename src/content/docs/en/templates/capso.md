---
title: Host Cap.so with Rustploy
description: "Complete environment for web applications with MySQL and S3 support. Create Cap.so in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Cap.so**: Complete environment for web applications with MySQL and S3 support. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `capso` |
| **Containers** | 3 (`cap-web`, `ps-mysql`, `minio`) |
| **Images** | `ghcr.io/capsoftware/cap-web:latest`, `mysql:8.0`, `quay.io/minio/minio:RELEASE.2025-05-24T17-08-30Z` |
| **UI port** | 3000, on service `cap-web` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Cap.so** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `minio_domain_1` | *domain (generated; replace it with yours)* |
| `minio_domain_2` | *domain (generated; replace it with yours)* |
| `mysql_database` | planetscale |
| `mysql_user` | root |
| `cap_aws_bucket` | capso |
| `cap_aws_region` | us-east-1 |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DOMAIN` | ${main_domain} |
| `MYSQL_DATABASE` | ${mysql_database} |
| `MYSQL_USER` | ${mysql_user} |
| `MYSQL_PASSWORD` | *random password, 32 characters* |
| `MYSQL_ROOT_PASSWORD` | *random password, 32 characters* |
| `DATABASE_ENCRYPTION_KEY` | *random password, 32 characters* |
| `NEXTAUTH_SECRET` | *random password, 32 characters* |
| `CAP_AWS_ACCESS_KEY` | *random password, 16 characters* |
| `CAP_AWS_SECRET_KEY` | *random password, 16 characters* |
| `CAP_AWS_BUCKET` | ${cap_aws_bucket} |
| `CAP_AWS_REGION` | ${cap_aws_region} |
| `MINIO_ROOT_USER` | *random password, 16 characters* |
| `MINIO_ROOT_PASSWORD` | *random password, 16 characters* |

## Domains

| Service | Port | Host |
|---|---|---|
| `cap-web` | 3000 | ${main_domain} |
| `minio` | 3902 | minio_domain_1 |
| `minio` | 3903 | minio_domain_2 |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  cap-web:
    image: ghcr.io/capsoftware/cap-web:latest
    restart: unless-stopped
    environment:
      DATABASE_URL: 'mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@ps-mysql:3306/${MYSQL_DATABASE}?ssl={"rejectUnauthorized":false}'
      WEB_URL: "http://${DOMAIN}:3000"
      NEXTAUTH_URL: "http://${DOMAIN}:3000"
      DATABASE_ENCRYPTION_KEY: ${DATABASE_ENCRYPTION_KEY}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      CAP_AWS_ACCESS_KEY: ${CAP_AWS_ACCESS_KEY}
      CAP_AWS_SECRET_KEY: ${CAP_AWS_SECRET_KEY}
      CAP_AWS_BUCKET: ${CAP_AWS_BUCKET}
      CAP_AWS_REGION: ${CAP_AWS_REGION}
      S3_PUBLIC_ENDPOINT: "http://${DOMAIN}:3902"
      S3_INTERNAL_ENDPOINT: "http://minio:3902"
    expose:
      - 3000
    depends_on:
      - ps-mysql
      - minio

  ps-mysql:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_ROOT_HOST: "%"
    command:
      - --max_connections=1000
      - --default-authentication-plugin=mysql_native_password
    expose:
      - 3306
    volumes:
      - ps-mysql:/var/lib/mysql

  minio:
    image: quay.io/minio/minio:RELEASE.2025-05-24T17-08-30Z
    restart: unless-stopped
    command: server /bitnami/minio/data --address ":3902" --console-address ":3903"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    expose:
      - 3902
      - 3903
    volumes:
      - minio-data:/bitnami/minio/data
      - minio-certs:/certs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3902/minio/health/ready"]
      interval: 30s
      timeout: 20s
      retries: 3

volumes:
  ps-mysql:
    driver: local
  minio-data:
    driver: local
  minio-certs:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
