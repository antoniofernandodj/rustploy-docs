---
title: Hospedar NTFY com Rustploy
description: "Serviço utilitário para disparar notificações push para celulares ou desktops via requisições HTTP simples. Crie NTFY em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**NTFY**: Serviço utilitário para disparar notificações push para celulares ou desktops via requisições HTTP simples. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `ntfy` |
| **Containers** | 1 (`ntfy`) |
| **Imagens** | `binwiederhier/ntfy` |
| **Porta da interface** | 80, no serviço `ntfy` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **NTFY** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `ntfy_domain` | *domínio (gerado; troque pelo seu)* |
| `ntfy_http_port` | 80 |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `HTTP_PORT` | ${ntfy_http_port} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `ntfy` | 80 | ${ntfy_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/templates/myapp.yml`
- `/server.yml`

## docker-compose.yml do template

```yaml
services:
  ntfy:
    image: binwiederhier/ntfy
    restart: unless-stopped
    command:
      - serve
    ports:
      - "${HTTP_PORT}"
    volumes:
      - ntfy-data:/var/lib/ntfy
      - ntfy-cache:/var/cache/ntfy
      - ../files/server.yml:/etc/ntfy/server.yml:ro
      - ../files/templates:/etc/ntfy/templates:ro
    healthcheck:
      test: ["CMD-SHELL", "wget -q --tries=1 http://localhost:${HTTP_PORT}/v1/health -O - | grep -Eo '\"healthy\"\\s*:\\s*true' || exit 1"]
      interval: 60s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  ntfy-data:
  ntfy-cache:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
