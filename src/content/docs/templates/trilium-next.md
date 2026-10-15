---
title: Hospedar TriliumNext com Rustploy
description: "Fork mantido e atualizado com melhorias do organizador hierárquico Trilium Notes. Crie TriliumNext em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**TriliumNext**: Fork mantido e atualizado com melhorias do organizador hierárquico Trilium Notes. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `trilium-next` |
| **Containers** | 1 (`trilium_next`) |
| **Imagens** | `triliumnext/trilium:v0.101.3` |
| **Porta da interface** | 8080, no serviço `trilium_next` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **TriliumNext** e selecione.
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
| `TRILIUM_DATA_DIR` | /root |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `trilium_next` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
# Running `docker-compose up` will create/use the "trilium-data" directory in the user home
services:
  trilium_next:
    # Optionally, replace `latest` with a version tag like `v0.110.3`
    # Using `latest` may cause unintended updates to the container
    image: triliumnext/trilium:v0.101.3
    # Restart the container unless it was stopped by the user
    restart: unless-stopped
    environment:
      - TRILIUM_DATA_DIR=/home/node/trilium-data
    ports:
      # By default, Trilium will be available at http://localhost:8080
      # It will also be accessible at http://<host-ip>:8080
      # You might want to limit this with something like Docker Networks, reverse proxies, or firewall rules,
      # however be aware that using UFW is known to not work with default Docker installations, see:
      # https://docs.docker.com/engine/network/packet-filtering-firewalls/#docker-and-ufw
      - "8080"
    volumes:
      # Unless TRILIUM_DATA_DIR is set, the data will be stored in the "trilium-data" directory in the home directory.
      # This can also be changed with by replacing the line below with `- /path/of/your/choice:/home/node/trilium-data
      - ${TRILIUM_DATA_DIR:-~/trilium-data}:/home/node/trilium-data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
