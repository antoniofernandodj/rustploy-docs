---
title: Hospedar Checkcle com Rustploy
description: "Ferramenta de segurança corporativa para auditoria de runtime e conformidade. Crie Checkcle em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Checkcle**: Ferramenta de segurança corporativa para auditoria de runtime e conformidade. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `checkcle` |
| **Containers** | 1 (`checkcle`) |
| **Imagens** | `operacle/checkcle:latest` |
| **Porta da interface** | 8090, no serviço `checkcle` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Checkcle** e selecione.
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
| `checkcle` | 8090 | ${main_domain} |

## docker-compose.yml do template

```yaml
#Default id pass Username: admin@example.com Password: Admin123456

version: "3.9"
services:
  checkcle:
    image: operacle/checkcle:latest
    restart: unless-stopped
    expose:
      - 8090
    volumes:
      - checkcle-data:/mnt/pb_data
    ulimits:
      nofile:
        soft: 4096
        hard: 8192

volumes:
  checkcle-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
