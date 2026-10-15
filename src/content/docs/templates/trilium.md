---
title: Hospedar Trilium com Rustploy
description: "Editor de notas estruturado hierarquicamente focado na construção de grandes bases de conhecimento. Crie Trilium em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Trilium**: Editor de notas estruturado hierarquicamente focado na construção de grandes bases de conhecimento. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `trilium` |
| **Containers** | 1 (`trilium`) |
| **Imagens** | `zadam/trilium:latest` |
| **Porta da interface** | 8080, no serviço `trilium` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Trilium** e selecione.
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
| `trilium` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  trilium:
    image: zadam/trilium:latest
    ports:
      - 8080
    restart: always
    volumes:
      - /root/trilium-backups:/home/node/trilium-data/backup
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
