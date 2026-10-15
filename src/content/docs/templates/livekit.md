---
title: Hospedar Livekit com Rustploy
description: "Infraestrutura em tempo real focada em transmissão de vídeo e áudio via WebRTC. Crie Livekit em um clique no Rustploy: 4 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Livekit**: Infraestrutura em tempo real focada em transmissão de vídeo e áudio via WebRTC. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `livekit` |
| **Containers** | 4 (`livekit`, `redis`, `egress`, `ingress`) |
| **Imagens** | `livekit/livekit-server:v1.9.0`, `redis:7-alpine`, `livekit/egress:latest`, `livekit/ingress:latest` |
| **Porta da interface** | 7880, no serviço `livekit` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Livekit** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | livekit.*domínio (gerado; troque pelo seu)* |
| `turn_domain` | livekit-turn.*domínio (gerado; troque pelo seu)* |
| `whip_domain` | livekit-whip.*domínio (gerado; troque pelo seu)* |
| `api_key` | API*senha aleatória de 12 caracteres* |
| `api_secret` | *senha aleatória de 44 caracteres* |
| `redis_address` | redis:6379 |
| `redis_password` | *senha aleatória de 32 caracteres* |
| `livekit_port` | 7880 |
| `livekit_tcp_port` | 7881 |
| `livekit_udp_port` | 7882 |
| `turn_tls_port` | 5349 |
| `turn_udp_port` | 3478 |
| `rtmp_port` | 1935 |
| `whip_port` | 8080 |
| `ingress_udp_port` | 7885 |
| `http_relay_port` | 9090 |

**Entregues ao container:**

| Variável | Valor |
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

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `livekit` | 7880 | ${main_domain} |
| `livekit` | 5349 | ${turn_domain} |
| `ingress` | 8080 | ${whip_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `redis.conf`
- `livekit.yaml`
- `egress.yaml`
- `ingress.yaml`

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
