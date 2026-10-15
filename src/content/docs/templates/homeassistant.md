---
title: Hospedar Home Assistant com Rustploy
description: "Ecossistema open-source definitivo para automação residencial privada. Crie Home Assistant em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Home Assistant**: Ecossistema open-source definitivo para automação residencial privada. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `homeassistant` |
| **Containers** | 1 (`homeassistant`) |
| **Imagens** | `ghcr.io/home-assistant/home-assistant:stable` |
| **Porta da interface** | 8123, no serviço `homeassistant` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Home Assistant** e selecione.
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
| `homeassistant` | 8123 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `configuration.yaml`

## docker-compose.yml do template

```yaml
services:
  homeassistant:
    image: ghcr.io/home-assistant/home-assistant:stable
    restart: unless-stopped
    ports:
      - 8123
    volumes:
      - ../files/configuration.yaml:/config/configuration.yaml
      - ../files/automations.yaml:/config/automations.yaml
      - ../files/scripts.yaml:/config/scripts.yaml
      - ../files/scenes.yaml:/config/scenes.yaml
      - /opt/homeassistant:/config
      - /etc/localtime:/etc/localtime:ro
      - /run/dbus:/run/dbus:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://homeassistant:8123/"]
      interval: 60s
      retries: 5
      start_period: 300s
      timeout: 2s
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
