---
title: Hospedar Mattermost com Rustploy
description: "Plataforma de chat corporativo e colaboração técnica focada em DevOps. Crie Mattermost em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Mattermost**: Plataforma de chat corporativo e colaboração técnica focada em DevOps. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `mattermost` |
| **Containers** | 2 (`postgres`, `mattermost`) |
| **Imagens** | `postgres:17`, `mattermost/mattermost-team-edition:10.6.1` |
| **Porta da interface** | 8065, no serviço `mattermost` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Mattermost** e selecione.
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
| `Domain` | ${main_domain} |
| `POSTGRES_USER` | mmuser |
| `POSTGRES_PASSWORD` | *senha aleatória de 32 caracteres* |
| `POSTGRES_DB` | mattermost |
| `MM_SQLSETTINGS_DRIVERNAME` | postgres |
| `MM_SQLSETTINGS_DATASOURCE` | postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?sslmode=disable&connect_timeout=10 |
| `APP_PORT` | 8065 |
| `TZ` | UTC |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `mattermost` | 8065 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  postgres:
    image: postgres:17
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    pids_limit: 100
    read_only: true
    tmpfs:
      - /tmp
      - /var/run/postgresql
    volumes:
      - mattermostDbData:/var/lib/postgresql/data
    environment:
      - TZ
      - POSTGRES_USER
      - POSTGRES_PASSWORD
      - POSTGRES_DB

  mattermost:
    depends_on:
      - postgres
    image: mattermost/mattermost-team-edition:10.6.1
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    pids_limit: 200
    read_only: false
    tmpfs:
      - /tmp
    volumes:
      - mattermostconf:/mattermost/config:rw
      - mattermostdata:/mattermost/data:rw
      - mattermostlogs:/mattermost/logs:rw
      - mattermostplugsin:/mattermost/plugins:rw
      - mattermostclientplugins:/mattermost/client/plugins:rw
      - mattermostBleveIndexes:/mattermost/bleve-indexes:rw
      
    environment:
      - DOMAIN
      - TZ
      - POSTGRES_USER
      - POSTGRES_PASSWORD
      - POSTGRES_DB
      - MM_SQLSETTINGS_DRIVERNAME
      - MM_SQLSETTINGS_DATASOURCE
      - MM_BLEVESETTINGS_INDEXDIR
      - MM_SERVICESETTINGS_SITEURL
      - APP_PORT


volumes:
  mattermostDbData:
    driver: local
  mattermostconf:
    driver: local
  mattermostdata:
    driver: local
  mattermostlogs:
    driver: local
  mattermostplugsin:
    driver: local
  mattermostclientplugins:
    driver: local
  mattermostBleveIndexes:
    driver: local
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
