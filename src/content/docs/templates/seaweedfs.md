---
title: Hospedar SeaweedFS com Rustploy
description: "Sistema de arquivos distribuído veloz com suporte a mounts POSIX e WebDAV. Crie SeaweedFS em um clique no Rustploy: 4 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**SeaweedFS**: Sistema de arquivos distribuído veloz com suporte a mounts POSIX e WebDAV. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `seaweedfs` |
| **Containers** | 4 (`master`, `volume`, `filer`, `s3`) |
| **Imagens** | `chrislusf/seaweedfs:4.02` |
| **Porta da interface** | 8888, no serviço `filer` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **SeaweedFS** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `filer_domain` | filer.*domínio (gerado; troque pelo seu)* |
| `master_domain` | master.*domínio (gerado; troque pelo seu)* |
| `s3_domain` | s3.*domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `S3_ACCESS_KEY` | admin |
| `S3_SECRET_KEY` | *senha aleatória de 16 caracteres* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `filer` | 8888 | ${filer_domain} |
| `master` | 9333 | ${master_domain} |
| `s3` | 8333 | ${s3_domain} |

## docker-compose.yml do template

```yaml
services:
  master:
    image: chrislusf/seaweedfs:4.02
    command: >
      -v=0
      master
      -volumeSizeLimitMB=10240
      -ip=master
      -ip.bind=0.0.0.0
      -port=9333
      -mdir=/data/master
    volumes:
      - seaweedfs-master:/data/master
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:9333"]
      interval: 30s
      timeout: 10s
      retries: 3
    expose:
      - 9333
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  volume:
    image: chrislusf/seaweedfs:4.02
    command: >
      -v=0
      volume
      -mserver="master:9333"
      -port=8080
      -dir=/data/volume
      -max=100
    volumes:
      - seaweedfs-volume:/data/volume
    depends_on:
      master:
        condition: service_healthy
    restart: unless-stopped
    expose:
      - 8080
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

  filer:
    image: chrislusf/seaweedfs:4.02
    command: >
      -v=0
      filer
      -defaultReplicaPlacement=000
      -master="master:9333"
      -ip=filer
      -ip.bind=0.0.0.0
      -port=8888
    environment:
      - WEED_MASTER=master:9333
    volumes:
      - seaweedfs-filer:/data
    depends_on:
      - master
      - volume
    restart: unless-stopped
    # # Secure the GUI with username/password
    # labels:
    #   # htpasswd -nb admin admin
    #   - "traefik.http.middlewares.basic-auth.basicauth.users=admin:$$apr1$$aLLYxhdC$$ZAW26eJfBRC8qWjCkcZns."
    #   - "traefik.http.routers.service-name.middlewares=basic-auth"
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:8888"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
    expose:
      - 8888

  s3:
    image: chrislusf/seaweedfs:4.02
    command: >
      -v=0
      s3
      -filer="filer:8888"
      -ip.bind=0.0.0.0
      -port=8333
    environment:
      - AWS_ACCESS_KEY_ID=${S3_ACCESS_KEY}
      - AWS_SECRET_ACCESS_KEY=${S3_SECRET_KEY}
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    expose:
      - 8333

volumes:
  seaweedfs-master:
  seaweedfs-volume:
  seaweedfs-filer:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
