---
title: Hospedar Parseable com Rustploy
description: "Sistema de análise de logs e observabilidade nativo para armazenamento de objetos. Crie Parseable em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Parseable**: Sistema de análise de logs e observabilidade nativo para armazenamento de objetos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `parseable` |
| **Containers** | 1 (`parseable`) |
| **Imagens** | `parseable/parseable:v1.6.0` |
| **Porta da interface** | 8000, no serviço `parseable` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Parseable** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `parseable_username` | *usuário gerado* |
| `parseable_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `PARSEABLE_USERNAME` | ${parseable_username} |
| `PARSEABLE_PASSWORD` | ${parseable_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `parseable` | 8000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  parseable:
    image: parseable/parseable:v1.6.0
    command: parseable local-store
    restart: unless-stopped
    volumes:
      - parseable-staging:/parseable/staging
      - parseable-data:/parseable/data
    environment:
      - P_ADDR=0.0.0.0:8000
      - P_USERNAME=${PARSEABLE_USERNAME}
      - P_PASSWORD=${PARSEABLE_PASSWORD}
      - P_STAGING_DIR=/parseable/staging
      - P_FS_DIR=/parseable/data
    ports:
      - 8000
      - 8001
      - 8002
volumes:
  parseable-staging: {}
  parseable-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
