---
title: Hospedar Filestash com Rustploy
description: "Cliente web para conectar múltiplos armazenamentos a provedores de identidade. Crie Filestash em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Filestash**: Cliente web para conectar múltiplos armazenamentos a provedores de identidade. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `filestash` |
| **Containers** | 2 (`app`, `wopi_server`) |
| **Imagens** | `machines/filestash:latest`, `collabora/code:24.04.10.2.1` |
| **Porta da interface** | 8334, no serviço `app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Filestash** e selecione.
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
| `APPLICATION_URL` | ${main_domain} |
| `CANARY` | true |
| `OFFICE_URL` | http://wopi_server:9980 |
| `OFFICE_FILESTASH_URL` | http://app:8334 |
| `OFFICE_REWRITE_URL` | http://127.0.0.1:9980 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `app` | 8334 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.8'

services:
  app:
    image: machines/filestash:latest
    restart: always
    environment:
      - APPLICATION_URL=${APPLICATION_URL}
      - CANARY=${CANARY}
      - OFFICE_URL=${OFFICE_URL}
      - OFFICE_FILESTASH_URL=${OFFICE_FILESTASH_URL}
      - OFFICE_REWRITE_URL=${OFFICE_REWRITE_URL}
    ports:
      - 8334
    volumes:
      - filestash:/app/data/state/

  wopi_server:
    image: collabora/code:24.04.10.2.1
    restart: always
    environment:
      # Set below to "true" if you are using custom domain and want to enable SSL
      - extra_params=--o:ssl.enable=false
      - aliasgroup1=https://.*:443
    command:
      - /bin/bash
      - -c
      - |
          curl -o /usr/share/coolwsd/browser/dist/branding-desktop.css https://gist.githubusercontent.com/mickael-kerjean/bc1f57cd312cf04731d30185cc4e7ba2/raw/d706dcdf23c21441e5af289d871b33defc2770ea/destop.css
          /bin/su -s /bin/bash -c '/start-collabora-online.sh' cool
    user: root
    ports:
      - 9980

volumes:
  filestash:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
