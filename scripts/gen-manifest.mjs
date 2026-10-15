// Gera referencia/manifesto.md: as tabelas de campos vêm dos structs de
// rustploy-shared/src/manifest.rs e models.rs (tipo, opcional, padrão, doc);
// o texto de cada campo vem de NOTES abaixo. Sem o agregador ao lado, mantém a
// página já commitada. Campo novo no código aparece na tabela sem nota; nota de
// campo que sumiu do código quebra o build (para não envelhecer em silêncio).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const manifestFile = new URL('rustploy-shared/src/manifest.rs', root);
const modelsFile = new URL('rustploy-shared/src/models.rs', root);
const outFile = new URL('../src/content/docs/referencia/manifesto.mdx', import.meta.url);

if (!existsSync(manifestFile) || !existsSync(modelsFile)) {
  console.log('gen-manifest: fontes não encontradas, mantendo a página atual');
  process.exit(0);
}

const manifestLines = readFileSync(manifestFile, 'utf8').split('\n');
const modelsLines = readFileSync(modelsFile, 'utf8').split('\n');

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
const NOTES = {
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
const defaultOf = (f) => {
  if (f.defaultFn === 'one') return '`1`';
  if (f.defaultFn === 'default_hc_type') return '`tcp`';
  if (f.hasDefault) return f.rust.startsWith('Option<') ? 'ausente' : f.rust === 'bool' ? '`false`' : /^u(16|32|64)$/.test(f.rust) ? '`0`' : f.rust.startsWith('Vec') || f.rust.startsWith('BTreeMap') ? 'vazio' : '—';
  return '—';
};
const required = (f) => !f.rust.startsWith('Option<') && !f.hasDefault;

let tables = '';
for (const [name, lines, title] of structs) {
  const fields = parseStruct(lines, name);
  tables += `### ${title}\n\n`;
  tables += '| Campo | Tipo | Obrigatório | Padrão | |\n|---|---|---|---|---|\n';
  for (const f of fields) {
    const key = `${name}.${f.name}`;
    seenNotes.add(key);
    const note = (NOTES[key] ?? f.doc ?? '').replace(/\|/g, '\\|');
    tables += `| \`${f.name}\` | ${friendly(f.rust)} | ${required(f) ? 'sim' : 'não'} | ${defaultOf(f)} | ${note} |\n`;
  }
  tables += '\n';
}
const orphan = Object.keys(NOTES).filter((k) => !seenNotes.has(k));
if (orphan.length) {
  console.error('gen-manifest: notas de campos que não existem mais no código:', orphan.join(', '));
  process.exit(1);
}

const page = `---
title: Referência do manifesto (rustploy.yml)
description: "Referência completa do manifesto YAML de Infra as Code do Rustploy: todos os campos de projeto, serviço, origem, healthcheck e domínios, o arquivo de variáveis TOML, as regras de importação (casamento por nome, prune, deploy) e os erros."
---

import { Aside } from '@astrojs/starlight/components';

O **manifesto** descreve projetos e serviços em YAML. O arquivo de **variáveis** (TOML) leva os
valores das variáveis. Para exportar, importar e as limitações do fluxo, veja
[Infra as Code](/guias/infra-as-code/). Esta página é a **referência de campos**, gerada do
código do \`rustploy-shared\`.

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

E o arquivo de variáveis que o acompanha (\`variáveis.toml\`, ou \`rustploy.vars.toml\` no zip do app):

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

writeFileSync(outFile, page);
console.log(`gen-manifest: página gerada (${structs.length} structs)`);
