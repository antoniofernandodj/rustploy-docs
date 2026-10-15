---
title: Hospedar File Browser com Rustploy
description: "Gerenciador de arquivos web completo com controle de usuários. Crie File Browser em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**File Browser**: Gerenciador de arquivos web completo com controle de usuários. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `filebrowser` |
| **Containers** | 1 (`filebrowser`) |
| **Imagens** | `hurlenko/filebrowser` |
| **Porta da interface** | 8080, no serviço `filebrowser` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **File Browser** e selecione.
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
| `FB_BASEURL` | /filebrowser |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `filebrowser` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  filebrowser:
    image: hurlenko/filebrowser
    volumes:
      - filebrowser-data:/data
      - filebrowser-config:/config
    environment:
      - FB_BASEURL=${FB_BASEURL}
    restart: always 

volumes:
  filebrowser-data:
  filebrowser-config:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
