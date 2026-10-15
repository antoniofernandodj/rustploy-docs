---
title: Host Crowdsec with Rustploy
description: "Collaborative security system against malicious IPs. Create Crowdsec in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Crowdsec**: Collaborative security system against malicious IPs. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `crowdsec` |
| **Containers** | 1 (`crowdsec`) |
| **Images** | `crowdsecurity/crowdsec:latest` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Crowdsec** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `auth_log_path` | /var/log/auth.log |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `AUTH_LOG_PATH` | ${auth_log_path} |

## The template docker-compose.yml

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

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
