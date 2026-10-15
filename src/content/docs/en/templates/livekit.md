---
title: Host Livekit with Rustploy
description: "Real-time infrastructure for video and audio streaming over WebRTC. Create Livekit in one click on Rustploy: 4 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Livekit**: Real-time infrastructure for video and audio streaming over WebRTC. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `livekit` |
| **Containers** | 4 (`livekit`, `redis`, `egress`, `ingress`) |
| **Images** | `livekit/livekit-server:v1.9.0`, `redis:7-alpine`, `livekit/egress:latest`, `livekit/ingress:latest` |
| **UI port** | 7880, on service `livekit` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Livekit** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | livekit.*domain (generated; replace it with yours)* |
| `turn_domain` | livekit-turn.*domain (generated; replace it with yours)* |
| `whip_domain` | livekit-whip.*domain (generated; replace it with yours)* |
| `api_key` | API*random password, 12 characters* |
| `api_secret` | *random password, 44 characters* |
| `redis_address` | redis:6379 |
| `redis_password` | *random password, 32 characters* |
| `livekit_port` | 7880 |
| `livekit_tcp_port` | 7881 |
| `livekit_udp_port` | 7882 |
| `turn_tls_port` | 5349 |
| `turn_udp_port` | 3478 |
| `rtmp_port` | 1935 |
| `whip_port` | 8080 |
| `ingress_udp_port` | 7885 |
| `http_relay_port` | 9090 |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `LIVEKIT_URL` | ${main_domain} |
| `RTMP_URL` | ${turn_domain} |
| `WHIP_URL` | ${whip_domain} |
| `REDIS_ADDRESS` | ${redis_address} |
| `REDIS_PASSWORD` | ${redis_password} |
| `API_KEY` | ${api_key} |
| `API_SECRET` | ${api_secret} |
| `LIVEKIT_PORT` | ${livekit_port} |
| `LIVEKIT_TCP_PORT` | ${livekit_tcp_port} |
| `LIVEKIT_UDP_PORT` | ${livekit_udp_port} |
| `TURN_TLS_PORT` | ${turn_tls_port} |
| `TURN_UDP_PORT` | ${turn_udp_port} |
| `RTMP_PORT` | ${rtmp_port} |
| `WHIP_PORT` | ${whip_port} |
| `INGRESS_UDP_PORT` | ${ingress_udp_port} |
| `HTTP_RELAY_PORT` | ${http_relay_port} |

## Domains

| Service | Port | Host |
|---|---|---|
| `livekit` | 7880 | ${main_domain} |
| `livekit` | 5349 | ${turn_domain} |
| `ingress` | 8080 | ${whip_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `redis.conf`
- `livekit.yaml`
- `egress.yaml`
- `ingress.yaml`

## The template docker-compose.yml

```yaml
services:
  livekit:
    image: livekit/livekit-server:v1.9.0
    restart: unless-stopped
    command: --config /etc/livekit.yaml
    volumes:
      - ../files/livekit.yaml:/etc/livekit.yaml
    ports:
      - "${LIVEKIT_PORT}:${LIVEKIT_PORT}"
      - "${TURN_UDP_PORT}:${TURN_UDP_PORT}/udp"
      - "${LIVEKIT_UDP_PORT}:${LIVEKIT_UDP_PORT}/udp"
    healthcheck:
      test: [ "CMD-SHELL", "wget -qO- http://localhost:${LIVEKIT_PORT} || exit 1" ]
      interval: 10s
      timeout: 5s
      retries: 6
    depends_on:
      redis:
        condition: service_healthy

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server /etc/redis.conf
    volumes:
      - ../files/redis.conf:/etc/redis.conf
    healthcheck:
      test: [ "CMD-SHELL", "redis-cli ping || exit 1" ]
      interval: 10s
      timeout: 5s
      retries: 6

  egress:
    image: livekit/egress:latest
    restart: unless-stopped
    environment:
      - EGRESS_CONFIG_FILE=/etc/egress.yaml
    volumes:
      - ../files/egress.yaml:/etc/egress.yaml
    cap_add:
      - CAP_SYS_ADMIN
    depends_on:
      livekit:
        condition: service_healthy

  ingress:
    image: livekit/ingress:latest
    restart: unless-stopped
    environment:
      - INGRESS_CONFIG_FILE=/etc/ingress.yaml
    volumes:
      - ../files/ingress.yaml:/etc/ingress.yaml
    ports:
      - "${RTMP_PORT}:${RTMP_PORT}"
      - "${INGRESS_UDP_PORT}:${INGRESS_UDP_PORT}/udp"
    depends_on:
      livekit:
        condition: service_healthy
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
