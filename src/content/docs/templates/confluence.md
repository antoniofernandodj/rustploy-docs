---
title: Hospedar Confluence com Rustploy
description: "Espaço corporativo para compartilhamento de conhecimento e documentações de projetos. Crie Confluence em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Confluence**: Espaço corporativo para compartilhamento de conhecimento e documentações de projetos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `confluence` |
| **Containers** | 1 (`confluence`) |
| **Imagens** | `atlassian/confluence-server:8.6-ubuntu-jdk17` |
| **Porta da interface** | 8090, no serviço `confluence` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Confluence** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `DOMAIN` | *domínio (gerado; troque pelo seu)* |
| `JVM_MIN_MEM` | 2048m |
| `JVM_MAX_MEM` | 4096m |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `JVM_MINIMUM_MEMORY` | ${JVM_MIN_MEM} |
| `JVM_MAXIMUM_MEMORY` | ${JVM_MAX_MEM} |
| `CATALINA_CONNECTOR_PROXYNAME` | ${DOMAIN} |
| `CATALINA_CONNECTOR_SCHEME` | http |
| `CATALINA_CONNECTOR_SECURE` | true |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `confluence` | 8090 | ${DOMAIN} |

## docker-compose.yml do template

```yaml
version: "3"

services:
  confluence:
    image: atlassian/confluence-server:8.6-ubuntu-jdk17
    ports:
      - "8090"
    volumes:
      - confluence-data:/var/atlassian/application-data/confluence
    environment:
      - JVM_MINIMUM_MEMORY=${JVM_MIN_MEM}
      - JVM_MAXIMUM_MEMORY=${JVM_MAX_MEM}
      - CATALINA_CONNECTOR_PROXYNAME=${DOMAIN}
      - CATALINA_CONNECTOR_SCHEME=http
      - CATALINA_CONNECTOR_SECURE=true

volumes:
  confluence-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
