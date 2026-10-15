---
title: Host Jenkins with Rustploy
description: "Classic open-source automation server for CI/CD pipelines. Create Jenkins in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Jenkins**: Classic open-source automation server for CI/CD pipelines. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `jenkins` |
| **Containers** | 1 (`jenkins`) |
| **Images** | `jenkins/jenkins:latest` |
| **UI port** | 8080, on service `jenkins` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Jenkins** and select it.
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
| `jenkins` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  jenkins:
    image: jenkins/jenkins:latest
    volumes:
      - jenkins-home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    ports:
      - 8080

volumes:
  jenkins-home: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
