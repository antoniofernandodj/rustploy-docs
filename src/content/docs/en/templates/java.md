---
title: Host Java with Rustploy
description: "Java application. Create Java in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Java**: Java application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `java` |
| **Containers** | 1 (`java-app`) |
| **Images** | `ghcr.io/pterodactyl/yolks:java_${JAVA_VERSION}` |
| **UI port** | 25565, on service `java-app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Java** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `java_version` | 21 |
| `server_port` | 25565 |
| `startup_command` | java -Xmx1024M -Xms512M -jar server.jar nogui |
| `server_jarfile` | server.jar |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `JAVA_VERSION` | ${java_version} |
| `SERVER_PORT` | ${server_port} |
| `STARTUP_COMMAND` | ${startup_command} |
| `SERVER_JARFILE` | ${server_jarfile} |

## Domains

| Service | Port | Host |
|---|---|---|
| `java-app` | 25565 | *domain (generated; replace it with yours)* |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/home/container/server.properties`

## The template docker-compose.yml

```yaml
services:
  java-app:
    image: ghcr.io/pterodactyl/yolks:java_${JAVA_VERSION}
    restart: unless-stopped
    stdin_open: true
    tty: true
    volumes:
      - app-data:/home/container
    working_dir: /home/container
    environment:
      - STARTUP=${STARTUP_COMMAND}
      - SERVER_JARFILE=${SERVER_JARFILE}
      - JAVA_VERSION=${JAVA_VERSION}
    ports:
      - ${SERVER_PORT}
    user: container

volumes:
  app-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
