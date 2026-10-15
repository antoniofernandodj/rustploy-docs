---
title: Hospedar Dokploy Prom Monitoring Extension com Rustploy
description: "Aplicação Dokploy Prom Monitoring Extension. Crie Dokploy Prom Monitoring Extension em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Dokploy Prom Monitoring Extension**: Aplicação Dokploy Prom Monitoring Extension. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `dokploy-prom-monitoring-extension` |
| **Containers** | 1 (`dokploy-monitoring`) |
| **Imagens** | `dokploy/monitoring:canary` |
| **Porta da interface** | 3001, no serviço `dokploy-monitoring` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Dokploy Prom Monitoring Extension** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `monitoring_token` | *senha aleatória de 32 caracteres* |
| `callback_url` | http://dokploy:3000/api/trpc/notification.receiveNotification |
| `server_type` | Dokploy |
| `refresh_rate` | 30 |
| `retention_days` | 7 |
| `cpu_threshold` | 80 |
| `memory_threshold` | 85 |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `METRICS_CONFIG` | {"server":{"refreshRate":${refresh_rate},"port":3001,"type":"${server_type}","token":"${monitoring_token}","urlCallback":"${callback_url}","retentionDays":${retention_days},"cronJob":"0 0 * * *","thresholds":{"cpu":${cpu_threshold},"memory":${memory_threshold}},"prometheus":{"enabled":true}},"containers":{"refreshRate":${refresh_rate},"services":{"include":[],"exclude":[]}}} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `dokploy-monitoring` | 3001 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  dokploy-monitoring:
    image: dokploy/monitoring:canary
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - monitoring-data:/app/data
volumes:
  monitoring-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
