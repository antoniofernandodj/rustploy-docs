---
title: Hospedar BentoPDF com Rustploy
description: "Microserviço leve para geração de arquivos PDF via API HTTP. Crie BentoPDF em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**BentoPDF**: Microserviço leve para geração de arquivos PDF via API HTTP. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `bentopdf` |
| **Containers** | 1 (`bentopdf`) |
| **Imagens** | `bentopdf/bentopdf:latest` |
| **Porta da interface** | 80, no serviço `bentopdf` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **BentoPDF** e selecione.
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
| `bentopdf` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  bentopdf:
    image: bentopdf/bentopdf:latest
    restart: unless-stopped
    expose:
      - 80
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
