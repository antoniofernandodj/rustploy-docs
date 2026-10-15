---
title: Host Elasticsearch with Rustploy
description: "Distributed full-text search and real-time analytics engine. Create Elasticsearch in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Elasticsearch**: Distributed full-text search and real-time analytics engine. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `elastic-search` |
| **Containers** | 2 (`elasticsearch`, `kibana`) |
| **Images** | `docker.elastic.co/elasticsearch/elasticsearch:8.10.2`, `docker.elastic.co/kibana/kibana:8.10.2` |
| **UI port** | 5601, on service `kibana` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Elasticsearch** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `api_domain` | *domain (generated; replace it with yours)* |

## Domains

| Service | Port | Host |
|---|---|---|
| `kibana` | 5601 | ${main_domain} |
| `elasticsearch` | 9200 | ${api_domain} |

## The template docker-compose.yml

```yaml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.10.2
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - bootstrap.memory_lock=true
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
    ulimits:
      memlock:
        soft: -1
        hard: -1
    ports:
      - "9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data

  kibana:
    image: docker.elastic.co/kibana/kibana:8.10.2
    container_name: kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601"
    depends_on:
      - elasticsearch

volumes:
  es_data:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
