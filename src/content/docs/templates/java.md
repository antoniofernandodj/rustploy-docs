---
title: Hospedar Java com Rustploy
description: "Aplicação Java. Crie Java em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Java**: Aplicação Java. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `java` |
| **Containers** | 1 (`java-app`) |
| **Imagens** | `ghcr.io/pterodactyl/yolks:java_${JAVA_VERSION}` |
| **Porta da interface** | 25565, no serviço `java-app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Java** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `java_version` | 21 |
| `server_port` | 25565 |
| `startup_command` | java -Xmx1024M -Xms512M -jar server.jar nogui |
| `server_jarfile` | server.jar |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `JAVA_VERSION` | ${java_version} |
| `SERVER_PORT` | ${server_port} |
| `STARTUP_COMMAND` | ${startup_command} |
| `SERVER_JARFILE` | ${server_jarfile} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `java-app` | 25565 | *domínio (gerado; troque pelo seu)* |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/home/container/server.properties`

## docker-compose.yml do template

```yaml
services:
  java-app:
    image: ghcr.io/pterodactyl/yolks:java_${JAVA_VERSION}
    restart: unless-stopped
    stdin_open: true
    tty: true
    volumes:
      - app-data:/home/container
    working_dir: /home/container
    environment:
      - STARTUP=${STARTUP_COMMAND}
      - SERVER_JARFILE=${SERVER_JARFILE}
      - JAVA_VERSION=${JAVA_VERSION}
    ports:
      - ${SERVER_PORT}
    user: container

volumes:
  app-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
