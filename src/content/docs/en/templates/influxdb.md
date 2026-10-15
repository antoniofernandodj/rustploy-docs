---
title: Host InfluxDB with Rustploy
description: "Database optimized for time series and infrastructure metrics. Create InfluxDB in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**InfluxDB**: Database optimized for time series and infrastructure metrics. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `influxdb` |
| **Containers** | 1 (`influxdb`) |
| **Images** | `influxdb:2.7.10` |
| **UI port** | 8086, on service `influxdb` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **InfluxDB** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

## Domains

| Service | Port | Host |
|---|---|---|
| `influxdb` | 8086 | ${main_domain} |

## The template docker-compose.yml

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

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
