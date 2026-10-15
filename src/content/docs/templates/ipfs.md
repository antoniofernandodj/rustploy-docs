---
title: Hospedar Ipfs com Rustploy
description: "Aplicação Ipfs. Crie Ipfs em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Ipfs**: Aplicação Ipfs. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `ipfs` |
| **Containers** | 1 (`ipfs`) |
| **Imagens** | `ipfs/kubo:latest` |
| **Porta da interface** | 8080, no serviço `ipfs` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Ipfs** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `gateway_domain` | *domínio (gerado; troque pelo seu)* |
| `api_domain` | *domínio (gerado; troque pelo seu)* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `ipfs` | 8080 | ${gateway_domain} |
| `ipfs` | 5001 | ${api_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/container-init.d/001-configure-api.sh`

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  ipfs:
    image: ipfs/kubo:latest
    restart: unless-stopped
    environment:
      - IPFS_PROFILE=server
    volumes:
      - ipfs_data:/data/ipfs
      - ipfs_staging:/export
    ports:
      - 4001
      - 8080
      - 5001
volumes:
  ipfs_data: {}
  ipfs_staging: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
