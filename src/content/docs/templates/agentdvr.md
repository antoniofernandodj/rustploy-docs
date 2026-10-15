---
title: Hospedar Agent DVR com Rustploy
description: "Sistema completo de vigilância e monitoramento de vídeo com IA. Crie Agent DVR em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Agent DVR**: Sistema completo de vigilância e monitoramento de vídeo com IA. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `agentdvr` |
| **Containers** | 1 (`agentdvr`) |
| **Imagens** | `mekayelanik/ispyagentdvr:latest` |
| **Porta da interface** | 8090, no serviço `agentdvr` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Agent DVR** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `timezone` | America/New_York |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `TIMEZONE` | ${timezone} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `agentdvr` | 8090 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  agentdvr:
    image: mekayelanik/ispyagentdvr:latest
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=${TIMEZONE:-America/New_York}
      - AGENTDVR_WEBUI_PORT=8090
    volumes:
      - agentdvr-config:/AgentDVR/Media/XML/
      - agentdvr-media:/AgentDVR/Media/WebServerRoot/Media/
      - agentdvr-commands:/AgentDVR/Commands/
    ports:
      - 8090
      - 3478/udp
      - 50000-50100/udp

volumes:
  agentdvr-config: {}
  agentdvr-media: {}
  agentdvr-commands: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
