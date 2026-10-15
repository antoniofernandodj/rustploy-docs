---
title: Hospedar LinkStack com Rustploy
description: "Plataforma estilo \"Link na Bio\" altamente customizável para agregação de redes sociais. Crie LinkStack em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**LinkStack**: Plataforma estilo "Link na Bio" altamente customizável para agregação de redes sociais. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `linkstack` |
| **Containers** | 2 (`linkstack`, `mysql`) |
| **Imagens** | `linkstackorg/linkstack:latest`, `mysql:8` |
| **Porta da interface** | 80, no serviço `linkstack` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **LinkStack** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `admin_email` | *e-mail gerado* |
| `mysql_root_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `TZ` | Europe/Berlin |
| `SERVER_ADMIN` | ${admin_email} |
| `HTTP_SERVER_NAME` | ${main_domain} |
| `HTTPS_SERVER_NAME` | ${main_domain} |
| `LOG_LEVEL` | info |
| `PHP_MEMORY_LIMIT` | 256M |
| `UPLOAD_MAX_FILESIZE` | 8M |
| `MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `linkstack` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  linkstack:
    image: linkstackorg/linkstack:latest
    environment:
      TZ: "Europe/Berlin"
      SERVER_ADMIN: "${admin_email}"
      HTTP_SERVER_NAME: "${main_domain}"
      HTTPS_SERVER_NAME: "${main_domain}"
      LOG_LEVEL: "info"
      PHP_MEMORY_LIMIT: "256M"
      UPLOAD_MAX_FILESIZE: "8M"
    volumes:
      - linkstack-data:/htdocs
    restart: unless-stopped
    depends_on:
      - mysql

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: ${mysql_root_password}
    volumes:
      - mysql-data:/var/lib/mysql
    restart: unless-stopped

volumes:
  linkstack-data: {}
  mysql-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
