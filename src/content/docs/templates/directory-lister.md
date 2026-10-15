---
title: Hospedar Directory Lister com Rustploy
description: "Script simples em PHP para listagem e navegação de diretórios web. Crie Directory Lister em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Directory Lister**: Script simples em PHP para listagem e navegação de diretórios web. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `directory-lister` |
| **Containers** | 1 (`directory-lister`) |
| **Imagens** | `directorylister/directorylister:latest` |
| **Porta da interface** | 80, no serviço `directory-lister` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Directory Lister** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `app_domain` | *domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `APP_LANGUAGE` | en |
| `DISPLAY_READMES` | true |
| `READMES_FIRST` | false |
| `ZIP_DOWNLOADS` | true |
| `TIMEZONE` | UTC |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `directory-lister` | 80 | ${app_domain} |

## docker-compose.yml do template

```yaml
services:
  directory-lister:
    image: directorylister/directorylister:latest
    restart: unless-stopped
    ports:
      # The internal port of the application.
      - 80
    volumes:
      # Mounts a persistent named volume to store directory data.
      - directory-lister-data:/data

volumes:
  # Defines the Docker-managed volume for data persistence.
  directory-lister-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
