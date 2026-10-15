---
title: Hospedar HeyForm com Rustploy
description: "Construtor visual de formulários de conversação, enquetes e quizzes. Crie HeyForm em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**HeyForm**: Construtor visual de formulários de conversação, enquetes e quizzes. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `heyform` |
| **Containers** | 3 (`heyform`, `mongo`, `redis`) |
| **Imagens** | `heyform/community-edition:latest`, `percona/percona-server-mongodb:4.4`, `redis` |
| **Porta da interface** | 8000, no serviço `heyform` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **HeyForm** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `session_key` | *chave base64 aleatória (64 bytes)* |
| `form_encryption_key` | *chave base64 aleatória (64 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `APP_HOMEPAGE_URL` | http://${main_domain} |
| `SESSION_KEY` | ${session_key} |
| `FORM_ENCRYPTION_KEY` | ${form_encryption_key} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `heyform` | 8000 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  heyform:
    image: heyform/community-edition:latest
    restart: always
    volumes:
      # Persist uploaded images
      - heyform-data:/app/static/upload
    depends_on:
      - mongo
      - redis
    ports:
      - 8000
    env_file:
      - .env
    environment:
      MONGO_URI: 'mongodb://mongo:27017/heyform'
      REDIS_HOST: redis
      REDIS_PORT: 6379
    networks:
      - heyform-network

  mongo:
    image: percona/percona-server-mongodb:4.4
    restart: always
    networks:
      - heyform-network
    volumes:
      # Persist MongoDB data
      - mongo-data:/data/db

  redis:
    image: redis
    restart: always
    command: "redis-server --appendonly yes"
    networks:
      - heyform-network
    volumes:
      # Persist KeyDB data
      - redis-data:/data

networks:
  heyform-network:
    driver: bridge

volumes:
  heyform-data:
  mongo-data:
  redis-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
