---
title: Hospedar DumbPad com Rustploy
description: "Bloco de notas web simples com proteção por senha. Crie DumbPad em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**DumbPad**: Bloco de notas web simples com proteção por senha. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `dumbpad` |
| **Containers** | 1 (`dumbpad`) |
| **Imagens** | `dumbwareio/dumbpad:latest` |
| **Porta da interface** | 3000, no serviço `dumbpad` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **DumbPad** e selecione.
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
| `NODE_ENV` | production |
| `SITE_TITLE` | DumbPad |
| `BASE_URL` | https://${main_domain} |
| `DUMBPAD_PIN` |  |
| `LOCKOUT_TIME` | 15 |
| `MAX_ATTEMPTS` | 5 |
| `COOKIE_MAX_AGE` | 24 |
| `PAGE_HISTORY_COOKIE_AGE` | 365 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `dumbpad` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  dumbpad:
    image: dumbwareio/dumbpad:latest
    restart: unless-stopped
    ports:
      - 3000
    volumes:
      - dumbpad-data:/app/data

volumes:
  dumbpad-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
