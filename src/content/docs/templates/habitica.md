---
title: Hospedar Habitica com Rustploy
description: "Gamificação de rotinas e tarefas diárias em formato de RPG. Crie Habitica em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Habitica**: Gamificação de rotinas e tarefas diárias em formato de RPG. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `habitica` |
| **Containers** | 3 (`server`, `client`, `mongo`) |
| **Imagens** | `docker.io/awinterstein/habitica-server:latest`, `docker.io/awinterstein/habitica-client:latest`, `docker.io/mongo:latest` |
| **Porta da interface** | 80, no serviço `client` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Habitica** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `mail_password` | *senha aleatória de 32 caracteres* |
| `mongo_key` | *chave base64 aleatória (756 bytes)* |
| `mongo_admin_password` | *senha aleatória* |
| `mongo_habitica_password` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `BASE_URL` | https://habitica.${main_domain} |
| `INVITE_ONLY` | false |
| `EMAIL_SERVER_URL` | mail.example.com |
| `EMAIL_SERVER_PORT` | 587 |
| `EMAIL_SERVER_AUTH_USER` | mail_user |
| `EMAIL_SERVER_AUTH_PASSWORD` | ${mail_password} |
| `MONGO_KEYFILE_CONTENT` | ${mongo_key} |
| `MONGO_ADMIN_USER` | admin |
| `MONGO_ADMIN_PASSWORD` | ${mongo_admin_password} |
| `MONGO_HABITICA_USER` | habitica |
| `MONGO_HABITICA_PASSWORD` | ${mongo_habitica_password} |
| `ADMIN_EMAIL` | no-reply@${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `client` | 80 | habitica.${main_domain} |

## docker-compose.yml do template

```yaml
services:
  server:
    image: docker.io/awinterstein/habitica-server:latest
    restart: unless-stopped
    depends_on:
      mongo:
        condition: service_healthy
    environment:
      NODE_DB_URI: "mongodb://${MONGO_HABITICA_USER}:${MONGO_HABITICA_PASSWORD}@mongo/habitica?authSource=habitica"
      INVITE_ONLY: "${INVITE_ONLY}"
      EMAIL_SERVER_URL: "${EMAIL_SERVER_URL}"
      EMAIL_SERVER_PORT: "${EMAIL_SERVER_PORT}"
      EMAIL_SERVER_AUTH_USER: "${EMAIL_SERVER_AUTH_USER}"
      EMAIL_SERVER_AUTH_PASSWORD: "${EMAIL_SERVER_AUTH_PASSWORD}"
      ADMIN_EMAIL: "${ADMIN_EMAIL}"

  client:
    image: docker.io/awinterstein/habitica-client:latest
    restart: unless-stopped
    depends_on:
      - server
    ports:
      - "80"

  mongo:
    image: docker.io/mongo:latest
    restart: unless-stopped
    command: >
      bash -c "
        echo \"${MONGO_KEYFILE_CONTENT}\" > /etc/mongo-keyfile &&
        chown 999:999 /etc/mongo-keyfile &&
        chmod 400 /etc/mongo-keyfile &&
        exec docker-entrypoint.sh mongod --replSet rs --bind_ip_all --port 27017 --keyFile /etc/mongo-keyfile
      "
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ADMIN_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ADMIN_PASSWORD}
      MONGO_KEYFILE_CONTENT: ${MONGO_KEYFILE_CONTENT}
      MONGO_HABITICA_USER: ${MONGO_HABITICA_USER}
      MONGO_HABITICA_PASSWORD: ${MONGO_HABITICA_PASSWORD}
    # ---------------------------------------------------------
    # SMART HEALTHCHECK: Auto-fixes Hostname Mismatches for replicaSet
    # ---------------------------------------------------------
    healthcheck:
      test: |
        mongosh --port 27017 --quiet -u "${MONGO_ADMIN_USER}" -p "${MONGO_ADMIN_PASSWORD}" --authenticationDatabase admin --eval "
          try {
            // 1. Hostname Fix
            const config = rs.conf();
            const currentHost = require('os').hostname() + ':27017';
            if (config.members[0].host !== currentHost) {
              config.members[0].host = currentHost;
              rs.reconfig(config, { force: true });
            }

            // 2. User Creation Logic
            const targetDb = db.getSiblingDB('habitica');
            const hUser = process.env.MONGO_HABITICA_USER;
            const hPass = process.env.MONGO_HABITICA_PASSWORD;

            // We can only check/create users if we are Primary
            if (rs.isMaster().ismaster) {
              if (!targetDb.getUser(hUser)) {
                print('Creating missing user ' + hUser + '...');
                targetDb.createUser({ user: hUser, pwd: hPass, roles: ['readWrite'] });
              }
              // SUCCESS: User exists and we are Primary
              quit(0);
            } else {
              // We are not Primary yet (still electing), so we cannot confirm user exists.
              // Fail the check so the dependent app waits.
              print('Waiting for Primary state...');
              quit(1);
            }
          } catch (err) {
            // If not initialized, initiate and FAIL this check so we wait for the next cycle
            try { 
              rs.initiate({ _id: 'rs', members: [{ _id: 0, host: require('os').hostname() + ':27017' }] }); 
            } catch (e) {}
            quit(1);
          }
        "
      interval: 5s
      timeout: 10s
      retries: 20
    volumes:
      - habitica-mongo-data:/data/db

volumes:
  habitica-mongo-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
