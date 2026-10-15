---
title: Hospedar Registry com Rustploy
description: "Aplicação Registry. Crie Registry em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Registry**: Aplicação Registry. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `registry` |
| **Containers** | 1 (`registry`) |
| **Imagens** | `registry:2` |
| **Porta da interface** | 5000, no serviço `registry` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Registry** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `registry_http_secret` | *senha aleatória de 30 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `REGISTRY_HTTP_SECRET` | ${registry_http_secret} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `registry` | 5000 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/auth/registry.password`

## docker-compose.yml do template

```yaml
services:
  registry:
    restart: always
    image: registry:2
    ports:
      - 5000
    volumes:
      - ../files/auth/registry.password:/auth/registry.password
      - registry-data:/var/lib/registry
    environment:
      REGISTRY_STORAGE_DELETE_ENABLED: true
      REGISTRY_HEALTH_STORAGEDRIVER_ENABLED: false
      REGISTRY_HTTP_SECRET: ${REGISTRY_HTTP_SECRET}
      REGISTRY_AUTH: htpasswd
      REGISTRY_AUTH_HTPASSWD_REALM: Registry Realm
      REGISTRY_AUTH_HTPASSWD_PATH: /auth/registry.password

volumes:
  registry-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
