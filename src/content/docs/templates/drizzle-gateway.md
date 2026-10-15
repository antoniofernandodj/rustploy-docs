---
title: Hospedar drizzle gateway com Rustploy
description: "Gateway de banco de dados nativo do ecossistema Drizzle ORM. Crie drizzle gateway em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**drizzle gateway**: Gateway de banco de dados nativo do ecossistema Drizzle ORM. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `drizzle-gateway` |
| **Containers** | 1 (`drizzle-gateway`) |
| **Imagens** | `ghcr.io/drizzle-team/gateway:latest` |
| **Porta da interface** | 4983, no serviço `drizzle-gateway` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **drizzle gateway** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `masterpass` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `MASTERPASS` | ${masterpass} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `drizzle-gateway` | 4983 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  drizzle-gateway:
    image: ghcr.io/drizzle-team/gateway:latest
    restart: always
    environment:
      PORT: "4983"
      STORE_PATH: "/app"
      MASTERPASS: ${MASTERPASS}
    volumes:
      - drizzle-gateway:/app
    networks:
      - dokploy-network

volumes:
  drizzle-gateway:

networks:
  dokploy-network:
    external: true
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
