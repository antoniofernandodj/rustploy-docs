---
title: Hospedar One Time Secret com Rustploy
description: "Compartilhamento seguro de segredos e senhas por meio de links que se destroem após visualizados. Crie One Time Secret em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**One Time Secret**: Compartilhamento seguro de segredos e senhas por meio de links que se destroem após visualizados. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `onetimesecret` |
| **Containers** | 2 (`onetimesecret-redis`, `onetimesecret`) |
| **Imagens** | `redis:7-alpine`, `onetimesecret/onetimesecret:latest` |
| **Porta da interface** | 3000, no serviço `onetimesecret` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **One Time Secret** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret` | *senha aleatória de 30 caracteres* |
| `redis_password` | *senha aleatória de 30 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `COLONEL` | admin@example.com |
| `HOST` | ${main_domain} |
| `REDIS_PASSWORD` | ${redis_password} |
| `SECRET` | ${secret} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `onetimesecret` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  onetimesecret-redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    restart: unless-stopped
    healthcheck:
      test:
        - CMD
        - redis-cli
        - ping
      interval: 30s
      timeout: 10s
      retries: 3

  onetimesecret:
    image: 'onetimesecret/onetimesecret:latest'
    restart: unless-stopped
    environment:
      # To see all available environment variables, visit:
      # https://github.com/onetimesecret/onetimesecret/blob/develop/etc/config.example.yaml
      - AUTH_AUTOVERIFY=true
      - AUTH_SIGNUP=true

      # Accounts created with this email address will have admin access
      - COLONEL=${COLONEL}

      # If you change your domain, make sure to update the HOST environment variable.
      - HOST=${HOST}

      - RACK_ENV=production
      - REDIS_URL=redis://:${REDIS_PASSWORD}@onetimesecret-redis:6379/0
      - SECRET=${SECRET}
      - SSL=true
    depends_on:
      - onetimesecret-redis
    healthcheck:
      test:
        - CMD
        - ruby
        - '-rnet/http'
        - '-e'
        - "exit(Net::HTTP.get_response(URI('http://localhost:3000')).is_a?(Net::HTTPSuccess) ? 0 : 1)"
      interval: 30s
      timeout: 10s
      retries: 3
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
