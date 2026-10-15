---
title: Hospedar AList com Rustploy
description: "Centralizador de múltiplos armazenamentos de arquivos via WebDAV. Crie AList em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**AList**: Centralizador de múltiplos armazenamentos de arquivos via WebDAV. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `alist` |
| **Containers** | 1 (`alist`) |
| **Imagens** | `xhofe/alist:v3.55.0` |
| **Porta da interface** | 5244, no serviço `alist` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **AList** e selecione.
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
| `alist` | 5244 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.3'
services:
  alist:
    image: xhofe/alist:v3.55.0
    volumes:
      - alist-data:/opt/alist/data
    environment:
      - PUID=0
      - PGID=0
      - UMASK=022
    restart: unless-stopped

volumes:
  alist-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
