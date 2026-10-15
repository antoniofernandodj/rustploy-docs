---
title: Hospedar imgproxy com Rustploy
description: "Servidor de processamento rápido de imagens otimizado por Nginx. Crie imgproxy em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**imgproxy**: Servidor de processamento rápido de imagens otimizado por Nginx. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `imgproxy` |
| **Containers** | 2 (`imgproxy`, `nginx`) |
| **Imagens** | `darthsim/imgproxy:v3.30.1`, `nginx:1.28.2-alpine` |
| **Porta da interface** | 80, no serviço `nginx` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **imgproxy** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `imgproxy_key` | *hash aleatório* |
| `imgproxy_salt` | *hash aleatório* |
| `imgproxy_allowed_sources` | http://${main_domain},https://${main_domain} |
| `imgproxy_quality` | 80 |
| `imgproxy_ttl` | 30600 |
| `imgproxy_max_src_file_size` | 20971520 |
| `imgproxy_max_src_resolution` | 50 |
| `imgproxy_log_level` | error |
| `imgproxy_max_clients` | 10 |
| `imgproxy_allow_origin` | * |
| `imgproxy_enable_webp_detection` | true |
| `imgproxy_enforce_webp` | true |
| `imgproxy_use_etag` | true |
| `nginx_cache_levels` | 1:2 |
| `nginx_cache_keys_zone_size` | 32m |
| `nginx_cache_max_size` | 500m |
| `nginx_cache_inactive` | 30d |
| `nginx_cache_use_temp_path` | off |
| `nginx_cache_expires` | 30d |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `IMGPROXY_KEY` | ${imgproxy_key} |
| `IMGPROXY_SALT` | ${imgproxy_salt} |
| `IMGPROXY_ENABLE_WEBP_DETECTION` | ${imgproxy_enable_webp_detection} |
| `IMGPROXY_ENFORCE_WEBP` | ${imgproxy_enforce_webp} |
| `IMGPROXY_TTL` | ${imgproxy_ttl} |
| `IMGPROXY_DEVELOPMENT_ERRORS_MODE` | false |
| `IMGPROXY_READ_TIMEOUT` | 10 |
| `IMGPROXY_WRITE_TIMEOUT` | 10 |
| `IMGPROXY_KEEP_ALIVE_TIMEOUT` | 10 |
| `IMGPROXY_DOWNLOAD_TIMEOUT` | 5 |
| `IMGPROXY_CONCURRENCY` |  |
| `IMGPROXY_MAX_CLIENTS` | ${imgproxy_max_clients} |
| `IMGPROXY_SO_REUSEPORT` |  |
| `IMGPROXY_USER_AGENT` |  |
| `IMGPROXY_USE_ETAG` | ${imgproxy_use_etag} |
| `IMGPROXY_QUALITY` | ${imgproxy_quality} |
| `IMGPROXY_ALLOWED_SOURCES` | ${imgproxy_allowed_sources} |
| `IMGPROXY_ALLOW_ORIGIN` | ${imgproxy_allow_origin} |
| `IMGPROXY_MAX_SRC_FILE_SIZE` | ${imgproxy_max_src_file_size} |
| `IMGPROXY_MAX_SRC_RESOLUTION` | ${imgproxy_max_src_resolution} |
| `IMGPROXY_LOG_LEVEL` | ${imgproxy_log_level} |
| `NGINX_CACHE_LEVELS` | ${nginx_cache_levels} |
| `NGINX_CACHE_KEYS_ZONE_SIZE` | ${nginx_cache_keys_zone_size} |
| `NGINX_CACHE_MAX_SIZE` | ${nginx_cache_max_size} |
| `NGINX_CACHE_INACTIVE` | ${nginx_cache_inactive} |
| `NGINX_CACHE_USE_TEMP_PATH` | ${nginx_cache_use_temp_path} |
| `NGINX_CACHE_EXPIRES` | ${nginx_cache_expires} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `nginx` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  imgproxy:
    image: darthsim/imgproxy:v3.30.1
    restart: unless-stopped
    environment:
      IMGPROXY_KEY: ${IMGPROXY_KEY}
      IMGPROXY_SALT: ${IMGPROXY_SALT}
      IMGPROXY_ENABLE_WEBP_DETECTION: ${IMGPROXY_ENABLE_WEBP_DETECTION:-true}
      IMGPROXY_ENFORCE_WEBP: ${IMGPROXY_ENFORCE_WEBP:-true}
      IMGPROXY_TTL: ${IMGPROXY_TTL:-30600}
      IMGPROXY_DEVELOPMENT_ERRORS_MODE: ${IMGPROXY_DEVELOPMENT_ERRORS_MODE:-false}
      IMGPROXY_READ_TIMEOUT: ${IMGPROXY_READ_TIMEOUT:-10}
      IMGPROXY_WRITE_TIMEOUT: ${IMGPROXY_WRITE_TIMEOUT:-10}
      IMGPROXY_KEEP_ALIVE_TIMEOUT: ${IMGPROXY_KEEP_ALIVE_TIMEOUT:-10}
      IMGPROXY_DOWNLOAD_TIMEOUT: ${IMGPROXY_DOWNLOAD_TIMEOUT:-5}
      IMGPROXY_CONCURRENCY: ${IMGPROXY_CONCURRENCY:-}
      IMGPROXY_MAX_CLIENTS: ${IMGPROXY_MAX_CLIENTS:-10}
      IMGPROXY_SO_REUSEPORT: ${IMGPROXY_SO_REUSEPORT:-}
      IMGPROXY_USER_AGENT: ${IMGPROXY_USER_AGENT:-}
      IMGPROXY_USE_ETAG: ${IMGPROXY_USE_ETAG:-true}
      IMGPROXY_QUALITY: ${IMGPROXY_QUALITY:-80}
      IMGPROXY_ALLOWED_SOURCES: ${IMGPROXY_ALLOWED_SOURCES}
      IMGPROXY_ALLOW_ORIGIN: ${IMGPROXY_ALLOW_ORIGIN:-*}
      IMGPROXY_MAX_SRC_FILE_SIZE: ${IMGPROXY_MAX_SRC_FILE_SIZE:-20971520}
      IMGPROXY_MAX_SRC_RESOLUTION: ${IMGPROXY_MAX_SRC_RESOLUTION:-50}
      IMGPROXY_LOG_LEVEL: ${IMGPROXY_LOG_LEVEL:-error}

  nginx:
    image: nginx:1.28.2-alpine
    restart: unless-stopped
    expose:
      - 80
    environment:
      NGINX_CACHE_LEVELS: ${NGINX_CACHE_LEVELS:-1:2}
      NGINX_CACHE_KEYS_ZONE_SIZE: ${NGINX_CACHE_KEYS_ZONE_SIZE:-32m}
      NGINX_CACHE_MAX_SIZE: ${NGINX_CACHE_MAX_SIZE:-500m}
      NGINX_CACHE_INACTIVE: ${NGINX_CACHE_INACTIVE:-30d}
      NGINX_CACHE_USE_TEMP_PATH: ${NGINX_CACHE_USE_TEMP_PATH:-off}
      NGINX_CACHE_EXPIRES: ${NGINX_CACHE_EXPIRES:-30d}
    depends_on:
      - imgproxy
    volumes:
      - nginx-cache:/tmp/cache
    command:
      - /bin/sh
      - -c
      - |
        cat <<EOF > /etc/nginx/conf.d/default.conf
        proxy_cache_path /tmp/cache levels=$${NGINX_CACHE_LEVELS} keys_zone=my_cache:$${NGINX_CACHE_KEYS_ZONE_SIZE} max_size=$${NGINX_CACHE_MAX_SIZE} inactive=$${NGINX_CACHE_INACTIVE} use_temp_path=$${NGINX_CACHE_USE_TEMP_PATH};

        server {
          listen 80 default_server;
          listen [::]:80 default_server;

          location / {
            expires $${NGINX_CACHE_EXPIRES};
            access_log off;
            set \$$handle_webp 0;
            if (\$$http_accept ~* "image/webp") {
              set \$$handle_webp 1;
            }
            proxy_cache my_cache;
            proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
            proxy_cache_background_update on;
            proxy_cache_lock on;
            proxy_cache_key "\$$scheme\$$host\$$uri\$$handle_webp";
            server_tokens off;
            proxy_pass http://imgproxy:8080;
          }
        }
        EOF
        exec nginx -g 'daemon off;'

volumes:
  nginx-cache:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
