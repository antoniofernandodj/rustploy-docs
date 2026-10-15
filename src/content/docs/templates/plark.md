---
title: Hospedar Plark com Rustploy
description: "Construtor visual de sites institucionais rápido e auto-hospedado. Crie Plark em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Plark**: Construtor visual de sites institucionais rápido e auto-hospedado. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `plark` |
| **Containers** | 1 (`plark`) |
| **Imagens** | `plarkinc/plark:latest` |
| **Porta da interface** | 80, no serviço `plark` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Plark** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `plark` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  plark:
    image: plarkinc/plark:latest
    pull_policy: always
    restart: unless-stopped
    ports:
      - "80"
    volumes:
      - plark-data:/var/data
volumes:
  plark-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
