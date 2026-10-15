---
title: Host Unifi with Rustploy
description: "Unifi application. Create Unifi in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Unifi**: Unifi application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `unifi` |
| **Containers** | 2 (`unifi-network-application`, `unifi-db`) |
| **Images** | `lscr.io/linuxserver/unifi-network-application:latest`, `mongo:4.4` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Unifi** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `init-mongo.sh`

## The template docker-compose.yml

```yaml
services:
  unifi-network-application:
    image: lscr.io/linuxserver/unifi-network-application:latest
    environment:
      - PUID=1000 # User ID
      - PGID=1000 # Group ID
      - TZ=Etc/UTC # Timezone
      - MONGO_HOST=unifi-db
      - MONGO_USER=unifi
      - MONGO_PASS=unifi_password
      - MONGO_PORT=27017
      - MONGO_DBNAME=unifi
      - MEM_LIMIT=1024
      - MEM_STARTUP=1024
      - MONGO_TLS= #optional  # MongoDB TLS setting
      - MONGO_AUTHSOURCE= #optional  # MongoDB authentication source
    volumes: # Volumes to mount in the container
      - ../files/config:/config # Map host directory to container directory
    ports:
      - 8443:8443 # HTTPS portal
      # - 3478:3478/udp # STUN service
      # - 10001:10001/udp # UniFi AP discovery
      # - 8080:8080 # HTTP portal
      # - 1900:1900/udp #optional  # For DLNA
      # - 8843:8843 #optional  # HTTPS guest portal
      # - 8880:8880 #optional  # HTTP guest portal
      # - 6789:6789 #optional  # Mobile speed test port
      # - 5514:5514/udp #optional  # Remote syslog port
    restart: unless-stopped
    depends_on:
      - unifi-db


  unifi-db:
    image: mongo:4.4
    volumes:
      - ../files/db/data:/data/db
      - ../files/init-mongo.sh:/docker-entrypoint-initdb.d/init-mongo.sh:ro
    ports:
      - 27017
    restart: unless-stopped
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
