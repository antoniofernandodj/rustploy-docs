---
title: Hospedar DumbDrop com Rustploy
description: "Compartilhador de arquivos de uso único temporário e anônimo. Crie DumbDrop em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**DumbDrop**: Compartilhador de arquivos de uso único temporário e anônimo. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `dumbdrop` |
| **Containers** | 1 (`dumbdrop`) |
| **Imagens** | `dumbwareio/dumbdrop:latest` |
| **Porta da interface** | 3000, no serviço `dumbdrop` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **DumbDrop** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | https://*domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `UPLOAD_DIR` | /app/uploads |
| `DUMBDROP_TITLE` | DumbDrop |
| `MAX_FILE_SIZE` | 1024 |
| `DUMBDROP_PIN` | *senha aleatória de 6 caracteres* |
| `AUTO_UPLOAD` | true |
| `BASE_URL` | ${main_domain} |
| `ALLOWED_ORIGINS` |  |
| `APPRISE_URL` |  |
| `APPRISE_MESSAGE` | New file uploaded {filename} ({size}), Storage used {storage} |
| `APPRISE_SIZE_UNIT` | Auto |
| `ALLOWED_EXTENSIONS` |  |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `dumbdrop` | 3000 | *domínio (gerado; troque pelo seu)* |

## docker-compose.yml do template

```yaml
services:
  dumbdrop:
    image: dumbwareio/dumbdrop:latest
    restart: unless-stopped
    ports:
      - 3000
    volumes:
      - dumbdrop-uploads:/app/uploads
volumes:
  dumbdrop-uploads: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
