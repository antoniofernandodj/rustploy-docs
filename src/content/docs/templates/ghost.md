---
title: Hospedar Ghost com Rustploy
description: "Plataforma profissional e moderna para publicação de blogs e newsletters. Crie Ghost em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Ghost**: Plataforma profissional e moderna para publicação de blogs e newsletters. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `ghost` |
| **Containers** | 2 (`ghost`, `db`) |
| **Imagens** | `ghost:6-alpine`, `mysql:8.0` |
| **Porta da interface** | 2368, no serviço `ghost` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Ghost** e selecione.
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
| `GHOST_HOST` | ${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `ghost` | 2368 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  ghost:
    image: ghost:6-alpine
    restart: always
    environment:
      database__client: mysql
      database__connection__host: db
      database__connection__user: root
      database__connection__password: example
      database__connection__database: ghost
      url: http://${GHOST_HOST}

    volumes:
      - ghost:/var/lib/ghost/content

  db:
    image: mysql:8.0
    restart: always

    environment:
      MYSQL_ROOT_PASSWORD: example
    volumes:
      - db:/var/lib/mysql

volumes:
  ghost:
  db:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
