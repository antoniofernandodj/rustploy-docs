---
title: Hospedar Vaultwarden com Rustploy
description: "Implementação leve em Rust compatível com toda a suíte de aplicativos do Bitwarden. Crie Vaultwarden em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Vaultwarden**: Implementação leve em Rust compatível com toda a suíte de aplicativos do Bitwarden. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `vaultwarden` |
| **Containers** | 1 (`vaultwarden`) |
| **Imagens** | `vaultwarden/server:1.34.3` |
| **Porta da interface** | 80, no serviço `vaultwarden` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Vaultwarden** e selecione.
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
| `SIGNUPS_ALLOWED` | true |
| `DOMAIN` | https://${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `vaultwarden` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
# the webserver can take a while to start up, so don't be alarmed if it takes a few minutes to get a response
services:
  vaultwarden:
    image: vaultwarden/server:1.34.3
    restart: always
    environment:
      DOMAIN: ${DOMAIN}
      SIGNUPS_ALLOWED: ${SIGNUPS_ALLOWED}
    volumes:
      - vaultwarden:/data
    expose:
      - 80

volumes:
  vaultwarden:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
