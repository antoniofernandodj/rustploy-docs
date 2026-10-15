---
title: Hospedar Cap.so com Rustploy
description: "Ambiente completo para aplicações web com suporte a MySQL e S3. Crie Cap.so em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Cap.so**: Ambiente completo para aplicações web com suporte a MySQL e S3. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `capso` |
| **Containers** | 3 (`cap-web`, `ps-mysql`, `minio`) |
| **Imagens** | `ghcr.io/capsoftware/cap-web:latest`, `mysql:8.0`, `quay.io/minio/minio:RELEASE.2025-05-24T17-08-30Z` |
| **Porta da interface** | 3000, no serviço `cap-web` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Cap.so** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `minio_domain_1` | *domínio (gerado; troque pelo seu)* |
| `minio_domain_2` | *domínio (gerado; troque pelo seu)* |
| `mysql_database` | planetscale |
| `mysql_user` | root |
| `cap_aws_bucket` | capso |
| `cap_aws_region` | us-east-1 |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DOMAIN` | ${main_domain} |
| `MYSQL_DATABASE` | ${mysql_database} |
| `MYSQL_USER` | ${mysql_user} |
| `MYSQL_PASSWORD` | *senha aleatória de 32 caracteres* |
| `MYSQL_ROOT_PASSWORD` | *senha aleatória de 32 caracteres* |
| `DATABASE_ENCRYPTION_KEY` | *senha aleatória de 32 caracteres* |
| `NEXTAUTH_SECRET` | *senha aleatória de 32 caracteres* |
| `CAP_AWS_ACCESS_KEY` | *senha aleatória de 16 caracteres* |
| `CAP_AWS_SECRET_KEY` | *senha aleatória de 16 caracteres* |
| `CAP_AWS_BUCKET` | ${cap_aws_bucket} |
| `CAP_AWS_REGION` | ${cap_aws_region} |
| `MINIO_ROOT_USER` | *senha aleatória de 16 caracteres* |
| `MINIO_ROOT_PASSWORD` | *senha aleatória de 16 caracteres* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `cap-web` | 3000 | ${main_domain} |
| `minio` | 3902 | minio_domain_1 |
| `minio` | 3903 | minio_domain_2 |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
