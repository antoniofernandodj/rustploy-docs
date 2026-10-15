---
title: Host OpenHands with Rustploy
description: "Central environment for orchestrating and deploying autonomous AI agents. Create OpenHands in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**OpenHands**: Central environment for orchestrating and deploying autonomous AI agents. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `openhands` |
| **Containers** | 1 (`openhands`) |
| **Images** | `docker.all-hands.dev/all-hands-ai/openhands:latest` |
| **UI port** | 3000, on service `openhands` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **OpenHands** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `openhands_api_key` | *random password, 64 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SANDBOX_RUNTIME_CONTAINER_IMAGE` | docker.all-hands.dev/all-hands-ai/runtime:0.50-nikolaik |

## Domains

| Service | Port | Host |
|---|---|---|
| `openhands` | 3000 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/.openhands/config.toml`

## The template docker-compose.yml

```yaml
# The 'version' attribute is obsolete and has been removed.
services:
  openhands:
    # Corrected the Docker image to what appears to be the official registry path.
    # This was the cause of the "pull access denied" error.
    image: docker.all-hands.dev/all-hands-ai/openhands:latest
    restart: unless-stopped

    # The port is exposed without mapping. Dokploy handles the routing via the domain.
    ports:
      - "3000"

    # Environment variables are sourced from the template.toml file.
    environment:
      - SANDBOX_RUNTIME_CONTAINER_IMAGE=${SANDBOX_RUNTIME_CONTAINER_IMAGE}
      - WORKSPACE_MOUNT_PATH=/opt/workspace_base

    # Allows the container to communicate with the host's Docker daemon.
    extra_hosts:
      - "host.docker.internal:host-gateway"

    # Volumes for persistent data. Named volumes are used instead of host mounts.
    # The docker socket is mounted to allow OpenHands to manage other containers.
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - openhands-config:/.openhands
      - openhands-workspace:/opt/workspace_base

    # These flags are necessary for the interactive shell functionality of OpenHands.
    stdin_open: true
    tty: true

# Named volumes are defined here to persist configuration and workspace data.
volumes:
  openhands-config: {}
  openhands-workspace: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
