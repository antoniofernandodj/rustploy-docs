---
title: Hospedar OpenResty Manager com Rustploy
description: "Painel administrativo gráfico avançado para servidores OpenResty/Nginx com gestão de SSL. Crie OpenResty Manager em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**OpenResty Manager**: Painel administrativo gráfico avançado para servidores OpenResty/Nginx com gestão de SSL. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `openresty-manager` |
| **Containers** | 1 (`openresty-manager`) |
| **Imagens** | `uusec/openresty-manager:latest` |
| **Porta da interface** | 34567, no serviço `openresty-manager` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **OpenResty Manager** e selecione.
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
| `openresty-manager` | 34567 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  openresty-manager:
   image: uusec/openresty-manager:latest
   restart: always
   volumes:
     - /etc/localtime:/etc/localtime:ro
     - /etc/resolv.conf:/etc/resolv.conf:ro
     - om_acme:/opt/om/acme
     - om_data:/opt/om/data
     - om_conf:/opt/om/nginx/conf

volumes:
  om_acme:
  om_data:
  om_conf:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
