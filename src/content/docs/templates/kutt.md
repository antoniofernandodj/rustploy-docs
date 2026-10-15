---
title: Hospedar Kutt com Rustploy
description: "Encurtador de URLs moderno com suporte a domínios customizados e analytics. Crie Kutt em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Kutt**: Encurtador de URLs moderno com suporte a domínios customizados e analytics. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `kutt` |
| **Containers** | 1 (`kutt`) |
| **Imagens** | `kutt/kutt:main` |
| **Porta da interface** | 3000, no serviço `kutt` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Kutt** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `jwt_secret` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `JWT_SECRET` | *JWT gerado* |
| `DEFAULT_DOMAIN` | ${main_domain} |
| `TRUST_PROXY` | false |
| `DISALLOW_ANONYMOUS_LINKS` | true |
| `CUSTOM_DOMAIN_USE_HTTPS` | true |
| `MAIL_ENABLED` | false |
| `MAIL_HOST` | '' |
| `MAIL_PORT` | '22' |
| `MAIL_SECURE` | true |
| `MAIL_USER` | '' |
| `MAIL_FROM` | '' |
| `MAIL_PASSWORD` | '' |
| `CONTACT_EMAIL` | '' |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `kutt` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  kutt:
    image: kutt/kutt:main
    volumes:
      - kutt_db_data:/var/lib/kutt
      - ./kutt/custom:/kutt/custom
    environment:
      DB_FILENAME: "/var/lib/kutt/data.sqlite"
      JWT_SECRET: ${JWT_SECRET}
      DEFAULT_DOMAIN: ${DEFAULT_DOMAIN}
      TRUST_PROXY: ${TRUST_PROXY}
      DISALLOW_ANONYMOUS_LINKS: ${DISALLOW_ANONYMOUS_LINKS}
      CUSTOM_DOMAIN_USE_HTTPS: ${CUSTOM_DOMAIN_USE_HTTPS}
      MAIL_ENABLED: ${MAIL_ENABLED}
      MAIL_HOST: ${MAIL_HOST}
      MAIL_PORT: ${MAIL_PORT}
      MAIL_SECURE: ${MAIL_SECURE}
      MAIL_USER: ${MAIL_USER}
      MAIL_FROM: ${MAIL_FROM}
      MAIL_PASSWORD: ${MAIL_PASSWORD}
      CONTACT_EMAIL: ${CONTACT_EMAIL}

volumes:
  kutt_db_data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
