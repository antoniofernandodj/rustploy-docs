---
title: Host FMD Server with Rustploy
description: "Control panel to locate Android devices through Find My Device. Create FMD Server in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**FMD Server**: Control panel to locate Android devices through Find My Device. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `fmd-server` |
| **Containers** | 1 (`fmd-server`) |
| **Images** | `registry.gitlab.com/fmd-foss/fmd-server:v0.11.0` |
| **UI port** | 8080, on service `fmd-server` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **FMD Server** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `registration_token` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `FMD_REGISTRATIONTOKEN` | ${registration_token} |
| `FMD_USERIDLENGTH` | 5 |
| `FMD_MAXSAVEDLOC` | 1000 |
| `FMD_MAXSAVEDPIC` | 10 |

## Domains

| Service | Port | Host |
|---|---|---|
| `fmd-server` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  fmd-server:
    image: registry.gitlab.com/fmd-foss/fmd-server:v0.11.0
    ports:
     - 8080
    environment:
      # View all configurations at:
      #     - https://gitlab.com/fmd-foss/fmd-server/-/blob/master/config.example.yml
      #
      # Config fields can be converted to environment variables as per the documentation
      #     - https://gitlab.com/fmd-foss/fmd-server#via-environment-variables
      # e.g. RegistrationToken -> FMD_REGISTRATIONTOKEN
      #
      - FMD_REGISTRATIONTOKEN=${FMD_REGISTRATIONTOKEN}
      - FMD_USERIDLENGTH=${FMD_USERIDLENGTH}
      - FMD_MAXSAVEDLOC=${FMD_MAXSAVEDLOC}
      - FMD_MAXSAVEDPIC=${FMD_MAXSAVEDPIC}
    volumes:
      - fmd-server-data:/var/lib/fmd-server/db/
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "timeout 10s bash -c ':> /dev/tcp/127.0.0.1/8080'"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s
      start_interval: 3s

volumes:
  fmd-server-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
