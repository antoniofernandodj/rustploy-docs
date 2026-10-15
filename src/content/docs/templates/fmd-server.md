---
title: Hospedar FMD Server com Rustploy
description: "Painel de controle e localização de dispositivos Android via Find My Device. Crie FMD Server em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**FMD Server**: Painel de controle e localização de dispositivos Android via Find My Device. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `fmd-server` |
| **Containers** | 1 (`fmd-server`) |
| **Imagens** | `registry.gitlab.com/fmd-foss/fmd-server:v0.11.0` |
| **Porta da interface** | 8080, no serviço `fmd-server` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **FMD Server** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `registration_token` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `FMD_REGISTRATIONTOKEN` | ${registration_token} |
| `FMD_USERIDLENGTH` | 5 |
| `FMD_MAXSAVEDLOC` | 1000 |
| `FMD_MAXSAVEDPIC` | 10 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `fmd-server` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  fmd-server:
    image: registry.gitlab.com/fmd-foss/fmd-server:v0.11.0
    ports:
     - 8080
    environment:
      # View all configurations at:
      #     - https://gitlab.com/fmd-foss/fmd-server/-/blob/master/config.example.yml
      #
      # Config fields can be converted to environment variables as per the documentation
      #     - https://gitlab.com/fmd-foss/fmd-server#via-environment-variables
      # e.g. RegistrationToken -> FMD_REGISTRATIONTOKEN
      #
      - FMD_REGISTRATIONTOKEN=${FMD_REGISTRATIONTOKEN}
      - FMD_USERIDLENGTH=${FMD_USERIDLENGTH}
      - FMD_MAXSAVEDLOC=${FMD_MAXSAVEDLOC}
      - FMD_MAXSAVEDPIC=${FMD_MAXSAVEDPIC}
    volumes:
      - fmd-server-data:/var/lib/fmd-server/db/
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "timeout 10s bash -c ':> /dev/tcp/127.0.0.1/8080'"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s
      start_interval: 3s

volumes:
  fmd-server-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
