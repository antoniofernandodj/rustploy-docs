---
title: Hospedar InfluxDB com Rustploy
description: "Banco de dados otimizado especificamente para séries temporais e métricas de infraestrutura. Crie InfluxDB em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**InfluxDB**: Banco de dados otimizado especificamente para séries temporais e métricas de infraestrutura. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `influxdb` |
| **Containers** | 1 (`influxdb`) |
| **Imagens** | `influxdb:2.7.10` |
| **Porta da interface** | 8086, no serviço `influxdb` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **InfluxDB** e selecione.
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
| `influxdb` | 8086 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  influxdb:
    image: influxdb:2.7.10
    restart: unless-stopped
    volumes:
      - influxdb2-data:/var/lib/influxdb2
      - influxdb2-config:/etc/influxdb2

volumes:
  influxdb2-data:
  influxdb2-config:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
