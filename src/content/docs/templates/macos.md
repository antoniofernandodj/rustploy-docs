---
title: Hospedar Macos com Rustploy
description: "Aplicação Macos. Crie Macos em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Macos**: Aplicação Macos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `macos` |
| **Containers** | 1 (`macos`) |
| **Imagens** | `dockurr/macos:1.14` |
| **Porta da interface** | 8006, no serviço `macos` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Macos** e selecione.
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
| `VERSION` | 15 |
| `DISK_SIZE` | 64G |
| `RAM_SIZE` | 4G |
| `CPU_CORES` | 2 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `macos` | 8006 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  macos:
    image: dockurr/macos:1.14
    volumes:
    - macos-storage:/storage
    environment:
      - VERSION
    devices:
      # If in .env string 'KVM=N' is not commented, you need to comment line below
      - /dev/kvm
    cap_add:
      - NET_ADMIN
    stop_grace_period: 2m

volumes:
  macos-storage:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
