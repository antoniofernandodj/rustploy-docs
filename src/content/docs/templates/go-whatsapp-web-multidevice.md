---
title: Hospedar Go Whatsapp Web Multidevice com Rustploy
description: "Aplicação Go Whatsapp Web Multidevice. Crie Go Whatsapp Web Multidevice em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Go Whatsapp Web Multidevice**: Aplicação Go Whatsapp Web Multidevice. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `go-whatsapp-web-multidevice` |
| **Containers** | 1 (`whatsapp`) |
| **Imagens** | `aldinokemal2104/go-whatsapp-web-multidevice` |
| **Porta da interface** | 3080, no serviço `whatsapp` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Go Whatsapp Web Multidevice** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `wa_user` | admin |
| `wa_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `WA_USER` | ${wa_user} |
| `WA_PASSWORD` | ${wa_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `whatsapp` | 3080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  whatsapp:
    image: aldinokemal2104/go-whatsapp-web-multidevice
    restart: always
    ports:
      - "3080"
    volumes:
      - whatsapp:/app/storages
    command:
      - rest
      - --basic-auth=${WA_USER}:${WA_PASSWORD}
      - --port=3080
      - --debug=true
      - --os=Chrome
      - --account-validation=false

volumes:
  whatsapp:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
