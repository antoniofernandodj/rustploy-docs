---
title: Hospedar BabyBuddy com Rustploy
description: "Monitor de rotina para cuidados e desenvolvimento de bebês. Crie BabyBuddy em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**BabyBuddy**: Monitor de rotina para cuidados e desenvolvimento de bebês. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `babybuddy` |
| **Containers** | 1 (`babybuddy`) |
| **Imagens** | `linuxserver/babybuddy:2.7.0` |
| **Porta da interface** | 8000, no serviço `babybuddy` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **BabyBuddy** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_key` | *senha aleatória de 32 caracteres* |
| `time_zone` | America/New_York |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DOMAIN` | ${main_domain} |
| `SECRET_KEY` | ${secret_key} |
| `TIME_ZONE` | ${time_zone} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `babybuddy` | 8000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  babybuddy:
    image: linuxserver/babybuddy:2.7.0
    restart: unless-stopped
    ports:
      - 8000
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=UTC
      - CSRF_TRUSTED_ORIGINS=https://${DOMAIN}
      - TIME_ZONE=${TIME_ZONE:-UTC}
      - SECRET_KEY=${SECRET_KEY}
    volumes:
      - config:/config

volumes:
  config: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
