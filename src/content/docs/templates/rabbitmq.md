---
title: Hospedar RabbitMQ com Rustploy
description: "Broker de mensageria multi-protocolo largamente utilizado para comunicação assíncrona. Crie RabbitMQ em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**RabbitMQ**: Broker de mensageria multi-protocolo largamente utilizado para comunicação assíncrona. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `rabbitmq` |
| **Containers** | 1 (`rabbitmq`) |
| **Imagens** | `rabbitmq:4.1-management` |
| **Porta da interface** | 15672, no serviço `rabbitmq` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **RabbitMQ** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `management_domain` | *domínio (gerado; troque pelo seu)* |
| `default_user` | admin |
| `default_pass` | *senha aleatória de 8 caracteres* |
| `disk_free_limit` | 2147483648 |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `RABBITMQ_DEFAULT_USER` | ${default_user} |
| `RABBITMQ_DEFAULT_PASS` | ${default_pass} |
| `RABBITMQ_DISK_FREE_LIMIT` | ${disk_free_limit} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `rabbitmq` | 15672 | ${main_domain} |
| `rabbitmq` | 5672 | ${management_domain} |

## docker-compose.yml do template

```yaml
services:
  rabbitmq:
    image: rabbitmq:4.1-management
    hostname: rabbitmq
    restart: unless-stopped
    environment:
      - RABBITMQ_DEFAULT_USER=${RABBITMQ_DEFAULT_USER}
      - RABBITMQ_DEFAULT_PASS=${RABBITMQ_DEFAULT_PASS}
      - RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS=-rabbit log_levels [{connection,error},{default,error}] disk_free_limit ${RABBITMQ_DISK_FREE_LIMIT}
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq
    ports:
      - 15672
      - 5672

volumes:
  rabbitmq-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
