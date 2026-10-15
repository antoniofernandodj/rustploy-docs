---
title: Hospedar Dozzle com Rustploy
description: "Visualizador leve e em tempo real para logs de containers Docker. Crie Dozzle em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Dozzle**: Visualizador leve e em tempo real para logs de containers Docker. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `dozzle` |
| **Containers** | 1 (`dozzle`) |
| **Imagens** | `amir20/dozzle:latest` |
| **Porta da interface** | 8080, no serviço `dozzle` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Dozzle** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `docker_socket` | /var/run/docker.sock |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DOZZLE_USERNAME` | *usuário gerado* |
| `DOZZLE_PASSWORD` | *senha aleatória de 16 caracteres* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `dozzle` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  dozzle:
    image: amir20/dozzle:latest
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    expose:
      - 8080
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
