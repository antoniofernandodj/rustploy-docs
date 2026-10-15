---
title: Hospedar Casdoor com Rustploy
description: "Central de gerenciamento de acesso e identidade (IAM) com suporte a múltiplos protocolos. Crie Casdoor em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Casdoor**: Central de gerenciamento de acesso e identidade (IAM) com suporte a múltiplos protocolos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `casdoor` |
| **Containers** | 2 (`casdoor`, `casdoor-db`) |
| **Imagens** | `casbin/casdoor:latest`, `postgres:16` |
| **Porta da interface** | 8000, no serviço `casdoor` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Casdoor** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `postgres_password` | *senha aleatória de 32 caracteres* |
| `admin_password` | *senha aleatória de 16 caracteres* |
| `jwt_secret` | *senha aleatória de 64 caracteres* |
| `main_domain` | *domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `ADMIN_FIRST_LOGIN_PASSWD` | ${admin_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `casdoor` | 8000 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `app.conf`
- `init_data.json`

## docker-compose.yml do template

```yaml
services:
  casdoor:
    image: casbin/casdoor:latest
    environment:
      - RUNNING_IN_DOCKER=true
    volumes:
      - ../files/app.conf:/conf/app.conf
      - ../files/init_data.json:/init_data.json
      - casdoor-data:/data
    depends_on:
      casdoor-db:
        condition: service_healthy
    restart: unless-stopped

  casdoor-db:
    image: postgres:16
    environment:
      - POSTGRES_USER=casdoor
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=casdoor
    volumes:
      - casdoor-postgres-data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U casdoor -d casdoor"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

volumes:
  casdoor-postgres-data:
  casdoor-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
