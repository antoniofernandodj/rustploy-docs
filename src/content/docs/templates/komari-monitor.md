---
title: Hospedar Komari Monitor com Rustploy
description: "Painel web leve para visualização rápida de desempenho de hardware. Crie Komari Monitor em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Komari Monitor**: Painel web leve para visualização rápida de desempenho de hardware. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `komari-monitor` |
| **Containers** | 1 (`komari`) |
| **Imagens** | `ghcr.io/komari-monitor/komari:latest` |
| **Porta da interface** | 25774, no serviço `komari` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Komari Monitor** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `admin_password` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `ADMIN_USERNAME` | admin |
| `ADMIN_PASSWORD` | ${admin_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `komari` | 25774 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  komari:
    image: ghcr.io/komari-monitor/komari:latest
    restart: unless-stopped
    volumes:
      - komari-data:/app/data
    environment:
      - ADMIN_USERNAME
      - ADMIN_PASSWORD

volumes:
  komari-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
