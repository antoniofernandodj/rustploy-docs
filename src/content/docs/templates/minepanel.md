---
title: Hospedar Minepanel com Rustploy
description: "Painel em Docker voltado à criação, monitoramento e controle de instâncias de Minecraft. Crie Minepanel em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Minepanel**: Painel em Docker voltado à criação, monitoramento e controle de instâncias de Minecraft. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `minepanel` |
| **Containers** | 2 (`backend`, `frontend`) |
| **Imagens** | `ketbom/minepanel-backend:1.7.1`, `ketbom/minepanel-frontend:1.7.1` |
| **Porta da interface** | 3000, no serviço `frontend` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Minepanel** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `jwt_secret` | *chave base64 aleatória (32 bytes)* |
| `client_username` | admin |
| `client_password` | *senha aleatória de 16 caracteres* |
| `default_language` | en |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `JWT_SECRET` | *JWT gerado* |
| `CLIENT_USERNAME` | ${client_username} |
| `CLIENT_PASSWORD` | ${client_password} |
| `FRONTEND_URL` | http://${main_domain} |
| `NEXT_PUBLIC_BACKEND_URL` | http://api-${main_domain} |
| `NEXT_PUBLIC_DEFAULT_LANGUAGE` | ${default_language} |
| `BASE_DIR` | /app |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `frontend` | 3000 | ${main_domain} |
| `backend` | 8091 | api-${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  backend:
    image: ketbom/minepanel-backend:1.7.1
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - FRONTEND_URL=${FRONTEND_URL}
      - JWT_SECRET=${JWT_SECRET}
      - CLIENT_PASSWORD=${CLIENT_PASSWORD}
      - CLIENT_USERNAME=${CLIENT_USERNAME}
      - BASE_DIR=${BASE_DIR}
    volumes:
      - minepanel-servers:/app/servers
      - minepanel-data:/app/data
      - /var/run/docker.sock:/var/run/docker.sock

  frontend:
    image: ketbom/minepanel-frontend:1.7.1
    restart: unless-stopped
    environment:
      - NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
      - NEXT_PUBLIC_DEFAULT_LANGUAGE=${NEXT_PUBLIC_DEFAULT_LANGUAGE}
    depends_on:
      - backend

volumes:
  minepanel-servers:
  minepanel-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
