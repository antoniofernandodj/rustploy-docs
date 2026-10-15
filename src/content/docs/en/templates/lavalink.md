---
title: Host Lavalink with Rustploy
description: "Standalone Java-based audio and music streaming server. Create Lavalink in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Lavalink**: Standalone Java-based audio and music streaming server. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `lavalink` |
| **Containers** | 2 (`fix-perms`, `lavalink`) |
| **Images** | `busybox:1.36`, `ghcr.io/lavalink-devs/lavalink:4` |
| **UI port** | 2333, on service `lavalink` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Lavalink** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `server_port` | 2333 |
| `lavalink_server_password` | *random password* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `_JAVA_OPTIONS` | -Xmx6G |
| `LAVALINK_SERVER_PASSWORD` | ${lavalink_server_password} |
| `SERVER_PORT` | ${server_port} |

## Domains

| Service | Port | Host |
|---|---|---|
| `lavalink` | 2333 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `./application.yml`

## The template docker-compose.yml

```yaml
services:
  fix-perms:
    image: busybox:1.36
    command: >
      sh -c "mkdir -p /opt/Lavalink/plugins &&
             chmod -R 0777 /opt/Lavalink/plugins || true &&
             chown -R 1000:1000 /opt/Lavalink/plugins || true &&
             echo perms-fixed && sleep 1"
    volumes:
      - "../files/plugins/:/opt/Lavalink/plugins/"
      - "../files/application.yml:/opt/Lavalink/application.yml"
    restart: "no"
  lavalink:
    image: ghcr.io/lavalink-devs/lavalink:4
    depends_on:
      - fix-perms
    restart: unless-stopped
    environment:
      _JAVA_OPTIONS: "${_JAVA_OPTIONS:--Xmx6G}"
      LAVALINK_SERVER_PASSWORD: "${LAVALINK_SERVER_PASSWORD:-youshallnotpass}"
      SERVER_PORT: "${SERVER_PORT:-2333}"
    volumes:
      - "../files/application.yml:/opt/Lavalink/application.yml:rw"
      - "../files/plugins/:/opt/Lavalink/plugins/:rw"
    ports:
      - ${SERVER_PORT}

    healthcheck:
      test: >
        sh -c 'wget --header="Authorization: ${LAVALINK_SERVER_PASSWORD}" -qO- http://127.0.0.1:${SERVER_PORT}/v4/info >/dev/null 2>&1 || exit 1'
      interval: 100s
      timeout: 5s
      retries: 5
      start_period: 30s

    entrypoint: >
      sh -c 'until [ -w /opt/Lavalink/plugins ] ; do
                echo "waiting for /opt/Lavalink/plugins to be writable";
                sleep 1;
             done;
             exec java -jar /opt/Lavalink/Lavalink.jar'
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
