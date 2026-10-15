---
title: Hospedar Postgresus com Rustploy
description: "Utilitário para automação e agendamento contínuo de backups de bancos PostgreSQL. Crie Postgresus em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Postgresus**: Utilitário para automação e agendamento contínuo de backups de bancos PostgreSQL. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `postgresus` |
| **Containers** | 1 (`postgresus`) |
| **Imagens** | `rostislavdugin/postgresus:latest` |
| **Porta da interface** | 4005, no serviço `postgresus` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Postgresus** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `postgresus` | 4005 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  postgresus:
    image: rostislavdugin/postgresus:latest
    ports:
      - "4005"
    volumes:
      # Persistent data storage
      - postgresus-data:/postgresus-data
    restart: unless-stopped
    environment:
      # Optional: Set timezone
      - TZ=UTC
    healthcheck:
      test: [ "CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:4005" ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  postgresus-data:
    driver: local
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
