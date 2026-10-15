---
title: Hospedar Omni-Tools com Rustploy
description: "Caixa de ferramentas utilitárias agrupadas em um único painel web estável. Crie Omni-Tools em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Omni-Tools**: Caixa de ferramentas utilitárias agrupadas em um único painel web estável. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `omni-tools` |
| **Containers** | 1 (`omni-tools`) |
| **Imagens** | `iib0011/omni-tools:latest` |
| **Porta da interface** | 80, no serviço `omni-tools` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Omni-Tools** e selecione.
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
| `LOCIZE_API_KEY` |  |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `omni-tools` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  omni-tools:
    image: iib0011/omni-tools:latest
    restart: unless-stopped
    ports:
      - 80
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
