---
title: Hospedar ArangoDB com Rustploy
description: "Banco de dados nativo multi-modelo (documentos, grafos, chave-valor). Crie ArangoDB em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**ArangoDB**: Banco de dados nativo multi-modelo (documentos, grafos, chave-valor). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `arangodb` |
| **Containers** | 1 (`arangodb`) |
| **Imagens** | `arangodb:3.12.4` |
| **Porta da interface** | 8529, no serviço `arangodb` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **ArangoDB** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `arango_password` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `ARANGO_PASSWORD` | ${arango_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `arangodb` | 8529 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  arangodb:
    image: arangodb:3.12.4
    restart: unless-stopped
    ports:
      - 8529
    environment:
      - ARANGO_ROOT_PASSWORD=${ARANGO_PASSWORD}
    volumes:
      - data:/var/lib/arangodb3

volumes:
  data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
