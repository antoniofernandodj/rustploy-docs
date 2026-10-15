---
title: Host Habitica with Rustploy
description: "Gamification of routines and daily tasks in RPG format. Create Habitica in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Habitica**: Gamification of routines and daily tasks in RPG format. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `habitica` |
| **Containers** | 3 (`server`, `client`, `mongo`) |
| **Images** | `docker.io/awinterstein/habitica-server:latest`, `docker.io/awinterstein/habitica-client:latest`, `docker.io/mongo:latest` |
| **UI port** | 80, on service `client` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Habitica** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `mail_password` | *random password, 32 characters* |
| `mongo_key` | *random base64 key (756 bytes)* |
| `mongo_admin_password` | *random password* |
| `mongo_habitica_password` | *random password* |

**Delivered to the container:**

| Variable | Value |
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

## Domains

| Service | Port | Host |
|---|---|---|
| `client` | 80 | habitica.${main_domain} |

## The template docker-compose.yml

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

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
