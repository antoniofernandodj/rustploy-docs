---
title: Hospedar RustFS com Rustploy
description: "Sistema de arquivos distribuído S3-compatible escrito em Rust de altíssima performance. Crie RustFS em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**RustFS**: Sistema de arquivos distribuído S3-compatible escrito em Rust de altíssima performance. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `rustfs` |
| **Containers** | 1 (`rustfs`) |
| **Imagens** | `rustfs/rustfs:latest` |
| **Porta da interface** | 9001, no serviço `rustfs` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **RustFS** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `console_domain` | *domínio (gerado; troque pelo seu)* |
| `api_domain` | *domínio (gerado; troque pelo seu)* |
| `access_key` | rustfsadmin |
| `secret_key` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `RUSTFS_ACCESS_KEY` | ${access_key} |
| `RUSTFS_SECRET_KEY` | ${secret_key} |
| `` |  |
| `## SET THE API URL IN CONSOLE CONFIG BY CLICKING THE COG` |  |
| `## API URL: ${api_domain}` |  |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `rustfs` | 9001 | ${console_domain} |
| `rustfs` | 9000 | ${api_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  rustfs:
    image: rustfs/rustfs:latest
    volumes:
      - rustfs-data:/data
    environment:
      - RUSTFS_ACCESS_KEY
      - RUSTFS_SECRET_KEY
      - RUSTFS_ADDRESS=0.0.0.0:9000
      - RUSTFS_CONSOLE_ADDRESS=0.0.0.0:9001
      - RUSTFS_CONSOLE_ENABLE=true
      - RUSTFS_CORS_ALLOWED_ORIGINS=*
      - RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS=*
    command: /data
    restart: unless-stopped

volumes:
  rustfs-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
