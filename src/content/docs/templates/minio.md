---
title: Hospedar Minio com Rustploy
description: "Servidor de armazenamento de objetos distribuído 100% compatível com a API AWS S3. Crie Minio em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Minio**: Servidor de armazenamento de objetos distribuído 100% compatível com a API AWS S3. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `minio` |
| **Containers** | 1 (`minio`) |
| **Imagens** | `minio/minio` |
| **Porta da interface** | 9001, no serviço `minio` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Minio** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `api_domain` | *domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `MINIO_ROOT_USER` | minioadmin |
| `MINIO_ROOT_PASSWORD` | *senha aleatória de 16 caracteres* |
| `MINIO_BROWSER_REDIRECT_URL` | http://${main_domain} |
| `MINIO_BROWSER_REDIRECT` | false |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `minio` | 9001 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
