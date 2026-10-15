---
title: Hospedar Otter Wiki com Rustploy
description: "Motor wiki baseado em Python e Flask focado em simplicidade com escrita em Markdown. Crie Otter Wiki em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Otter Wiki**: Motor wiki baseado em Python e Flask focado em simplicidade com escrita em Markdown. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `otterwiki` |
| **Containers** | 1 (`otterwiki`) |
| **Imagens** | `redimp/otterwiki:2` |
| **Porta da interface** | 80, no serviço `otterwiki` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Otter Wiki** e selecione.
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
| `otterwiki` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  otterwiki:
    image: redimp/otterwiki:2
    restart: unless-stopped
    volumes:
      - otterwiki-data:/app-data

volumes:
  otterwiki-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
