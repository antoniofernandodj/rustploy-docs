---
title: Hospedar Grimoire com Rustploy
description: "Organizador e salvador de favoritos (bookmarks) ultra veloz. Crie Grimoire em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Grimoire**: Organizador e salvador de favoritos (bookmarks) ultra veloz. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `grimoire` |
| **Containers** | 1 (`grimoire`) |
| **Imagens** | `goniszewski/grimoire:latest` |
| **Porta da interface** | 5173, no serviço `grimoire` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Grimoire** e selecione.
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
| `PORT` | 5173 |
| `PUBLIC_ORIGIN` | https://${main_domain} |
| `PUBLIC_HTTPS_ONLY` | true |
| `PUBLIC_SIGNUP_DISABLED` | false |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `grimoire` | 5173 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  grimoire:
    image: goniszewski/grimoire:latest
    restart: unless-stopped
    volumes:
      - grimoire_data:/app/data
    ports:
      - "5173"
volumes:
  grimoire_data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
