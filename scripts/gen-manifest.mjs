// Gera referencia/manifesto.md: as tabelas de campos vêm dos structs de
// rustploy-daemon/.../features/iac/manifest.rs e rustploy-shared/src/domain/*.rs (tipo, opcional, padrão, doc);
// o texto de cada campo vem de NOTES abaixo. Sem o agregador ao lado, mantém a
// página já commitada. Campo novo no código aparece na tabela sem nota; nota de
// campo que sumiu do código quebra o build (para não envelhecer em silêncio).
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const manifestFile = new URL('rustploy-daemon/crates/daemon/src/features/iac/manifest.rs', root);
const modelsDir = new URL('rustploy-shared/src/domain/', root);
const outFile = new URL('../src/content/docs/referencia/manifesto.mdx', import.meta.url);

if (!existsSync(manifestFile) || !existsSync(modelsDir)) {
  console.log('gen-manifest: fontes não encontradas, mantendo a página atual');
  process.exit(0);
}

const manifestLines = readFileSync(manifestFile, 'utf8').split('\n');
const modelsLines = readdirSync(modelsDir)
  .filter((f) => f.endsWith('.rs'))
  .sort()
  .flatMap((f) => readFileSync(new URL(f, modelsDir), 'utf8').split('\n'));

/** Lê `pub struct Nome { … }` e devolve os campos com doc e atributos serde. */
function parseStruct(lines, name) {
  const start = lines.findIndex((line) => line.startsWith(`pub struct ${name} {`));
  if (start < 0) throw new Error(`struct ${name} não encontrado`);
  const fields = [];
  let doc = [];
  let attr = '';
  let inAttr = false;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line === '}') break;
    const t = line.trim();
    if (inAttr) {
      attr += ' ' + t;
      if (t.endsWith(')]')) inAttr = false;
      continue;
    }
    if (t.startsWith('///')) { doc.push(t.replace(/^\/\/\/ ?/, '')); continue; }
    if (t.startsWith('#[serde(')) { attr += ' ' + t; inAttr = !t.endsWith(')]'); continue; }
    if (t.startsWith('#[') || t.startsWith('//')) continue;
    const m = t.match(/^pub (\w+): (.+?),?$/);
    if (m) {
      const rename = attr.match(/rename = "([^"]+)"/)?.[1];
      const defaultFn = attr.match(/default = "([^"]+)"/)?.[1];
      fields.push({
        name: rename ?? m[1],
        rust: m[2],
        doc: doc.join(' ').replace(/\s+/g, ' ').trim(),
        hasDefault: /\bdefault\b/.test(attr),
        defaultFn,
      });
    }
    doc = []; attr = '';
  }
  return fields;
}

const friendly = (rust) => {
  let t = rust.replace(/^Option<(.+)>$/, '$1');
  const map = {
    String: 'texto', bool: 'verdadeiro/falso', u16: 'inteiro', u32: 'inteiro', u64: 'inteiro',
    'Vec<String>': 'lista de textos', 'BTreeMap<String, String>': 'mapa texto → texto',
    'Vec<DomainRoute>': 'lista de rotas de domínio', 'Vec<EnvComment>': 'lista de comentários',
    'Vec<ServiceManifest>': 'lista de serviços', 'Vec<ProjectEntry>': 'lista de projetos',
    SourceManifest: 'objeto `source`', GitManifest: 'objeto `git`', HealthcheckManifest: 'objeto `healthcheck`',
    ResourcesManifest: 'objeto `resources`', ProjectMeta: 'objeto `project`',
    'BTreeMap<String, ProjectEnvDoc>': 'tabelas por projeto', 'BTreeMap<String, GitProviderDoc>': 'tabelas por provedor',
    'BTreeMap<String, ServiceEnvDoc>': 'tabelas por serviço',
  };
  return map[t] ?? t;
};

// Texto de cada campo (a doc do Rust é curta ou está em outro idioma de comentário).
const NOTES_PT = {
  'ServerManifest.apiVersion': 'Sempre `rustploy/v1`. Opcional; hoje não é validado.',
  'ServerManifest.projects': 'Os projetos. Cada item é um projeto declarado ali mesmo. (`include:` não é aceito pela importação do daemon.)',
  'ProjectManifest.apiVersion': 'Sempre `rustploy/v1`. Opcional.',
  'ProjectManifest.project': 'Nome, descrição e variáveis do projeto.',
  'ProjectManifest.services': 'Os serviços do projeto.',
  'ProjectMeta.name': 'Obrigatório e não pode ser vazio. **É a chave de casamento**: um projeto com este nome é atualizado, senão é criado.',
  'ProjectMeta.description': 'Descrição do projeto.',
  'ProjectMeta.env': 'Variáveis herdadas por todos os serviços. Valor `secret:NOME` referencia um secret do projeto; `${CHAVE}` é resolvido pelo arquivo de variáveis.',
  'ServiceManifest.name': 'Obrigatório. **Chave de casamento** dentro do projeto.',
  'ServiceManifest.source': 'Obrigatório. De onde vem o serviço (veja `source`).',
  'ServiceManifest.port': 'Porta do app **dentro** do container. Omitida, vale `0` (sem erro, mas o serviço não terá porta útil).',
  'ServiceManifest.host_port': 'Porta TCP aberta no servidor. `0` pede alocação automática (reaproveita a porta já alocada ao serviço de mesmo nome).',
  'ServiceManifest.domain': 'Domínio **legado** (um só). Prefira `domains`.',
  'ServiceManifest.tls': 'TLS do `domain` legado.',
  'ServiceManifest.domains': 'Rotas de domínio: cada uma com `domain`, `port` e `tls`.',
  'ServiceManifest.env': 'Variáveis do serviço. Valor `secret:NOME` referencia um secret; `${CHAVE}` vem do arquivo de variáveis.',
  'ServiceManifest.env_comments': 'Comentários do editor `.env`, cada um ancorado a uma chave.',
  'ServiceManifest.volumes': 'Cada item é `host:container` ou `host:container:ro`. **Item inválido é descartado em silêncio.**',
  'ServiceManifest.healthcheck': 'Healthcheck. Omitido, o serviço fica **sem** healthcheck (`none`).',
  'ServiceManifest.replicas': 'Número de containers. Padrão e mínimo `1` (`0` vira `1`).',
  'ServiceManifest.resources': 'Limites de CPU e memória.',
  'ServiceManifest.command': 'Sobrescreve o comando da imagem.',
  'ServiceManifest.args': 'Argumentos do comando.',
  'ServiceManifest.db': 'Tipo de banco: `postgres`, `mongodb`, `mariadb`, `mysql` ou `redis`.',
  'ServiceManifest.shared': 'Marca o serviço como **servidor de banco compartilhado**. Os projetos autorizados ficam no daemon, não no manifesto.',
  'SourceManifest.registry': 'Imagem de registry (`nginx:latest`).',
  'SourceManifest.git': 'Repositório Git com Dockerfile.',
  'SourceManifest.compose': 'O YAML de uma stack Compose, como texto.',
  'SourceManifest.compose_ingress': 'Em stacks Compose, o serviço **dentro do YAML** que recebe o domínio. Sem ele o daemon descobre pela porta do domínio.',
  'GitManifest.url': 'Obrigatório. URL do repositório.',
  'GitManifest.branch': 'Padrão `main`.',
  'GitManifest.root_path': 'Gravado, mas o deploy ainda **não usa**. Padrão `.`.',
  'GitManifest.dockerfile': 'Caminho do Dockerfile, relativo ao contexto. Padrão `Dockerfile`.',
  'GitManifest.context': 'Pasta enviada como contexto de build. Padrão `.`.',
  'GitManifest.build_stage': 'Gravado, mas o deploy ainda **não usa**.',
  'GitManifest.submodules': 'Gravado, mas o deploy ainda **não usa**.',
  'GitManifest.watch_paths': 'Gravado, mas o deploy ainda **não usa**.',
  'GitManifest.username': 'Usuário do clone, se o provedor exigir.',
  'GitManifest.credentials': 'O **nome** de um secret do projeto com o token de clone.',
  'GitManifest.provider': 'O **nome** de uma conta Git conectada. Se não existir no destino (nem no arquivo de variáveis), a importação **aborta**.',
  'HealthcheckManifest.type': '`none`, `tcp`, `http` ou `docker` (maiúsculas valem). **Omitido, vale `tcp`**, e qualquer valor desconhecido também vira `tcp`.',
  'HealthcheckManifest.path': 'Só para `http`. Padrão `/`.',
  'HealthcheckManifest.status': 'Só para `http`. Status esperado, padrão `200`.',
  'HealthcheckManifest.interval': 'Segundos entre tentativas. Padrão `5`.',
  'HealthcheckManifest.timeout': 'Segundos por tentativa. Padrão `3`.',
  'HealthcheckManifest.retries': 'Tentativas. Padrão `10`.',
  'HealthcheckManifest.start_period': 'Segundos antes da primeira tentativa. Padrão `5`.',
  'ResourcesManifest.cpu_shares': 'Peso de CPU. `0` = sem limite.',
  'ResourcesManifest.mem': 'Limite de memória: `1024`, `256k`, `256m` ou `2g`.',
  'DomainRoute.domain': 'Obrigatório. O nome do domínio.',
  'DomainRoute.port': 'Porta do container para este domínio. Omitida, vale a `port` do serviço.',
  'DomainRoute.tls': 'HTTPS automático (ACME).',
  'EnvComment.text': 'A linha completa, incluindo o `#`.',
  'EnvComment.before_key': 'A chave que vem logo depois do comentário. Omitida, é um comentário solto, no fim.',
  'EnvDoc.project': 'Uma tabela `[project."NOME"]` por projeto.',
  'EnvDoc.git_provider': 'Uma tabela `[git_provider."NOME"]` por conta Git referenciada.',
  'ProjectEnvDoc.env': 'Valores das variáveis **do projeto**.',
  'ProjectEnvDoc.service': 'Uma tabela `[project."NOME".service."SERVIÇO"]` por serviço.',
  'ServiceEnvDoc.env': 'Valores das variáveis **do serviço**.',
  'GitProviderDoc.kind': '`gitea` ou `github`.',
  'GitProviderDoc.base_url': 'URL base do provedor (vazia no github.com).',
  'GitProviderDoc.auth_mode': '`oauth` ou `pat`.',
  'GitProviderDoc.oauth_client_id': 'Só para `oauth`. O *client secret* **nunca** é exportado.',
};

const NOTES_EN = {
  'ServerManifest.apiVersion': 'Always `rustploy/v1`. Optional; not validated today.',
  'ServerManifest.projects': 'The projects. Each item is a project declared right there. (`include:` is not accepted by the daemon import.)',
  'ProjectManifest.apiVersion': 'Always `rustploy/v1`. Optional.',
  'ProjectManifest.project': 'Name, description and variables of the project.',
  'ProjectManifest.services': 'The project services.',
  'ProjectMeta.name': 'Required and cannot be empty. **It is the matching key**: a project with this name is updated, otherwise it is created.',
  'ProjectMeta.description': 'Project description.',
  'ProjectMeta.env': 'Variables inherited by every service. A `secret:NAME` value references a project secret; `${KEY}` is resolved from the variables file.',
  'ServiceManifest.name': 'Required. **Matching key** within the project.',
  'ServiceManifest.source': 'Required. Where the service comes from (see `source`).',
  'ServiceManifest.port': 'App port **inside** the container. If omitted, it is `0` (no error, but the service will have no useful port).',
  'ServiceManifest.host_port': 'TCP port opened on the server. `0` asks for automatic allocation (reuses the port already allocated to the service with the same name).',
  'ServiceManifest.domain': '**Legacy** domain (just one). Prefer `domains`.',
  'ServiceManifest.tls': 'TLS for the legacy `domain`.',
  'ServiceManifest.domains': 'Domain routes: each one with `domain`, `port` and `tls`.',
  'ServiceManifest.env': 'Service variables. A `secret:NAME` value references a secret; `${KEY}` comes from the variables file.',
  'ServiceManifest.env_comments': 'Comments from the `.env` editor, each anchored to a key.',
  'ServiceManifest.volumes': 'Each item is `host:container` or `host:container:ro`. **An invalid item is silently dropped.**',
  'ServiceManifest.healthcheck': 'Healthcheck. If omitted, the service has **no** healthcheck (`none`).',
  'ServiceManifest.replicas': 'Number of containers. Default and minimum `1` (`0` becomes `1`).',
  'ServiceManifest.resources': 'CPU and memory limits.',
  'ServiceManifest.command': 'Overrides the image command.',
  'ServiceManifest.args': 'Command arguments.',
  'ServiceManifest.db': 'Database type: `postgres`, `mongodb`, `mariadb`, `mysql` or `redis`.',
  'ServiceManifest.shared': 'Marks the service as a **shared database server**. The authorized projects live in the daemon, not in the manifest.',
  'SourceManifest.registry': 'Registry image (`nginx:latest`).',
  'SourceManifest.git': 'Git repository with a Dockerfile.',
  'SourceManifest.compose': 'The YAML of a Compose stack, as text.',
  'SourceManifest.compose_ingress': 'In Compose stacks, the service **inside the YAML** that receives the domain. Without it the daemon finds it by the domain port.',
  'GitManifest.url': 'Required. Repository URL.',
  'GitManifest.branch': 'Default `main`.',
  'GitManifest.root_path': 'Stored, but the deploy does **not use it** yet. Default `.`.',
  'GitManifest.dockerfile': 'Dockerfile path, relative to the context. Default `Dockerfile`.',
  'GitManifest.context': 'Folder sent as the build context. Default `.`.',
  'GitManifest.build_stage': 'Stored, but the deploy does **not use it** yet.',
  'GitManifest.submodules': 'Stored, but the deploy does **not use it** yet.',
  'GitManifest.watch_paths': 'Stored, but the deploy does **not use it** yet.',
  'GitManifest.username': 'Clone user, if the provider requires one.',
  'GitManifest.credentials': 'The **name** of a project secret holding the clone token.',
  'GitManifest.provider': 'The **name** of a connected Git account. If it does not exist at the destination (or in the variables file), the import **aborts**.',
  'HealthcheckManifest.type': '`none`, `tcp`, `http` or `docker` (uppercase works). **If omitted, it is `tcp`**, and any unknown value also becomes `tcp`.',
  'HealthcheckManifest.path': '`http` only. Default `/`.',
  'HealthcheckManifest.status': '`http` only. Expected status, default `200`.',
  'HealthcheckManifest.interval': 'Seconds between attempts. Default `5`.',
  'HealthcheckManifest.timeout': 'Seconds per attempt. Default `3`.',
  'HealthcheckManifest.retries': 'Attempts. Default `10`.',
  'HealthcheckManifest.start_period': 'Seconds before the first attempt. Default `5`.',
  'ResourcesManifest.cpu_shares': 'CPU weight. `0` = no limit.',
  'ResourcesManifest.mem': 'Memory limit: `1024`, `256k`, `256m` or `2g`.',
  'DomainRoute.domain': 'Required. The domain name.',
  'DomainRoute.port': 'Container port for this domain. If omitted, the service `port` applies.',
  'DomainRoute.tls': 'Automatic HTTPS (ACME).',
  'EnvComment.text': 'The full line, including the `#`.',
  'EnvComment.before_key': 'The key that comes right after the comment. If omitted, it is a loose comment at the end.',
  'EnvDoc.project': 'One `[project."NAME"]` table per project.',
  'EnvDoc.git_provider': 'One `[git_provider."NAME"]` table per referenced Git account.',
  'ProjectEnvDoc.env': 'Values of the **project** variables.',
  'ProjectEnvDoc.service': 'One `[project."NAME".service."SERVICE"]` table per service.',
  'ServiceEnvDoc.env': 'Values of the **service** variables.',
  'GitProviderDoc.kind': '`gitea` or `github`.',
  'GitProviderDoc.base_url': 'Provider base URL (empty on github.com).',
  'GitProviderDoc.auth_mode': '`oauth` or `pat`.',
  'GitProviderDoc.oauth_client_id': '`oauth` only. The *client secret* is **never** exported.',
};

const TITLES_EN = {
  ServerManifest: 'Root manifest', ProjectManifest: 'Single-project manifest', ProjectMeta: '`project`', ServiceManifest: 'Item of `services`',
  SourceManifest: '`source` (use **one** of the keys)', GitManifest: '`source.git`', HealthcheckManifest: '`healthcheck`', ResourcesManifest: '`resources`',
  DomainRoute: 'Item of `domains`', EnvComment: 'Item of `env_comments`', EnvDoc: 'Variables file (TOML)', ProjectEnvDoc: '`[project."NAME"]` in the TOML',
  ServiceEnvDoc: '`[project."NAME".service."SERVICE"]` in the TOML', GitProviderDoc: '`[git_provider."NAME"]` in the TOML',
};

const FRIENDLY_EN = {
  texto: 'text', 'verdadeiro/falso': 'true/false', inteiro: 'integer', 'lista de textos': 'list of texts', 'mapa texto → texto': 'map text → text',
  'lista de rotas de domínio': 'list of domain routes', 'lista de comentários': 'list of comments', 'lista de serviços': 'list of services', 'lista de projetos': 'list of projects',
  'objeto `source`': '`source` object', 'objeto `git`': '`git` object', 'objeto `healthcheck`': '`healthcheck` object', 'objeto `resources`': '`resources` object', 'objeto `project`': '`project` object',
  'tabelas por projeto': 'tables per project', 'tabelas por provedor': 'tables per provider', 'tabelas por serviço': 'tables per service',
};

const structs = [
  ['ServerManifest', manifestLines, 'Manifesto raiz'],
  ['ProjectManifest', manifestLines, 'Manifesto de um projeto'],
  ['ProjectMeta', manifestLines, '`project`'],
  ['ServiceManifest', manifestLines, 'Item de `services`'],
  ['SourceManifest', manifestLines, '`source` (use **uma** das chaves)'],
  ['GitManifest', manifestLines, '`source.git`'],
  ['HealthcheckManifest', manifestLines, '`healthcheck`'],
  ['ResourcesManifest', manifestLines, '`resources`'],
  ['DomainRoute', modelsLines, 'Item de `domains`'],
  ['EnvComment', modelsLines, 'Item de `env_comments`'],
  ['EnvDoc', manifestLines, 'Arquivo de variáveis (TOML)'],
  ['ProjectEnvDoc', manifestLines, '`[project."NOME"]` do TOML'],
  ['ServiceEnvDoc', manifestLines, '`[project."NOME".service."SERVIÇO"]` do TOML'],
  ['GitProviderDoc', manifestLines, '`[git_provider."NOME"]` do TOML'],
];

const seenNotes = new Set();
const defaultOf = (f, en) => {
  if (f.defaultFn === 'one') return '`1`';
  if (f.defaultFn === 'default_hc_type') return '`tcp`';
  if (f.hasDefault) return f.rust.startsWith('Option<') ? (en ? 'absent' : 'ausente') : f.rust === 'bool' ? '`false`' : /^u(16|32|64)$/.test(f.rust) ? '`0`' : f.rust.startsWith('Vec') || f.rust.startsWith('BTreeMap') ? (en ? 'empty' : 'vazio') : '—';
  return '—';
};
const required = (f) => !f.rust.startsWith('Option<') && !f.hasDefault;

function buildTables(locale) {
  const en = locale === 'en';
  const notes = en ? NOTES_EN : NOTES_PT;
  let tables = '';
  for (const [name, lines, titlePt] of structs) {
    const fields = parseStruct(lines, name);
    tables += `### ${en ? TITLES_EN[name] : titlePt}\n\n`;
    tables += en ? '| Field | Type | Required | Default | |\n|---|---|---|---|---|\n' : '| Campo | Tipo | Obrigatório | Padrão | |\n|---|---|---|---|---|\n';
    for (const f of fields) {
      const key = `${name}.${f.name}`;
      seenNotes.add(key);
      const note = (notes[key] ?? f.doc ?? '').replace(/\|/g, '\\|');
      const type = friendly(f.rust);
      tables += `| \`${f.name}\` | ${en ? FRIENDLY_EN[type] ?? type : type} | ${required(f) ? (en ? 'yes' : 'sim') : (en ? 'no' : 'não')} | ${defaultOf(f, en)} | ${note} |\n`;
    }
    tables += '\n';
  }
  return tables;
}
const tablesPt = buildTables('pt');
const tablesEn = buildTables('en');
for (const [label, notes] of [['pt', NOTES_PT], ['en', NOTES_EN]]) {
  const orphan = Object.keys(notes).filter((k) => !seenNotes.has(k));
  if (orphan.length) {
    console.error(`gen-manifest (${label}): notas de campos que não existem mais no código:`, orphan.join(', '));
    process.exit(1);
  }
}

const pagePt = (tables) => `---
title: Referência do manifesto (rustploy.yml)
description: "Referência completa do manifesto YAML de Infra as Code do Rustploy: todos os campos de projeto, serviço, origem, healthcheck e domínios, o arquivo de variáveis TOML, as regras de importação (casamento por nome, prune, deploy) e os erros."
---

import { Aside } from '@astrojs/starlight/components';

O **manifesto** descreve projetos e serviços em YAML. O arquivo de **variáveis** (TOML) leva os
valores das variáveis. Para exportar, importar e as limitações do fluxo, veja
[Infra as Code](/guias/infra-as-code/). Esta página é a **referência de campos**, gerada do
código do daemon e do \`rustploy-shared\`.

## As duas formas

| Forma | Chave no topo | Use quando |
|---|---|---|
| **Raiz** | \`projects:\` (lista) | vários projetos, ou o que a exportação gera |
| **Projeto único** | \`project:\` e \`services:\` | um projeto só |

Sem \`projects:\` nem \`project:\` no topo, a importação recusa o arquivo
(*"manifesto inválido: esperado a chave \`project:\` ou \`projects:\` no topo"*).

## Exemplo completo

Este exemplo foi validado contra o parser do daemon:

\`\`\`yaml
apiVersion: rustploy/v1
projects:
  - project:
      name: loja
      description: Loja virtual
      env:
        LOG_LEVEL: info
        SMTP_PASSWORD: secret:SMTP_PASSWORD
    services:
      - name: web
        source:
          git:
            url: https://github.com/acme/loja-web.git
            branch: main
            dockerfile: Dockerfile
            context: .
            provider: meu-github
        port: 3000
        domains:
          - { domain: loja.exemplo.com, port: 3000, tls: true }
        env:
          API_URL: http://rp_api:8080
          SESSION_KEY: \${SESSION_KEY}
        volumes:
          - /srv/loja/uploads:/app/uploads
          - /srv/loja/config:/app/config:ro
        healthcheck:
          type: http
          path: /health
          status: 200
          interval: 5
          timeout: 3
          retries: 10
          start_period: 5
        replicas: 2
        resources:
          cpu_shares: 512
          mem: 512m
      - name: api
        source:
          registry: ghcr.io/acme/loja-api:1.4.0
        port: 8080
        command: ./server
        args: ["--workers", "4"]
      - name: cache
        source:
          registry: redis:7
        port: 6379
        host_port: 0
      - name: banco
        source:
          compose: |
            services:
              rp_banco:
                image: postgres:18
                environment:
                  POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
        port: 5432
        env:
          POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
        db: postgres
        shared: true
\`\`\`

E o arquivo de variáveis que o acompanha (\`rustploy.vars.toml\`, dentro do zip da exportação):

\`\`\`toml
[project."loja".service."web".env]
SESSION_KEY = "um-valor-longo-e-aleatorio"

[project."loja".service."banco".env]
POSTGRES_PASSWORD = "outra-senha-forte"

[git_provider."meu-github"]
kind = "github"
base_url = ""
auth_mode = "pat"
\`\`\`

## Campos

As tabelas abaixo vêm direto dos tipos do código. **Obrigatório** diz se o campo precisa existir
para o arquivo ser aceito.

${tables}
## Variáveis: \`\${CHAVE}\` e \`secret:NOME\`

Um valor de \`env\` pode ser de três formas:

| Forma | Significa |
|---|---|
| \`texto\` | valor comum, gravado como está |
| \`\${CHAVE}\` | o valor vem do **arquivo de variáveis** |
| \`secret:NOME\` | referência a um **secret do projeto** (o valor não vai no manifesto) |

O \`\${CHAVE}\` é procurado **com escopo**:

- no \`env\` do **projeto**: só na tabela \`[project."NOME".env]\`;
- no \`env\` de um **serviço**: primeiro em \`[project."NOME".service."SERVIÇO".env]\` e, se não achar, em \`[project."NOME".env]\`.

Se sobrar alguma \`\${CHAVE}\` sem valor, a importação **aborta antes de aplicar qualquer coisa** e lista
cada faltante com o escopo (\`loja/web: SESSION_KEY\`). No serviço Compose, o \`\${CHAVE}\` **dentro do YAML do compose não é tocado** pela importação: declare a variável no \`env\` do serviço (como no \`banco\` do exemplo) e o Compose a lê do \`.env\` na hora do deploy. Os \`secret:NOME\` **não são criados** pela
importação: crie os secrets no projeto de destino, senão a variável chega vazia. Veja
[Como as variáveis são resolvidas](/conceitos/variaveis-de-ambiente/).

## O que a importação faz

A importação **reconcilia** o manifesto com o que já existe, casando tudo **por nome**.

| Situação | Resultado |
|---|---|
| projeto com esse nome não existe | é **criado** |
| projeto existe e a descrição mudou | é **atualizado** |
| projeto existe e o manifesto traz \`env\` | as variáveis do projeto são **substituídas** (e os comentários do \`.env\` do projeto, apagados) |
| projeto existe e o manifesto **não** traz \`env\` | as variáveis existentes são **preservadas** |
| serviço com esse nome não existe | é **criado** |
| serviço existe e é idêntico | fica \`unchanged\` |
| serviço existe e é diferente | tem o spec **inteiro substituído** pelo do manifesto |
| serviço existe e o manifesto não traz \`env\` | as variáveis do serviço são **preservadas** |
| \`prune\` ligado | os serviços do projeto que **não estão** no manifesto são **removidos** |
| \`deploy\` ligado | os serviços criados ou alterados entram na fila de deploy |
| \`host_port: 0\` | reaproveita a porta já alocada ao serviço de mesmo nome, ou aloca uma nova e libera no firewall |

<Aside type="danger" title="Atualizar um serviço apaga o que o manifesto não descreve">
  O spec do serviço é **substituído** pelo do manifesto. Tudo o que o manifesto **não** pode
  representar volta ao padrão: em especial a **fila de pré-deploy**, que não existe no manifesto.
  Importar sobre um serviço que tem pré-deploy configurado **zera essa fila**. O mesmo vale
  para as opções que você pôs só pela tela. Exporte antes de importar para ver o que o manifesto cobre.
</Aside>

Os **Git providers** do arquivo de variáveis que ainda não existem no destino são criados
**pendentes**, sem token nem *client secret*: complete a autenticação em **Settings → Git**.
Um provider que já existe com o mesmo nome **não é tocado**.

## Comportamentos que surpreendem

Testados contra o parser real:

| Você escreve | O que acontece |
|---|---|
| um campo com **erro de digitação** (\`replica: 5\`, \`domian: …\`) | é **ignorado em silêncio**: o parser não rejeita campos desconhecidos |
| duas chaves em \`source\` (\`registry\` e \`git\`) | vale a **primeira** na ordem \`registry\`, \`git\`, \`compose\`; sem erro |
| nenhuma chave em \`source\` | o serviço fica com imagem **vazia** e o deploy é recusado |
| \`source\` ausente | erro (campo obrigatório) |
| \`port\` ausente | vale \`0\`, sem erro |
| \`healthcheck: { path: /saude }\` sem \`type\` | vale \`tcp\`; o \`path\` é ignorado |
| um volume sem \`:\` ou com lado vazio | é **descartado**; \`/a:/b:rw\` vale como leitura e escrita |
| \`replicas: 0\` | vira \`1\` |
| serviço com origem **zip** (Archive) na exportação | sai como \`registry: ""\` (imagem vazia): **não cabe** no manifesto |

## Erros

| Código | Quando |
|---|---|
| \`InvalidManifest\` | YAML inválido, sem \`project:\`/\`projects:\` no topo, projeto sem nome, ou campo obrigatório ausente |
| \`InvalidEnvVars\` | o arquivo de variáveis não é um TOML válido |
| \`MissingEnvVars\` | sobrou \`\${CHAVE}\` sem valor (a resposta lista cada uma, com o escopo) |
| \`InvalidGitProvider\` | \`kind\` ou \`auth_mode\` desconhecido em \`[git_provider]\` |
| provider não resolvido | um \`source.git.provider\` nomeia uma conta que não existe no destino nem no arquivo de variáveis |
| \`include: não suportado\` | um item de \`projects:\` usa \`include:\`, que só funcionava no CLI antigo |

<Aside type="tip" title="Mensagem de erro opaca na forma raiz">
  Na forma **raiz**, qualquer erro *dentro* de um projeto aparece como
  *"data did not match any variant of untagged enum ProjectEntry"*, sem dizer qual campo. Para
  ver o erro de verdade, valide o projeto na forma **única** (\`project:\` e \`services:\` no topo):
  a mensagem passa a ser algo como \`\`services[0]: missing field \`source\` at line 4 column 5\`\`.
</Aside>

## Não cabem no manifesto

Jobs (Schedules), a fila de pré-deploy, os valores dos secrets, os databases gerenciados e as
autorizações do banco compartilhado, serviços de origem zip e as contas Git com credenciais.
Para copiar **um serviço** entre servidores, incluindo o que o manifesto não leva, use
**Exportar serviço** e **Importar** na tela do serviço.
`;

const pageEn = (tables) => `---
title: Manifest reference (rustploy.yml)
description: "Complete reference for the Rustploy Infrastructure as Code YAML manifest: every project, service, source, healthcheck and domain field, the TOML variables file, the import rules (matching by name, prune, deploy) and the errors."
---

import { Aside } from '@astrojs/starlight/components';

The **manifest** describes projects and services in YAML. The **variables** file (TOML) holds
the variable values. To export, import and for the limits of the flow, see
[Infra as Code](/en/guias/infra-as-code/). This page is the **field reference**, generated from
the daemon and \`rustploy-shared\` code.

## The two shapes

| Shape | Top-level key | Use when |
|---|---|---|
| **Root** | \`projects:\` (list) | several projects, or what the export produces |
| **Single project** | \`project:\` and \`services:\` | just one project |

With neither \`projects:\` nor \`project:\` at the top, the import rejects the file
(*"manifesto inválido: esperado a chave \`project:\` ou \`projects:\` no topo"*, that is, "invalid manifest: expected a \`project:\` or \`projects:\` key at the top").

## Complete example

This example was validated against the daemon parser:

\`\`\`yaml
apiVersion: rustploy/v1
projects:
  - project:
      name: loja
      description: Online store
      env:
        LOG_LEVEL: info
        SMTP_PASSWORD: secret:SMTP_PASSWORD
    services:
      - name: web
        source:
          git:
            url: https://github.com/acme/loja-web.git
            branch: main
            dockerfile: Dockerfile
            context: .
            provider: my-github
        port: 3000
        domains:
          - { domain: shop.example.com, port: 3000, tls: true }
        env:
          API_URL: http://rp_api:8080
          SESSION_KEY: \${SESSION_KEY}
        volumes:
          - /srv/loja/uploads:/app/uploads
          - /srv/loja/config:/app/config:ro
        healthcheck:
          type: http
          path: /health
          status: 200
          interval: 5
          timeout: 3
          retries: 10
          start_period: 5
        replicas: 2
        resources:
          cpu_shares: 512
          mem: 512m
      - name: api
        source:
          registry: ghcr.io/acme/loja-api:1.4.0
        port: 8080
        command: ./server
        args: ["--workers", "4"]
      - name: cache
        source:
          registry: redis:7
        port: 6379
        host_port: 0
      - name: banco
        source:
          compose: |
            services:
              rp_banco:
                image: postgres:18
                environment:
                  POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
        port: 5432
        env:
          POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
        db: postgres
        shared: true
\`\`\`

And the variables file that goes with it (\`rustploy.vars.toml\`, inside the export zip):

\`\`\`toml
[project."loja".service."web".env]
SESSION_KEY = "a-long-random-value"

[project."loja".service."banco".env]
POSTGRES_PASSWORD = "another-strong-password"

[git_provider."my-github"]
kind = "github"
base_url = ""
auth_mode = "pat"
\`\`\`

## Fields

The tables below come straight from the code types. **Required** says whether the field must be
present for the file to be accepted.

${tables}
## Variables: \`\${KEY}\` and \`secret:NAME\`

An \`env\` value can take three forms:

| Form | Meaning |
|---|---|
| \`text\` | plain value, stored as is |
| \`\${KEY}\` | the value comes from the **variables file** |
| \`secret:NAME\` | reference to a **project secret** (the value does not go in the manifest) |

\`\${KEY}\` is looked up **with scope**:

- in the **project** \`env\`: only in the \`[project."NAME".env]\` table;
- in a **service** \`env\`: first in \`[project."NAME".service."SERVICE".env]\` and, if not found, in \`[project."NAME".env]\`.

If any \`\${KEY}\` is left without a value, the import **aborts before applying anything** and lists
each missing one with its scope (\`loja/web: SESSION_KEY\`). In a Compose service, a \`\${KEY}\` **inside the compose YAML is not touched** by the import: declare the variable in the service \`env\` (as in \`banco\` in the example) and Compose reads it from the \`.env\` at deploy time. \`secret:NAME\` references are **not created** by the
import: create the secrets in the destination project, otherwise the variable arrives empty. See
[How variables are resolved](/en/conceitos/variaveis-de-ambiente/).

## What the import does

The import **reconciles** the manifest with what already exists, matching everything **by name**.

| Situation | Result |
|---|---|
| no project with that name | it is **created** |
| project exists and the description changed | it is **updated** |
| project exists and the manifest has \`env\` | the project variables are **replaced** (and the project \`.env\` comments erased) |
| project exists and the manifest has **no** \`env\` | the existing variables are **preserved** |
| no service with that name | it is **created** |
| service exists and is identical | stays \`unchanged\` |
| service exists and differs | its **entire** spec is replaced by the manifest one |
| service exists and the manifest has no \`env\` | the service variables are **preserved** |
| \`prune\` on | the project services that are **not in** the manifest are **removed** |
| \`deploy\` on | created or changed services go into the deploy queue |
| \`host_port: 0\` | reuses the port already allocated to the service with the same name, or allocates a new one and opens it in the firewall |

<Aside type="danger" title="Updating a service erases what the manifest does not describe">
  The service spec is **replaced** by the manifest one. Everything the manifest **cannot**
  represent goes back to the default: notably the **pre-deploy queue**, which does not exist in the manifest.
  Importing over a service that has pre-deploy configured **resets that queue**. The same goes
  for options you set only through the screen. Export before importing to see what the manifest covers.
</Aside>

The **Git providers** in the variables file that do not yet exist at the destination are created
**pending**, with no token or *client secret*: finish the authentication in **Settings → Git**.
A provider that already exists with the same name is **left alone**.

## Behaviors that surprise

Tested against the real parser:

| You write | What happens |
|---|---|
| a field with a **typo** (\`replica: 5\`, \`domian: …\`) | it is **silently ignored**: the parser does not reject unknown fields |
| two keys in \`source\` (\`registry\` and \`git\`) | the **first** in the order \`registry\`, \`git\`, \`compose\` wins; no error |
| no key in \`source\` | the service ends up with an **empty** image and the deploy is refused |
| \`source\` missing | error (required field) |
| \`port\` missing | it is \`0\`, no error |
| \`healthcheck: { path: /health }\` without \`type\` | it is \`tcp\`; the \`path\` is ignored |
| a volume without \`:\` or with an empty side | it is **dropped**; \`/a:/b:rw\` counts as read-write |
| \`replicas: 0\` | becomes \`1\` |
| service with a **zip** (Archive) source on export | comes out as \`registry: ""\` (empty image): it **does not fit** the manifest |

## Errors

| Code | When |
|---|---|
| \`InvalidManifest\` | invalid YAML, no \`project:\`/\`projects:\` at the top, a project without a name, or a missing required field |
| \`InvalidEnvVars\` | the variables file is not valid TOML |
| \`MissingEnvVars\` | a \`\${KEY}\` was left without a value (the response lists each one, with its scope) |
| \`InvalidGitProvider\` | unknown \`kind\` or \`auth_mode\` in \`[git_provider]\` |
| unresolved provider | a \`source.git.provider\` names an account that exists neither at the destination nor in the variables file |
| \`include: não suportado\` | an item of \`projects:\` uses \`include:\`, which only worked in the old CLI |

<Aside type="tip" title="Opaque error message in the root shape">
  In the **root** shape, any error *inside* a project shows up as
  *"data did not match any variant of untagged enum ProjectEntry"*, without saying which field. To
  see the real error, validate the project in the **single** shape (\`project:\` and \`services:\` at the top):
  the message becomes something like \`\`services[0]: missing field \`source\` at line 4 column 5\`\`.
</Aside>

## What does not fit in the manifest

Jobs (Schedules), the pre-deploy queue, secret values, managed databases and the
shared-database authorizations, zip-source services and Git accounts with credentials.
To copy **one service** between servers, including what the manifest does not carry, use
**Exportar serviço** (Export service) and **Importar** (Import) on the service screen.
`;

const outFileEn = new URL('../src/content/docs/en/referencia/manifesto.mdx', import.meta.url);
mkdirSync(new URL('./', outFileEn), { recursive: true });
writeFileSync(outFile, pagePt(tablesPt));
writeFileSync(outFileEn, pageEn(tablesEn));
console.log(`gen-manifest: páginas pt e en geradas (${structs.length} structs)`);
