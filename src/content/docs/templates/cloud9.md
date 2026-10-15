---
title: Hospedar Cloud9 com Rustploy
description: "IDE completa na nuvem para codificação colaborativa em tempo real. Crie Cloud9 em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Cloud9**: IDE completa na nuvem para codificação colaborativa em tempo real. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `cloud9` |
| **Containers** | 1 (`cloud9`) |
| **Imagens** | `lscr.io/linuxserver/cloud9:1.29.2` |
| **Porta da interface** | 8000, no serviço `cloud9` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Cloud9** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `USERNAME` | user |
| `PASSWORD` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `USERNAME` | ${USERNAME} |
| `PASSWORD` | ${PASSWORD} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `cloud9` | 8000 | *domínio (gerado; troque pelo seu)* |

## docker-compose.yml do template

```yaml
version: "3"

services:
  cloud9:
    image: lscr.io/linuxserver/cloud9:1.29.2
    ports:
      - "8000"
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/London
      - GITURL=https://github.com/linuxserver/docker-cloud9.git
      - USERNAME=${USERNAME}
      - PASSWORD=${PASSWORD}
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - code:/code

volumes:
  code:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
