---
title: Hospedar I18n Blog com Rustploy
description: "Aplicação I18n Blog. Crie I18n Blog em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**I18n Blog**: Aplicação I18n Blog. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `i18n-blog` |
| **Containers** | 1 (`kuno`) |
| **Imagens** | `ictrun/kuno:latest` |
| **Porta da interface** | 80, no serviço `kuno` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **I18n Blog** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `jwt_secret` | *senha aleatória de 32 caracteres* |
| `recovery_mode` | false |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_API_URL` | https://${main_domain}/api |
| `DB_PATH` | /app/data/blog.db |
| `UPLOAD_DIR` | /app/data/uploads |
| `GIN_MODE` | release |
| `NODE_ENV` | production |
| `JWT_SECRET` | *JWT gerado* |
| `RECOVERY_MODE` | ${recovery_mode} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `kuno` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  kuno:
    image: ictrun/kuno:latest
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
      DB_PATH: /app/data/blog.db
      UPLOAD_DIR: /app/data/uploads
      GIN_MODE: release
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}
      RECOVERY_MODE: ${RECOVERY_MODE}
    volumes:
      - kuno-data:/app/data

volumes:
  kuno-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
