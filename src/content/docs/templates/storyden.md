---
title: Hospedar Storyden com Rustploy
description: "Plataforma moderna de fóruns e quadros de discussão estruturada para comunidades engajadas. Crie Storyden em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Storyden**: Plataforma moderna de fóruns e quadros de discussão estruturada para comunidades engajadas. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `storyden` |
| **Containers** | 1 (`storyden`) |
| **Imagens** | `ghcr.io/southclaws/storyden:latest` |
| **Porta da interface** | 8000, no serviço `storyden` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Storyden** e selecione.
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
| `STORYDEN_FQDN` | http://${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `storyden` | 8000 | ${main_domain} |

## docker-compose.yml do template

```yaml
volumes:
  storyden_data:

services:
  storyden:
    image: ghcr.io/southclaws/storyden:latest
    expose:
      - 8000
    volumes:
      - storyden_data:/storyden/data
    environment:
      # https://www.storyden.org/docs/operation/configuration#core-configuration
      PUBLIC_WEB_ADDRESS: ${STORYDEN_FQDN}
      PUBLIC_API_ADDRESS: ${STORYDEN_FQDN}

      # https://www.storyden.org/docs/operation/configuration#email
      # EMAIL_PROVIDER: ${EMAIL_PROVIDER}
      # SENDGRID_FROM_NAME: ${SENDGRID_FROM_NAME}
      # SENDGRID_FROM_ADDRESS: ${SENDGRID_FROM_ADDRESS}
      # SENDGRID_API_KEY: ${SENDGRID_API_KEY}

      # https://www.storyden.org/docs/operation/configuration#authentication
      # JWT_SECRET: ${JWT_SECRET}
      # OAUTH_GOOGLE_ENABLED: ${OAUTH_GOOGLE_ENABLED}
      # OAUTH_GOOGLE_CLIENT_ID: ${OAUTH_GOOGLE_CLIENT_ID}
      # OAUTH_GOOGLE_CLIENT_SECRET: ${OAUTH_GOOGLE_CLIENT_SECRET}
      # OAUTH_GITHUB_ENABLED: ${OAUTH_GITHUB_ENABLED}
      # OAUTH_GITHUB_CLIENT_ID: ${OAUTH_GITHUB_CLIENT_ID}
      # OAUTH_GITHUB_CLIENT_SECRET: ${OAUTH_GITHUB_CLIENT_SECRET}
      # OAUTH_DISCORD_ENABLED: ${OAUTH_DISCORD_ENABLED}
      # OAUTH_DISCORD_CLIENT_ID: ${OAUTH_DISCORD_CLIENT_ID}
      # OAUTH_DISCORD_CLIENT_SECRET: ${OAUTH_DISCORD_CLIENT_SECRET}
      # OAUTH_KEYCLOAK_ENABLED: ${OAUTH_KEYCLOAK_ENABLED}
      # OAUTH_KEYCLOAK_CLIENT_ID: ${OAUTH_KEYCLOAK_CLIENT_ID}
      # OAUTH_KEYCLOAK_CLIENT_SECRET: ${OAUTH_KEYCLOAK_CLIENT_SECRET}
      # OAUTH_KEYCLOAK_ISSUER_URL: ${OAUTH_KEYCLOAK_ISSUER_URL}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
