---
title: Hospedar Ontime com Rustploy
description: "Gerenciador de roteiros, contagem regressiva e cronogramas para eventos de transmissão ao vivo. Crie Ontime em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Ontime**: Gerenciador de roteiros, contagem regressiva e cronogramas para eventos de transmissão ao vivo. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `ontime` |
| **Containers** | 1 (`ontime`) |
| **Imagens** | `getontime/ontime:v3.8.0` |
| **Porta da interface** | 4001, no serviço `ontime` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Ontime** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `TZ` | UTC |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `ontime` | 4001 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  ontime:
    image: getontime/ontime:v3.8.0
    ports:
      - 4001
      - 8888
      - 9999
    volumes:
      - ontime-data:/data/
    environment:
      - TZ
    restart: unless-stopped
volumes:
  ontime-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
