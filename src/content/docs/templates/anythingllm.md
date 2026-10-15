---
title: Hospedar AnythingLLM com Rustploy
description: "Chatbot privado para conversar com seus documentos locais. Crie AnythingLLM em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**AnythingLLM**: Chatbot privado para conversar com seus documentos locais. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `anythingllm` |
| **Containers** | 1 (`anythingllm`) |
| **Imagens** | `mintplexlabs/anythingllm:latest` |
| **Porta da interface** | 3001, no serviço `anythingllm` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **AnythingLLM** e selecione.
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
| `anythingllm` | 3001 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  anythingllm:
    image: mintplexlabs/anythingllm:latest
    restart: unless-stopped
    ports:
      - 3001
    environment:
      - STORAGE_DIR=/app/server/storage
    volumes:
      - storage:/app/server/storage
    cap_add:
      - SYS_ADMIN

volumes:
  storage: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
