// Fonte única da FAQ (pt e en). Cada resposta é Markdown curto, autocontido (a primeira
// frase responde a pergunta). Links usam os slugs em português; o gerador prefixa /en/ no inglês.
// Não use links com âncora aqui: os títulos mudam de idioma e as âncoras também.
export const sections = [
  {
    title: { pt: 'Sobre o Rustploy', en: 'About Rustploy' },
    items: [
      {
        q: { pt: 'O que é o Rustploy?', en: 'What is Rustploy?' },
        a: {
          pt: 'O Rustploy é um PaaS self-hosted de nó único, escrito em Rust, que faz deploy de containers Docker com troca sem downtime, proxy reverso com HTTPS automático, registry embutido, jobs agendados e um servidor MCP. Roda como um binário só, o `rustployd`, numa VPS com Docker. Veja [O que é o Rustploy](/comece/o-que-e/).',
          en: 'Rustploy is a single-node, self-hosted PaaS written in Rust. It deploys Docker containers with zero-downtime swaps, a reverse proxy with automatic HTTPS, an embedded registry, scheduled jobs and an MCP server. It runs as one binary, `rustployd`, on a VPS with Docker. See [What is Rustploy](/comece/o-que-e/).',
        },
      },
      {
        q: { pt: 'Para que o Rustploy não serve?', en: 'What is Rustploy not for?' },
        a: {
          pt: 'O Rustploy não serve para mais de um servidor, para centenas de containers nem para builds sem Dockerfile. Ele gerencia **uma** máquina Linux com Docker, não faz cluster, e construir a partir de código exige um `Dockerfile` (não há buildpacks). Para vários hosts, veja os [comparativos](/comparativos/visao-geral/).',
          en: 'Rustploy is not for more than one server, for hundreds of containers, or for builds without a Dockerfile. It manages **one** Linux machine with Docker, does not cluster, and building from source requires a `Dockerfile` (there are no buildpacks). For multiple hosts, see the [comparisons](/comparativos/visao-geral/).',
        },
      },
      {
        q: { pt: 'Quanta memória o Rustploy usa?', en: 'How much memory does Rustploy use?' },
        a: {
          pt: 'O alvo do projeto é ficar abaixo de 50 MB de RAM em repouso, mas esse número é uma meta e não uma medição publicada. O daemon, o proxy, o banco SQLite e o registry rodam num processo só. O que pesa de verdade são as suas aplicações e os builds, então planeje pelo menos 1 GB de RAM na VPS.',
          en: 'The project targets under 50 MB of RAM at idle, but that number is a goal, not a published measurement. The daemon, proxy, SQLite database and registry run in a single process. What really weighs on the server is your applications and builds, so plan for at least 1 GB of RAM on the VPS.',
        },
      },
      {
        q: { pt: 'O Rustploy é gratuito? Qual a licença?', en: 'Is Rustploy free? What is the license?' },
        a: {
          pt: 'Sim, o Rustploy é gratuito e de código aberto, com licença MIT declarada nos `Cargo.toml` dos três repositórios (`rustploy-daemon`, `rustploy-gui` e `rustploy-shared`). O código está em github.com/antoniofernandodj/rustploy.',
          en: 'Yes, Rustploy is free and open source, under the MIT license declared in the `Cargo.toml` of the three repositories (`rustploy-daemon`, `rustploy-gui` and `rustploy-shared`). The code is at github.com/antoniofernandodj/rustploy.',
        },
      },
      {
        q: { pt: 'Preciso saber Docker para usar?', en: 'Do I need to know Docker?' },
        a: {
          pt: 'Sim, a documentação parte do princípio de que você já conhece imagem, container, rede, volume, Dockerfile e Docker Compose. O Rustploy automatiza o que você faria à mão com o Docker. A tabela [Do Docker para o Rustploy](/comece/docker-para-rustploy/) traduz cada conceito.',
          en: 'Yes, the documentation assumes you already know images, containers, networks, volumes, Dockerfiles and Docker Compose. Rustploy automates what you would do by hand with Docker. The [Docker to Rustploy](/comece/docker-para-rustploy/) table translates each concept.',
        },
      },
      {
        q: { pt: 'Em quais sistemas o Rustploy roda?', en: 'Which systems does Rustploy run on?' },
        a: {
          pt: 'O daemon roda em Linux com systemd e Docker Engine, em x86_64 ou aarch64. O app desktop tem versões para Linux e Windows. Não há suporte a macOS no app desktop, mas a web UI funciona em qualquer navegador.',
          en: 'The daemon runs on Linux with systemd and Docker Engine, on x86_64 or aarch64. The desktop app has Linux and Windows builds. The desktop app does not support macOS, but the web UI works in any browser.',
        },
      },
    ],
  },
  {
    title: { pt: 'Instalação e acesso', en: 'Installation and access' },
    items: [
      {
        q: { pt: 'Como instalo o Rustploy?', en: 'How do I install Rustploy?' },
        a: {
          pt: 'Com um comando, na VPS Debian ou Ubuntu: `curl -fsSL https://raw.githubusercontent.com/antoniofernandodj/rustploy/main/install.sh | sudo sh`. Ele baixa o `.deb` do `rustployd` da última release do GitHub, confere o SHA-256, instala, gera um token e mostra o token de conexão. O pacote cria o usuário `rustploy`, o serviço systemd e o helper de firewall. Veja [Instalação rápida](/instalacao/instalacao-rapida/). Se preferir compilar, ou sem acesso ao GitHub, use o `.deb` gerado com `make deb-rustploy` ([Instalar o daemon na VPS](/instalacao/instalar-daemon/)).',
          en: 'With one command, on a Debian or Ubuntu VPS: `curl -fsSL https://raw.githubusercontent.com/antoniofernandodj/rustploy/main/install.sh | sudo sh`. It downloads the `rustployd` `.deb` from the latest GitHub release, checks the SHA-256, installs it, generates a token and prints the connection token. The package creates the `rustploy` user, the systemd service and the firewall helper. See [Quick install](/en/instalacao/instalacao-rapida/). If you prefer to build it, or have no access to GitHub, use the `.deb` built with `make deb-rustploy` ([Install the daemon on the VPS](/en/instalacao/instalar-daemon/)).',
        },
      },
      {
        q: { pt: 'Preciso instalar o git no servidor?', en: 'Do I need git on the server?' },
        a: {
          pt: 'Sim, se algum serviço usar a fonte Git: o clone usa o comando `git` do servidor, e o pacote `.deb` não o declara como dependência. Instale com `sudo apt-get install git`. Sem ele o deploy falha com "falha ao iniciar git". Veja [Fazer deploy a partir de Git](/guias/git/).',
          en: 'Yes, if any service uses a Git source: cloning uses the server\'s `git` command, and the `.deb` package does not list it as a dependency. Install it with `sudo apt-get install git`. Without it the deploy fails with "falha ao iniciar git" (failed to start git). See [Deploy from a Git repository](/guias/git/).',
        },
      },
      {
        q: { pt: 'Onde pego o token de conexão?', en: 'Where do I get the connection token?' },
        a: {
          pt: 'O token de conexão sai de `sudo rustployd access-key` na VPS, de `[api].connection_token` no `config.toml`, ou de Settings → Web Server no app. Ele é o base64 de `host:porta::token` e só existe se `[api].token` estiver configurado. Veja [Primeiro acesso](/instalacao/primeiro-acesso/).',
          en: 'The connection token comes from `sudo rustployd access-key` on the VPS, from `[api].connection_token` in `config.toml`, or from Settings → Web Server in the app. It is the base64 of `host:port::token` and only exists if `[api].token` is set. See [First access](/instalacao/primeiro-acesso/).',
        },
      },
      {
        q: { pt: 'Como acesso o painel de outra máquina?', en: 'How do I reach the dashboard from another machine?' },
        a: {
          pt: 'Defina `[api].bind_address = "0.0.0.0"` e um `[api].token` forte no `config.toml`, reinicie o daemon e abra a porta 9797 no firewall. O daemon se recusa a subir com bind público e sem token. Para HTTPS, configure `[api].domain`. Veja [Instalar o daemon na VPS](/instalacao/instalar-daemon/).',
          en: 'Set `[api].bind_address = "0.0.0.0"` and a strong `[api].token` in `config.toml`, restart the daemon and open port 9797 in the firewall. The daemon refuses to start with a public bind and no token. For HTTPS, set `[api].domain`. See [Install the daemon on the VPS](/instalacao/instalar-daemon/).',
        },
      },
      {
        q: { pt: 'Editei o config.toml e nada mudou. Por quê?', en: 'I edited config.toml and nothing changed. Why?' },
        a: {
          pt: 'Provavelmente o arquivo tem um erro e o daemon o ignorou **em silêncio**, usando os padrões. Um TOML inválido, uma seção obrigatória faltando ou um valor com o tipo errado (`port = "9797"` com aspas) descartam o arquivo inteiro, sem aviso no log. Confira com `sudo rustployd access-key`: se disser que não há token, o arquivo não foi lido. Veja [O arquivo config.toml](/instalacao/config-toml/).',
          en: 'The file probably has an error and the daemon ignored it **silently**, falling back to the defaults. Invalid TOML, a missing required section or a wrongly typed value (`port = "9797"` with quotes) discards the whole file, with no log warning. Check with `sudo rustployd access-key`: if it says there is no token, the file was not read. See [The config.toml file](/instalacao/config-toml/).',
        },
      },
      {
        q: { pt: 'Como atualizo o Rustploy?', en: 'How do I update Rustploy?' },
        a: {
          pt: 'Instale o `.deb` novo por cima do antigo com `sudo dpkg -i`. Seus dados em `/var/lib/rustploy`, o `config.toml` e a `master.key` são preservados, e os containers dos serviços continuam rodando. Veja [Atualizar o Rustploy](/instalacao/atualizar/).',
          en: 'Install the new `.deb` over the old one with `sudo dpkg -i`. Your data in `/var/lib/rustploy`, `config.toml` and `master.key` are preserved, and the service containers keep running. See [Update Rustploy](/instalacao/atualizar/).',
        },
      },
    ],
  },
  {
    title: { pt: 'Deploy', en: 'Deploys' },
    items: [
      {
        q: { pt: 'Criei o serviço, mas nada está no ar. Por quê?', en: 'I created the service but nothing is running. Why?' },
        a: {
          pt: 'Criar um serviço não faz deploy: ele nasce parado e vazio. Abra o serviço, configure a origem (Git, imagem ou zip), a porta e o healthcheck, e clique em **Deploy**. Veja o [tutorial do primeiro deploy](/tutorial/primeiro-deploy/).',
          en: 'Creating a service does not deploy it: it starts stopped and empty. Open the service, set the source (Git, image or zip), the port and the healthcheck, and click **Deploy**. See the [first deploy tutorial](/tutorial/primeiro-deploy/).',
        },
      },
      {
        q: { pt: 'Por que meu deploy falhou?', en: 'Why did my deploy fail?' },
        a: {
          pt: 'A causa fica no **build log** do deploy, na linha `==> Erro em [Estado]: …`. No app desktop, abra o serviço, aba Deployments, e clique em **≡** na linha do deploy. As causas mais comuns são Dockerfile não encontrado, `git` ausente no servidor e healthcheck que não passa. Veja [O ciclo de vida de um deploy](/conceitos/ciclo-de-vida/).',
          en: 'The cause is in the deploy\'s **build log**, on the `==> Erro em [State]: …` line. In the desktop app, open the service, the Deployments tab, and click **≡** on the deploy\'s row. The most common causes are a missing Dockerfile, no `git` on the server and a healthcheck that does not pass. See [The lifecycle of a deploy](/conceitos/ciclo-de-vida/).',
        },
      },
      {
        q: { pt: 'Meu deploy fica parado em Pending. O que é isso?', en: 'My deploy is stuck in Pending. What is that?' },
        a: {
          pt: 'O Rustploy executa **um deploy por vez** no servidor inteiro, e os outros esperam na fila. Veja a fila na tela Deploy Engine. Se a fila estiver **pausada**, os deploys esperam até você retomar. Um deploy enfileirado pode ser promovido ao topo ou cancelado. Veja [A fila de deploys](/guias/fila-de-deploys/).',
          en: 'Rustploy runs **one deploy at a time** on the whole server, and the others wait in a queue. See the queue on the Deploy Engine screen. If the queue is **paused**, deploys wait until you resume it. A queued deploy can be promoted to the top or cancelled. See [The deploy queue](/guias/fila-de-deploys/).',
        },
      },
      {
        q: { pt: 'Como volto para a versão anterior?', en: 'How do I roll back to the previous version?' },
        a: {
          pt: 'Redeploye a versão anterior: ponha de volta a imagem, a branch ou o commit que funcionava e clique em **Deploy**. O botão Rollback não redeploya: ele só localiza o deploy anterior. Se um deploy falhar no healthcheck, o Rustploy volta sozinho para o container antigo. Veja o [tutorial](/tutorial/primeiro-deploy/).',
          en: 'Redeploy the previous version: put back the image, branch or commit that worked and click **Deploy**. The Rollback button does not redeploy: it only finds the previous deploy. If a deploy fails its healthcheck, Rustploy automatically keeps the old container. See the [tutorial](/tutorial/primeiro-deploy/).',
        },
      },
      {
        q: { pt: 'O deploy é realmente sem downtime?', en: 'Is the deploy really zero-downtime?' },
        a: {
          pt: 'Sim, desde que o healthcheck esteja configurado. O container novo sobe ao lado do antigo, passa no healthcheck, e só então o proxy troca a rota de uma vez. Um serviço novo nasce com healthcheck **None**, e nesse caso o Rustploy só confere que o container subiu, não que o app responde. Configure um healthcheck HTTP. Veja [Healthcheck](/guias/healthcheck/).',
          en: 'Yes, as long as the healthcheck is configured. The new container starts next to the old one, passes the healthcheck, and only then does the proxy switch the route in one step. A new service starts with the healthcheck set to **None**, in which case Rustploy only checks that the container is up, not that the app responds. Configure an HTTP healthcheck. See [Healthcheck](/guias/healthcheck/).',
        },
      },
      {
        q: { pt: 'Posso fazer deploy a cada push no Git?', en: 'Can I deploy on every Git push?' },
        a: {
          pt: 'Sim, com o **webhook de deploy**: cada serviço Application tem uma URL secreta, e um `POST` nela dispara o deploy. Funciona com GitHub, GitLab, Gitea, Docker Hub e GitHub Actions, e pushes em outras branches são ignorados. A URL só aparece depois do primeiro deploy. Veja [Webhooks de deploy](/guias/webhooks/).',
          en: 'Yes, with the **deploy webhook**: every Application service has a secret URL, and a `POST` to it triggers the deploy. It works with GitHub, GitLab, Gitea, Docker Hub and GitHub Actions, and pushes to other branches are ignored. The URL only appears after the first deploy. See [Deploy webhooks](/guias/webhooks/).',
        },
      },
      {
        q: { pt: 'Meu `ARG` do Dockerfile chega vazio. Por quê?', en: 'My Dockerfile `ARG` arrives empty. Why?' },
        a: {
          pt: 'O `docker build` do Rustploy roda **sem** as variáveis do projeto ou do serviço: não existem *build args*. As variáveis só chegam ao container em execução. Leia o valor em tempo de execução ou, se o build precisar dele, use uma stack Compose com `build.args`. Veja [Como as variáveis são resolvidas](/conceitos/variaveis-de-ambiente/).',
          en: 'Rustploy\'s `docker build` runs **without** the project or service variables: there are no *build args*. Variables only reach the running container. Read the value at runtime or, if the build needs it, use a Compose stack with `build.args`. See [How environment variables are resolved](/conceitos/variaveis-de-ambiente/).',
        },
      },
      {
        q: { pt: 'Mudei uma variável de ambiente e nada mudou. Por quê?', en: 'I changed an environment variable and nothing changed. Why?' },
        a: {
          pt: 'As variáveis são entregues ao container quando ele é **criado**, então a mudança só vale no próximo **Deploy**. O Reload apenas reinicia o container existente e não aplica variáveis novas. O mesmo vale para trocar o valor de um secret. Veja [Variáveis de ambiente e secrets](/guias/variaveis-e-secrets/).',
          en: 'Variables are handed to the container when it is **created**, so the change only applies on the next **Deploy**. Reload just restarts the existing container and does not apply new variables. The same goes for changing a secret\'s value. See [Environment variables and secrets](/guias/variaveis-e-secrets/).',
        },
      },
      {
        q: { pt: 'Meu monorepo não acha o Dockerfile. O que ajusto?', en: 'My monorepo cannot find the Dockerfile. What do I adjust?' },
        a: {
          pt: 'Aponte o **CONTEXT PATH** para a pasta do app (por exemplo `apps/web`) e o **DOCKERFILE** para o arquivo dentro dela. O caminho do Dockerfile é relativo ao contexto, e o Rustploy confere que ele existe antes de chamar o Docker. Os campos **WATCH PATHS**, **BUILD PATH** e **BUILD STAGE** aparecem na tela, mas o deploy ainda não os usa. Veja [Fazer deploy a partir de Git](/guias/git/).',
          en: 'Point **CONTEXT PATH** at the app folder (for example `apps/web`) and **DOCKERFILE** at the file inside it. The Dockerfile path is relative to the context, and Rustploy checks that it exists before calling Docker. The **WATCH PATHS**, **BUILD PATH** and **BUILD STAGE** fields appear on screen, but the deploy does not use them yet. See [Deploy from a Git repository](/guias/git/).',
        },
      },
      {
        q: { pt: 'Dá para fazer deploy sem Dockerfile?', en: 'Can I deploy without a Dockerfile?' },
        a: {
          pt: 'Não para construir a partir de código: o Rustploy não tem buildpacks e exige um `Dockerfile`. Sem Dockerfile você pode usar uma imagem pronta de um registry, uma stack Compose ou um template do catálogo. Veja [Serviço e fontes](/conceitos/servico-e-fontes/).',
          en: 'Not to build from source: Rustploy has no buildpacks and requires a `Dockerfile`. Without a Dockerfile you can use a ready-made image from a registry, a Compose stack or a template from the catalog. See [Service and sources](/conceitos/servico-e-fontes/).',
        },
      },
    ],
  },
  {
    title: { pt: 'Domínios, rede e HTTPS', en: 'Domains, networking and HTTPS' },
    items: [
      {
        q: { pt: 'Meu domínio responde 502. Como diagnostico?', en: 'My domain returns 502. How do I diagnose it?' },
        a: {
          pt: 'Um 502 significa que o proxy achou a rota, mas o container não respondeu. Veja a tela Ingress: se o domínio não aparece, nenhum deploy registrou a rota; se a porta de destino está errada, corrija a porta do domínio na aba Domains. Confira também se o app escuta em `0.0.0.0` e se o healthcheck passa. Veja [Diagnosticar um erro 502](/guias/diagnosticar-502/).',
          en: 'A 502 means the proxy found the route but the container did not respond. Check the Ingress screen: if the domain is missing, no deploy registered the route; if the target port is wrong, fix the domain\'s port on the Domains tab. Also check that the app listens on `0.0.0.0` and that the healthcheck passes. See [Diagnose a 502 error](/guias/diagnosticar-502/).',
        },
      },
      {
        q: { pt: 'O certificado HTTPS não sai. O que verifico?', en: 'The HTTPS certificate is not issued. What do I check?' },
        a: {
          pt: 'Verifique, nesta ordem: o DNS do domínio aponta para o servidor, `ingress.acme.enabled` é `true` com um `email`, as portas 80 e 443 estão abertas para a internet, e o serviço chegou a `Live` (o certificado é pedido depois do deploy). O Let\'s Encrypt precisa alcançar a porta 80 pelo nome do domínio. Veja [Domínios e HTTPS automático](/guias/dominios-e-tls/).',
          en: 'Check, in this order: the domain\'s DNS points at the server, `ingress.acme.enabled` is `true` with an `email`, ports 80 and 443 are open to the internet, and the service reached `Live` (the certificate is requested after the deploy). Let\'s Encrypt must reach port 80 through the domain name. See [Domains and automatic HTTPS](/guias/dominios-e-tls/).',
        },
      },
      {
        q: { pt: 'Como minha aplicação encontra o banco de dados?', en: 'How does my application find the database?' },
        a: {
          pt: 'Dentro do projeto, os serviços se alcançam pelo nome na rede do projeto: um serviço Application responde como `rp_<nome>`, e um serviço Compose pelo nome do serviço **dentro do YAML**. A aba Connection do banco mostra a URL interna pronta para copiar. Veja [Rede e nomes](/conceitos/rede-e-nomes/).',
          en: 'Inside a project, services reach each other by name on the project network: an Application service answers as `rp_<name>`, and a Compose service by its service name **inside the YAML**. The database\'s Connection tab shows the internal URL ready to copy. See [Networking and names](/conceitos/rede-e-nomes/).',
        },
      },
      {
        q: { pt: 'Como acesso um banco de fora do servidor?', en: 'How do I reach a database from outside the server?' },
        a: {
          pt: 'Abra uma porta TCP do host: na aba Domains do serviço use **PORTA TCP DO HOST** (Salvar porta ou Automática), ou marque a opção de URL externa no assistente da GUI. O Rustploy aloca uma porta da faixa 20000–20999 e a libera no firewall. Isso expõe o banco à internet, protegido só pela senha: use uma senha forte. Veja [Bancos e brokers](/guias/bancos-e-brokers/).',
          en: 'Open a host TCP port: on the service\'s Domains tab use **PORTA TCP DO HOST** (Salvar porta or Automática), or tick the external URL option in the desktop wizard. Rustploy allocates a port from the 20000–20999 range and opens it in the firewall. This exposes the database to the internet, protected only by its password: use a strong one. See [Databases and brokers](/guias/bancos-e-brokers/).',
        },
      },
      {
        q: { pt: 'Um serviço pode ter vários domínios?', en: 'Can a service have several domains?' },
        a: {
          pt: 'Sim, cada serviço pode ter vários domínios, cada um com a própria porta de container e com ou sem TLS. Eles ficam na aba Domains. Em uma stack Compose, só um container atende o domínio: defina o alvo de ingress se o escolhido por padrão estiver errado. Veja [Domínios e HTTPS automático](/guias/dominios-e-tls/).',
          en: 'Yes, each service can have several domains, each with its own container port and with or without TLS. They live on the Domains tab. In a Compose stack only one container serves the domain: set the ingress target if the default pick is wrong. See [Domains and automatic HTTPS](/guias/dominios-e-tls/).',
        },
      },
    ],
  },
  {
    title: { pt: 'Dados, backup e segurança', en: 'Data, backups and security' },
    items: [
      {
        q: { pt: 'O Rustploy faz backup dos meus bancos de dados?', en: 'Does Rustploy back up my databases?' },
        a: {
          pt: 'Não, o Rustploy não faz backup dos dados dos seus bancos nem dos volumes. Use um job agendado que roda `pg_dump`, `mysqldump` ou `mongodump` para um caminho do host e copie esse caminho para fora do servidor. Faça também backup do estado do próprio Rustploy e da `master.key`. Veja [Backup e restauração](/guias/backup/).',
          en: 'No, Rustploy does not back up the data in your databases or volumes. Use a scheduled job that runs `pg_dump`, `mysqldump` or `mongodump` to a host path and copy that path off the server. Also back up Rustploy\'s own state and the `master.key`. See [Backup and restore](/guias/backup/).',
        },
      },
      {
        q: { pt: 'Meus serviços voltam sozinhos depois de reiniciar o servidor?', en: 'Do my services come back by themselves after the server reboots?' },
        a: {
          pt: 'Provavelmente não. Pelo código, os containers são criados com a política de reinício `no`, e ao subir o daemon marca como parados os serviços sem container rodando. O plano de iniciar tudo no boot ainda não foi implementado. Depois de um reboot, faça Deploy dos serviços. Confira no seu servidor antes de depender disso. Veja [Monitoramento, saúde e reinício automático](/operacao/monitoramento-e-saude/).',
          en: 'Probably not. According to the code, containers are created with restart policy `no`, and on startup the daemon marks services without a running container as stopped. The plan to start everything at boot is not implemented yet. After a reboot, deploy your services. Verify on your server before relying on it. See [Monitoring, health and automatic restart](/operacao/monitoramento-e-saude/).',
        },
      },
      {
        q: { pt: 'Existe somente leitura ou controle de acesso por usuário?', en: 'Is there read-only access or per-user access control?' },
        a: {
          pt: 'Não, a API usa um único token de administrador, sem escopo e sem usuários. Quem tem o token faz qualquer coisa, inclusive ler secrets decifrados, e comandos destrutivos não pedem confirmação. Proteja o token como a senha de root, use HTTPS e, se possível, VPN. Veja [Segurança do servidor](/operacao/seguranca-do-servidor/).',
          en: 'No, the API uses a single administrator token, with no scopes and no users. Whoever has the token can do anything, including reading decrypted secrets, and destructive commands do not ask for confirmation. Protect the token like the root password, use HTTPS and, if possible, a VPN. See [Server security](/operacao/seguranca-do-servidor/).',
        },
      },
      {
        q: { pt: 'O token vazou. O que faço?', en: 'The token leaked. What do I do?' },
        a: {
          pt: 'Troque `[api].token` no `config.toml`, reinicie o daemon e entre de novo nos clientes. O `connection_token` se regrava sozinho. Se o token estava em agentes de IA, remova e registre o MCP de novo. Veja [Segurança do servidor](/operacao/seguranca-do-servidor/).',
          en: 'Change `[api].token` in `config.toml`, restart the daemon and sign in again on the clients. The `connection_token` rewrites itself. If the token was in AI agents, remove and register the MCP again. See [Server security](/operacao/seguranca-do-servidor/).',
        },
      },
      {
        q: { pt: 'Perdi a master.key. Consigo recuperar os secrets?', en: 'I lost master.key. Can I recover the secrets?' },
        a: {
          pt: 'Não: sem a chave mestra em `/etc/rustploy/master.key`, os secrets gravados não podem ser decifrados, e um backup do banco sozinho não resolve. Guarde uma cópia da chave fora do servidor. Você precisará recriar os secrets. Veja [Variáveis de ambiente e secrets](/guias/variaveis-e-secrets/).',
          en: 'No: without the master key at `/etc/rustploy/master.key`, stored secrets cannot be decrypted, and a database backup alone does not help. Keep a copy of the key off the server. You will have to recreate the secrets. See [Environment variables and secrets](/guias/variaveis-e-secrets/).',
        },
      },
      {
        q: { pt: 'Onde ficam os logs da minha aplicação?', en: 'Where are my application\'s logs?' },
        a: {
          pt: 'O log de runtime é lido do Docker **ao vivo** e não é guardado: quando um deploy troca o container, o log do antigo some. Abra-o na aba Logs do serviço. O **build log** de cada deploy fica guardado. Para histórico da aplicação, envie os logs para fora do servidor. Veja [Janelas de logs](/interface/logs/).',
          en: 'The runtime log is read from Docker **live** and is not stored: when a deploy swaps the container, the old one\'s log is gone. Open it on the service\'s Logs tab. Each deploy\'s **build log** is stored. For application log history, ship logs off the server. See [Log windows](/interface/logs/).',
        },
      },
    ],
  },
  {
    title: { pt: 'Agentes de IA e MCP', en: 'AI agents and MCP' },
    items: [
      {
        q: { pt: 'Como conecto o Claude Code ao Rustploy?', en: 'How do I connect Claude Code to Rustploy?' },
        a: {
          pt: 'Em Settings → Web Server, use a seção **Conectar um agente de IA (MCP)** (há um botão Copiar para Claude Code, Codex e Gemini CLI). No Claude Code, copie o comando `claude mcp add --transport http rustploy https://HOST:PORTA/mcp --header "Authorization: Bearer <token>"` e rode-o no terminal. Depois abra uma sessão **nova** do Claude Code. Veja [Conectar o Claude Code ao Rustploy](/agentes/conectar-claude-code/).',
          en: 'In Settings → Web Server, use the **Conectar um agente de IA (MCP)** section (it has a Copy button for Claude Code, Codex and Gemini CLI). For Claude Code, copy the command `claude mcp add --transport http rustploy https://HOST:PORT/mcp --header "Authorization: Bearer <token>"` and run it in your terminal. Then open a **new** Claude Code session. Codex and Gemini CLI have their own Copy buttons there (a `config.toml` block and a `gemini mcp add` command). See [Connect Claude Code to Rustploy](/agentes/conectar-claude-code/).',
        },
      },
      {
        q: { pt: 'O que um agente de IA consegue fazer no meu servidor?', en: 'What can an AI agent do on my server?' },
        a: {
          pt: 'Um agente consegue listar serviços, disparar deploy e esperar o resultado, ler o build log, diagnosticar um 502 e executar qualquer comando do protocolo pela ferramenta `rpc`. São nove ferramentas MCP. O acesso é o mesmo de um administrador. Veja [Operar o Rustploy com agentes de IA](/agentes/visao-geral/) e a [referência das ferramentas](/agentes/ferramentas/).',
          en: 'An agent can list services, trigger a deploy and wait for the result, read the build log, diagnose a 502 and run any protocol command through the `rpc` tool. There are nine MCP tools. The access is the same as an administrator\'s. See [Operate Rustploy with AI agents](/agentes/visao-geral/) and the [tools reference](/agentes/ferramentas/).',
        },
      },
      {
        q: { pt: 'É seguro dar o token a um agente de IA?', en: 'Is it safe to give the token to an AI agent?' },
        a: {
          pt: 'Só com cautela: o token é de administrador, o servidor não pede confirmação em comandos destrutivos (`ServiceDelete`, `Prune*`, `Remove*`) e não existe modo somente leitura. Instrua o agente a descrever e aguardar sua confirmação antes de agir, nomeie cada servidor e use o MCP só em redes de confiança. Veja [Segurança ao usar agentes](/agentes/seguranca/).',
          en: 'Only with caution: the token is an administrator\'s, the server does not ask for confirmation on destructive commands (`ServiceDelete`, `Prune*`, `Remove*`) and there is no read-only mode. Tell the agent to describe and wait for your confirmation before acting, name each server and use MCP only on trusted networks. See [Security when using agents](/agentes/seguranca/).',
        },
      },
    ],
  },
  {
    title: { pt: 'Migração e operação', en: 'Migration and operations' },
    items: [
      {
        q: { pt: 'Consigo migrar do Dokploy?', en: 'Can I migrate from Dokploy?' },
        a: {
          pt: 'Em parte: o importer `rustploy-import` copia projetos, aplicações Git, stacks Compose, variáveis e o primeiro domínio de cada serviço. Ele não converte aplicações de imagem Docker, bancos de dados, secrets nem volumes, e a gravação direta pode apagar serviços de mesmo nome. Rode antes com `--dry-run`. Veja [Migrar do Dokploy](/migracao/dokploy/).',
          en: 'Partly: the `rustploy-import` importer copies projects, Git applications, Compose stacks, variables and each service\'s first domain. It does not convert Docker image applications, databases, secrets or volumes, and the direct write can delete services with the same name. Run with `--dry-run` first. See [Migrate from Dokploy](/migracao/dokploy/).',
        },
      },
      {
        q: { pt: 'Como copio um serviço para outro servidor?', en: 'How do I copy a service to another server?' },
        a: {
          pt: 'Use **Exportar serviço** na tela do serviço para gerar um arquivo e **Importar** no assistente Novo serviço do outro servidor. O serviço é criado sem deploy e nada é sobrescrito. Só a configuração viaja: dados, volumes e secrets não. Para levar o servidor inteiro, use o [manifesto de Infra as Code](/guias/infra-as-code/).',
          en: 'Use **Exportar serviço** on the service screen to generate a file and **Importar** in the New service wizard on the other server. The service is created without a deploy and nothing is overwritten. Only the configuration travels: data, volumes and secrets do not. To move the whole server, use the [Infrastructure as Code manifest](/guias/infra-as-code/).',
        },
      },
      {
        q: { pt: 'Qual a diferença entre Deploy, Reload e Rebuild?', en: 'What is the difference between Deploy, Reload and Rebuild?' },
        a: {
          pt: '**Deploy** faz o ciclo completo (build ou pull, container novo, healthcheck, troca de rota). **Reload** só reinicia o container que está no ar, sem aplicar variáveis nem imagem novas. No app desktop, **Rebuild** chama a mesma função que Deploy. Veja [A tela do serviço](/interface/servico/).',
          en: '**Deploy** runs the full cycle (build or pull, new container, healthcheck, route swap). **Reload** only restarts the container that is running, without applying new variables or a new image. In the desktop app, **Rebuild** calls the same function as Deploy. See [The service screen](/interface/servico/).',
        },
      },
      {
        q: { pt: 'Devo usar o app desktop ou a web UI?', en: 'Should I use the desktop app or the web UI?' },
        a: {
          pt: 'Tanto faz para o dia a dia: os dois falam com a mesma API. A web UI não exige instalação e funciona no celular como PWA. O app desktop guarda vários servidores, tem bandeja do sistema e avisa quando um deploy termina, mesmo com a janela fechada. Alguns recursos só existem pela API ou pelo MCP. Veja [Instalar os clientes](/instalacao/instalar-clientes/).',
          en: 'Either works for daily use: both talk to the same API. The web UI needs no installation and works on a phone as a PWA. The desktop app keeps several servers, has a system tray icon and notifies you when a deploy finishes, even with the window closed. Some features only exist through the API or MCP. See [Install the clients](/instalacao/instalar-clientes/).',
        },
      },
      {
        q: { pt: 'Qual a diferença entre o Rustploy e o Dokploy, o Coolify ou o CapRover?', en: 'How is Rustploy different from Dokploy, Coolify or CapRover?' },
        a: {
          pt: 'O Rustploy gerencia uma única máquina com um binário só e proxy próprio, e tem MCP nativo. Os outros três gerenciam mais de um servidor (ou usam Swarm), têm comunidades maiores e mais recursos, como backups e notificações. Veja a [visão geral dos comparativos](/comparativos/visao-geral/).',
          en: 'Rustploy manages a single machine with one binary and its own proxy, and has native MCP. The other three manage more than one server (or use Swarm), have larger communities and more features, such as backups and notifications. See the [comparison overview](/comparativos/visao-geral/).',
        },
      },
    ],
  },
];
