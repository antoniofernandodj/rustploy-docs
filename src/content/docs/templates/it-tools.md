---
title: Hospedar IT Tools com Rustploy
description: "Coleção massiva de pequenos utilitários online essenciais para desenvolvedores. Crie IT Tools em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**IT Tools**: Coleção massiva de pequenos utilitários online essenciais para desenvolvedores. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `it-tools` |
| **Containers** | 1 (`it-tools`) |
| **Imagens** | `corentinth/it-tools:latest` |
| **Porta da interface** | 80, no serviço `it-tools` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **IT Tools** e selecione.
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
| `it-tools` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  it-tools:
    image: corentinth/it-tools:latest
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:80"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
