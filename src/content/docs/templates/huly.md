---
title: Hospedar Huly com Rustploy
description: "Gerenciador de projetos e times tudo-em-um (Alternativa ao Jira, Linear e Slack). Crie Huly em um clique no Rustploy: 12 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Huly**: Gerenciador de projetos e times tudo-em-um (Alternativa ao Jira, Linear e Slack). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `huly` |
| **Containers** | 12 (`nginx`, `mongodb`, `minio`, `elastic`, `rekoni`, `transactor`, `collaborator`, `account`, `workspace`, `front`, `fulltext`, `stats`) |
| **Imagens** | `nginx:1.21.3`, `mongo:7-jammy`, `minio/minio:RELEASE.2024-11-07T00-52-20Z`, `elasticsearch:7.14.2`, `hardcoreeng/rekoni-service:${HULY_VERSION}`, `hardcoreeng/transactor:${HULY_VERSION}`, `hardcoreeng/collaborator:${HULY_VERSION}`, `hardcoreeng/account:${HULY_VERSION}`, `hardcoreeng/workspace:${HULY_VERSION}`, `hardcoreeng/front:${HULY_VERSION}`, `hardcoreeng/fulltext:${HULY_VERSION}`, `hardcoreeng/stats:${HULY_VERSION}` |
| **Porta da interface** | 80, no serviço `nginx` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Huly** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `huly_secret` | *chave base64 aleatória (64 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `HULY_VERSION` | v0.6.468 |
| `DOCKER_NAME` | huly |
| `HOST_ADDRESS` | ${main_domain} |
| `SECURE` |  |
| `HTTP_PORT` | 80 |
| `HTTP_BIND` |  |
| `TITLE` | Huly |
| `DEFAULT_LANGUAGE` | en |
| `LAST_NAME_FIRST` | true |
| `SECRET` | ${huly_secret} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `nginx` | 80 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/volumes/nginx/.huly.nginx`

## docker-compose.yml do template

```yaml
name: ${DOCKER_NAME}
version: "3"
services:
  nginx:

    image: "nginx:1.21.3"
    ports:
      - 80
    volumes:
      - ../files/volumes/nginx/.huly.nginx:/etc/nginx/conf.d/default.conf
    restart: unless-stopped

  mongodb:

    image: "mongo:7-jammy"
    environment:
      - PUID=1000
      - PGID=1000
    volumes:
      - db:/data/db
    restart: unless-stopped

  minio:

    image: "minio/minio:RELEASE.2024-11-07T00-52-20Z"
    command: server /data --address ":9000" --console-address ":9001"
    volumes:
      - files:/data
    restart: unless-stopped

  elastic:

    image: "elasticsearch:7.14.2"
    command: |
      /bin/sh -c "./bin/elasticsearch-plugin list | grep -q ingest-attachment || yes | ./bin/elasticsearch-plugin install --silent ingest-attachment;
      /usr/local/bin/docker-entrypoint.sh eswrapper"
    volumes:
      - elastic:/usr/share/elasticsearch/data
    environment:
      - ELASTICSEARCH_PORT_NUMBER=9200
      - BITNAMI_DEBUG=true
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms1024m -Xmx1024m
      - http.cors.enabled=true
      - http.cors.allow-origin=http://localhost:8082
    healthcheck:
      interval: 20s
      retries: 10
      test: curl -s http://localhost:9200/_cluster/health | grep -vq '"status":"red"'
    restart: unless-stopped

  rekoni:

    image: hardcoreeng/rekoni-service:${HULY_VERSION}
    environment:
      - SECRET=${SECRET}
    deploy:
      resources:
        limits:
          memory: 500M
    restart: unless-stopped

  transactor:

    image: hardcoreeng/transactor:${HULY_VERSION}
    environment:
      - SERVER_PORT=3333
      - SERVER_SECRET=${SECRET}
      - SERVER_CURSOR_MAXTIMEMS=30000
      - DB_URL=mongodb://mongodb:27017
      - MONGO_URL=mongodb://mongodb:27017
      - STORAGE_CONFIG=minio|minio?accessKey=minioadmin&secretKey=minioadmin
      - FRONT_URL=http://localhost:8087
      - ACCOUNTS_URL=http://account:3000
      - FULLTEXT_URL=http://fulltext:4700
      - STATS_URL=http://stats:4900
      - LAST_NAME_FIRST=${LAST_NAME_FIRST:-true}
    restart: unless-stopped

  collaborator:

    image: hardcoreeng/collaborator:${HULY_VERSION}
    environment:
      - COLLABORATOR_PORT=3078
      - SECRET=${SECRET}
      - ACCOUNTS_URL=http://account:3000
      - DB_URL=mongodb://mongodb:27017
      - STATS_URL=http://stats:4900
      - STORAGE_CONFIG=minio|minio?accessKey=minioadmin&secretKey=minioadmin
    restart: unless-stopped

  account:

    image: hardcoreeng/account:${HULY_VERSION}
    environment:
      - SERVER_PORT=3000
      - SERVER_SECRET=${SECRET}
      - DB_URL=mongodb://mongodb:27017
      - MONGO_URL=mongodb://mongodb:27017
      - TRANSACTOR_URL=ws://transactor:3333;ws${SECURE:+s}://${HOST_ADDRESS}/_transactor
      - STORAGE_CONFIG=minio|minio?accessKey=minioadmin&secretKey=minioadmin
      - FRONT_URL=http://front:8080
      - STATS_URL=http://stats:4900
      - MODEL_ENABLED=*
      - ACCOUNTS_URL=http://localhost:3000
      - ACCOUNT_PORT=3000
    restart: unless-stopped

  workspace:

    image: hardcoreeng/workspace:${HULY_VERSION}
    environment:
      - SERVER_SECRET=${SECRET}
      - DB_URL=mongodb://mongodb:27017
      - MONGO_URL=mongodb://mongodb:27017
      - TRANSACTOR_URL=ws://transactor:3333;ws${SECURE:+s}://${HOST_ADDRESS}/_transactor
      - STORAGE_CONFIG=minio|minio?accessKey=minioadmin&secretKey=minioadmin
      - MODEL_ENABLED=*
      - ACCOUNTS_URL=http://account:3000
      - STATS_URL=http://stats:4900
    restart: unless-stopped

  front:

    image: hardcoreeng/front:${HULY_VERSION}
    environment:
      - SERVER_PORT=8080
      - SERVER_SECRET=${SECRET}
      - LOVE_ENDPOINT=http${SECURE:+s}://${HOST_ADDRESS}/_love
      - ACCOUNTS_URL=http${SECURE:+s}://${HOST_ADDRESS}/_accounts
      - REKONI_URL=http${SECURE:+s}://${HOST_ADDRESS}/_rekoni
      - CALENDAR_URL=http${SECURE:+s}://${HOST_ADDRESS}/_calendar
      - GMAIL_URL=http${SECURE:+s}://${HOST_ADDRESS}/_gmail
      - TELEGRAM_URL=http${SECURE:+s}://${HOST_ADDRESS}/_telegram
      - STATS_URL=http${SECURE:+s}://${HOST_ADDRESS}/_stats
      - UPLOAD_URL=/files
      - ELASTIC_URL=http://elastic:9200
      - COLLABORATOR_URL=ws${SECURE:+s}://${HOST_ADDRESS}/_collaborator
      - STORAGE_CONFIG=minio|minio?accessKey=minioadmin&secretKey=minioadmin
      - DB_URL=mongodb://mongodb:27017
      - MONGO_URL=mongodb://mongodb:27017
      - TITLE=${TITLE:-Huly Self Host}
      - DEFAULT_LANGUAGE=${DEFAULT_LANGUAGE:-en}
      - LAST_NAME_FIRST=${LAST_NAME_FIRST:-true}
      - DESKTOP_UPDATES_CHANNEL=selfhost
    restart: unless-stopped

  fulltext:

    image: hardcoreeng/fulltext:${HULY_VERSION}
    environment:
      - SERVER_SECRET=${SECRET}
      - DB_URL=mongodb://mongodb:27017
      - FULLTEXT_DB_URL=http://elastic:9200
      - ELASTIC_INDEX_NAME=huly_storage_index
      - STORAGE_CONFIG=minio|minio?accessKey=minioadmin&secretKey=minioadmin
      - REKONI_URL=http://rekoni:4004
      - ACCOUNTS_URL=http://account:3000
      - STATS_URL=http://stats:4900
    restart: unless-stopped

  stats:

    image: hardcoreeng/stats:${HULY_VERSION}
    environment:
      - PORT=4900
      - SERVER_SECRET=${SECRET}
    restart: unless-stopped
volumes:
  db:
  elastic:
  files:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
