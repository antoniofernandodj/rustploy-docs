---
title: Hospedar Lavalink com Rustploy
description: "Servidor autônomo de streaming de áudio e música baseado em Java. Crie Lavalink em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Lavalink**: Servidor autônomo de streaming de áudio e música baseado em Java. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `lavalink` |
| **Containers** | 2 (`fix-perms`, `lavalink`) |
| **Imagens** | `busybox:1.36`, `ghcr.io/lavalink-devs/lavalink:4` |
| **Porta da interface** | 2333, no serviço `lavalink` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Lavalink** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `server_port` | 2333 |
| `lavalink_server_password` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `_JAVA_OPTIONS` | -Xmx6G |
| `LAVALINK_SERVER_PASSWORD` | ${lavalink_server_password} |
| `SERVER_PORT` | ${server_port} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `lavalink` | 2333 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `./application.yml`

## docker-compose.yml do template

```yaml
services:
  fix-perms:
    image: busybox:1.36
    command: >
      sh -c "mkdir -p /opt/Lavalink/plugins &&
             chmod -R 0777 /opt/Lavalink/plugins || true &&
             chown -R 1000:1000 /opt/Lavalink/plugins || true &&
             echo perms-fixed && sleep 1"
    volumes:
      - "../files/plugins/:/opt/Lavalink/plugins/"
      - "../files/application.yml:/opt/Lavalink/application.yml"
    restart: "no"
  lavalink:
    image: ghcr.io/lavalink-devs/lavalink:4
    depends_on:
      - fix-perms
    restart: unless-stopped
    environment:
      _JAVA_OPTIONS: "${_JAVA_OPTIONS:--Xmx6G}"
      LAVALINK_SERVER_PASSWORD: "${LAVALINK_SERVER_PASSWORD:-youshallnotpass}"
      SERVER_PORT: "${SERVER_PORT:-2333}"
    volumes:
      - "../files/application.yml:/opt/Lavalink/application.yml:rw"
      - "../files/plugins/:/opt/Lavalink/plugins/:rw"
    ports:
      - ${SERVER_PORT}

    healthcheck:
      test: >
        sh -c 'wget --header="Authorization: ${LAVALINK_SERVER_PASSWORD}" -qO- http://127.0.0.1:${SERVER_PORT}/v4/info >/dev/null 2>&1 || exit 1'
      interval: 100s
      timeout: 5s
      retries: 5
      start_period: 30s

    entrypoint: >
      sh -c 'until [ -w /opt/Lavalink/plugins ] ; do
                echo "waiting for /opt/Lavalink/plugins to be writable";
                sleep 1;
             done;
             exec java -jar /opt/Lavalink/Lavalink.jar'
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
