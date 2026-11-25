---
title: Host OneDev with Rustploy
description: "Git server integrated with Kanban boards and native CI/CD pipelines. Create OneDev in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**OneDev**: Git server integrated with Kanban boards and native CI/CD pipelines. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `onedev` |
| **Containers** | 1 (`onedev`) |
| **Images** | `1dev/server:11.6.6` |
| **UI port** | 6610, on service `onedev` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **OneDev** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

## Domains

| Service | Port | Host |
|---|---|---|
| `onedev` | 6610 | ${main_domain} |

## The template docker-compose.yml

```yaml
---
services:
  onedev:
    image: 1dev/server:11.6.6
    restart: always

    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
      - "onedev-data:/opt/onedev"
    
volumes:
  onedev-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
