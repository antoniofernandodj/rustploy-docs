---
title: Host ChirpStack with Rustploy
description: "Open-source network server for managing LoRaWAN IoT devices. Create ChirpStack in one click on Rustploy: 7 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**ChirpStack**: Open-source network server for managing LoRaWAN IoT devices. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `chirpstack` |
| **Containers** | 7 (`chirpstack`, `chirpstack-gateway-bridge`, `chirpstack-gateway-bridge-basicstation`, `chirpstack-rest-api`, `postgres`, `redis`, `mosquitto`) |
| **Images** | `chirpstack/chirpstack:4`, `chirpstack/chirpstack-gateway-bridge:4`, `chirpstack/chirpstack-rest-api:4`, `postgres:14-alpine`, `redis:7-alpine`, `eclipse-mosquitto:2` |
| **UI port** | 8080, on service `chirpstack` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **ChirpStack** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `api_secret` | *random base64 key (32 bytes)* |
| `postgres_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `chirpstack` | 8080 | ${main_domain} |
| `chirpstack-rest-api` | 8090 | api-${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/chirpstack/chirpstack.toml`
- `/chirpstack/region_as923_2.toml`
- `/chirpstack/region_as923_3.toml`
- `/chirpstack/region_as923_4.toml`
- `/chirpstack/region_as923.toml`
- `/chirpstack/region_au915_0.toml`
- `/chirpstack/region_au915_1.toml`
- `/chirpstack/region_au915_2.toml`
- `/chirpstack/region_au915_3.toml`
- `/chirpstack/region_au915_4.toml`
- `/chirpstack/region_au915_5.toml`
- `/chirpstack/region_au915_6.toml`
- `/chirpstack/region_au915_7.toml`
- `/chirpstack/region_cn470_0.toml`
- `/chirpstack/region_cn470_10.toml`
- `/chirpstack/region_cn470_11.toml`
- `/chirpstack/region_cn470_1.toml`
- `/chirpstack/region_cn470_2.toml`
- `/chirpstack/region_cn470_3.toml`
- `/chirpstack/region_cn470_4.toml`
- `/chirpstack/region_cn470_5.toml`
- `/chirpstack/region_cn470_6.toml`
- `/chirpstack/region_cn470_7.toml`
- `/chirpstack/region_cn470_8.toml`
- `/chirpstack/region_cn470_9.toml`
- `/chirpstack/region_cn779.toml`
- `/chirpstack/region_eu433.toml`
- `/chirpstack/region_eu868.toml`
- `/chirpstack/region_in865.toml`
- `/chirpstack/region_ism2400.toml`
- `/chirpstack/region_kr920.toml`
- `/chirpstack/region_ru864.toml`
- `/chirpstack/region_us915_0.toml`
- `/chirpstack/region_us915_1.toml`
- `/chirpstack/region_us915_2.toml`
- `/chirpstack/region_us915_3.toml`
- `/chirpstack/region_us915_4.toml`
- `/chirpstack/region_us915_5.toml`
- `/chirpstack/region_us915_6.toml`
- `/chirpstack/region_us915_7.toml`
- `/chirpstack-gateway-bridge/chirpstack-gateway-bridge.toml`
- `/chirpstack-gateway-bridge/chirpstack-gateway-bridge-basicstation-eu868.toml`
- `/mosquitto/config/mosquitto.conf`
- `/postgresql/initdb/001-chirpstack_extensions.sh`

## The template docker-compose.yml

```yaml
services:
  chirpstack:
    image: chirpstack/chirpstack:4 
    command: -c /etc/chirpstack
    restart: unless-stopped
    volumes:
      - ../files/chirpstack:/etc/chirpstack
    ports:
      - 8080
    environment:
      - MQTT_BROKER_HOST=mosquitto
      - REDIS_HOST=redis
      - POSTGRESQL_HOST=postgres
    depends_on:
      - postgres
      - mosquitto
      - redis

  chirpstack-gateway-bridge:
    image: chirpstack/chirpstack-gateway-bridge:4
    restart: unless-stopped
    volumes:
      - ../files/chirpstack-gateway-bridge:/etc/chirpstack-gateway-bridge
    ports:
      - 1700/udp
    environment:
      - INTEGRATION__MQTT__EVENT_TOPIC_TEMPLATE=eu868/gateway/{{ .GatewayID }}/event/{{ .EventType }}
      - INTEGRATION__MQTT__STATE_TOPIC_TEMPLATE=eu868/gateway/{{ .GatewayID }}/state/{{ .StateType }}
      - INTEGRATION__MQTT__COMMAND_TOPIC_TEMPLATE=eu868/gateway/{{ .GatewayID }}/command/#
    depends_on:
      - mosquitto

  chirpstack-gateway-bridge-basicstation:
    image: chirpstack/chirpstack-gateway-bridge:4
    command: -c /etc/chirpstack-gateway-bridge/chirpstack-gateway-bridge-basicstation-eu868.toml
    restart: unless-stopped
    volumes:
      - ../files/chirpstack-gateway-bridge:/etc/chirpstack-gateway-bridge
    ports:
      - 3001
    depends_on:
      - mosquitto

  chirpstack-rest-api:
    image: chirpstack/chirpstack-rest-api:4
    restart: unless-stopped
    command: --server chirpstack:8080 --bind 0.0.0.0:8090 --insecure
    ports:
      - 8090
    depends_on:
      - chirpstack

  postgres:
    image: postgres:14-alpine
    restart: unless-stopped
    volumes:
      - postgresqldata:/var/lib/postgresql/data
      - ../files/postgresql/initdb:/docker-entrypoint-initdb.d
    environment:
      - POSTGRES_USER=chirpstack
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=chirpstack

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --save 300 1 --save 60 100 --appendonly no
    volumes:
      - redisdata:/data

  mosquitto:
    image: eclipse-mosquitto:2
    restart: unless-stopped
    volumes:
      - ../files/mosquitto/config/:/mosquitto/config/
    ports:
      - 1883

volumes:
  postgresqldata:
  redisdata:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
