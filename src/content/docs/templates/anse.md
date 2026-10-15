---
title: Hospedar Anse com Rustploy
description: "Interface web para chat com IA compatível com a API da OpenAI. Crie Anse em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Anse**: Interface web para chat com IA compatível com a API da OpenAI. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `anse` |
| **Containers** | 1 (`anse-demo`) |
| **Imagens** | `ddiu8081/anse:latest` |
| **Porta da interface** | 3000, no serviço `anse-demo` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Anse** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_key` | *senha aleatória de 32 caracteres* |
| `site_password` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `OPENAI_API_KEY` |  |
| `OPENAI_API_BASE_URL` | https://api.openai.com |
| `HEAD_SCRIPTS` |  |
| `SECRET_KEY` | ${secret_key} |
| `SITE_PASSWORD` | ${site_password} |
| `OPENAI_API_MODEL` | gpt-4o-mini |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `anse-demo` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  anse-demo:
    image: ddiu8081/anse:latest
    restart: always
    expose:
      - 3000
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OPENAI_API_BASE_URL=${OPENAI_API_BASE_URL}
      - HEAD_SCRIPTS=${HEAD_SCRIPTS}
      - SECRET_KEY=${SECRET_KEY}
      - SITE_PASSWORD=${SITE_PASSWORD}
      - OPENAI_API_MODEL=${OPENAI_API_MODEL}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
