---
title: Hospedar Dragonfly Db com Rustploy
description: "Aplicação Dragonfly Db. Crie Dragonfly Db em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Dragonfly Db**: Aplicação Dragonfly Db. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `dragonfly-db` |
| **Containers** | 1 (`dragonflydb`) |
| **Imagens** | `docker.dragonflydb.io/dragonflydb/dragonfly` |
| **Porta da interface** | 6379, no serviço `dragonflydb` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Dragonfly Db** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 32 caracteres* |
| `any_helper` | *UUID aleatório* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DFLY_requirepass` | ${db_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `dragonflydb` | 6379 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/content/configuration.conf`

## docker-compose.yml do template

```yaml
version: '3.8'
services:
  dragonflydb:
    image: 'docker.dragonflydb.io/dragonflydb/dragonfly'
    ulimits:
      memlock: -1
    ports:
      - "6379:6379"
    volumes:
      - dragonflydata:/data
    environment: 
      - DFLY_requirepass
volumes:
  dragonflydata:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
