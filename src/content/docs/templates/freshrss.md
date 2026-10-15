---
title: Hospedar FreshRSS com Rustploy
description: "Agregador e leitor de feeds RSS rápido, leve e customizável. Crie FreshRSS em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**FreshRSS**: Agregador e leitor de feeds RSS rápido, leve e customizável. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `freshrss` |
| **Containers** | 1 (`freshrss`) |
| **Imagens** | `freshrss/freshrss:${FRESHRSS_VERSION:-latest}` |
| **Porta da interface** | 80, no serviço `freshrss` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **FreshRSS** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `timezone` | UTC |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `FRESHRSS_VERSION` | latest |
| `TZ` | ${timezone} |
| `CRON_MIN` | 13,43 |
| `FRESHRSS_ENV` | production |
| `COPY_LOG_TO_SYSLOG` | On |
| `COPY_SYSLOG_TO_STDERR` | On |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `freshrss` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  freshrss:
    image: freshrss/freshrss:${FRESHRSS_VERSION:-latest}
    restart: unless-stopped
    volumes:
      # FreshRSS persistent data such as configuration and SQLite databases
      - freshrss_data:/var/www/FreshRSS/data
      # Optional volume for storing third-party extensions
      - freshrss_extensions:/var/www/FreshRSS/extensions
    ports:
      - "80"
    environment:
      # Server timezone
      TZ: ${TZ:-UTC}
      # Cron job to refresh feeds at specified minutes
      CRON_MIN: ${CRON_MIN:-13,43}
      # Production or development mode
      FRESHRSS_ENV: ${FRESHRSS_ENV:-production}
      # Copy logs to syslog
      COPY_LOG_TO_SYSLOG: ${COPY_LOG_TO_SYSLOG:-On}
      # Copy syslog to stderr for docker logs
      COPY_SYSLOG_TO_STDERR: ${COPY_SYSLOG_TO_STDERR:-On}
      # Optional auto-install parameters
      FRESHRSS_INSTALL: ${FRESHRSS_INSTALL:-}
      # Optional auto-create user parameters
      FRESHRSS_USER: ${FRESHRSS_USER:-}

volumes:
  freshrss_data:
  freshrss_extensions:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
