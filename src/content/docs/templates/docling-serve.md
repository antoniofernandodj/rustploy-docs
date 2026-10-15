---
title: Hospedar Docling Serve com Rustploy
description: "Serviço em API para conversão de documentos baseado em IA. Crie Docling Serve em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Docling Serve**: Serviço em API para conversão de documentos baseado em IA. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `docling-serve` |
| **Containers** | 1 (`docling-serve`) |
| **Imagens** | `quay.io/docling-project/docling-serve:latest` |
| **Porta da interface** | 5001, no serviço `docling-serve` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Docling Serve** e selecione.
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
| `DOCLING_SERVE_ENABLE_UI` | 1 |
| `DOCLING_SERVE_HOST` | 0.0.0.0 |
| `DOCLING_SERVE_PORT` | 5001 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `docling-serve` | 5001 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  docling-serve:
    image: quay.io/docling-project/docling-serve:latest
    restart: unless-stopped
    ports:
      - 5001
    environment:
      - DOCLING_SERVE_ENABLE_UI=1
      - DOCLING_SERVE_HOST=0.0.0.0
      - DOCLING_SERVE_PORT=5001
    volumes:
      - docling-data:/app/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  docling-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
