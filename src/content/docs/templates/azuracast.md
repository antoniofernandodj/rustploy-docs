---
title: Hospedar AzuraCast com Rustploy
description: "Painel completo \"all-in-one\" para gerenciamento de Web Rádios. Crie AzuraCast em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**AzuraCast**: Painel completo "all-in-one" para gerenciamento de Web Rádios. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `azuracast` |
| **Containers** | 2 (`azuracast`, `mariadb`) |
| **Imagens** | `ghcr.io/azuracast/azuracast:latest`, `mariadb:11.4` |
| **Porta da interface** | 80, no serviço `azuracast` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **AzuraCast** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `mysql_root_password` | *senha aleatória de 32 caracteres* |
| `mysql_password` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `LANG` | en_US.UTF-8 |
| `AZURACAST_DC_REVISION` | 1 |
| `MYSQL_HOST` | mariadb |
| `MYSQL_PORT` | 3306 |
| `MYSQL_USER` | azuracast |
| `MYSQL_PASSWORD` | ${mysql_password} |
| `MYSQL_DATABASE` | azuracast |
| `MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |
| `LETSENCRYPT_HOST` | ${main_domain} |
| `VIRTUAL_HOST` | ${main_domain} |
| `DISABLE_LETSENCRYPT` | true |
| `AUTO_ASSIGN_PORT_HTTP` | 80 |
| `AUTO_ASSIGN_PORT_HTTPS` | 443 |
| `NGINX_RADIO_PORTS` | 8000,8010,8020,8030,8040,8050 |
| `PREFER_RELEASE_BUILDS` | true |
| `COMPOSER_PLUGIN_MODE` | false |
| `ADDITIONAL_MEDIA_SYNC_WORKER_COUNT` | 0 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `azuracast` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  azuracast:
    image: ghcr.io/azuracast/azuracast:latest
    restart: unless-stopped
    ports:
      - 80
    volumes:
      - azuracast-station-data:/var/azuracast/stations
      - azuracast-data:/var/azuracast/www_tmp
      - azuracast-uploads:/var/azuracast/uploads
      - azuracast-backups:/var/azuracast/backups
    environment:
      - LANG=en_US.UTF-8
      - AZURACAST_DC_REVISION=1
      - MYSQL_HOST=mariadb
      - MYSQL_PORT=3306
      - MYSQL_USER=azuracast
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - MYSQL_DATABASE=azuracast
    depends_on:
      - mariadb

  mariadb:
    image: mariadb:11.4
    restart: unless-stopped
    volumes:
      - mariadb-data:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=azuracast
      - MYSQL_USER=azuracast
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}

volumes:
  azuracast-station-data: {}
  azuracast-data: {}
  azuracast-uploads: {}
  azuracast-backups: {}
  mariadb-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
