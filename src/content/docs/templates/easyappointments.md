---
title: Hospedar Easy!Appointments com Rustploy
description: "Sistema web para reservas e agendamentos de clientes. Crie Easy!Appointments em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Easy!Appointments**: Sistema web para reservas e agendamentos de clientes. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `easyappointments` |
| **Containers** | 2 (`easyappointments`, `mysql`) |
| **Imagens** | `alextselegidis/easyappointments:1.5.0`, `mysql:8.0` |
| **Porta da interface** | 80, no serviço `easyappointments` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Easy!Appointments** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DOMAIN` | ${main_domain} |
| `DB_PASSWORD` | ${db_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `easyappointments` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  easyappointments:
    image: alextselegidis/easyappointments:1.5.0
    restart: unless-stopped
    environment:
      - BASE_URL=http://${DOMAIN}
      - DB_HOST=mysql
      - DB_NAME=easyappointments
      - DB_USERNAME=root
      - DB_PASSWORD=${DB_PASSWORD}
    volumes:
      - easyappointments:/var/www/html
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_PASSWORD}
      - MYSQL_DATABASE=easyappointments
    volumes:
      - mysql:/var/lib/mysql

volumes:
  easyappointments:
  mysql:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
