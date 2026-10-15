---
title: Hospedar Roundcube com Rustploy
description: "Cliente tradicional de webmail baseado em PHP para caixas de e-mail IMAP. Crie Roundcube em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Roundcube**: Cliente tradicional de webmail baseado em PHP para caixas de e-mail IMAP. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `roundcube` |
| **Containers** | 1 (`roundcubemail`) |
| **Imagens** | `roundcube/roundcubemail:1.6.9-apache` |
| **Porta da interface** | 80, no serviço `roundcubemail` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Roundcube** e selecione.
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
| `DEFAULT_HOST` | tls://mail.example.com |
| `SMTP_SERVER` | tls://mail.example.com |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `roundcubemail` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  roundcubemail:
    image: roundcube/roundcubemail:1.6.9-apache
    volumes:
      - ./www:/var/www/html
      - ./db/sqlite:/var/roundcube/db
    environment:
      - ROUNDCUBEMAIL_DB_TYPE=sqlite
      - ROUNDCUBEMAIL_SKIN=elastic
      - ROUNDCUBEMAIL_DEFAULT_HOST=${DEFAULT_HOST}
      - ROUNDCUBEMAIL_SMTP_SERVER=${SMTP_SERVER}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
