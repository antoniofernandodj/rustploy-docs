---
title: Hospedar Poste.io com Rustploy
description: "Servidor de e-mail corporativo completo (SMTP, IMAP, Antivírus) em uma única imagem estável. Crie Poste.io em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Poste.io**: Servidor de e-mail corporativo completo (SMTP, IMAP, Antivírus) em uma única imagem estável. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `poste.io` |
| **Containers** | 1 (`mailserver`) |
| **Imagens** | `analogic/poste.io` |
| **Porta da interface** | 8080, no serviço `mailserver` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Poste.io** e selecione.
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
| `TZ` | UTC |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `mailserver` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  mailserver:
    image: analogic/poste.io
    restart: unless-stopped
    hostname: mail.${DOMAIN}
    ports:
      - "25:25"
      - "110:110"
      - "143:143"
      - "465:465"
      - "587:587"
      - "993:993"
      - "995:995"
      - "4190:4190"
    environment:
      - TZ=${TZ}
      - HTTPS=OFF
      - HTTP_PORT=8080
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - poste-data:/data

volumes:
  poste-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
