---
title: Hospedar Glpi com Rustploy
description: "Aplicação Glpi. Crie Glpi em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Glpi**: Aplicação Glpi. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `glpi` |
| **Containers** | 2 (`glpi-mysql`, `glpi-web`) |
| **Imagens** | `mysql:9.1.0`, `elestio/glpi:10.0.16` |
| **Porta da interface** | 80, no serviço `glpi-web` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Glpi** e selecione.
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
| `glpi-web` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  glpi-mysql:
    image: mysql:9.1.0
    restart: always
    volumes:
      - glpi-mysql-data:/var/lib/mysql


  glpi-web:
    image: elestio/glpi:10.0.16
    restart: always
    volumes:
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
      - glpi-www-data:/var/www/html/glpi
    environment:
      - TIMEZONE=Europe/Brussels


volumes:
  glpi-mysql-data:
  glpi-www-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
