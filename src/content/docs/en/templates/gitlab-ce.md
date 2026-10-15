---
title: Host GitLab CE with Rustploy
description: "Robust, complete DevOps platform for the code lifecycle and CI/CD. Create GitLab CE in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**GitLab CE**: Robust, complete DevOps platform for the code lifecycle and CI/CD. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `gitlab-ce` |
| **Containers** | 3 (`gitlab`, `postgresql`, `redis`) |
| **Images** | `gitlab/gitlab-ce:latest`, `postgres:16-alpine`, `redis:7-alpine` |
| **UI port** | 80, on service `gitlab` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **GitLab CE** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_db` | gitlab |
| `postgres_user` | gitlab |
| `postgres_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `GITLAB_HOST` | ${main_domain} |
| `POSTGRES_DB` | ${postgres_db} |
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_PASSWORD` | ${postgres_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `gitlab` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  gitlab:
    image: gitlab/gitlab-ce:latest
    restart: unless-stopped
    hostname: gitlab.example.com
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://${GITLAB_HOST}'
        gitlab_rails['gitlab_ssh_host'] = '${GITLAB_HOST}'
        gitlab_rails['gitlab_shell_ssh_port'] = 2224
        gitlab_rails['db_adapter'] = 'postgresql'
        gitlab_rails['db_host'] = 'postgresql'
        gitlab_rails['db_port'] = '5432'
        gitlab_rails['db_database'] = '${POSTGRES_DB}'
        gitlab_rails['db_username'] = '${POSTGRES_USER}'
        gitlab_rails['db_password'] = '${POSTGRES_PASSWORD}'
        # Redis config for external TCP connection
        gitlab_rails['redis_url'] = 'redis://redis:6379/0'
        gitlab_rails['redis_host'] = 'redis'
        gitlab_rails['redis_port'] = 6379
        gitlab_rails['redis_socket'] = nil
        gitlab_rails['gitlab_email_enabled'] = false
        gitlab_rails['gitlab_default_can_create_group'] = true
        gitlab_rails['gitlab_username_changing_enabled'] = false
        unicorn['worker_processes'] = 2
        unicorn['worker_timeout'] = 60
        postgresql['enable'] = false
        redis['enable'] = false
        nginx['enable'] = true
        nginx['listen_port'] = 80
        nginx['listen_https'] = false
        prometheus_monitoring['enable'] = false
    ports:
      - "80"
      - "2224"
    volumes:
      - gitlab_config:/etc/gitlab
      - gitlab_logs:/var/log/gitlab
      - gitlab_data:/var/opt/gitlab
    depends_on:
      - postgresql
      - redis

  postgresql:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgresql_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data

volumes:
  gitlab_config:
  gitlab_logs:
  gitlab_data:
  postgresql_data:
  redis_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
