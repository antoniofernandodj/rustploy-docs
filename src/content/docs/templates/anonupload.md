---
title: Hospedar AnonUpload com Rustploy
description: "Compartilhamento anônimo e seguro de arquivos (sem banco de dados). Crie AnonUpload em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**AnonUpload**: Compartilhamento anônimo e seguro de arquivos (sem banco de dados). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `anonupload` |
| **Containers** | 1 (`anonupload`) |
| **Imagens** | `ghcr.io/supernova3339/anonfiles:1` |
| **Porta da interface** | 80, no serviço `anonupload` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **AnonUpload** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `admin_email` | *e-mail gerado* |
| `admin_password` | *senha aleatória de 16 caracteres* |
| `contact_email` | *e-mail gerado* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `ADMIN_EMAIL` | ${admin_email} |
| `ADMIN_PASSWORD` | ${admin_password} |
| `CONTACT_EMAIL` | ${contact_email} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `anonupload` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  anonupload:
    image: ghcr.io/supernova3339/anonfiles:1
    restart: unless-stopped
    ports:
      - 80
    environment:
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - CONTACT_EMAIL=${CONTACT_EMAIL}
    volumes:
      - uploads:/var/www/html/uploads

volumes:
  uploads: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
