---
title: Hospedar Homebridge com Rustploy
description: "Emulador para trazer compatibilidade com o Apple HomeKit para dispositivos legados. Crie Homebridge em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Homebridge**: Emulador para trazer compatibilidade com o Apple HomeKit para dispositivos legados. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `homebridge` |
| **Containers** | 1 (`homebridge`) |
| **Imagens** | `homebridge/homebridge:latest` |
| **Porta da interface** | 8581, no serviço `homebridge` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Homebridge** e selecione.
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
| `homebridge` | 8581 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  homebridge:
    image: homebridge/homebridge:latest
    restart: always
    ports:
      - 8581
    volumes:
      - ./volumes/homebridge:/homebridge
    healthcheck:
      test: ["CMD", "curl", "-f", "http://homebridge:8581/"]
      interval: 60s
      retries: 5
      start_period: 300s
      timeout: 2s
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
