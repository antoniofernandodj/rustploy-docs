---
title: Hospedar Phpmyadmin com Rustploy
description: "O clássico e amigável gerenciador web para bancos de dados MySQL e MariaDB. Crie Phpmyadmin em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Phpmyadmin**: O clássico e amigável gerenciador web para bancos de dados MySQL e MariaDB. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `phpmyadmin` |
| **Containers** | 2 (`db`, `phpmyadmin`) |
| **Imagens** | `mysql:5.7`, `phpmyadmin/phpmyadmin:5.2.1` |
| **Porta da interface** | 80, no serviço `phpmyadmin` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Phpmyadmin** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `root_password` | *senha aleatória de 32 caracteres* |
| `user_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `MYSQL_ROOT_PASSWORD` | ${root_password} |
| `MYSQL_DATABASE` | mysql |
| `MYSQL_USER` | phpmyadmin |
| `MYSQL_PASSWORD` | ${user_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `phpmyadmin` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: tu_base_de_datos
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql


  phpmyadmin:
    image: phpmyadmin/phpmyadmin:5.2.1
    environment:
      PMA_HOST: db
      PMA_USER: ${MYSQL_USER}
      PMA_PASSWORD: ${MYSQL_PASSWORD}
      PMA_ARBITRARY: 1
    depends_on:
      - db

volumes:
  db_data:
    driver: local
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
