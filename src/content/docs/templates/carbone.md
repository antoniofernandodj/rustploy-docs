---
title: Hospedar Carbone com Rustploy
description: "Motor de alta performance para geração de documentos com dados em JSON. Crie Carbone em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Carbone**: Motor de alta performance para geração de documentos com dados em JSON. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `carbone` |
| **Containers** | 1 (`carbone`) |
| **Imagens** | `carbone/carbone-ee:full-4.25.5` |
| **Porta da interface** | 4000, no serviço `carbone` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Carbone** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `carbone_key` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `CARBONE_KEY` | ${carbone_key} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `carbone` | 4000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.8'

services:
  carbone:
    image: carbone/carbone-ee:full-4.25.5
    restart: unless-stopped
    environment:
      - CARBONE_EE_LICENSE=${CARBONE_KEY}
      - CARBONE_EE_STUDIO=true
    ports:
      - 4000
    volumes:
      - template:/app/template

volumes:
  template:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
