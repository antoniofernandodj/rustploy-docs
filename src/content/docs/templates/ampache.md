---
title: Hospedar Ampache com Rustploy
description: "Central de streaming e gerenciamento de músicas/vídeos. Crie Ampache em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Ampache**: Central de streaming e gerenciamento de músicas/vídeos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `ampache` |
| **Containers** | 1 (`ampache`) |
| **Imagens** | `ampache/ampache:latest` |
| **Porta da interface** | 80, no serviço `ampache` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Ampache** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `media_path` | /path/to/your/media |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `MEDIA_PATH` | ${media_path} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `ampache` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  ampache:
    image: ampache/ampache:latest
    restart: unless-stopped
    ports:
      - 80
    volumes:
      - config:/var/www/config
      - log:/var/log/ampache
      - mysql:/var/lib/mysql
      - ${MEDIA_PATH}:/media

volumes:
  config: {}
  log: {}
  mysql: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
