---
title: Host Vault with Rustploy
description: "HashiCorp security vault for strict management of secrets and dynamic access. Create Vault in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Vault**: HashiCorp security vault for strict management of secrets and dynamic access. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `vault` |
| **Containers** | 1 (`vault`) |
| **Images** | `hashicorp/vault:latest` |
| **UI port** | 8200, on service `vault` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Vault** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `root_token` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `VAULT_DEV_ROOT_TOKEN_ID` | ${root_token} |
| `VAULT_DEV_LISTEN_ADDRESS` | 0.0.0.0:8200 |

## Domains

| Service | Port | Host |
|---|---|---|
| `vault` | 8200 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  vault:
    image: hashicorp/vault:latest
    container_name: vault
    cap_add:
      - IPC_LOCK
    environment:
      VAULT_DEV_ROOT_TOKEN_ID: "${VAULT_DEV_ROOT_TOKEN_ID}"
      VAULT_DEV_LISTEN_ADDRESS: "${VAULT_DEV_LISTEN_ADDRESS}"
    ports:
      - "8200"
    volumes:
      - vault-data:/vault/file
    command: "server -dev -dev-root-token-id=${VAULT_DEV_ROOT_TOKEN_ID} -dev-listen-address=${VAULT_DEV_LISTEN_ADDRESS}"

volumes:
  vault-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
