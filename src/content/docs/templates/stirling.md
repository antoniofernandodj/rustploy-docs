---
title: Hospedar Stirling com Rustploy
description: "Aplicação Stirling. Crie Stirling em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Stirling**: Aplicação Stirling. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `stirling` |
| **Containers** | 1 (`stirling-pdf`) |
| **Imagens** | `docker.stirlingpdf.com/stirlingtools/stirling-pdf:latest` |
| **Porta da interface** | 8080, no serviço `stirling-pdf` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Stirling** e selecione.
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
| `stirling-pdf` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  stirling-pdf:
    image: docker.stirlingpdf.com/stirlingtools/stirling-pdf:latest
    ports:
      - 8080
    volumes:
      - stirling_pdf_trainingdata:/usr/share/tessdata # Required for extra OCR languages
      - stirling_pdf_extraconfigs:/configs
      - stirling_pdf_customfiles:/customFiles/
      - stirling_pdf_logs:/logs/
      - stirling_pdf_pipeline:/pipeline/
    environment:
      - DOCKER_ENABLE_SECURITY=false
      - LANGS=en_GB
volumes:
  stirling_pdf_trainingdata:
  stirling_pdf_extraconfigs:
  stirling_pdf_customfiles:
  stirling_pdf_logs:
  stirling_pdf_pipeline:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
