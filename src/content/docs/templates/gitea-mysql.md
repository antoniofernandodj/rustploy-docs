---
title: Hospedar Gitea (MySQL) com Rustploy
description: "Servidor Git Gitea configurado com banco de dados MySQL. Crie Gitea (MySQL) em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Gitea (MySQL)**: Servidor Git Gitea configurado com banco de dados MySQL. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `gitea-mysql` |
| **Containers** | 2 (`gitea`, `mysql`) |
| **Imagens** | `docker.gitea.com/gitea:1.24.4`, `docker.io/library/mysql:8` |
| **Porta da interface** | 3000, no serviço `gitea` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Gitea (MySQL)** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 24 caracteres* |
| `db_root_password` | *senha aleatória de 24 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `USER_UID` | 1000 |
| `USER_GID` | 1000 |
| `GITEA__database__DB_TYPE` | mysql |
| `GITEA__database__HOST` | mysql:3306 |
| `GITEA__database__NAME` | gitea |
| `GITEA__database__USER` | gitea |
| `GITEA__database__PASSWD` | ${db_password} |
| `GITEA_DB_PASSWORD` | ${db_password} |
| `MYSQL_ROOT_PASSWORD` | ${db_root_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `gitea` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  gitea:
    image: docker.gitea.com/gitea:1.24.4
    restart: unless-stopped
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - GITEA__database__DB_TYPE=mysql
      - GITEA__database__HOST=mysql:3306
      - GITEA__database__NAME=gitea
      - GITEA__database__USER=gitea
      - GITEA__database__PASSWD=${GITEA_DB_PASSWORD:-gitea}
    volumes:
      - gitea-data:/data
    expose:
      - "3000"
      - "22"
    depends_on:
      - mysql
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/"]
      interval: 15s
      timeout: 5s
      retries: 10

  mysql:
    image: docker.io/library/mysql:8
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD:-gitea}
      - MYSQL_USER=gitea
      - MYSQL_PASSWORD=${GITEA_DB_PASSWORD:-gitea}
      - MYSQL_DATABASE=gitea
    command: ["--default-authentication-plugin=mysql_native_password"]
    volumes:
      - mysql-data:/var/lib/mysql
    expose:
      - "3306"

volumes:
  gitea-data: {}
  mysql-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
