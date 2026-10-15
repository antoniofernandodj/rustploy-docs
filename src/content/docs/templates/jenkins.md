---
title: Hospedar Jenkins com Rustploy
description: "Clássico servidor de automação open-source voltado para pipelines de CI/CD. Crie Jenkins em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Jenkins**: Clássico servidor de automação open-source voltado para pipelines de CI/CD. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `jenkins` |
| **Containers** | 1 (`jenkins`) |
| **Imagens** | `jenkins/jenkins:latest` |
| **Porta da interface** | 8080, no serviço `jenkins` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Jenkins** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `jenkins` | 8080 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
