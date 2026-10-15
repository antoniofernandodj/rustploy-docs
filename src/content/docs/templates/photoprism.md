---
title: Hospedar Photoprism com Rustploy
description: "Organizador inteligente de fotos movido a IA para identificação automática de objetos e rostos. Crie Photoprism em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Photoprism**: Organizador inteligente de fotos movido a IA para identificação automática de objetos e rostos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `photoprism` |
| **Containers** | 2 (`photoprism`, `mariadb`) |
| **Imagens** | `photoprism/photoprism:latest`, `mariadb:11` |
| **Porta da interface** | 2342, no serviço `photoprism` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Photoprism** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `admin_password` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `BASE_URL` | http://${main_domain} |
| `ADMIN_PASSWORD` | ${admin_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `photoprism` | 2342 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  photoprism:
    image: photoprism/photoprism:latest
    stop_grace_period: 10s
    depends_on:
      - mariadb
    security_opt:
      - seccomp:unconfined
      - apparmor:unconfined

    environment:
      PHOTOPRISM_ADMIN_USER: "admin"
      PHOTOPRISM_ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      PHOTOPRISM_AUTH_MODE: "password"
      PHOTOPRISM_SITE_URL: "http://localhost:2342/"
      PHOTOPRISM_DISABLE_TLS: "false"
      PHOTOPRISM_DEFAULT_TLS: "false"
      PHOTOPRISM_ORIGINALS_LIMIT: 5000               # file size limit for originals in MB (increase for high-res video)
      PHOTOPRISM_HTTP_COMPRESSION: "gzip"
      PHOTOPRISM_LOG_LEVEL: "info"                   # log level: trace, debug, info, warning, error, fatal, or panic
      PHOTOPRISM_READONLY: "false"
      PHOTOPRISM_EXPERIMENTAL: "false"
      PHOTOPRISM_DISABLE_CHOWN: "false"
      PHOTOPRISM_DISABLE_WEBDAV: "false"
      PHOTOPRISM_DISABLE_SETTINGS: "false"
      PHOTOPRISM_DISABLE_TENSORFLOW: "false"
      PHOTOPRISM_DISABLE_FACES: "false"
      PHOTOPRISM_DISABLE_CLASSIFICATION: "false"
      PHOTOPRISM_DISABLE_VECTORS: "false"
      PHOTOPRISM_DISABLE_RAW: "false"
      PHOTOPRISM_RAW_PRESETS: "false"
      PHOTOPRISM_SIDECAR_YAML: "true"
      PHOTOPRISM_BACKUP_ALBUMS: "true"
      PHOTOPRISM_BACKUP_DATABASE: "true"
      PHOTOPRISM_BACKUP_SCHEDULE: "daily"
      PHOTOPRISM_INDEX_SCHEDULE: ""
      PHOTOPRISM_AUTO_INDEX: 300
      PHOTOPRISM_AUTO_IMPORT: -1
      PHOTOPRISM_DETECT_NSFW: "false"
      PHOTOPRISM_UPLOAD_NSFW: "true"
      PHOTOPRISM_DATABASE_DRIVER: "mysql"
      PHOTOPRISM_DATABASE_SERVER: "mariadb:3306"
      PHOTOPRISM_DATABASE_NAME: "photoprism"
      PHOTOPRISM_DATABASE_USER: "photoprism"
      PHOTOPRISM_DATABASE_PASSWORD: "insecure"
      PHOTOPRISM_SITE_CAPTION: "AI-Powered Photos App"
      PHOTOPRISM_SITE_DESCRIPTION: ""
      PHOTOPRISM_SITE_AUTHOR: ""
    working_dir:
      "/photoprism"
    volumes:
      - pictures:/photoprism/originals
      - storage-data:/photoprism/storage

  mariadb:
    image: mariadb:11
    restart: unless-stopped
    stop_grace_period: 5s

    security_opt:
      - seccomp:unconfined
      - apparmor:unconfined
    volumes:
      - db-data:/var/lib/mysql
    environment:
      MARIADB_AUTO_UPGRADE: "1"
      MARIADB_INITDB_SKIP_TZINFO: "1"
      MARIADB_DATABASE: "photoprism"
      MARIADB_USER: "photoprism"
      MARIADB_PASSWORD: "insecure"
      MARIADB_ROOT_PASSWORD: "insecure"

volumes:
  db-data:
  storage-data:
  pictures:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
