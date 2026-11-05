// Gera referencia/manifesto.mdx (agora: o formato do `service` do PACOTE DE SERVIÇO; o manifesto raiz/projeto e o
// arquivo de variáveis saíram junto com o import/export do IaC): as tabelas de campos vêm dos structs de
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
  'GitManifest.watch_paths': 'Caminhos (relativos à raiz do repositório; aceita `*` e `**`) que um push precisa tocar para o **webhook** disparar o deploy. Vazio: todo push da branch dispara. Ver [Webhooks](/guias/webhooks/#filtro-por-caminhos-watch_paths).',
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
};

const NOTES_EN = {
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
  'GitManifest.watch_paths': 'Paths (relative to the repository root; `*` and `**` allowed) that a push must touch for the **webhook** to trigger a deploy. Empty: every push to the branch triggers. See [Webhooks](/en/guias/webhooks/#path-filter-watch_paths).',
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
};

const TITLES_EN = {
  ServiceManifest: '`service`', SourceManifest: '`source` (use **one** of the keys)', GitManifest: '`source.git`', HealthcheckManifest: '`healthcheck`',
  ResourcesManifest: '`resources`', DomainRoute: 'Item of `domains`', EnvComment: 'Item of `env_comments`',
};

const FRIENDLY_EN = {
  texto: 'text', 'verdadeiro/falso': 'true/false', inteiro: 'integer', 'lista de textos': 'list of texts', 'mapa texto → texto': 'map text → text',
  'lista de rotas de domínio': 'list of domain routes', 'lista de comentários': 'list of comments', 'lista de serviços': 'list of services', 'lista de projetos': 'list of projects',
  'objeto `source`': '`source` object', 'objeto `git`': '`git` object', 'objeto `healthcheck`': '`healthcheck` object', 'objeto `resources`': '`resources` object', 'objeto `project`': '`project` object',
  'tabelas por projeto': 'tables per project', 'tabelas por provedor': 'tables per provider', 'tabelas por serviço': 'tables per service',
};

const structs = [
  ['ServiceManifest', manifestLines, '`service`'],
  ['SourceManifest', manifestLines, '`source` (use **uma** das chaves)'],
  ['GitManifest', manifestLines, '`source.git`'],
  ['HealthcheckManifest', manifestLines, '`healthcheck`'],
  ['ResourcesManifest', manifestLines, '`resources`'],
  ['DomainRoute', modelsLines, 'Item de `domains`'],
  ['EnvComment', modelsLines, 'Item de `env_comments`'],
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
title: Formato do serviço no pacote (referência)
description: "Referência dos campos do \`service\` que viaja no pacote de serviço do Rustploy (Exportar serviço / Importar): origem, domínios, variáveis, healthcheck e recursos."
---

import { Aside } from '@astrojs/starlight/components';

O **pacote de serviço** (veja [Copiar um serviço entre servidores](/guias/copiar-servico/)) leva um
\`service\` em YAML. Esta página é a **referência dos campos** desse \`service\`, gerada do código do
daemon e do \`rustploy-shared\`.

<Aside type="note" title="O manifesto do servidor inteiro não existe mais">
  O antigo manifesto de Infra as Code (\`rustploy.yml\` + \`rustploy.vars.toml\`, com \`projects:\`)
  foi removido. Para uma cópia da infra inteira, use [Baixar a infra](/guias/infra-as-code/); para
  restaurar, a [sincronização com o git](/guias/sincronizacao-git/).
</Aside>

## Campos

**Obrigatório** diz se o campo precisa existir para o arquivo ser aceito.

${tables}
## Valores de variáveis: \`secret:NOME\`

Um valor de \`env\` é um texto comum ou \`secret:NOME\`, a referência a um **secret do projeto** (o valor
não vai no arquivo). Ao exportar **sem valores**, os valores comuns saem redigidos. Veja
[Como as variáveis são resolvidas](/conceitos/variaveis-de-ambiente/).

## Comportamentos que surpreendem

| Você escreve | O que acontece |
|---|---|
| um campo com **erro de digitação** (\`replica: 5\`) | é **ignorado em silêncio**: o parser não rejeita campos desconhecidos |
| duas chaves em \`source\` (\`registry\` e \`git\`) | vale a **primeira** na ordem \`registry\`, \`git\`, \`compose\`; sem erro |
| \`port\` ausente | vale \`0\`, sem erro |
| \`healthcheck: { path: /saude }\` sem \`type\` | vale \`tcp\`; o \`path\` é ignorado |
| um volume sem \`:\` ou com lado vazio | é **descartado** |
| \`replicas: 0\` | vira \`1\` |
`;

const pageEn = (tables) => `---
title: Service format in the bundle (reference)
description: "Reference of the \`service\` fields carried by the Rustploy service bundle (Export service / Import): source, domains, variables, healthcheck and resources."
---

import { Aside } from '@astrojs/starlight/components';

The **service bundle** (see [Copy a service between servers](/en/guias/copiar-servico/)) carries one
\`service\` as YAML. This page is the **field reference** for that \`service\`, generated from the
daemon and \`rustploy-shared\` code.

<Aside type="note" title="The whole-server manifest no longer exists">
  The old Infrastructure as Code manifest (\`rustploy.yml\` + \`rustploy.vars.toml\`, with \`projects:\`)
  was removed. For a copy of the whole infrastructure use [Download the infra](/en/guias/infra-as-code/);
  to restore, use [git sync](/en/guias/sincronizacao-git/).
</Aside>

## Fields

**Required** says whether the field must exist for the file to be accepted.

${tables}
## Variable values: \`secret:NAME\`

An \`env\` value is plain text or \`secret:NAME\`, a reference to a **project secret** (the value is not in
the file). When exporting **without values**, plain values are redacted. See
[How variables are resolved](/en/conceitos/variaveis-de-ambiente/).

## Surprising behaviors

| You write | What happens |
|---|---|
| a field with a **typo** (\`replica: 5\`) | it is **silently ignored**: the parser does not reject unknown fields |
| two keys in \`source\` (\`registry\` and \`git\`) | the **first** wins in the order \`registry\`, \`git\`, \`compose\`; no error |
| \`port\` missing | it is \`0\`, no error |
| \`healthcheck: { path: /saude }\` without \`type\` | it is \`tcp\`; the \`path\` is ignored |
| a volume without \`:\` or with an empty side | it is **dropped** |
| \`replicas: 0\` | becomes \`1\` |
`;

const outFileEn = new URL('../src/content/docs/en/referencia/manifesto.mdx', import.meta.url);
mkdirSync(new URL('./', outFileEn), { recursive: true });
writeFileSync(outFile, pagePt(tablesPt));
writeFileSync(outFileEn, pageEn(tablesEn));
console.log(`gen-manifest: páginas pt e en geradas (${structs.length} structs)`);
