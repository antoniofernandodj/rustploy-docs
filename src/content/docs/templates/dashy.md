---
title: Hospedar Dashy com Rustploy
description: "Dashboard pessoal customizável com monitoramento de status e widgets. Crie Dashy em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Dashy**: Dashboard pessoal customizável com monitoramento de status e widgets. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `dashy` |
| **Containers** | 1 (`dashy`) |
| **Imagens** | `lissy93/dashy:latest` |
| **Porta da interface** | 8080, no serviço `dashy` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Dashy** e selecione.
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
| `dashy` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  dashy:
    image: lissy93/dashy:latest
    restart: unless-stopped
    ports:
      - 8080
    volumes:
      - dashy-config:/app/user-data
volumes:
  dashy-config: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
