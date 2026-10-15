---
title: Hospedar Tianji com Rustploy
description: "Painel unificado combinando análises de acessos web com monitor de uptime de servidores. Crie Tianji em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Tianji**: Painel unificado combinando análises de acessos web com monitor de uptime de servidores. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `tianji` |
| **Containers** | 2 (`tianji`, `postgres`) |
| **Imagens** | `moonrailgun/tianji`, `postgres:15.4-alpine` |
| **Porta da interface** | 12345, no serviço `tianji` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Tianji** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `jwt_secret` | *senha aleatória de 32 caracteres* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `tianji` | 12345 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3'
services:
  tianji:
    image: moonrailgun/tianji
    ports:
      - "12345"
    environment:
      DATABASE_URL: postgresql://tianji:tianji@postgres:5432/tianji
      # API Key
      JWT_SECRET: ${jwt_secret}
      ALLOW_REGISTER: "false"
      ALLOW_OPENAPI: "true"
    depends_on:
      - postgres
  postgres:
    image: postgres:15.4-alpine
    environment:
      POSTGRES_DB: tianji
      POSTGRES_USER: tianji
      POSTGRES_PASSWORD: tianji
    volumes:
      - tianji-db-data:/var/lib/postgresql/data
volumes:
  tianji-db-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
