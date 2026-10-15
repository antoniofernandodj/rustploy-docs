---
title: Hospedar GitLab CE com Rustploy
description: "Plataforma robusta DevOps completa para ciclo de vida de código e CI/CD. Crie GitLab CE em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**GitLab CE**: Plataforma robusta DevOps completa para ciclo de vida de código e CI/CD. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `gitlab-ce` |
| **Containers** | 3 (`gitlab`, `postgresql`, `redis`) |
| **Imagens** | `gitlab/gitlab-ce:latest`, `postgres:16-alpine`, `redis:7-alpine` |
| **Porta da interface** | 80, no serviço `gitlab` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **GitLab CE** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_db` | gitlab |
| `postgres_user` | gitlab |
| `postgres_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `GITLAB_HOST` | ${main_domain} |
| `POSTGRES_DB` | ${postgres_db} |
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_PASSWORD` | ${postgres_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `gitlab` | 80 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
