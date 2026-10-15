---
title: Hospedar Windows com Rustploy
description: "Aplicação Windows. Crie Windows em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Windows**: Aplicação Windows. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `windows` |
| **Containers** | 1 (`windows`) |
| **Imagens** | `dockurr/windows:4.00` |
| **Porta da interface** | 8006, no serviço `windows` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Windows** e selecione.
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
| `VERSION` | win11 |
| `DISK_SIZE` | 64G |
| `RAM_SIZE` | 4G |
| `CPU_CORES` | 2 |
| `USERNAME` | Dokploy |
| `PASSWORD` |  |
| `LANGUAGE` | English |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `windows` | 8006 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  windows:
    image: dockurr/windows:4.00
    volumes:
      - win-storage:/storage
    environment:
      - VERSION
      - KVM
    devices:
      # If in .env string 'KVM=N' is not commented, you need to comment line below
      - /dev/kvm
    cap_add:
      - NET_ADMIN
    stop_grace_period: 2m

volumes:
  win-storage:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
