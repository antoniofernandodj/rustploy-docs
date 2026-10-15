---
title: Catálogo de templates
description: "Catálogo com 386 aplicações prontas para criar em um clique no Rustploy: nome, containers, imagens, porta e variáveis de cada template."
---

O Rustploy traz **386 templates** de aplicações. Cada página mostra os containers, as imagens, a porta, as variáveis geradas e o compose completo. Para usar, veja [Templates de um clique](/guias/templates/).

## Geradores de valores

Nas variáveis dos templates, estes marcadores viram valores na hora de criar o serviço:

| Marcador | Resultado |
|---|---|
| `${domain}` | um domínio provisório (`app-xxxx.example.com`), que você troca pelo seu |
| `${password:N}` | senha aleatória de N caracteres |
| `${base64:N}` | chave aleatória em base64 |
| `${hash:N}` | hash aleatório |
| `${uuid}` | UUID aleatório |
| `${email}` / `${username}` | e-mail e usuário gerados |
| `${jwt}` | JWT gerado |

## Todos os templates


### A

- [Ackee](/templates/ackee/): Analytics focado em privacidade para websites
- [Activepieces](/templates/activepieces/): Automação no-code (Alternativa ao Zapier e Make)
- [Actual Budget](/templates/actualbudget/): Gerenciador de finanças pessoais rápido e privado
- [AdGuard Home](/templates/adguardhome/): Bloqueador de anúncios e rastreadores em nível de rede DNS
- [Adminer](/templates/adminer/): Gerenciador de banco de dados leve (MySQL, Postgres, SQLite, etc)
- [AdventureLog](/templates/adventurelog/): Rastreador de atividades físicas com integração ao Strava
- [Affine Pro](/templates/affinepro/): Plataforma de notas e gerenciamento de projetos colaborativos (Estilo Notion/Miro)
- [Agent DVR](/templates/agentdvr/): Sistema completo de vigilância e monitoramento de vídeo com IA
- [Akaunting](/templates/akaunting/): Software de contabilidade open-source para pequenas empresas
- [AList](/templates/alist/): Centralizador de múltiplos armazenamentos de arquivos via WebDAV
- [AllTube](/templates/alltube/): Interface web (GUI) para baixar vídeos usando youtube-dl
- [Ampache](/templates/ampache/): Central de streaming e gerenciamento de músicas/vídeos
- [AnonUpload](/templates/anonupload/): Compartilhamento anônimo e seguro de arquivos (sem banco de dados)
- [Anse](/templates/anse/): Interface web para chat com IA compatível com a API da OpenAI
- [Answer](/templates/answer/): Plataforma de perguntas e respostas (Estilo StackOverflow privado)
- [Anubis](/templates/anubis/): Protetor e bloqueador de bots maliciosos para sites
- [AnythingLLM](/templates/anythingllm/): Chatbot privado para conversar com seus documentos locais
- [Anytype](/templates/anytype/): Base de conhecimento pessoal "offline-first" e criptografada
- [App Flowy](/templates/appflowy/): Alternativa open-source ao Notion focada em privacidade
- [Apprise API](/templates/apprise-api/): API universal para envio de notificações para dezenas de serviços
- [Appsmith](/templates/appsmith/): Construtor low-code de ferramentas internas e painéis administrativos
- [Appwrite](/templates/appwrite/): Plataforma Backend-as-a-Service (BaaS) completa em Docker
- [Aptabase](/templates/aptabase/): Plataforma auto-hospedada para análise de tráfego web
- [ArangoDB](/templates/arangodb/): Banco de dados nativo multi-modelo (documentos, grafos, chave-valor)
- [Argilla](/templates/argilla/): Plataforma para curadoria de dados e fluxos de Machine Learning
- [Audiobookshelf](/templates/audiobookshelf/): Servidor de mídia exclusivo para audiolivros e podcasts
- [Authelia](/templates/authelia/): Provedor de Single Sign-On (SSO) com autenticação multifator (2FA)
- [Authentik](/templates/authentik/): Gerenciador de identidade e acesso integrado (SAML, OAuth2, OIDC)
- [Authorizer](/templates/authorizer/): Solução low-code de autenticação e autorização de usuários
- [Autobase](/templates/autobase/): Alternativa de código aberto a bancos de dados gerenciados em nuvem
- [Automatisch](/templates/automatisch/): Aplicação Automatisch
- [AzuraCast](/templates/azuracast/): Painel completo "all-in-one" para gerenciamento de Web Rádios

### B

- [BabyBuddy](/templates/babybuddy/): Monitor de rotina para cuidados e desenvolvimento de bebês
- [Backrest](/templates/backrest/): Interface web para gerenciamento e automação de backups via restic
- [Baikal](/templates/baikal/): Servidor leve para sincronização de Calendários (CalDAV) e Contatos (CardDAV)
- [Barrage](/templates/barrage/): Interface web minimalista e mobile-first para o cliente de torrent Deluge
- [Baserow](/templates/baserow/): Banco de dados relacional com interface de planilha (Alternativa ao Airtable)
- [Bazarr](/templates/bazarr/): Gerenciador automático de legendas integrado ao Sonarr/Radarr
- [BentoPDF](/templates/bentopdf/): Microserviço leve para geração de arquivos PDF via API HTTP
- [Beszel](/templates/beszel/): Monitor leve de servidores com estatísticas de containers e alertas
- [BigCapital](/templates/bigcapital/): Sistema ERP e contábil corporativo (Alternativa ao QuickBooks)
- [Blender](/templates/blender/): Suíte completa de criação, modelagem e renderização 3D
- [Blinko](/templates/blinko/): Aplicativo moderno de anotações rápidas e organização de fluxos
- [Bluesky PDS](/templates/bluesky-pds/): Servidor de Dados Pessoais (PDS) para a rede descentralizada Bluesky
- [bolt.diy](/templates/bolt-diy/): Ferramenta para rodar, editar e implantar apps full-stack usando qualquer LLM
- [Booklore](/templates/booklore/): Aplicação em MariaDB para gerenciar dados relacionados a livros
- [BookStack](/templates/bookstack/): Plataforma wiki para criação de documentações corporativas e manuais
- [Borgitory](/templates/borgitory/): Interface web para visualizar e gerenciar repositórios BorgBackup
- [Botpress](/templates/botpress/): Plataforma para criação e orquestração de agentes de IA conversacionais
- [Browserless](/templates/browserless/): Execução remota e headless do Chrome/Puppeteer em containers Docker
- [Budget Board](/templates/budget-board/): App de orçamento financeiro com backend em PostgreSQL
- [Budibase](/templates/budibase/): Plataforma low-code para criação ágil de formulários e portais internos
- [Bugsink](/templates/bugsink/): Rastreador de erros de software auto-hospedado compatível com Sentry-SDK
- [Bytebase](/templates/bytebase/): Ferramenta para controle e gerenciamento do ciclo de vida de bancos de dados
- [ByteStash](/templates/bytestash/): Repositório privado e organizador de trechos de código (Snippets)

### C

- [Calcom](/templates/calcom/): Agendador de reuniões e marcação de horários (Alternativa ao Calendly)
- [Calibre](/templates/calibre/): Gerenciador e organizador completo de bibliotecas de e-books
- [Calibre-Web](/templates/calibre-web/): Interface moderna para ler e navegar em e-books do Calibre via navegador
- [Cap.so](/templates/capso/): Ambiente completo para aplicações web com suporte a MySQL e S3
- [Carbone](/templates/carbone/): Motor de alta performance para geração de documentos com dados em JSON
- [Casdoor](/templates/casdoor/): Central de gerenciamento de acesso e identidade (IAM) com suporte a múltiplos protocolos
- [Change Detection](/templates/changedetection/): Monitor inteligente para detecção de alterações em páginas web
- [Chatwoot](/templates/chatwoot/): Plataforma de atendimento omnichannel (Live Chat, WhatsApp, Redes Sociais)
- [Checkcle](/templates/checkcle/): Ferramenta de segurança corporativa para auditoria de runtime e conformidade
- [Checkmate](/templates/checkmate/): Monitor em tempo real de hardware, uptime de servidores e incidentes
- [Chevereto](/templates/chevereto/): Plataforma robusta de hospedagem e compartilhamento de imagens/vídeos
- [Chibisafe](/templates/chibisafe/): Cofre de arquivos pessoal de alta performance baseado em nuvem
- [Chief-Onboarding](/templates/chiefonboarding/): Sistema para gerenciamento e integração de novos colaboradores
- [ChirpStack](/templates/chirpstack/): Servidor de rede open-source para gerenciamento de dispositivos IoT LoRaWAN
- [Chromium](/templates/chromium/): Navegador open-source empacotado para execução em container
- [ClassicPress](/templates/classicpress/): CMS focado em criadores (Fork estável do WordPress com editor clássico)
- [ClickHouse](/templates/clickhouse/): Banco de dados analítico (OLAP) orientado a colunas extremamente veloz
- [Cloud9](/templates/cloud9/): IDE completa na nuvem para codificação colaborativa em tempo real
- [Cloud Commander](/templates/cloudcommander/): Gerenciador de arquivos para web com terminal e editor embutidos
- [Cloudflare DDNS](/templates/cloudflare-ddns/): Script robusto para atualização automática de DNS Dinâmico na Cloudflare
- [Cloudflared](/templates/cloudflared/): Daemon para conectar serviços locais à internet de forma segura via Cloudflare Tunnel
- [Cloudreve](/templates/cloudreve/): Sistema de gerenciamento e compartilhamento de arquivos multi-nuvem
- [Cockpit](/templates/cockpit/): CMS Headless com arquitetura orientada a API para entrega de conteúdo
- [Coder](/templates/coder/): Ambiente de desenvolvimento baseado em nuvem (CDE) corporativo
- [CodeX Docs](/templates/codex-docs/): Hub de engenharia com ferramentas unificadas como Editor.js e Hawk.so
- [Colanode](/templates/colanode/): Aplicação Colanode
- [Collabora Office](/templates/collabora-office/): Suíte de escritório online poderosa baseada no LibreOffice
- [CommaFeed](/templates/commafeed/): Agregador de feeds RSS minimalista rodando em PostgreSQL
- [Commento++](/templates/commento/): Caixa de comentários leve para sites estáticos com moderação de spam
- [Commentoplusplus](/templates/commentoplusplus/): Aplicação Commentoplusplus
- [Conduit](/templates/conduit/): Servidor de chat Matrix ultrarrápido escrito em Rust
- [Conduwuit](/templates/conduwuit/): Versão otimizada e rica em recursos do servidor Matrix Conduit
- [Confluence](/templates/confluence/): Espaço corporativo para compartilhamento de conhecimento e documentações de projetos
- [ConvertX](/templates/convertx/): Serviço utilitário de conversão de arquivos de mídia em massa
- [Convex](/templates/convex/): Banco de dados reativo para facilitar o desenvolvimento de aplicações web de tempo real
- [CookieCloud](/templates/cookie-cloud/): Sincronizador criptografado de cookies de navegadores entre dispositivos
- [Coralproject](/templates/coralproject/): Aplicação Coralproject
- [CouchDB](/templates/couchdb/): Banco de dados NoSQL baseado em documentos com excelente sincronização
- [Crawl4AI](/templates/crawl4ai/): Web crawler otimizado para IA com suporte a extrações em Markdown e LLM
- [Crowdsec](/templates/crowdsec/): Sistema de segurança colaborativo contra IPs maliciosos
- [Cup](/templates/cup/): Interface gráfica leve para administração de containers Docker locais
- [CyberChef](/templates/cyberchef/): Canivete suíço web para operações de criptografia, codificação e análise de dados

### D

- [Dashy](/templates/dashy/): Dashboard pessoal customizável com monitoramento de status e widgets
- [DataLens](/templates/datalens/): Ferramenta escalável de Business Intelligence (BI) e visualização de dados
- [Directory Lister](/templates/directory-lister/): Script simples em PHP para listagem e navegação de diretórios web
- [Directus](/templates/directus/): CMS Headless e wrapper instantâneo de APIs para SQL
- [Discord Tickets](/templates/discord-tickets/): Bot corporativo para controle e abertura de chamados via Discord
- [Discourse](/templates/discourse/): Plataforma moderna para fóruns de discussão e comunidades
- [Docling Serve](/templates/docling-serve/): Serviço em API para conversão de documentos baseado em IA
- [Docmost](/templates/docmost/): Wiki colaborativa de código aberto para documentações de equipes
- [Documenso](/templates/documenso/): Plataforma para assinaturas digitais de documentos (Alternativa ao DocuSign)
- [Docuseal](/templates/docuseal/): Sistema de gestão de documentos com foco em assinatura eletrônica
- [Dokploy Prom Monitoring Extension](/templates/dokploy-prom-monitoring-extension/): Aplicação Dokploy Prom Monitoring Extension
- [Dolibarr](/templates/dolibarr/): Pacote unificado de software ERP e CRM para gestão empresarial
- [Domain Locker](/templates/domain-locker/): Monitor e rastreador automático de expiração de domínios web
- [Doublezero](/templates/doublezero/): Aplicação Doublezero
- [Dozzle](/templates/dozzle/): Visualizador leve e em tempo real para logs de containers Docker
- [Dragonfly Db](/templates/dragonfly-db/): Aplicação Dragonfly Db
- [draw.io](/templates/drawio/): Ferramenta avançada para desenho de diagramas e quadros brancos
- [Drawnix](/templates/drawnix/): Aplicação para renderização e gerenciamento de ativos visuais
- [drizzle gateway](/templates/drizzle-gateway/): Gateway de banco de dados nativo do ecossistema Drizzle ORM
- [DumbAssets](/templates/dumbassets/): Rastreador de ativos estáticos sem necessidade de banco de dados
- [DumbBudget](/templates/dumbbudget/): Controle financeiro minimalista protegido por PIN (sem banco de dados)
- [DumbDrop](/templates/dumbdrop/): Compartilhador de arquivos de uso único temporário e anônimo
- [DumbPad](/templates/dumbpad/): Bloco de notas web simples com proteção por senha

### E

- [Easy!Appointments](/templates/easyappointments/): Sistema web para reservas e agendamentos de clientes
- [Elasticsearch](/templates/elastic-search/): Motor distribuído de busca textual e análise analítica em tempo real
- [Emby](/templates/emby/): Servidor de mídia privado para streaming de filmes, séries e músicas
- [EMQX](/templates/emqx/): Broker MQTT massivamente escalável para projetos IoT e veículos conectados
- [Enshrouded](/templates/enshrouded/): Servidor dedicado para o jogo multiplayer Enshrouded via Steam
- [ERPNext](/templates/erpnext/): Sistema integrado completo de gestão empresarial open-source
- [Etherpad](/templates/etherpad/): Editor de texto colaborativo multiusuário em tempo real
- [Evershop](/templates/evershop/): Solução completa e modular de e-commerce e loja virtual
- [Evolution API](/templates/evolutionapi/): API de WhatsApp focada em automação para pequenas empresas
- [Excalidraw](/templates/excalidraw/): Quadro branco virtual para esboços e diagramas desenhados à mão
- [EZBookkeeping](/templates/ezbookkeeping/): Gerenciador contábil para finanças pessoais e microempresas

### F

- [File Browser](/templates/filebrowser/): Gerenciador de arquivos web completo com controle de usuários
- [Filestash](/templates/filestash/): Cliente web para conectar múltiplos armazenamentos a provedores de identidade
- [Firecrawl](/templates/firecrawl/): API de raspagem web que transforma qualquer URL em Markdown limpo para LLMs
- [Fivem](/templates/fivem/): Aplicação Fivem
- [Flagsmith](/templates/flagsmith/): Ferramenta para gerenciamento de Feature Flags e configurações remotas
- [FlareSolverr](/templates/flaresolverr/): Proxy para contornar proteções do Cloudflare e DDoS-GUARD
- [Flatnotes](/templates/flatnotes/): Bloco de notas que salva arquivos diretamente em Markdown puro
- [Flatnotes (TOTP)](/templates/flatnotes-totp/): Versão do Flatnotes com camada de autenticação em duas etapas (2FA)
- [Flowise](/templates/flowise/): Interface visual no-code para construir e orquestrar cadeias de LLM
- [FMD Server](/templates/fmd-server/): Painel de controle e localização de dispositivos Android via Find My Device
- [Focalboard](/templates/focalboard/): Gerenciador de tarefas em estilo Kanban (Alternativa ao Trello/Asana)
- [Fonoster](/templates/fonoster/): Alternativa ao Twilio para telefonia na nuvem, SIP e WebRTC
- [Forgejo](/templates/forgejo/): Plataforma leve e independente para hospedagem de código Git
- [Formbricks](/templates/formbricks/): Ferramenta modular para criação e análise de pesquisas com usuários
- [Frappe HR](/templates/frappe-hr/): Módulo completo de código aberto para Recursos Humanos e Folha de Pagamento
- [FreeScout](/templates/freescout/): Central de atendimento e helpdesk (Alternativa ao HelpScout e Zendesk)
- [FreshRSS](/templates/freshrss/): Agregador e leitor de feeds RSS rápido, leve e customizável

### G

- [Garage](/templates/garage/): Aplicação Garage
- [Garage With Ui](/templates/garage-with-ui/): Aplicação Garage With Ui
- [Ghost](/templates/ghost/): Plataforma profissional e moderna para publicação de blogs e newsletters
- [Gitea Mirror](/templates/gitea-mirror/): Sincronizador automático de repositórios do GitHub para instâncias Gitea
- [Gitea (MySQL)](/templates/gitea-mysql/): Servidor Git Gitea configurado com banco de dados MySQL
- [Gitea Postgres](/templates/gitea-postgres/): Aplicação Gitea Postgres
- [Gitea (SQLite)](/templates/gitea-sqlite/): Versão simplificada do Gitea rodando em um único container com SQLite
- [Gitingest](/templates/gitingest/): App utilitário integrado com S3, Sentry e coleta de métricas via Prometheus
- [GitLab CE](/templates/gitlab-ce/): Plataforma robusta DevOps completa para ciclo de vida de código e CI/CD
- [Glance](/templates/glance/): Feed unificado para reunir feeds RSS, clima, bookmarks e monitoramento
- [Glitchtip](/templates/glitchtip/): Coletor centralizado e simplificado de erros de aplicações (Alternativa ao Sentry)
- [Glpi](/templates/glpi/): Aplicação Glpi
- [Go Whatsapp Web Multidevice](/templates/go-whatsapp-web-multidevice/): Aplicação Go Whatsapp Web Multidevice
- [Gotenberg](/templates/gotenberg/): API apátrida escalável em Docker dedicada a conversões de arquivos para PDF
- [Grafana](/templates/grafana/): Suíte de observabilidade para criação de dashboards gráficos analíticos
- [Grimoire](/templates/grimoire/): Organizador e salvador de favoritos (bookmarks) ultra veloz
- [Grist](/templates/grist/): Planilha inteligente open-source integrada com a estrutura relacional de banco de dados

### H

- [Habitica](/templates/habitica/): Gamificação de rotinas e tarefas diárias em formato de RPG
- [HeyForm](/templates/heyform/): Construtor visual de formulários de conversação, enquetes e quizzes
- [Hi.events](/templates/hi-events/): Plataforma integrada de venda de ingressos e gestão de eventos locais
- [Hoarder](/templates/hoarder/): Aplicativo inteligente de bookmarks com auto-tagging baseado em IA
- [Homarr](/templates/homarr/): Dashboard moderno de aplicativos residenciais integrado ao Docker
- [Home Assistant](/templates/homeassistant/): Ecossistema open-source definitivo para automação residencial privada
- [Homebridge](/templates/homebridge/): Emulador para trazer compatibilidade com o Apple HomeKit para dispositivos legados
- [Hoppscotch](/templates/hoppscotch/): Aplicação Hoppscotch
- [HortusFox](/templates/hortusfox/): Sistema de gerenciamento de fotos, rotinas e tarefas voltado para fotógrafos
- [Huly](/templates/huly/): Gerenciador de projetos e times tudo-em-um (Alternativa ao Jira, Linear e Slack)

### I

- [I18n Blog](/templates/i18n-blog/): Aplicação I18n Blog
- [I Hate Money](/templates/ihatemoney/): Utilitário web focado na divisão de contas compartilhadas e despesas em grupo
- [imgproxy](/templates/imgproxy/): Servidor de processamento rápido de imagens otimizado por Nginx
- [Immich](/templates/immich/): Servidor de backup de alta performance para fotos e vídeos de celulares
- [Infisical](/templates/infisical/): Plataforma unificada de gerenciamento de secrets, chaves e variáveis de ambiente
- [InfluxDB](/templates/influxdb/): Banco de dados otimizado especificamente para séries temporais e métricas de infraestrutura
- [Inngest](/templates/inngest/): Motor para orquestração e execução de workflows serverless baseados em eventos
- [InstantDB](/templates/instantdb/): Banco de dados em tempo real com sincronização instantânea de estado em clients
- [InvoiceShelf](/templates/invoiceshelf/): Emissor de faturas e gerenciador financeiro para profissionais autônomos
- [Ipfs](/templates/ipfs/): Aplicação Ipfs
- [IT Tools](/templates/it-tools/): Coleção massiva de pequenos utilitários online essenciais para desenvolvedores

### J

- [Java](/templates/java/): Aplicação Java
- [Jellyfin](/templates/jellyfin/): Central de mídia e streaming de vídeo totalmente gratuita e open-source
- [Jenkins](/templates/jenkins/): Clássico servidor de automação open-source voltado para pipelines de CI/CD

### K

- [Kaneo](/templates/kaneo/): Plataforma limpa e simplificada de gerenciamento de projetos
- [KaraKeep](/templates/karakeep/): Rebrand do aplicativo de favoritos e anotações baseadas em IA (antigo Hoarder)
- [Kener](/templates/kener/): Página de status open-source moderna para monitoramento de infraestrutura
- [Kestra](/templates/kestra/): Orquestrador declarativo de fluxos de dados e lógica complexa de negócios
- [Keycloak](/templates/keycloak/): Provedor robusto de gerenciamento de identidade e autenticação corporativa
- [Kimai](/templates/kimai/): Sistema multiusuário para controle e monitoramento de horas trabalhadas (Time-tracking)
- [KitchenOwl](/templates/kitchenowl/): Organizador inteligente de receitas culinárias e listas de supermercado
- [Kokoro TTS](/templates/kokoro-tts/): Wrapper FastAPI em Docker para síntese de voz usando o modelo Kokoro-82M
- [Kokoro Web](/templates/kokoro-web/): Interface de usuário amigável para geração de áudios via IA do Kokoro
- [Komari Monitor](/templates/komari-monitor/): Painel web leve para visualização rápida de desempenho de hardware
- [Kutt](/templates/kutt/): Encurtador de URLs moderno com suporte a domínios customizados e analytics

### L

- [Langflow](/templates/langflow/): Interface low-code focada na criação de pipelines de RAG e agentes de IA
- [Lavalink](/templates/lavalink/): Servidor autônomo de streaming de áudio e música baseado em Java
- [Letterfeed](/templates/letterfeed/): Conversor inteligente que transforma newsletters recebidas por e-mail em feeds RSS
- [LibreChat](/templates/librechat/): Interface avançada e unificada para conversar com múltiplos provedores de IA (Ollama, OpenAI, Anthropic)
- [Libredesk](/templates/libredesk/): Central de helpdesk e suporte ao cliente empacotada em binário único
- [LibreTranslate](/templates/libretranslate/): API auto-hospedada de tradução de idiomas por máquina sem dependências externas
- [Linkding](/templates/linkding/): Gerenciador de favoritos veloz com uma interface minimalista livre de distrações
- [LinkStack](/templates/linkstack/): Plataforma estilo "Link na Bio" altamente customizável para agregação de redes sociais
- [Linkwarden](/templates/linkwarden/): Gerenciador de links focado em arquivamento completo e preservação de páginas web
- [Listmonk](/templates/listmonk/): Gerenciador de campanhas de e-mail marketing e newsletters de alta performance
- [LiteLLM](/templates/litellm/): Proxy leve que unifica as chamadas de múltiplos LLMs sob o padrão da API da OpenAI
- [Livekit](/templates/livekit/): Infraestrutura em tempo real focada em transmissão de vídeo e áudio via WebRTC
- [Lobe Chat](/templates/lobe-chat/): Framework de chat com IA moderno, modular e com suporte a plugins de voz
- [Lodestone](/templates/lodestone/): Painel intuitivo de gerenciamento de servidores de Minecraft e jogos multiplayer
- [Logto](/templates/logto/): Plataforma CIAM moderna voltada para autenticação de clientes e colaboradores
- [Lowcoder](/templates/lowcoder/): Construtor visual rápido de aplicações e painéis de dados corporativos

### M

- [Macos](/templates/macos/): Aplicação Macos
- [Mage AI](/templates/mage-ai/): Ferramenta moderna de engenharia de dados para construir, rodar e monitorar pipelines
- [Mailpit](/templates/mailpit/): Servidor SMTP falso local focado em testes e inspeção de e-mails de desenvolvimento
- [Mattermost](/templates/mattermost/): Plataforma de chat corporativo e colaboração técnica focada em DevOps
- [Mautic](/templates/mautic/): Sistema completo de automação de marketing digital e gerenciamento de leads
- [Maybe](/templates/maybe/): Aplicação privada e moderna para acompanhamento financeiro e despesas domésticas
- [MAZANOKE](/templates/mazanoke/): Plataforma ágil e minimalista para hospedagem e compartilhamento de álbuns de fotos
- [MCSManager](/templates/mcsmanager/): Painel web distribuído para administração de servidores Minecraft e instâncias de jogos
- [Mealie](/templates/mealie/): Aplicação Mealie
- [MediaCMS](/templates/mediacms/): CMS moderno focado em streaming de vídeo, canais e compartilhamento de mídia
- [MediaFetch](/templates/mediafetch/): Interface web simplificada para download de áudio/vídeo alimentada por yt-dlp
- [Meilisearch](/templates/meilisearch/): Motor de busca textual open-source focado em velocidade extrema e experiência do usuário
- [Memos](/templates/memos/): Central de notas rápidas inspirada no Twitter, com foco em privacidade
- [Metabase](/templates/metabase/): Plataforma fácil de Business Intelligence para geração rápida de relatórios e dashboards
- [MeTube](/templates/metube/): Downloader web de vídeos do YouTube utilizando o motor do yt-dlp
- [Minepanel](/templates/minepanel/): Painel em Docker voltado à criação, monitoramento e controle de instâncias de Minecraft
- [Minio](/templates/minio/): Servidor de armazenamento de objetos distribuído 100% compatível com a API AWS S3
- [Misaka Danmu Server](/templates/misaka-danmu-server/): Servidor dedicado ao gerenciamento de comentários flutuantes (danmaku) para streams
- [Mixpost](/templates/mixpost/): Plataforma centralizada para agendamento e postagem automática em redes sociais
- [Moltbot](/templates/moltbot/): Gateway e agente CLI de WhatsApp integrado com inteligência artificial
- [Morphos](/templates/morphos/): Microserviço focado em tarefas de orquestração distribuída leve
- [Movary](/templates/movary/): Rastreador pessoal de histórico de filmes assistidos integrado à base de dados do TMDB
- [Mulesoft Esb](/templates/mulesoft-esb/): Aplicação Mulesoft Esb
- [Mumble](/templates/mumble/): Servidor de comunicação de voz com baixíssima latência voltado para jogos cooperativos

### N

- [n8n](/templates/n8n/): Plataforma low-code avançada para automação de tarefas e fluxos complexos de integração
- [N8n Runner Postgres Ollama](/templates/n8n-runner-postgres-ollama/): Aplicação N8n Runner Postgres Ollama
- [N8n With Postgres](/templates/n8n-with-postgres/): Aplicação N8n With Postgres
- [Navidrome](/templates/navidrome/): Servidor leve de streaming de áudio compatível com o protocolo Subsonic
- [Neko](/templates/neko/): Navegador virtual compartilhado operando diretamente dentro de um container Docker (via WebRTC/VNC)
- [Netdata](/templates/netdata/): Monitor analítico de infraestrutura em tempo real com métricas detalhadas por segundo
- [Networking Toolbox](/templates/networking-toolbox/): Painel web contendo dezenas de utilitários rápidos para testes de rede
- [Nextcloud Aio](/templates/nextcloud-aio/): Aplicação Nextcloud Aio
- [Nginx](/templates/nginx/): O clássico servidor web de altíssima performance e proxy reverso
- [NocoDB](/templates/nocodb/): Transforma qualquer banco de dados relacional (Postgres/MySQL) em uma interface inteligente estilo Airtable
- [Notifuse](/templates/notifuse/): Central open-source para criação, envio e acompanhamento de métricas de newsletters
- [NTFY](/templates/ntfy/): Serviço utilitário para disparar notificações push para celulares ou desktops via requisições HTTP simples

### O

- [Obsidian LiveSync](/templates/obsidian-livesync/): Servidor CouchDB pré-configurado para sincronização em tempo real das notas do Obsidian
- [Odoo 17](/templates/odoo_17/): Aplicação Odoo 17
- [Odoo 18](/templates/odoo_18/): Aplicação Odoo 18
- [Odoo 19](/templates/odoo_19/): Aplicação Odoo 19
- [Ojs](/templates/ojs/): Aplicação Ojs
- [Omni-Tools](/templates/omni-tools/): Caixa de ferramentas utilitárias agrupadas em um único painel web estável
- [OneDev](/templates/onedev/): Servidor Git integrado com quadros Kanban e esteiras nativas de CI/CD
- [One Time Secret](/templates/onetimesecret/): Compartilhamento seguro de segredos e senhas por meio de links que se destroem após visualizados
- [Ontime](/templates/ontime/): Gerenciador de roteiros, contagem regressiva e cronogramas para eventos de transmissão ao vivo
- [Open Fiesta](/templates/open-fiesta/): Interface de inferência para chat de IA com suporte a múltiplos backends (Ollama/Gemini)
- [Open WebUI](/templates/open-webui/): Interface web completa para modelos LLM locais (Ollama) no estilo ChatGPT (inclui o Ollama)
- [Open Notebook](/templates/open_notebook/): Caderno de notas integrado com SurrealDB e utilitários assistidos por IA
- [Openclaw](/templates/openclaw/): Gateway CLI alternativo focado no ecossistema de mensagens automatizadas do WhatsApp
- [OpenGist](/templates/opengist/): Alternativa auto-hospedada ao GitHub Gist para compartilhamento público ou privado de trechos de código
- [OpenHands](/templates/openhands/): Ambiente centralizado voltado para a orquestração e deploy de agentes autônomos de IA
- [Openinary](/templates/openinary/): Alternativa de código aberto ao Cloudinary para processamento dinâmico de mídia
- [OpenPanel](/templates/openpanel/): Analytics web focado em privacidade, agindo como substituto limpo do Google Analytics ou Mixpanel
- [OpenResty Manager](/templates/openresty-manager/): Painel administrativo gráfico avançado para servidores OpenResty/Nginx com gestão de SSL
- [OpenSpeedTest](/templates/openspeedtest/): Testador interno de largura de banda e performance de rede local em HTML5
- [Otter Wiki](/templates/otterwiki/): Motor wiki baseado em Python e Flask focado em simplicidade com escrita em Markdown
- [Outline](/templates/outline/): Base de conhecimento corporativa moderna e extremamente limpa para equipes ágeis
- [Owncast](/templates/owncast/): Servidor independente de live streaming de vídeo com chat interativo embutido

### P

- [Palmr](/templates/palmr/): Plataforma minimalista para compartilhamento de arquivos pesados (Alternativa ao WeTransfer)
- [Parseable](/templates/parseable/): Sistema de análise de logs e observabilidade nativo para armazenamento de objetos
- [Passbolt](/templates/passbolt/): Gerenciador de senhas e credenciais open-source focado na colaboração de equipes técnicas
- [Pastefy](/templates/pastefy/): Repositório privado de textos (Pastebin) com realce de sintaxe e login via OAuth2
- [Paymenter](/templates/paymenter/): Sistema de cobrança, faturamento automático e área do cliente focado em provedores de hospedagem
- [PeerDB](/templates/peerdb/): Sincronizador analítico de dados entre bases com rotinas rápidas e APIs dedicadas
- [Penpot](/templates/penpot/): Ferramenta avançada de design vetorial e prototipação web (Alternativa open-source ao Figma)
- [Peppermint](/templates/peppermint/): Ambiente unificado focado em documentação, design e testes rápidos de endpoints de API
- [pgAdmin](/templates/pgadmin/): A interface gráfica oficial e mais popular para gerenciamento de bancos PostgreSQL
- [Photoprism](/templates/photoprism/): Organizador inteligente de fotos movido a IA para identificação automática de objetos e rostos
- [Phpmyadmin](/templates/phpmyadmin/): O clássico e amigável gerenciador web para bancos de dados MySQL e MariaDB
- [Picsur](/templates/picsur/): Servidor simplificado de hospedagem de imagens estruturado em PostgreSQL
- [Pinchflat](/templates/pinchflat/): Interface para baixar e automatizar o download de canais inteiros do YouTube via yt-dlp
- [Plane](/templates/plane/): Sistema moderno e ágil de gerenciamento de projetos e sprints (Alternativa ao Jira)
- [Plark](/templates/plark/): Construtor visual de sites institucionais rápido e auto-hospedado
- [Plausible](/templates/plausible/): Analisador leve de tráfego web sem cookies focado na privacidade do usuário
- [Plunk](/templates/plunk/): Plataforma integrada para gerenciamento de disparos de e-mails transacionais e marketing
- [Pocket ID](/templates/pocket-id/): Autenticador simples OIDC para proteger serviços usando passkeys nativas
- [PocketBase](/templates/pocketbase/): Backend em um único arquivo embarcado com SQLite, autenticação, realtime e painel
- [Poke](/templates/poke/): Plataforma privada focada em compartilhamento de vídeos mantendo anonimato
- [Portainer](/templates/portainer/): Painel visual clássico e indispensável para gerenciamento geral de instâncias Docker e Swarm
- [Poste.io](/templates/poste-io/): Servidor de e-mail corporativo completo (SMTP, IMAP, Antivírus) em uma única imagem estável
- [Postgres Pgdog](/templates/postgres-pgdog/): Aplicação Postgres Pgdog
- [Postgresus](/templates/postgresus/): Utilitário para automação e agendamento contínuo de backups de bancos PostgreSQL
- [Postiz](/templates/postiz/): Plataforma focada em agendamento, análise e publicação multicanal de conteúdo
- [Prometheus](/templates/prometheus/): Banco de dados e central de monitoramento de séries temporais via scraping de métricas
- [Pterodactyl](/templates/pterodactyl/): Painel avançado e robusto focado no gerenciamento massivo de servidores de jogos em Docker
- [Pulse](/templates/pulse/): Painel responsivo para monitoramento centralizado de ambientes Proxmox VE e Docker
- [Pyrodactyl](/templates/pyrodactyl/): Alternativa leve, segura e rápida construída sobre a base do painel Pterodactyl

### Q

- [qBittorrent](/templates/qbittorrent/): Cliente de BitTorrent clássico equipado com sua interface web nativa de gerenciamento
- [Qbitwebui](/templates/qbitwebui/): Aplicação Qbitwebui
- [Qdrant](/templates/qdrant/): Banco de dados vetorial focado em busca de similaridade e armazenamento de embeddings em alta performance
- [Quant-UX](/templates/quant-ux/): Ferramenta avançada para prototipação e análise de comportamento e testes de UX de usuários

### R

- [RabbitMQ](/templates/rabbitmq/): Broker de mensageria multi-protocolo largamente utilizado para comunicação assíncrona
- [Reactive Resume](/templates/reactive-resume/): Gerador moderno de currículos baseado em seções estruturadas com exportação limpa
- [Registry](/templates/registry/): Aplicação Registry
- [Rocketchat](/templates/rocketchat/): Ecossistema completo de chat e comunicação interna corporativa
- [Rote](/templates/rote/): Sistema de anotações pessoais estruturado em chamadas de API nativas
- [Roundcube](/templates/roundcube/): Cliente tradicional de webmail baseado em PHP para caixas de e-mail IMAP
- [RSS-Bridge](/templates/rss-bridge/): Utilitário PHP focado em gerar feeds RSS estruturados de plataformas que não os possuem nativamente
- [RSSHub](/templates/rsshub/): Gerador dinâmico de feeds RSS conectável a milhares de serviços web e redes sociais
- [RustDesk](/templates/rustdesk/): Servidor de acesso remoto e controle de telas (Alternativa aberta ao TeamViewer/Anydesk)
- [RustFS](/templates/rustfs/): Sistema de arquivos distribuído S3-compatible escrito em Rust de altíssima performance
- [ruTorrent](/templates/rutorrent/): Interface clássica web robusta acoplada ao cliente estável de torrent rTorrent
- [Rybbit](/templates/rybbit/): Analytics web alternativo focado em ser mais legível e limpo que o Google Analytics clássico
- [Ryot](/templates/ryot/): Sistema unificado para registrar e catalogar mídias consumidas (Livros, Filmes, Jogos)

### S

- [Scrutiny](/templates/scrutiny/): Interface de monitoramento de integridade física e relatórios S.M.A.R.T. de discos rígidos
- [Scrypted](/templates/scrypted/): Central de processamento de vídeo de segurança com altíssima taxa de quadros e integração NVR
- [Seafile](/templates/seafile/): Nuvem privada para armazenamento, sincronização e compartilhamento de arquivos com foco corporativo
- [SearXNG](/templates/searxng/): Metamecanismo de busca privado que agrega resultados do Google/Bing sem rastrear dados
- [SeaweedFS](/templates/seaweedfs/): Sistema de arquivos distribuído veloz com suporte a mounts POSIX e WebDAV
- [Shlink](/templates/shlink/): Encurtador de links corporativo auto-hospedado feito para rodar sob seus próprios domínios
- [SigNoz](/templates/signoz/): Plataforma completa de APM, rastreamento de traces e logs (Alternativa ao Datadog)
- [SilverBullet](/templates/silverbullet/): Bloco de notas extensível operando como uma base pessoal de conhecimento dinâmico
- [Slash](/templates/slash/): Encurtador interno rápido feito para organizar caminhos de links favoritos
- [Snapp](/templates/snapp/): Servidor ágil para captura, upload e compartilhamento de prints e imagens com controle de acessos
- [Soketi](/templates/soketi/): Servidor WebSockets ultrarrápido construído em Node.js (Compatível com o ecossistema Laravel Pusher)
- [Spacedrive](/templates/spacedrive/): Gerenciador de arquivos cross-platform estruturado sob um sistema virtual distribuído (VDFS) em Rust
- [Stack Auth](/templates/stack-auth/): Provedor de autenticação de usuários simplificado (Alternativa aberta ao Clerk/Auth0)
- [Stalwart](/templates/stalwart/): Servidor de e-mail moderno completo escrito em Rust com suporte a JMAP, IMAP e criptografia nativa
- [Statping-NG](/templates/statping-ng/): Monitor visual de uptime e integridade de páginas com dashboards elegantes de status
- [Stirling](/templates/stirling/): Aplicação Stirling
- [Storyden](/templates/storyden/): Plataforma moderna de fóruns e quadros de discussão estruturada para comunidades engajadas
- [Strapi](/templates/strapi/): CMS Headless baseado em JavaScript líder de mercado para construção rápida de APIs de conteúdo
- [StreamFlow](/templates/streamflow/): Plataforma para retransmissão de fluxos de vídeo em tempo real (Restream) para múltiplos canais (YouTube/Facebook)
- [Supabase](/templates/supabase/): A alternativa open-source mais robusta ao Firebase (Stack completa baseada em PostgreSQL)
- [Superset](/templates/superset/): Aplicação Superset
- [SurrealDB](/templates/surrealdb/): Banco de dados multimodel moderno (relacional, grafos, documentos, vetorial) unificado
- [Syncthing](/templates/syncthing/): Sincronizador contínuo e descentralizado de diretórios entre múltiplos computadores em tempo real

### T

- [Tailscale Exitnode](/templates/tailscale-exitnode/): Aplicação Tailscale Exitnode
- [Teable](/templates/teable/): Banco de dados baseado em Postgres com interface visual de planilha de altíssima performance
- [Tianji](/templates/tianji/): Painel unificado combinando análises de acessos web com monitor de uptime de servidores
- [Tolgee](/templates/tolgee/): Plataforma web para gerenciamento e tradução de strings de localização de software
- [Tooljet](/templates/tooljet/): Construtor low-code de ferramentas internas conectável a múltiplos bancos de dados de forma nativa
- [Tor Browser](/templates/tor-browser/): Instância do navegador Tor acessível diretamente via interface web baseada em VNC (noVNC)
- [TrailBase](/templates/trailbase/): Servidor de aplicações veloz em Rust e SQLite equipado com runtime nativo de WebAssembly
- [Triggerdotdev](/templates/triggerdotdev/): Aplicação Triggerdotdev
- [Trilium](/templates/trilium/): Editor de notas estruturado hierarquicamente focado na construção de grandes bases de conhecimento
- [TriliumNext](/templates/trilium-next/): Fork mantido e atualizado com melhorias do organizador hierárquico Trilium Notes
- [TRMNL BYOS Laravel](/templates/trmnl-byos-laravel/): Aplicação self-hosted em Laravel feita para gerenciar as telas de tinta eletrônica (e-ink) da TRMNL
- [Tuwunel](/templates/tuwunel/): Servidor Matrix de alta performance em Rust (Sucessor oficial do Conduwuit para ambientes corporativos)
- [Twenty](/templates/twenty/): Aplicação Twenty
- [Typebot](/templates/typebot/): Construtor visual de fluxos de conversação e chatbots interativos via blocos arrastáveis
- [Typecho](/templates/typecho/): Um CMS leve, minimalista e rápido baseado em PHP focado na publicação de blogs simples
- [Typesense](/templates/typesense/): Motor de busca rápida e tolerante a falhas feito para buscas em tempo real em aplicações

### U

- [Umami](/templates/umami/): O clássico e popular analytics web focado em privacidade e em ser uma alternativa limpa ao Google Analytics
- [Unifi](/templates/unifi/): Aplicação Unifi
- [Unleash](/templates/unleash/): Plataforma corporativa robusta voltada ao gerenciamento de Feature Flags e estratégias de rollout
- [Upsnap](/templates/upsnap/): Dashboard simples integrado ao PocketBase feito para enviar pacotes Wake-on-LAN e monitorar dispositivos de rede
- [Uptime Kuma](/templates/uptime-kuma/): Monitor visual de uptime de serviços e portas de rede com alertas via Telegram/Discord
- [useSend](/templates/usesend/): Plataforma aberta para envio massivo e transacional de e-mails (Alternativa ao Resend e Sendgrid)

### V

- [Valkey](/templates/valkey/): O fork oficial do Redis mantido pela Linux Foundation e grandes provedores de nuvem
- [Vault](/templates/vault/): Cofre de segurança desenvolvido pela HashiCorp para gerenciamento estrito de segredos e acessos dinâmicos
- [Vaultwarden](/templates/vaultwarden/): Implementação leve em Rust compatível com toda a suíte de aplicativos do Bitwarden
- [Verdaccio](/templates/verdaccio/): Servidor proxy local e privado para repositórios e pacotes Node.js (npm)
- [Vikunja](/templates/vikunja/): Organizador completo de tarefas e listas de afazeres com suporte a Kanbans e visualizações de Gantt

### W

- [Wallos](/templates/wallos/): Rastreador pessoal focado no monitoramento financeiro de assinaturas mensais e gastos recorrentes
- [Wanderer](/templates/wanderer/): Plataforma de mapas e geolocalização estruturada em PocketBase e Meilisearch
- [Web-Check](/templates/web-check/): Analisador web "all-in-one" para levantar dados de infraestrutura, DNS e segurança de qualquer domínio
- [WG-Easy](/templates/wg-easy/): Interface gráfica simples e amigável para instalar e gerenciar servidores VPN baseados em WireGuard
- [Wiki.js](/templates/wikijs/): Uma das ferramentas mais completas e extensíveis para criação de Wikis e documentações modernas
- [Windmill](/templates/windmill/): Plataforma para desenvolvedores criarem fluxos de trabalho internos robustos baseados em scripts (Alternativa ao Retool)
- [Windows](/templates/windows/): Aplicação Windows
- [Wordpress](/templates/wordpress/): O CMS mais utilizado no mundo para criação e gerenciamento de sites e blogs
- [WuzAPI](/templates/wuzapi/): API RESTful leve para integração e automação multi-dispositivo com contas de WhatsApp

### X

- [XSSHunter](/templates/xsshunter/): Ferramenta avançada para pesquisadores de segurança focada na identificação de falhas de Blind XSS

### Y

- [Yamtrack](/templates/yamtrack/): Gerenciador pessoal de animes e mangás assistidos estruturado sob banco de dados Redis
- [YOURLS](/templates/yourls/): Sistema em PHP clássico para criação de encurtadores de links privados sob controle total do usuário
- [yt-dlp-webui](/templates/yt-dlp-webui/): Interface gráfica web simples mapeando as opções do terminal do utilitário yt-dlp

### Z

- [Zabbix](/templates/zabbix/): Monitor corporativo robusto para redes, servidores e serviços com suporte a banco de dados PostgreSQL
- [Zipline](/templates/zipline/): Servidor de upload rápido de arquivos otimizado para integração com ferramentas como ShareX
- [Zitadel](/templates/zitadel/): Provedor de identidade e gestão de acessos de última geração com suporte nativo a multi-inquilinato (multi-tenancy)
