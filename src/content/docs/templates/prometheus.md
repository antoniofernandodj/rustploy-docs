---
title: Hospedar Prometheus com Rustploy
description: "Banco de dados e central de monitoramento de séries temporais via scraping de métricas. Crie Prometheus em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Prometheus**: Banco de dados e central de monitoramento de séries temporais via scraping de métricas. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `prometheus` |
| **Containers** | 1 (`prometheus`) |
| **Imagens** | `prom/prometheus:latest` |
| **Porta da interface** | 9090, no serviço `prometheus` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Prometheus** e selecione.
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
| `prometheus` | 9090 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `prometheus.yml`

## docker-compose.yml do template

```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    restart: unless-stopped
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--web.console.libraries=/usr/share/prometheus/console_libraries"
      - "--web.console.templates=/usr/share/prometheus/consoles"
      - "--web.enable-lifecycle"
    volumes:
      - ../files/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
volumes:
  prometheus-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
