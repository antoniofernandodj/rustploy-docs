---
title: Hospedar Mailpit com Rustploy
description: "Servidor SMTP falso local focado em testes e inspeção de e-mails de desenvolvimento. Crie Mailpit em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Mailpit**: Servidor SMTP falso local focado em testes e inspeção de e-mails de desenvolvimento. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `mailpit` |
| **Containers** | 1 (`mailpit`) |
| **Imagens** | `axllent/mailpit:v1.22.3` |
| **Porta da interface** | 8025, no serviço `mailpit` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Mailpit** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `default_password` | *senha aleatória* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `mailpit` | 8025 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  mailpit:
    image: axllent/mailpit:v1.22.3
    restart: unless-stopped
    ports:
      - '1025:1025'
    volumes:
      - 'mailpit-data:/data'
    environment:
      - MP_SMTP_AUTH_ALLOW_INSECURE=true
      - MP_MAX_MESSAGES=5000
      - MP_DATABASE=/data/mailpit.db
      - MP_UI_AUTH=${MP_UI_AUTH}
      - MP_SMTP_AUTH=${MP_SMTP_AUTH}
    healthcheck:
      test:
        - CMD
        - /mailpit
        - readyz
      interval: 5s
      timeout: 20s
      retries: 10

volumes:
  mailpit-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
