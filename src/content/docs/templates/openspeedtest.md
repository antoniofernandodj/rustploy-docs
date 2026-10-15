---
title: Hospedar OpenSpeedTest com Rustploy
description: "Testador interno de largura de banda e performance de rede local em HTML5. Crie OpenSpeedTest em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**OpenSpeedTest**: Testador interno de largura de banda e performance de rede local em HTML5. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `openspeedtest` |
| **Containers** | 1 (`openspeedtest`) |
| **Imagens** | `openspeedtest/latest:latest` |
| **Porta da interface** | 3000, no serviço `openspeedtest` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **OpenSpeedTest** e selecione.
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
| `openspeedtest` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  openspeedtest:
    image: openspeedtest/latest:latest
    restart: unless-stopped
    ports:
      - 3000
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
