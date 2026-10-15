---
title: Hospedar Spacedrive com Rustploy
description: "Gerenciador de arquivos cross-platform estruturado sob um sistema virtual distribuído (VDFS) em Rust. Crie Spacedrive em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Spacedrive**: Gerenciador de arquivos cross-platform estruturado sob um sistema virtual distribuído (VDFS) em Rust. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `spacedrive` |
| **Containers** | 1 (`server`) |
| **Imagens** | `ghcr.io/spacedriveapp/spacedrive/server:latest` |
| **Porta da interface** | 8080, no serviço `server` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Spacedrive** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_key` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SD_USERNAME` | admin |
| `SD_PASSWORD` | ${secret_key} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `server` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  server:
    image: ghcr.io/spacedriveapp/spacedrive/server:latest
    ports:
      - 8080
    environment:
      - SD_AUTH=${SD_USERNAME}:${SD_PASSWORD}
    volumes:
      - /var/spacedrive:/var/spacedrive
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
