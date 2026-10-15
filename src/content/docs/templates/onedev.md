---
title: Hospedar OneDev com Rustploy
description: "Servidor Git integrado com quadros Kanban e esteiras nativas de CI/CD. Crie OneDev em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**OneDev**: Servidor Git integrado com quadros Kanban e esteiras nativas de CI/CD. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `onedev` |
| **Containers** | 1 (`onedev`) |
| **Imagens** | `1dev/server:11.6.6` |
| **Porta da interface** | 6610, no serviço `onedev` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **OneDev** e selecione.
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
| `onedev` | 6610 | ${main_domain} |

## docker-compose.yml do template

```yaml
---
services:
  onedev:
    image: 1dev/server:11.6.6
    restart: always

    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
      - "onedev-data:/opt/onedev"
    
volumes:
  onedev-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
