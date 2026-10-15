---
title: Hospedar Chevereto com Rustploy
description: "Plataforma robusta de hospedagem e compartilhamento de imagens/vídeos. Crie Chevereto em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Chevereto**: Plataforma robusta de hospedagem e compartilhamento de imagens/vídeos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `chevereto` |
| **Containers** | 2 (`chevereto`, `mysql`) |
| **Imagens** | `chevereto/chevereto:4`, `mysql:8` |
| **Porta da interface** | 80, no serviço `chevereto` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Chevereto** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DB_PASSWORD` | ${db_password} |
| `DOMAIN` | ${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `chevereto` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.8'

services:
  chevereto:
    image: chevereto/chevereto:4
    restart: unless-stopped
    environment:
      - CHEVERETO_DB_HOST=mysql
      - CHEVERETO_DB_USER=mysql
      - CHEVERETO_DB_PASS=${DB_PASSWORD}
      - CHEVERETO_DB_PORT=3306
      - CHEVERETO_DB_NAME=chevereto
      - CHEVERETO_HOSTNAME=${DOMAIN}
      - CHEVERETO_HOSTNAME_PATH=/
      - CHEVERETO_HTTPS=0
      - CHEVERETO_MAX_POST_SIZE=2G
      - CHEVERETO_MAX_UPLOAD_SIZE=2G
    ports:
      - 80
    volumes:
      - storage:/var/www/html/images/
    depends_on:
      - mysql

  mysql:
    image: mysql:8
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_PASSWORD}
      - MYSQL_DATABASE=chevereto
      - MYSQL_USER=mysql
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - mysql:/var/lib/mysql

volumes:
  storage:
  mysql:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
