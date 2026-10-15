---
title: Hospedar Mage AI com Rustploy
description: "Ferramenta moderna de engenharia de dados para construir, rodar e monitorar pipelines. Crie Mage AI em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Mage AI**: Ferramenta moderna de engenharia de dados para construir, rodar e monitorar pipelines. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `mage-ai` |
| **Containers** | 1 (`mage-ai`) |
| **Imagens** | `mageai/mageai:0.9.78` |
| **Porta da interface** | 6789, no serviço `mage-ai` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Mage AI** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `PROJECT_NAME` | mage-ai |
| `ENV` | production |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `mage-ai` | 6789 | ${main_domain} |

## docker-compose.yml do template

```yaml
# https://docs.mage.ai/getting-started/setup#docker-compose
#
# The default credentials are:
#     USERNAME: admin@admin.com
#     PASSWORD: admin

services:
  mage-ai:
    image: mageai/mageai:0.9.78
    command: mage start ${PROJECT_NAME}
    environment:
      USER_CODE_PATH: /home/src/${PROJECT_NAME}
      ENV: ${ENV}
    expose:
      - 6789
    volumes:
      - mageai_data:/home/src/
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-s", "-f", "-o", "/dev/null", "http://localhost:6789"]
      interval: 30s
      timeout: 10s
      retries: 5

volumes:
  mageai_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
