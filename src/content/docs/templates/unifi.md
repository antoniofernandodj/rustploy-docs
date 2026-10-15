---
title: Hospedar Unifi com Rustploy
description: "Aplicação Unifi. Crie Unifi em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Unifi**: Aplicação Unifi. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `unifi` |
| **Containers** | 2 (`unifi-network-application`, `unifi-db`) |
| **Imagens** | `lscr.io/linuxserver/unifi-network-application:latest`, `mongo:4.4` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Unifi** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `init-mongo.sh`

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
