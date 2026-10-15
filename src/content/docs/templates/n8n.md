---
title: Hospedar n8n com Rustploy
description: "Plataforma low-code avançada para automação de tarefas e fluxos complexos de integração. Crie n8n em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**n8n**: Plataforma low-code avançada para automação de tarefas e fluxos complexos de integração. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `n8n` |
| **Containers** | 1 (`n8n`) |
| **Imagens** | `docker.n8n.io/n8nio/n8n:1.104.0` |
| **Porta da interface** | 5678, no serviço `n8n` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **n8n** e selecione.
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
| `N8N_HOST` | ${main_domain} |
| `N8N_PORT` | 5678 |
| `GENERIC_TIMEZONE` | Europe/Berlin |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `n8n` | 5678 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n:1.104.0
    restart: always
    environment:
      - N8N_HOST=${N8N_HOST}
      - N8N_PORT=${N8N_PORT}
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - WEBHOOK_URL=https://${N8N_HOST}/
      - GENERIC_TIMEZONE=${GENERIC_TIMEZONE}
      - N8N_SECURE_COOKIE=false
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
