---
title: Hospedar Scrypted com Rustploy
description: "Central de processamento de vídeo de segurança com altíssima taxa de quadros e integração NVR. Crie Scrypted em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Scrypted**: Central de processamento de vídeo de segurança com altíssima taxa de quadros e integração NVR. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `scrypted` |
| **Containers** | 1 (`scrypted`) |
| **Imagens** | `ghcr.io/koush/scrypted:latest` |
| **Porta da interface** | 11080, no serviço `scrypted` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Scrypted** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `SCRYPTED_WEBHOOK_UPDATE_AUTHORIZATION` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SCRYPTED_WEBHOOK_UPDATE_AUTHORIZATION` | ${SCRYPTED_WEBHOOK_UPDATE_AUTHORIZATION} |
| `SCRYPTED_WEBHOOK_UPDATE` | http://${main_domain}:10444/v1/update |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `scrypted` | 11080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  scrypted:
    image: ghcr.io/koush/scrypted:latest
    environment:
      - SCRYPTED_WEBHOOK_UPDATE_AUTHORIZATION=${SCRYPTED_WEBHOOK_UPDATE_AUTHORIZATION}
      - SCRYPTED_WEBHOOK_UPDATE=http://${main_domain}:10444/v1/update
    volumes:
      - ../files/scrypted-volume:/server/volume
      # Optional NVR volume, uncomment if needed
      # - ../files/nvr:/nvr
    restart: unless-stopped
    logging:
      driver: "none"
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
