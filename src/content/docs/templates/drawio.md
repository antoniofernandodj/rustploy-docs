---
title: Hospedar draw.io com Rustploy
description: "Ferramenta avançada para desenho de diagramas e quadros brancos. Crie draw.io em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**draw.io**: Ferramenta avançada para desenho de diagramas e quadros brancos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `drawio` |
| **Containers** | 3 (`plantuml-server`, `image-export`, `drawio`) |
| **Imagens** | `plantuml/plantuml-server`, `jgraph/export-server`, `jgraph/drawio:24.7.17` |
| **Porta da interface** | 8080, no serviço `drawio` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **draw.io** e selecione.
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
| `DRAWIO_HOST` | ${main_domain} |
| `DRAWIO_BASE_URL` | https://${main_domain} |
| `DRAWIO_SERVER_URL` | https://${main_domain}/ |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `drawio` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3'
services:
  plantuml-server:
    image: plantuml/plantuml-server
    ports:
      - "8080"

    volumes:
      - fonts_volume:/usr/share/fonts/drawio
  image-export:
    image: jgraph/export-server
    ports:
      - "8000"

    volumes:
      - fonts_volume:/usr/share/fonts/drawio
    environment:
      - DRAWIO_BASE_URL=${DRAWIO_BASE_URL}
  drawio:
    image: jgraph/drawio:24.7.17
    ports:
      - "8080"
    links:
      - plantuml-server:plantuml-server
      - image-export:image-export
    depends_on:
      - plantuml-server
      - image-export

    environment:
      RAWIO_SELF_CONTAINED: 1
      DRAWIO_USE_HTTP: 1
      PLANTUML_URL: http://plantuml-server:8080/
      EXPORT_URL: http://image-export:8000/
      DRAWIO_BASE_URL: ${DRAWIO_BASE_URL}
      DRAWIO_SERVER_URL: ${DRAWIO_SERVER_URL}
      DRAWIO_CSP_HEADER: ${DRAWIO_CSP_HEADER}
      DRAWIO_VIEWER_URL: ${DRAWIO_VIEWER_URL}
      DRAWIO_LIGHTBOX_URL: ${DRAWIO_LIGHTBOX_URL}
      DRAWIO_CONFIG: ${DRAWIO_CONFIG}
      DRAWIO_GOOGLE_CLIENT_ID: ${DRAWIO_GOOGLE_CLIENT_ID}
      DRAWIO_GOOGLE_APP_ID: ${DRAWIO_GOOGLE_APP_ID}
      DRAWIO_GOOGLE_CLIENT_SECRET: ${DRAWIO_GOOGLE_CLIENT_SECRET}
      DRAWIO_GOOGLE_VIEWER_CLIENT_ID: ${DRAWIO_GOOGLE_VIEWER_CLIENT_ID}
      DRAWIO_GOOGLE_VIEWER_APP_ID: ${DRAWIO_GOOGLE_VIEWER_APP_ID}
      DRAWIO_GOOGLE_VIEWER_CLIENT_SECRET: ${DRAWIO_GOOGLE_VIEWER_CLIENT_SECRET}
      DRAWIO_MSGRAPH_CLIENT_ID: ${DRAWIO_MSGRAPH_CLIENT_ID}
      DRAWIO_MSGRAPH_CLIENT_SECRET: ${DRAWIO_MSGRAPH_CLIENT_SECRET}
      DRAWIO_MSGRAPH_TENANT_ID: ${DRAWIO_MSGRAPH_TENANT_ID}
      DRAWIO_GITLAB_ID: ${DRAWIO_GITLAB_ID}
      DRAWIO_GITLAB_SECRET: ${DRAWIO_GITLAB_SECRET}
      DRAWIO_GITLAB_URL: ${DRAWIO_GITLAB_URL}
      DRAWIO_CLOUD_CONVERT_APIKEY: ${DRAWIO_CLOUD_CONVERT_APIKEY}
volumes:
  fonts_volume:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
