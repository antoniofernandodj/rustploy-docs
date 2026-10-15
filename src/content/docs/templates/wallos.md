---
title: Hospedar Wallos com Rustploy
description: "Rastreador pessoal focado no monitoramento financeiro de assinaturas mensais e gastos recorrentes. Crie Wallos em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Wallos**: Rastreador pessoal focado no monitoramento financeiro de assinaturas mensais e gastos recorrentes. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `wallos` |
| **Containers** | 1 (`wallos`) |
| **Imagens** | `bellamy/wallos:latest` |
| **Porta da interface** | 80, no serviço `wallos` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Wallos** e selecione.
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
| `wallos` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.8'
services:
  wallos:
    image: bellamy/wallos:latest
    ports:
      - '80'
    environment:
      TZ: 'Europe/Paris'
    volumes:
      - wallos_db:/var/www/html/db
      - wallos_logos:/var/www/html/images/uploads/logos
    restart: unless-stopped

volumes:
  wallos_db:
  wallos_logos:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
