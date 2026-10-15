---
title: Hospedar Garage com Rustploy
description: "Aplicação Garage. Crie Garage em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Garage**: Aplicação Garage. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `garage` |
| **Containers** | 1 (`garage`) |
| **Imagens** | `dxflrs/garage:v2.0.0` |
| **Porta da interface** | 3900, no serviço `garage` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Garage** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `webui_domain` | web-ui.*domínio (gerado; troque pelo seu)* |
| `admin_token` | *chave base64 aleatória (32 bytes)* |
| `metrics_token` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `API_BASE_URL` | http://garage:3903 |
| `S3_ENDPOINT_URL` | http://garage:3900 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `garage` | 3900 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `garage.toml`

## docker-compose.yml do template

```yaml
services:
  garage:
    image: dxflrs/garage:v2.0.0
    volumes:
      - ../files/garage.toml:/etc/garage.toml
      - garage-storage:/var/lib/garage
      - garage-storage:/var/lib/garage
    restart: unless-stopped
    ports:
      - 3900
      - 3901
      - 3902
      - 3903

volumes:
  garage-storage: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
