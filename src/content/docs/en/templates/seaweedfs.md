---
title: Host SeaweedFS with Rustploy
description: "Fast distributed file system with POSIX mount and WebDAV support. Create SeaweedFS in one click on Rustploy: 4 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**SeaweedFS**: Fast distributed file system with POSIX mount and WebDAV support. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `seaweedfs` |
| **Containers** | 4 (`master`, `volume`, `filer`, `s3`) |
| **Images** | `chrislusf/seaweedfs:4.02` |
| **UI port** | 8888, on service `filer` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **SeaweedFS** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `filer_domain` | filer.*domain (generated; replace it with yours)* |
| `master_domain` | master.*domain (generated; replace it with yours)* |
| `s3_domain` | s3.*domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `S3_ACCESS_KEY` | admin |
| `S3_SECRET_KEY` | *random password, 16 characters* |

## Domains

| Service | Port | Host |
|---|---|---|
| `filer` | 8888 | ${filer_domain} |
| `master` | 9333 | ${master_domain} |
| `s3` | 8333 | ${s3_domain} |

## The template docker-compose.yml

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

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
