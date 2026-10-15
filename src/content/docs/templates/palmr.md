---
title: Hospedar Palmr com Rustploy
description: "Plataforma minimalista para compartilhamento de arquivos pesados (Alternativa ao WeTransfer). Crie Palmr em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Palmr**: Plataforma minimalista para compartilhamento de arquivos pesados (Alternativa ao WeTransfer). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `palmr` |
| **Containers** | 1 (`palmr`) |
| **Imagens** | `kyantech/palmr:latest` |
| **Porta da interface** | 5487, no serviço `palmr` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Palmr** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `ENCRYPTION_KEY` |  |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `palmr` | 5487 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  palmr:
    image: kyantech/palmr:latest
    environment:
      - ENABLE_S3=false
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
    ports:
      - "5487"
      - "3333"
    volumes:
      - palmr_data:/app/server
    restart: unless-stopped

volumes:
  palmr_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
