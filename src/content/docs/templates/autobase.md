---
title: Hospedar Autobase com Rustploy
description: "Alternativa de código aberto a bancos de dados gerenciados em nuvem. Crie Autobase em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Autobase**: Alternativa de código aberto a bancos de dados gerenciados em nuvem. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `autobase` |
| **Containers** | 1 (`autobase-console`) |
| **Imagens** | `autobase/console:2.5.2` |
| **Porta da interface** | 80, no serviço `autobase-console` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Autobase** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `api_domain` | *domínio (gerado; troque pelo seu)* |
| `authenticattion_token` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `PG_CONSOLE_API_URL` | http://${api_domain}/api/v1 |
| `PG_CONSOLE_AUTHORIZATION_TOKEN` | ${authenticattion_token} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `autobase-console` | 80 | ${main_domain} |
| `autobase-console` | 8080 | ${api_domain} |

## docker-compose.yml do template

```yaml
services:
  autobase-console:
    image: autobase/console:2.5.2
    restart: unless-stopped
    ports:
      - "80"
      - "8080"
    environment:
      - PG_CONSOLE_API_URL=${PG_CONSOLE_API_URL}
      - PG_CONSOLE_AUTHORIZATION_TOKEN=${PG_CONSOLE_AUTHORIZATION_TOKEN}
    volumes:
      - console_postgres:/var/lib/postgresql
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/ansible:/tmp/ansible

volumes:
  console_postgres:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
