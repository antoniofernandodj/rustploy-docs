---
title: Hospedar Cloudcommander com Rustploy
description: "Aplicação Cloudcommander. Crie Cloudcommander em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Cloudcommander**: Aplicação Cloudcommander. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `cloudcommander` |
| **Containers** | 1 (`cloudcmd`) |
| **Imagens** | `coderaiser/cloudcmd:18.5.1` |
| **Porta da interface** | 80, no serviço `cloudcmd` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Cloudcommander** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domínios**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `USERNAME` | user |
| `PASSWORD` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `USERNAME` | ${USERNAME} |
| `PASSWORD` | ${PASSWORD} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `cloudcmd` | 80 | *domínio (gerado; troque pelo seu)* |

## docker-compose.yml do template

```yaml
version: "3"

services:
  cloudcmd:
    image: coderaiser/cloudcmd:18.5.1
    ports:
      - "80"
    environment:
      - CLOUDCMD_ROOT=/mnt/fs
      - CLOUDCMD_AUTH=true
      - CLOUDCMD_USERNAME=${USERNAME}
      - CLOUDCMD_PASSWORD=${PASSWORD}
    volumes:
      - /root:/root
      - /:/mnt/fs
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
