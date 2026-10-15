---
title: Hospedar Vault com Rustploy
description: "Cofre de segurança desenvolvido pela HashiCorp para gerenciamento estrito de segredos e acessos dinâmicos. Crie Vault em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Vault**: Cofre de segurança desenvolvido pela HashiCorp para gerenciamento estrito de segredos e acessos dinâmicos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `vault` |
| **Containers** | 1 (`vault`) |
| **Imagens** | `hashicorp/vault:latest` |
| **Porta da interface** | 8200, no serviço `vault` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Vault** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `root_token` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `VAULT_DEV_ROOT_TOKEN_ID` | ${root_token} |
| `VAULT_DEV_LISTEN_ADDRESS` | 0.0.0.0:8200 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `vault` | 8200 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
