---
title: Hospedar Gotenberg com Rustploy
description: "API apátrida escalável em Docker dedicada a conversões de arquivos para PDF. Crie Gotenberg em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Gotenberg**: API apátrida escalável em Docker dedicada a conversões de arquivos para PDF. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `gotenberg` |
| **Containers** | 1 (`gotenberg`) |
| **Imagens** | `gotenberg/gotenberg:latest` |
| **Porta da interface** | 3000, no serviço `gotenberg` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Gotenberg** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `username` | gotenberg |
| `password` | changethis |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `GOTENBERG_API_BASIC_AUTH_USERNAME` | *usuário gerado* |
| `GOTENBERG_API_BASIC_AUTH_PASSWORD` | *senha aleatória* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `gotenberg` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  gotenberg:
    image: gotenberg/gotenberg:latest
    environment:
      # NOTE: requires the --api-enable-basic-auth option in "command"
      #       make sure to also change the credentials in Dokploy environment
      GOTENBERG_API_BASIC_AUTH_USERNAME: ${GOTENBERG_API_BASIC_AUTH_USERNAME}
      GOTENBERG_API_BASIC_AUTH_PASSWORD: ${GOTENBERG_API_BASIC_AUTH_PASSWORD}
    command:
      - gotenberg
      # See the full list of options at https://gotenberg.dev/docs/configuration

      # Examples:
      # - --api-timeout=60s
      # - --chromium-auto-start
      - --api-enable-basic-auth
      - --api-disable-health-check-logging
    restart: unless-stopped
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
