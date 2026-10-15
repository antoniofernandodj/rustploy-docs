---
title: Hospedar Keycloak com Rustploy
description: "Provedor robusto de gerenciamento de identidade e autenticação corporativa. Crie Keycloak em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Keycloak**: Provedor robusto de gerenciamento de identidade e autenticação corporativa. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `keycloak` |
| **Containers** | 2 (`postgres`, `keycloak`) |
| **Imagens** | `postgres:16.2`, `quay.io/keycloak/keycloak:26.3.5` |
| **Porta da interface** | 8080, no serviço `keycloak` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Keycloak** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `POSTGRES_DB` | keycloak |
| `POSTGRES_USER` | keycloakuser |
| `POSTGRES_PASSWORD` | *senha aleatória de 32 caracteres* |
| `KEYCLOAK_ADMIN` | admin |
| `KEYCLOAK_ADMIN_PASSWORD` | *senha aleatória de 32 caracteres* |
| `KC_HOSTNAME` | ${main_domain} |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_DB` | ${POSTGRES_DB} |
| `POSTGRES_USER` | ${POSTGRES_USER} |
| `POSTGRES_PASSWORD` | ${POSTGRES_PASSWORD} |
| `KEYCLOAK_ADMIN` | ${KEYCLOAK_ADMIN} |
| `KEYCLOAK_ADMIN_PASSWORD` | ${KEYCLOAK_ADMIN_PASSWORD} |
| `KC_HOSTNAME` | ${KC_HOSTNAME} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `keycloak` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  postgres:
    image: postgres:16.2
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always
    
  keycloak:
    image: quay.io/keycloak/keycloak:26.3.5
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/${POSTGRES_DB}
      KC_DB_USERNAME: ${POSTGRES_USER}
      KC_DB_PASSWORD: ${POSTGRES_PASSWORD}
      KC_BOOTSTRAP_ADMIN_USERNAME: ${KEYCLOAK_ADMIN}
      KC_BOOTSTRAP_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
      KC_HOSTNAME: ${KC_HOSTNAME}      
      KC_HTTP_ENABLED: "true"               
      KC_HEALTH_ENABLED: "true"
      KC_PROXY_HEADERS: "xforwarded"
    command: start-dev
    restart: always

volumes:
  postgres_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
