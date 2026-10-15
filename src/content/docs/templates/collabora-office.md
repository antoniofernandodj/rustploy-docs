---
title: Hospedar Collabora Office com Rustploy
description: "Suíte de escritório online poderosa baseada no LibreOffice. Crie Collabora Office em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Collabora Office**: Suíte de escritório online poderosa baseada no LibreOffice. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `collabora-office` |
| **Containers** | 1 (`collabora`) |
| **Imagens** | `collabora/code:latest` |
| **Porta da interface** | 9980, no serviço `collabora` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Collabora Office** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `DOMAIN` | *domínio (gerado; troque pelo seu)* |
| `USERNAME` | user |
| `PASSWORD` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DOMAIN` | ${DOMAIN} |
| `USERNAME` | ${USERNAME} |
| `PASSWORD` | ${PASSWORD} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `collabora` | 9980 | *domínio (gerado; troque pelo seu)* |

## docker-compose.yml do template

```yaml
version: "3"

services:
  collabora:
    image: collabora/code:latest
    ports:
      - "9980"
    environment:
      - domain=${DOMAIN}
      - username=${USERNAME}
      - password=${PASSWORD}
      - extra_params=--o:ssl.enable=false
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
