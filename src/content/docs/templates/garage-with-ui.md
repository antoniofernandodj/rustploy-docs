---
title: Hospedar Garage With Ui com Rustploy
description: "Aplicação Garage With Ui. Crie Garage With Ui em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Garage With Ui**: Aplicação Garage With Ui. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `garage-with-ui` |
| **Containers** | 2 (`garage`, `garage-webui`) |
| **Imagens** | `dxflrs/garage:v2.0.0`, `khairul169/garage-webui:1.1.0` |
| **Porta da interface** | 3900, no serviço `garage` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Garage With Ui** e selecione.
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
| `` |  |
| `# To set up auth for the web-ui please go here: https://github.com/khairul169/garage-webui?tab` | readme-ov-file#authentication |
| `# or run this command: htpasswd -nbBC 10 'YOUR_USERNAME' 'YOUR_PASSWORD' and paste the output in here.` |  |
| `AUTH_USER_PASS` |  |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `garage` | 3900 | ${main_domain} |
| `garage-webui` | 3909 | ${webui_domain} |

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

  garage-webui:
    image: khairul169/garage-webui:1.1.0
    restart: unless-stopped
    volumes:
      - ../files/garage.toml:/etc/garage.toml:ro
    ports:
      - 3909
    environment:
      - AUTH_USER_PASS
      - API_BASE_URL
      - S3_ENDPOINT_URL

volumes:
  garage-storage: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
