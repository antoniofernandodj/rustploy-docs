---
title: Hospedar Fonoster com Rustploy
description: "Alternativa ao Twilio para telefonia na nuvem, SIP e WebRTC. Crie Fonoster em um clique no Rustploy: 10 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Fonoster**: Alternativa ao Twilio para telefonia na nuvem, SIP e WebRTC. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `fonoster` |
| **Containers** | 10 (`dashboard`, `apiserver`, `autopilot`, `routr`, `rtpengine`, `asterisk`, `postgres`, `influxdb`, `nats`, `envoy`) |
| **Imagens** | `fonoster/dashboard:0.15.15`, `fonoster/apiserver:0.15.15`, `fonoster/autopilot:0.15.15`, `fonoster/routr-one:2.13.13`, `fonoster/rtpengine:0.3.17`, `fonoster/asterisk:20`, `postgres:16.10-alpine3.22`, `influxdb:2.7`, `nats:2.11.8`, `envoyproxy/envoy:v1.35.0` |
| **Porta da interface** | 3030, no serviço `dashboard` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Fonoster** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `host_ip` | CHANGE_ME_TO_HOST_IP |
| `dashboard_session_secret` | *senha aleatória de 64 caracteres* |
| `ari_secret` | *senha aleatória de 32 caracteres* |
| `asterisk_ari_secret` | *senha aleatória de 32 caracteres* |
| `asterisk_sipproxy_secret` | *senha aleatória de 32 caracteres* |
| `postgres_password` | *senha aleatória de 32 caracteres* |
| `influxdb_password` | *senha aleatória de 32 caracteres* |
| `influxdb_token` | *senha aleatória de 64 caracteres* |
| `cloak_encryption_key` | *chave base64 aleatória (32 bytes)* |
| `postgres_user` | postgres |
| `postgres_db_fonoster` | fonoster |
| `postgres_db_identity` | fnidentity |
| `postgres_db_routr` | routr |
| `api_server_app_url` | https://${main_domain} |
| `api_server_root_domain` | ${main_domain} |
| `api_server_owner_email` | admin@${main_domain} |
| `api_server_owner_name` | Admin User |
| `api_server_owner_password` | *senha aleatória de 32 caracteres* |
| `influxdb_init_org` | fonoster |
| `influxdb_init_username` | influxdb |
| `asterisk_codecs` | g722,ulaw,alaw |
| `asterisk_dtmf_mode` | auto_info |
| `asterisk_rtp_port_start` | 10000 |
| `asterisk_rtp_port_end` | 20000 |
| `asterisk_sipproxy_port` | 5060 |
| `asterisk_sipproxy_username` | voice |
| `rtpengine_port_min` | 10000 |
| `rtpengine_port_max` | 20000 |
| `routr_nats_publisher_url` | nats://nats:4222 |
| `logs_format` | json |
| `logs_level` | verbose |
| `logs_transport` | none |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SERVER_DASHBOARD_SESSION_SECRET` | ${dashboard_session_secret} |
| `APISERVER_APP_URL` | ${api_server_app_url} |
| `APISERVER_ROOT_DOMAIN` | ${api_server_root_domain} |
| `APISERVER_OWNER_EMAIL` | ${api_server_owner_email} |
| `APISERVER_OWNER_NAME` | ${api_server_owner_name} |
| `APISERVER_OWNER_PASSWORD` | ${api_server_owner_password} |
| `APISERVER_DATABASE_URL` | postgresql://${postgres_user}:${postgres_password}@postgres:5432/${postgres_db_fonoster} |
| `APISERVER_IDENTITY_DATABASE_URL` | postgresql://${postgres_user}:${postgres_password}@postgres:5432/${postgres_db_identity} |
| `APISERVER_ASTERISK_ARI_PROXY_URL` | http://asterisk:8088 |
| `APISERVER_ASTERISK_ARI_SECRET` | ${ari_secret} |
| `APISERVER_ASTERISK_ARI_USERNAME` | ari |
| `APISERVER_IDENTITY_ISSUER` | https://${api_server_root_domain} |
| `APISERVER_IDENTITY_CONTACT_VERIFICATION_REQUIRED` | false |
| `APISERVER_IDENTITY_TWO_FACTOR_AUTHENTICATION_REQUIRED` | false |
| `APISERVER_IDENTITY_WORKSPACE_INVITE_EXPIRATION` | 1d |
| `APISERVER_IDENTITY_WORKSPACE_INVITE_FAIL_URL` | ${api_server_app_url}/invite-fail |
| `APISERVER_IDENTITY_WORKSPACE_INVITE_URL` | https://${api_server_root_domain}:8449/api/identity/accept-invite |
| `APISERVER_IDENTITY_OAUTH2_GITHUB_CLIENT_ID` |  |
| `APISERVER_IDENTITY_OAUTH2_GITHUB_CLIENT_SECRET` |  |
| `APISERVER_IDENTITY_OAUTH2_GITHUB_ENABLED` | false |
| `APISERVER_INFLUXDB_URL` | http://influxdb:8086 |
| `APISERVER_INFLUXDB_INIT_ORG` | ${influxdb_init_org} |
| `APISERVER_INFLUXDB_INIT_USERNAME` | ${influxdb_init_username} |
| `APISERVER_INFLUXDB_INIT_PASSWORD` | ${influxdb_password} |
| `APISERVER_INFLUXDB_INIT_TOKEN` | ${influxdb_token} |
| `APISERVER_NATS_URL` | nats://nats:4222 |
| `APISERVER_LOGS_FORMAT` | ${logs_format} |
| `APISERVER_LOGS_LEVEL` | ${logs_level} |
| `APISERVER_LOGS_TRANSPORT` | ${logs_transport} |
| `APISERVER_CLOAK_ENCRYPTION_KEY` | ${cloak_encryption_key} |
| `APISERVER_AUTHZ_SERVICE_ENABLED` | false |
| `APISERVER_AUTHZ_SERVICE_HOST` | fnauthz |
| `APISERVER_AUTHZ_SERVICE_METHODS` | /fonoster.calls.v1beta2.Calls/CreateCall,/fonoster.identity.v1beta2.Identity/CreateWorkspace |
| `APISERVER_AUTHZ_SERVICE_PORT` | 50071 |
| `APISERVER_SMTP_HOST` | your-smtp-server |
| `APISERVER_SMTP_PORT` | 587 |
| `APISERVER_SMTP_SECURE` | true |
| `APISERVER_SMTP_AUTH_USER` | postmaster@${api_server_root_domain} |
| `APISERVER_SMTP_AUTH_PASS` | secret |
| `APISERVER_SMTP_SENDER` | Fonoster Info <info@${api_server_root_domain}> |
| `APISERVER_SIGNALING_SERVER` | ws://${api_server_root_domain}:5062 |
| `APISERVER_TWILIO_ACCOUNT_SID` |  |
| `APISERVER_TWILIO_AUTH_TOKEN` |  |
| `APISERVER_TWILIO_PHONE_NUMBER` |  |
| `AUTOPILOT_CONVERSATION_PROVIDER` | api |
| `AUTOPILOT_KNOWLEDGE_BASE_ENABLED` | false |
| `AUTOPILOT_LOGS_FORMAT` | ${logs_transport} |
| `AUTOPILOT_LOGS_LEVEL` | ${logs_level} |
| `AUTOPILOT_LOGS_TRANSPORT` | ${logs_transport} |
| `AUTOPILOT_AWS_S3_ACCESS_KEY_ID` |  |
| `AUTOPILOT_AWS_S3_ENDPOINT` |  |
| `AUTOPILOT_AWS_S3_REGION` | us-east-1 |
| `AUTOPILOT_AWS_S3_SECRET_ACCESS_KEY` |  |
| `AUTOPILOT_OPENAI_API_KEY` |  |
| `AUTOPILOT_UNSTRUCTURED_API_KEY` |  |
| `AUTOPILOT_UNSTRUCTURED_API_URL` |  |
| `ROUTR_DATABASE_URL` | postgresql://${postgres_user}:${postgres_password}@postgres:5432/${postgres_db_routr} |
| `ROUTR_EXTERNAL_ADDRS` | ${host_ip} |
| `ROUTR_RTPENGINE_HOST` | rtpengine |
| `ROUTR_NATS_PUBLISHER_URL` | ${routr_nats_publisher_url} |
| `ROUTR_LOGS_FORMAT` | ${logs_transport} |
| `ROUTR_LOGS_LEVEL` | ${logs_level} |
| `ROUTR_LOGS_TRANSPORT` | ${logs_transport} |
| `ASTERISK_ARI_PROXY_URL` | http://asterisk:8088 |
| `ASTERISK_ARI_SECRET` | ${asterisk_ari_secret} |
| `ASTERISK_ARI_USERNAME` | ari |
| `ASTERISK_CODECS` | ${asterisk_codecs} |
| `ASTERISK_DTMF_MODE` | ${asterisk_dtmf_mode} |
| `ASTERISK_RTP_PORT_START` | ${asterisk_rtp_port_start} |
| `ASTERISK_RTP_PORT_END` | ${asterisk_rtp_port_end} |
| `ASTERISK_SIPPROXY_HOST` | ${host_ip} |
| `ASTERISK_SIPPROXY_PORT` | ${asterisk_sipproxy_port} |
| `ASTERISK_SIPPROXY_SECRET` | ${asterisk_sipproxy_secret} |
| `ASTERISK_SIPPROXY_USERNAME` | ${asterisk_sipproxy_username} |
| `RTPENGINE_PUBLIC_IP` | ${host_ip} |
| `RTPENGINE_PORT_MIN` | ${rtpengine_port_min} |
| `RTPENGINE_PORT_MAX` | ${rtpengine_port_max} |
| `INFLUXDB_INIT_ORG` | ${influxdb_init_org} |
| `INFLUXDB_INIT_USERNAME` | ${influxdb_init_username} |
| `INFLUXDB_INIT_PASSWORD` | ${influxdb_password} |
| `INFLUXDB_INIT_TOKEN` | ${influxdb_token} |
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_DB` | ${postgres_db_fonoster} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `dashboard` | 3030 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `config/integrations.json`
- `config/init-db.sh`
- `config/keys/.gitkeep`
- `config/keys/public.pem`
- `config/envoy.yaml`

## docker-compose.yml do template

```yaml
services:
  dashboard:
    image: fonoster/dashboard:0.15.15
    restart: unless-stopped
    ports:
      - 3030
    environment:
      - SERVER_DASHBOARD_SESSION_SECRET=${SERVER_DASHBOARD_SESSION_SECRET}

  apiserver:
    image: fonoster/apiserver:0.15.15
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - APISERVER_APP_URL=${APISERVER_APP_URL}
      - APISERVER_ASTERISK_ARI_PROXY_URL=${APISERVER_ASTERISK_ARI_PROXY_URL}
      - APISERVER_ASTERISK_ARI_SECRET=${APISERVER_ASTERISK_ARI_SECRET}
      - APISERVER_ASTERISK_ARI_USERNAME=${APISERVER_ASTERISK_ARI_USERNAME}
      - APISERVER_AUTHZ_SERVICE_ENABLED=${APISERVER_AUTHZ_SERVICE_ENABLED}
      - APISERVER_AUTHZ_SERVICE_HOST=${APISERVER_AUTHZ_SERVICE_HOST}
      - APISERVER_AUTHZ_SERVICE_METHODS=${APISERVER_AUTHZ_SERVICE_METHODS}
      - APISERVER_AUTHZ_SERVICE_PORT=${APISERVER_AUTHZ_SERVICE_PORT}
      - APISERVER_CLOAK_ENCRYPTION_KEY=${APISERVER_CLOAK_ENCRYPTION_KEY}
      - APISERVER_DATABASE_URL=${APISERVER_DATABASE_URL}
      - APISERVER_IDENTITY_DATABASE_URL=${APISERVER_IDENTITY_DATABASE_URL}
      - APISERVER_IDENTITY_ISSUER=${APISERVER_IDENTITY_ISSUER}
      - APISERVER_IDENTITY_CONTACT_VERIFICATION_REQUIRED=${APISERVER_IDENTITY_CONTACT_VERIFICATION_REQUIRED}
      - APISERVER_IDENTITY_TWO_FACTOR_AUTHENTICATION_REQUIRED=${APISERVER_IDENTITY_TWO_FACTOR_AUTHENTICATION_REQUIRED}
      - APISERVER_IDENTITY_WORKSPACE_INVITE_EXPIRATION=${APISERVER_IDENTITY_WORKSPACE_INVITE_EXPIRATION}
      - APISERVER_IDENTITY_WORKSPACE_INVITE_FAIL_URL=${APISERVER_IDENTITY_WORKSPACE_INVITE_FAIL_URL}
      - APISERVER_IDENTITY_WORKSPACE_INVITE_URL=${APISERVER_IDENTITY_WORKSPACE_INVITE_URL}
      - APISERVER_IDENTITY_OAUTH2_GITHUB_CLIENT_ID=${APISERVER_IDENTITY_OAUTH2_GITHUB_CLIENT_ID}
      - APISERVER_IDENTITY_OAUTH2_GITHUB_CLIENT_SECRET=${APISERVER_IDENTITY_OAUTH2_GITHUB_CLIENT_SECRET}
      - APISERVER_IDENTITY_OAUTH2_GITHUB_ENABLED=${APISERVER_IDENTITY_OAUTH2_GITHUB_ENABLED}
      - APISERVER_INFLUXDB_INIT_ORG=${APISERVER_INFLUXDB_INIT_ORG}
      - APISERVER_INFLUXDB_INIT_PASSWORD=${APISERVER_INFLUXDB_INIT_PASSWORD}
      - APISERVER_INFLUXDB_INIT_TOKEN=${APISERVER_INFLUXDB_INIT_TOKEN}
      - APISERVER_INFLUXDB_INIT_USERNAME=${APISERVER_INFLUXDB_INIT_USERNAME}
      - APISERVER_INFLUXDB_URL=${APISERVER_INFLUXDB_URL}
      - APISERVER_LOGS_FORMAT=${APISERVER_LOGS_FORMAT}
      - APISERVER_LOGS_LEVEL=${APISERVER_LOGS_LEVEL}
      - APISERVER_LOGS_TRANSPORT=${APISERVER_LOGS_TRANSPORT}
      - APISERVER_NATS_URL=${APISERVER_NATS_URL}
      - APISERVER_OWNER_EMAIL=${APISERVER_OWNER_EMAIL}
      - APISERVER_OWNER_NAME=${APISERVER_OWNER_NAME}
      - APISERVER_OWNER_PASSWORD=${APISERVER_OWNER_PASSWORD}
      - APISERVER_ROOT_DOMAIN=${APISERVER_ROOT_DOMAIN}
      - APISERVER_SMTP_AUTH_PASS=${APISERVER_SMTP_AUTH_PASS}
      - APISERVER_SMTP_AUTH_USER=${APISERVER_SMTP_AUTH_USER}
      - APISERVER_SMTP_HOST=${APISERVER_SMTP_HOST}
      - APISERVER_SMTP_PORT=${APISERVER_SMTP_PORT}
      - APISERVER_SMTP_SECURE=${APISERVER_SMTP_SECURE}
      - APISERVER_SMTP_SENDER=${APISERVER_SMTP_SENDER}
      - APISERVER_SIGNALING_SERVER=${APISERVER_SIGNALING_SERVER}
      - APISERVER_TWILIO_ACCOUNT_SID=${APISERVER_TWILIO_ACCOUNT_SID}
      - APISERVER_TWILIO_AUTH_TOKEN=${APISERVER_TWILIO_AUTH_TOKEN}
      - APISERVER_TWILIO_PHONE_NUMBER=${APISERVER_TWILIO_PHONE_NUMBER}
    expose:
      - 50051
    volumes:
      - ../files/config/keys:/opt/fonoster/keys:ro
      - ../files/config/integrations.json:/opt/fonoster/integrations.json:ro

  autopilot:
    image: fonoster/autopilot:0.15.15
    restart: unless-stopped
    expose:
      - 50061
    environment:
      - AUTOPILOT_AWS_S3_ACCESS_KEY_ID=${AUTOPILOT_AWS_S3_ACCESS_KEY_ID}
      - AUTOPILOT_AWS_S3_ENDPOINT=${AUTOPILOT_AWS_S3_ENDPOINT}
      - AUTOPILOT_AWS_S3_REGION=${AUTOPILOT_AWS_S3_REGION}
      - AUTOPILOT_AWS_S3_SECRET_ACCESS_KEY=${AUTOPILOT_AWS_S3_SECRET_ACCESS_KEY}
      - AUTOPILOT_CONVERSATION_PROVIDER=${AUTOPILOT_CONVERSATION_PROVIDER}
      - AUTOPILOT_KNOWLEDGE_BASE_ENABLED=${AUTOPILOT_KNOWLEDGE_BASE_ENABLED}
      - AUTOPILOT_LOGS_FORMAT=${AUTOPILOT_LOGS_FORMAT}
      - AUTOPILOT_LOGS_LEVEL=${AUTOPILOT_LOGS_LEVEL}
      - AUTOPILOT_LOGS_TRANSPORT=${AUTOPILOT_LOGS_TRANSPORT}
      - AUTOPILOT_OPENAI_API_KEY=${AUTOPILOT_OPENAI_API_KEY}
      - AUTOPILOT_UNSTRUCTURED_API_KEY=${AUTOPILOT_UNSTRUCTURED_API_KEY}
      - AUTOPILOT_UNSTRUCTURED_API_URL=${AUTOPILOT_UNSTRUCTURED_API_URL}
    volumes:
      - ../files/config/integrations.json:/opt/fonoster/integrations.json:ro

  routr:
    image: fonoster/routr-one:2.13.13
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: ${ROUTR_DATABASE_URL}
      EXTERNAL_ADDRS: ${ROUTR_EXTERNAL_ADDRS}
      LOGS_FORMAT: ${ROUTR_LOGS_FORMAT}
      LOGS_LEVEL: ${ROUTR_LOGS_LEVEL}
      LOGS_TRANSPORT: ${ROUTR_LOGS_TRANSPORT}
      NATS_PUBLISHER_ENABLED: "true"
      NATS_PUBLISHER_URL: ${ROUTR_NATS_PUBLISHER_URL}
      RTPENGINE_HOST: ${ROUTR_RTPENGINE_HOST}
      START_INTERNAL_DB: "false"
      CONNECT_VERIFIER_PUBLIC_KEY_PATH: /etc/routr/keys/public.pem
    expose:
      - 51907
      - 51908
    ports:
      - 5060:5060/udp
      - 5060-5063:5060-5063
    volumes:
      - ../files/config/keys/public.pem:/etc/routr/keys/public.pem

  # RTPEngine uses a range of ports to handle RTP traffic. Because exposing a large range of ports 
  # is not possible in Docker, we need to use network_mode: host.
  #
  # Unfortunately, network_mode: host is not supported for Windows or Mac.
  # In those cases, we need to use a different approach.
  #
  # By default we are opening a small range of ports (10000-10100) to handle RTP traffic.
  # However, this is not enough for production environments.
  #
  # We recommend that when using Linux you use network_mode: host and remove the ports section.
  rtpengine:
    image: fonoster/rtpengine:0.3.17
    restart: unless-stopped
    platform: linux/x86_64
    ports: 
      - 10000-10100:10000-10100/udp
      - 8080:8080
    environment:
      PORT_MAX: ${RTPENGINE_PORT_MAX}
      PORT_MIN: ${RTPENGINE_PORT_MIN}
      PUBLIC_IP: ${RTPENGINE_PUBLIC_IP}

  asterisk:
    image: fonoster/asterisk:20
    restart: unless-stopped
    environment:
      ARI_PROXY_URL: ${ASTERISK_ARI_PROXY_URL}
      ARI_SECRET: ${ASTERISK_ARI_SECRET}
      ARI_USERNAME: ${ASTERISK_ARI_USERNAME}
      CODECS: ${ASTERISK_CODECS}
      DTMF_MODE: ${ASTERISK_DTMF_MODE}
      RTP_PORT_END: ${ASTERISK_RTP_PORT_END}
      RTP_PORT_START: ${ASTERISK_RTP_PORT_START}
      SIPPROXY_HOST: ${ASTERISK_SIPPROXY_HOST}
      SIPPROXY_PORT: ${ASTERISK_SIPPROXY_PORT}
      SIPPROXY_SECRET: ${ASTERISK_SIPPROXY_SECRET}
      SIPPROXY_USERNAME: ${ASTERISK_SIPPROXY_USERNAME}
    expose:
      - 6060

  postgres:
    image: postgres:16.10-alpine3.22
    restart: unless-stopped
    environment:
      PGTZ: UTC
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_DB: ${POSTGRES_DB}
      TZ: UTC
    expose:
      - 5432
    volumes:
      - db:/var/lib/postgresql/data
      - ../files/config/init-db.sh:/docker-entrypoint-initdb.d/init-db.sh:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 10

  influxdb:
    image: influxdb:2.7
    restart: unless-stopped
    expose:
      - 8086
    environment:
      DOCKER_INFLUXDB_INIT_ADMIN_TOKEN: ${INFLUXDB_INIT_TOKEN}
      DOCKER_INFLUXDB_INIT_BUCKET: calls
      DOCKER_INFLUXDB_INIT_MODE: setup
      DOCKER_INFLUXDB_INIT_ORG: ${INFLUXDB_INIT_ORG}
      DOCKER_INFLUXDB_INIT_PASSWORD: ${INFLUXDB_INIT_PASSWORD}
      DOCKER_INFLUXDB_INIT_USERNAME: ${INFLUXDB_INIT_USERNAME}
    volumes:
      - influxdb:/var/lib/influxdb2

  nats:
    image: nats:2.11.8
    restart: unless-stopped
    expose:
      - 4222

  envoy:
    image: envoyproxy/envoy:v1.35.0
    restart: unless-stopped
    command: ["/usr/local/bin/envoy", "-c", "/etc/envoy/envoy.yaml"]
    volumes:
      - ../files/config:/etc/envoy:ro
    ports:
      - 8449:8449

volumes:
  db:
  influxdb:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
