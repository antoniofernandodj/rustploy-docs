---
title: Host Stirling with Rustploy
description: "Stirling application. Create Stirling in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Stirling**: Stirling application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `stirling` |
| **Containers** | 1 (`stirling-pdf`) |
| **Images** | `docker.stirlingpdf.com/stirlingtools/stirling-pdf:latest` |
| **UI port** | 8080, on service `stirling-pdf` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Stirling** and select it.
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
| `stirling-pdf` | 8080 | ${main_domain} |

## The template docker-compose.yml

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

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
