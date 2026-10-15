---
title: Hospedar Conduwuit com Rustploy
description: "Versão otimizada e rica em recursos do servidor Matrix Conduit. Crie Conduwuit em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Conduwuit**: Versão otimizada e rica em recursos do servidor Matrix Conduit. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `conduwuit` |
| **Containers** | 1 (`homeserver`) |
| **Imagens** | `girlbossceo/conduwuit:latest` |
| **Porta da interface** | 6167, no serviço `homeserver` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Conduwuit** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `registration_token` | *senha aleatória de 20 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `CONDUWUIT_SERVER_NAME` | ${main_domain} |
| `CONDUWUIT_REGISTRATION_TOKEN` | ${registration_token} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `homeserver` | 6167 | ${main_domain} |

## docker-compose.yml do template

```yaml
# conduwuit
# https://conduwuit.puppyirl.gay/deploying/docker-compose.yml

services:
  homeserver:
    image: girlbossceo/conduwuit:latest
    restart: unless-stopped
    ports:
      - 8448:6167
    volumes:
      - db:/var/lib/conduwuit
      #- ./conduwuit.toml:/etc/conduwuit.toml
    environment:
      # Edit this in your Dokploy Environment
      CONDUWUIT_SERVER_NAME: ${CONDUWUIT_SERVER_NAME}

      CONDUWUIT_DATABASE_PATH: /var/lib/conduwuit
      CONDUWUIT_PORT: 6167
      CONDUWUIT_MAX_REQUEST_SIZE: 20000000 # in bytes, ~20 MB

      CONDUWUIT_ALLOW_REGISTRATION: 'true'
      CONDUWUIT_REGISTRATION_TOKEN: ${CONDUWUIT_REGISTRATION_TOKEN}

      CONDUWUIT_ALLOW_FEDERATION: 'true'
      CONDUWUIT_ALLOW_CHECK_FOR_UPDATES: 'true'
      CONDUWUIT_TRUSTED_SERVERS: '["matrix.org"]'
      #CONDUWUIT_LOG: warn,state_res=warn
      CONDUWUIT_ADDRESS: 0.0.0.0

      # Uncomment if you mapped config toml in volumes
      #CONDUWUIT_CONFIG: '/etc/conduwuit.toml'

  ### Uncomment if you want to use your own Element-Web App.
  ### Note: You need to provide a config.json for Element and you also need a second
  ###     Domain or Subdomain for the communication between Element and conduwuit
  ### Config-Docs: https://github.com/vector-im/element-web/blob/develop/docs/config.md
  # element-web:
  #   image: vectorim/element-web:latest
  #   restart: unless-stopped
  #   ports:
  #     - 8009:80
  #   volumes:
  #     - ./element_config.json:/app/config.json
  #   depends_on:
  #     - homeserver

volumes:
  db:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
