---
title: Hospedar Stalwart com Rustploy
description: "Servidor de e-mail moderno completo escrito em Rust com suporte a JMAP, IMAP e criptografia nativa. Crie Stalwart em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Stalwart**: Servidor de e-mail moderno completo escrito em Rust com suporte a JMAP, IMAP e criptografia nativa. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `stalwart` |
| **Containers** | 1 (`stalwart-mail`) |
| **Imagens** | `stalwartlabs/stalwart:latest-alpine` |
| **Porta da interface** | 8080, no serviço `stalwart-mail` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Stalwart** e selecione.
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
| `stalwart-mail` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  stalwart-mail:
    image: stalwartlabs/stalwart:latest-alpine # for production choose specific version from https://hub.docker.com/r/stalwartlabs/stalwart/tags
    ports:
      - "443"    # HTTPS
      - "8080"   # HTTP API
      - "25"     # SMTP
      - "587"    # Submission
      - "465"    # SMTPS
      - "143"    # IMAP
      - "993"    # IMAPS
      - "4190"   # ManageSieve
      - "110"    # POP3
      - "995"    # POP3S
    volumes:
      - stalwart_data:/opt/stalwart-mail
    restart: unless-stopped

volumes:
  stalwart_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
