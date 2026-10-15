---
title: Hospedar Chief-Onboarding com Rustploy
description: "Sistema para gerenciamento e integração de novos colaboradores. Crie Chief-Onboarding em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Chief-Onboarding**: Sistema para gerenciamento e integração de novos colaboradores. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `chiefonboarding` |
| **Containers** | 2 (`chiefonboarding`, `db`) |
| **Imagens** | `chiefonboarding/chiefonboarding:v2.2.5`, `postgres:13` |
| **Porta da interface** | 8000, no serviço `chiefonboarding` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Chief-Onboarding** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 16 caracteres* |
| `secret_key` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DB_PASSWORD` | ${db_password} |
| `SECRET_KEY` | ${secret_key} |
| `DOMAIN` | ${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `chiefonboarding` | 8000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.8'

services:
  chiefonboarding:
    image: chiefonboarding/chiefonboarding:v2.2.5
    restart: unless-stopped
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - DATABASE_URL=postgres://postgres:${DB_PASSWORD}@db:5432/chiefonboarding
      - ALLOWED_HOSTS=${DOMAIN}
    ports:
      - 8000
    depends_on:
      - db

  db:
    image: postgres:13
    restart: unless-stopped
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=chiefonboarding
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
