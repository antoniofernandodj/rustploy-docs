---
title: Hospedar Pulse com Rustploy
description: "Painel responsivo para monitoramento centralizado de ambientes Proxmox VE e Docker. Crie Pulse em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Pulse**: Painel responsivo para monitoramento centralizado de ambientes Proxmox VE e Docker. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `pulse` |
| **Containers** | 1 (`pulse`) |
| **Imagens** | `rcourtman/pulse:5.1` |
| **Porta da interface** | 7655, no serviço `pulse` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Pulse** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `pulse_auth_user` | *usuário gerado* |
| `pulse_auth_pass` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `PULSE_AUTH_USER` | ${pulse_auth_user} |
| `PULSE_AUTH_PASS` | ${pulse_auth_pass} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `pulse` | 7655 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  pulse:
    image: rcourtman/pulse:5.1
    restart: always
    expose:
      - 7655
    volumes:
      - pulse_data:/data
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - PULSE_AUTH_USER=${PULSE_AUTH_USER}
      - PULSE_AUTH_PASS=${PULSE_AUTH_PASS}
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:7655/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  pulse_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
