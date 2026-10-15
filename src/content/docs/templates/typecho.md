---
title: Hospedar Typecho com Rustploy
description: "Um CMS leve, minimalista e rápido baseado em PHP focado na publicação de blogs simples. Crie Typecho em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Typecho**: Um CMS leve, minimalista e rápido baseado em PHP focado na publicação de blogs simples. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `typecho` |
| **Containers** | 2 (`typecho`, `db`) |
| **Imagens** | `80x86/typecho:latest`, `mysql:5.7` |
| **Porta da interface** | 80, no serviço `typecho` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Typecho** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 16 caracteres* |
| `root_password` | *senha aleatória de 16 caracteres* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `typecho` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  typecho:
    image: 80x86/typecho:latest
    restart: unless-stopped
    environment:
      PHP_TZ: Asia/Shanghai
      PHP_MAX_EXECUTION_TIME: 600
    volumes:
      - typecho_data:/data
    depends_on:
      - db

  db:
    image: mysql:5.7
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: typecho
      MYSQL_USER: typecho
      MYSQL_PASSWORD: typecho_password
      MYSQL_ROOT_PASSWORD: root_password
    volumes:
      - db_data:/var/lib/mysql

volumes:
  typecho_data:
  db_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
