---
title: Hospedar Crowdsec com Rustploy
description: "Sistema de segurança colaborativo contra IPs maliciosos. Crie Crowdsec em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Crowdsec**: Sistema de segurança colaborativo contra IPs maliciosos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `crowdsec` |
| **Containers** | 1 (`crowdsec`) |
| **Imagens** | `crowdsecurity/crowdsec:latest` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Crowdsec** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `auth_log_path` | /var/log/auth.log |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `AUTH_LOG_PATH` | ${auth_log_path} |

## docker-compose.yml do template

```yaml
# --------------------------------------------------------------------------------
# note: this is the minimal crowdsec container
# this compose file prepared to work with two key remediation engines
# install and configure them via links below:
# traefik bouncer plugin | https://plugins.traefik.io/plugins/6335346ca4caa9ddeffda116/crowdsec-bouncer-traefik-plugin
# firewall bouncer (iptables) | https://docs.crowdsec.net/u/bouncers/firewall/
# --------------------------------------------------------------------------------
services:
  crowdsec:
    image: crowdsecurity/crowdsec:latest
    environment:
      GID: "${GID-1000}"
      COLLECTIONS: "crowdsecurity/linux crowdsecurity/traefik crowdsecurity/http-cve"
    volumes:
      - ../files/acquis.yaml:/etc/crowdsec/acquis.yaml # https://docs.crowdsec.net/u/getting_started/post_installation/acquisition_new/
      - crowdsec-db:/var/lib/crowdsec/data/
      - crowdsec-config:/etc/crowdsec/
      - /etc/dokploy/traefik/dynamic/access.log:/var/log/traefik/access.log:ro # make sure access log is enabled in dokploy
      - ${AUTH_LOG_PATH}:/var/log/ssh/auth.log:ro
      # - /var/log/fail2ban.log:/var/log/fail2ban/fail2ban.log:ro # uncomment if you have fail2ban installed on the system
    security_opt:
      - no-new-privileges:true
    # uncomment these two lines if you intent to use firewall bouncer installed natively on the host
    # ports: 
    #  - "127.0.0.1:8080:8080" # local binding only, necessary for firewall-iptables-bouncer to connect to container's lapi
    labels:
      - traefik.enable=false
    restart: unless-stopped
volumes:
  crowdsec-db:
  crowdsec-config:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
