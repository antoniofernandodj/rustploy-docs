---
title: Hospedar Nginx com Rustploy
description: "O clássico servidor web de altíssima performance e proxy reverso. Crie Nginx em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Nginx**: O clássico servidor web de altíssima performance e proxy reverso. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `nginx` |
| **Containers** | 1 (`nginx`) |
| **Imagens** | `nginx:latest` |
| **Porta da interface** | 80, no serviço `nginx` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Nginx** e selecione.
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
| `nginx` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  nginx:
    image: nginx:latest
    restart: unless-stopped
    ports:
      - 80
      - 443
    volumes:
      - nginx-config:/etc/nginx
      - nginx-html:/usr/share/nginx/html
volumes:
  nginx-config: {}
  nginx-html: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
