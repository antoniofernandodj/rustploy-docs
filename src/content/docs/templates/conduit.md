---
title: Hospedar Conduit com Rustploy
description: "Servidor de chat Matrix ultrarrápido escrito em Rust. Crie Conduit em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Conduit**: Servidor de chat Matrix ultrarrápido escrito em Rust. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `conduit` |
| **Containers** | 1 (`homeserver`) |
| **Imagens** | `registry.gitlab.com/famedly/conduit/matrix-conduit:v0.9.0` |
| **Porta da interface** | 6167, no serviço `homeserver` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Conduit** e selecione.
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
| `MATRIX_SUBDOMAIN` | ${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `homeserver` | 6167 | ${main_domain} |

## docker-compose.yml do template

```yaml
# From Conduit's official documentation: https://docs.conduit.rs/deploying/docker.html#docker-compose
version: '3'

services:
    homeserver:
        image: registry.gitlab.com/famedly/conduit/matrix-conduit:v0.9.0
        restart: unless-stopped
        volumes:
            - db:/var/lib/matrix-conduit/
        environment:
            CONDUIT_SERVER_NAME: ${MATRIX_SUBDOMAIN}
            CONDUIT_DATABASE_PATH: /var/lib/matrix-conduit/
            CONDUIT_DATABASE_BACKEND: rocksdb
            CONDUIT_PORT: 6167
            CONDUIT_MAX_REQUEST_SIZE: 20000000 # in bytes, ~20 MB
            CONDUIT_ALLOW_REGISTRATION: 'true'
            #CONDUIT_REGISTRATION_TOKEN: '' # require password for registration
            CONDUIT_ALLOW_FEDERATION: 'true'
            CONDUIT_ALLOW_CHECK_FOR_UPDATES: 'true'
            CONDUIT_TRUSTED_SERVERS: '["matrix.org"]'
            #CONDUIT_MAX_CONCURRENT_REQUESTS: 100
            CONDUIT_ADDRESS: 0.0.0.0
            CONDUIT_CONFIG: '' # Ignore this
volumes:
    db:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
