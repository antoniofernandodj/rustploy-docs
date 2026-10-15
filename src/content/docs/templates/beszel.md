---
title: Hospedar Beszel com Rustploy
description: "Monitor leve de servidores com estatísticas de containers e alertas. Crie Beszel em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Beszel**: Monitor leve de servidores com estatísticas de containers e alertas. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `beszel` |
| **Containers** | 1 (`beszel`) |
| **Imagens** | `henrygd/beszel:0.10.2` |
| **Porta da interface** | 8090, no serviço `beszel` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Beszel** e selecione.
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
| `beszel` | 8090 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  beszel:
    image: henrygd/beszel:0.10.2
    restart: unless-stopped
    ports:
      - 8090
    volumes:
      - beszel_data:/beszel_data
      - /var/run/docker.sock:/var/run/docker.sock:ro

volumes:
  beszel_data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
