---
title: Hospedar ChirpStack com Rustploy
description: "Servidor de rede open-source para gerenciamento de dispositivos IoT LoRaWAN. Crie ChirpStack em um clique no Rustploy: 7 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**ChirpStack**: Servidor de rede open-source para gerenciamento de dispositivos IoT LoRaWAN. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `chirpstack` |
| **Containers** | 7 (`chirpstack`, `chirpstack-gateway-bridge`, `chirpstack-gateway-bridge-basicstation`, `chirpstack-rest-api`, `postgres`, `redis`, `mosquitto`) |
| **Imagens** | `chirpstack/chirpstack:4`, `chirpstack/chirpstack-gateway-bridge:4`, `chirpstack/chirpstack-rest-api:4`, `postgres:14-alpine`, `redis:7-alpine`, `eclipse-mosquitto:2` |
| **Porta da interface** | 8080, no serviço `chirpstack` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **ChirpStack** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `api_secret` | *chave base64 aleatória (32 bytes)* |
| `postgres_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `chirpstack` | 8080 | ${main_domain} |
| `chirpstack-rest-api` | 8090 | api-${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

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

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
