// Gera a referência do protocolo (Command, Response, Event) lendo o
// rustploy-shared/src/protocol.rs e o comandos.md do agregador.
// Sem o agregador ao lado, mantém as páginas já commitadas.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { DOCS as DOCS_EN, FIELD_DOCS as FIELD_DOCS_EN, GROUPS as GROUPS_EN } from './data/protocol-en.mjs';

const root = new URL('../../', import.meta.url);
const protocolFile = new URL('rustploy-shared/src/protocol.rs', root);
const parityFile = new URL('docs/indice/comandos.md', root);
const outDirs = { pt: new URL('../src/content/docs/referencia/', import.meta.url), en: new URL('../src/content/docs/en/referencia/', import.meta.url) };
mkdirSync(outDirs.en, { recursive: true });

if (!existsSync(protocolFile)) {
  console.log('gen-protocol: protocol.rs não encontrado, mantendo as páginas atuais');
  process.exit(0);
}

const source = readFileSync(protocolFile, 'utf8').split('\n');

/** Lê um `pub enum Nome { … }` e devolve as variantes com seção, doc e campos. */
function parseEnum(name) {
  const start = source.findIndex((line) => line.startsWith(`pub enum ${name} {`));
  if (start < 0) throw new Error(`enum ${name} não encontrado`);
  const variants = [];
  let section = '';
  let pendingDoc = [];
  let previousBlank = true;
  let current = null;
  let fieldDoc = [];

  for (let index = start + 1; index < source.length; index++) {
    const line = source[index];
    if (line === '}') break;
    const trimmed = line.trim();

    if (current) {
      if (trimmed === '},') {
        variants.push(current);
        current = null;
      } else if (trimmed.startsWith('///')) {
        fieldDoc.push(trimmed.replace(/^\/\/\/ ?/, ''));
      } else if (trimmed.startsWith('#[') || trimmed.startsWith('//')) {
        // atributos e comentários comuns dentro do struct-variant
      } else {
        const field = trimmed.match(/^(\w+):\s*(.+?),?$/);
        if (field) current.fields.push({ name: field[1], type: field[2].replace(/,$/, ''), doc: fieldDoc.join(' ') });
        fieldDoc = [];
      }
      continue;
    }

    if (trimmed === '') {
      previousBlank = true;
      continue;
    }
    if (trimmed.startsWith('///')) {
      pendingDoc.push(trimmed.replace(/^\/\/\/ ?/, ''));
      previousBlank = false;
      continue;
    }
    if (trimmed.startsWith('//')) {
      if (previousBlank) section = trimmed.replace(/^\/\/ ?/, '').split(' — ')[0].replace(/\.$/, '');
      previousBlank = false;
      continue;
    }
    if (trimmed.startsWith('#[')) continue;
    previousBlank = false;

    const doc = pendingDoc.join(' ');
    pendingDoc = [];
    let match;
    if ((match = trimmed.match(/^(\w+),$/))) {
      variants.push({ name: match[1], kind: 'unit', fields: [], section, doc });
    } else if ((match = trimmed.match(/^(\w+)\((.+)\),$/))) {
      variants.push({ name: match[1], kind: 'tuple', type: match[2], fields: [], section, doc });
    } else if ((match = trimmed.match(/^(\w+) \{$/))) {
      current = { name: match[1], kind: 'struct', fields: [], section, doc };
      fieldDoc = [];
    }
  }
  return variants;
}

function placeholder(field, owner = '') {
  const { name, type } = field;
  if (/^Option</.test(type)) return null;
  if (/^Vec</.test(type)) return [];
  if (type === 'bool') return false;
  if (/^(usize|u8|u16|u32|u64|i32|i64)$/.test(type)) return /limit|tail/.test(name) ? 20 : 0;
  if (type === 'String') {
    if (name === 'id') return /^Project/.test(owner) ? 'prj_…' : /^Service/.test(owner) ? 'svc_…' : '…';
    if (name === 'service_id' || name === 'server_service_id' || name === 'trigger_service_id') return 'svc_…';
    if (name === 'project_id') return 'prj_…';
    if (name === 'deployment_id') return 'dep_…';
    return '…';
  }
  return '{…}';
}

function example(variant) {
  if (variant.kind === 'unit') return JSON.stringify(variant.name);
  if (variant.kind === 'tuple') return `{"${variant.name}":{…}}`;
  const body = Object.fromEntries(variant.fields.map((field) => [field.name, placeholder(field, variant.name)]));
  return JSON.stringify({ [variant.name]: body });
}

const escapeHtml = (text) => text.replace(/<(?![^`]*`(?:[^`]*`[^`]*`)*[^`]*$)/g, '&lt;');
const cleanDoc = (doc) =>
  doc
    .replace(/\s+/g, ' ')
    .replace(/\[`([^`]+)`\]\([^)]*\)/g, '`$1`')
    .replace(/\[`([^`]+)`\]/g, '`$1`')
    .trim();
const safe = (text) =>
  cleanDoc(text)
    .split('`')
    .map((part, index) => (index % 2 === 0 ? part.replace(/</g, '&lt;').replace(/>/g, '&gt;') : part))
    .join('`');

// ── Quem chama cada comando (comandos.md) ──
const usage = new Map();
let paritySummary = [];
if (existsSync(parityFile)) {
  for (const line of readFileSync(parityFile, 'utf8').split('\n')) {
    const match = line.match(/^(\w+)(?: — .*?)? \| daemon: (.*?) \| gui: (.*?) \| web: (.*)$/);
    if (match) {
      const present = (value) => value.trim() !== '—' && value.trim() !== '';
      usage.set(match[1], { gui: present(match[3]), web: present(match[4]) });
    }
    if (line.startsWith('- Só GUI') || line.startsWith('- Só webui') || line.startsWith('- Nem GUI')) paritySummary.push(line);
  }
}

const commands = parseEnum('Command');
const events = parseEnum('Event');
const responses = parseEnum('Response');

const sectionTitle = (name) => ({
  Projects: 'Projetos',
  Services: 'Serviços',
  Deployments: 'Deploys',
  'Service lifecycle': 'Ciclo de vida do serviço',
  'Global views': 'Visões globais',
  Observability: 'Observabilidade',
  Webhooks: 'Webhooks e configuração do daemon',
  Secrets: 'Secrets',
  Infrastructure: 'Infraestrutura',
  'Docker cleanup': 'Docker: limpeza e inventário',
  '': 'Outros',
})[name] ?? name;

// Variantes sem seção própria herdam a anterior, o que mistura temas: agrupa por prefixo do nome.
const groupOf = (variant) => {
  const name = variant.name;
  const rules = [
    [/^Project/, 'Projetos'],
    [/^Service(Create|Update|Delete|List|Get|Stop|Reload|ConnectionInfo)$/, 'Serviços'],
    [/^Service(ExportPlan|Export|Import)$/, 'Copiar serviço entre servidores'],
    [/^Deploy(Start|Abort|Rollback|History|Delete)$|^RecentDeployments$|^GetBuildLogs$/, 'Deploys'],
    [/^DeployQueue|^DeployEngineStatus$/, 'Fila de deploys'],
    [/^Logs|^Metrics/, 'Logs e métricas'],
    [/^SharedAccess|^ManagedDatabase/, 'Banco compartilhado'],
    [/^Migration/, 'Migração de banco'],
    [/^Secret/, 'Secrets'],
    [/^Manifest/, 'Infra as Code'],
    [/Job/, 'Jobs'],
    [/^Prune|^Docker|^Remove|^StopAllManaged$/, 'Docker'],
    [/^Ingress/, 'Ingress'],
    [/^EnvBackup/, 'Backup de variáveis'],
    [/^Git/, 'Provedores Git'],
    [/^Wizard/, 'Assistente e templates'],
    [/^Registry/, 'Registry embutido'],
    [/^(GetWebhookUrl|RegenerateWebhookToken)$/, 'Webhooks'],
    [/^(Get|Set)DaemonSettings$|^Ping$|^DaemonStatus$|^Snapshot$/, 'Daemon'],
  ];
  for (const [pattern, group] of rules) if (pattern.test(name)) return group;
  return sectionTitle(variant.section);
};


const slugify = (group) => group.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pipe = (text) => text.replace(/\|/g, '\\|');

const L = {
  pt: {
    base: '', docOf: (owner, doc) => doc, fieldDoc: (key, doc) => doc, group: (g) => g,
    cmdTitle: 'Comandos do protocolo',
    cmdDesc: (n) => `Referência dos ${n} comandos da API do Rustploy (POST /api/rpc): nome, campos, exemplo JSON e se a GUI ou a web UI os usam.`,
    cmdIntro: (n) => `Toda a API do Rustploy passa por **um** endpoint, \`POST /api/rpc\`, que recebe um **comando** em JSON e devolve uma **resposta**. Esta página lista os **${n} comandos**. A mesma lista vale para a ferramenta \`rpc\` do [MCP](/agentes/ferramentas/).`,
    how: 'Como chamar',
    howP: 'A codificação é *externally tagged*: um comando **com campos** é um objeto de uma chave; um comando **sem campos** é a string nua. O mesmo vale para as respostas.',
    noFields: '# sem campos', withFields: '# com campos',
    errP: 'Uma falha vem como `{"Err":{"code":"…","message":"…"}}`. Os exemplos abaixo usam `…` e `{…}` como marcadores: troque pelos valores reais. Para saber a forma de um tipo composto (como `ServiceSpec`), leia um existente com `ServiceGet` e use-o de molde.',
    destructive: '**Comandos destrutivos não pedem confirmação:** `ServiceDelete`, `Prune*`, `Remove*`, `StopAllManaged`, `RegistryRepoDelete`, `ManagedDatabaseDelete` e `MigrationDiscard`. E `ServiceUpdate` **substitui** o serviço inteiro, não é um patch.',
    groupsH: 'Grupos', valueIs: (t) => `O valor é um \`${t}\`.`, field: 'Campo', type: 'Tipo',
    usedBy: 'Usado por:', gui: 'GUI', web: 'web UI', and: ' e ', onlyApiLabel: 'só pela API e pelo MCP (nenhuma tela)',
    evTitle: 'Eventos em tempo real (SSE)',
    evDesc: (n) => `Os ${n} eventos que o daemon do Rustploy publica em GET /api/events (Server-Sent Events): mudança de estado de deploy, logs de build, métricas e status de serviço.`,
    ev1: '`GET /api/events` é um stream **SSE**. Ele entrega um **snapshot** completo do painel a cada 2 segundos e os **eventos** abaixo assim que acontecem. Cada registro traz um campo `kind` no `data` JSON: `"snapshot"` ou `"bus"`.',
    ev2: 'O navegador não consegue usar `EventSource` aqui, porque ele não permite enviar o cabeçalho `Authorization`: a web UI lê o stream com `fetch`.',
    ev3: 'Se o canal interno encher, um evento é **descartado em silêncio**: o snapshot periódico corrige a tela.',
    evH: 'Eventos', carries: (t) => `Carrega um \`${t}\`.`,
    resTitle: 'Respostas do protocolo',
    resDesc: (n) => `As ${n} variantes de resposta de POST /api/rpc no Rustploy, com o tipo que cada uma carrega, e como reconhecer um erro.`,
    res1: (link) => `Cada [comando](${link}) devolve uma destas variantes. Uma resposta **com campos** é um objeto de uma chave; **sem campos**, a string nua (\`"Ok"\`).`,
    res2: 'Um erro vem como `{"Err":{"code":"…","message":"…"}}`.', resCol: 'Resposta', carriesCol: 'Carrega',
    parTitle: 'Qual cliente faz o quê',
    parDesc: 'Quais comandos do Rustploy existem só pela API e pelo MCP, quais só na GUI desktop e quais só na web UI - para saber quando usar cada interface.',
    par1: 'A GUI desktop e a web UI falam com a mesma API, mas cobrem conjuntos um pouco diferentes. Esta lista é gerada do código a cada versão.',
    parA: (n) => `Sem chamada direta de nenhuma tela (${n})`,
    parAp: (link) => `Nenhuma tela dispara estes comandos diretamente. Alguns dados (as listas do Docker, os jobs) aparecem nas telas mesmo assim, porque chegam no *snapshot* do painel. Para agir sobre eles, use \`curl\`, a ferramenta \`rpc\` do [MCP](${link}) ou um agente de IA.`,
    parG: (n) => `Só na GUI desktop (${n})`, parW: (n) => `Só na web UI (${n})`,
    parEnd: 'Todo o resto existe nas duas interfaces. Os comandos de assinatura de logs e métricas (`LogsSubscribe`, `MetricsSubscribe`) foram trocados pelos streams SSE e não aparecem aqui.',
  },
  en: {
    base: '/en', docOf: (owner, doc) => DOCS_EN[owner] ?? doc, fieldDoc: (key, doc) => FIELD_DOCS_EN[key] ?? doc, group: (g) => GROUPS_EN[g] ?? g,
    cmdTitle: 'Protocol commands',
    cmdDesc: (n) => `Reference of the ${n} Rustploy API commands (POST /api/rpc): name, fields, JSON example and whether the GUI or the web UI use them.`,
    cmdIntro: (n) => `The whole Rustploy API goes through **one** endpoint, \`POST /api/rpc\`, which takes a JSON **command** and returns a **response**. This page lists the **${n} commands**. The same list applies to the \`rpc\` tool of the [MCP](/en/agentes/ferramentas/).`,
    how: 'How to call',
    howP: 'The encoding is *externally tagged*: a command **with fields** is a one-key object; a command **without fields** is the bare string. The same goes for responses.',
    noFields: '# no fields', withFields: '# with fields',
    errP: 'A failure comes as `{"Err":{"code":"…","message":"…"}}`. The examples below use `…` and `{…}` as placeholders: replace them with real values. To learn the shape of a composite type (such as `ServiceSpec`), read an existing one with `ServiceGet` and use it as a template.',
    destructive: '**Destructive commands do not ask for confirmation:** `ServiceDelete`, `Prune*`, `Remove*`, `StopAllManaged`, `RegistryRepoDelete`, `ManagedDatabaseDelete` and `MigrationDiscard`. And `ServiceUpdate` **replaces** the whole service; it is not a patch.',
    groupsH: 'Groups', valueIs: (t) => `The value is a \`${t}\`.`, field: 'Field', type: 'Type',
    usedBy: 'Used by:', gui: 'GUI', web: 'web UI', and: ' and ', onlyApiLabel: 'only by the API and the MCP (no screen)',
    evTitle: 'Real-time events (SSE)',
    evDesc: (n) => `The ${n} events the Rustploy daemon publishes on GET /api/events (Server-Sent Events): deploy state changes, build logs, metrics and service status.`,
    ev1: '`GET /api/events` is an **SSE** stream. It delivers a full dashboard **snapshot** every 2 seconds and the **events** below as soon as they happen. Each record carries a `kind` field in the JSON `data`: `"snapshot"` or `"bus"`.',
    ev2: 'The browser cannot use `EventSource` here, because it does not allow sending the `Authorization` header: the web UI reads the stream with `fetch`.',
    ev3: 'If the internal channel fills up, an event is **silently dropped**: the periodic snapshot corrects the screen.',
    evH: 'Events', carries: (t) => `Carries a \`${t}\`.`,
    resTitle: 'Protocol responses',
    resDesc: (n) => `The ${n} response variants of POST /api/rpc on Rustploy, the type each one carries, and how to recognize an error.`,
    res1: (link) => `Each [command](${link}) returns one of these variants. A response **with fields** is a one-key object; **without fields**, the bare string (\`"Ok"\`).`,
    res2: 'An error comes as `{"Err":{"code":"…","message":"…"}}`.', resCol: 'Response', carriesCol: 'Carries',
    parTitle: 'Which client does what',
    parDesc: 'Which Rustploy commands exist only through the API and the MCP, which only in the desktop GUI and which only in the web UI - to know when to use each interface.',
    par1: 'The desktop GUI and the web UI talk to the same API, but cover slightly different sets. This list is generated from the code on every release.',
    parA: (n) => `Not called directly by any screen (${n})`,
    parAp: (link) => `No screen fires these commands directly. Some data (the Docker lists, the jobs) shows up on the screens anyway, because it arrives in the dashboard *snapshot*. To act on them, use \`curl\`, the \`rpc\` tool of the [MCP](${link}) or an AI agent.`,
    parG: (n) => `Desktop GUI only (${n})`, parW: (n) => `Web UI only (${n})`,
    parEnd: 'Everything else exists in both interfaces. The log and metrics subscription commands (`LogsSubscribe`, `MetricsSubscribe`) were replaced by the SSE streams and do not appear here.',
  },
};

const onlyApi = commands.filter((c) => usage.has(c.name) && !usage.get(c.name).gui && !usage.get(c.name).web && !/Subscribe$/.test(c.name));
const onlyGui = commands.filter((c) => usage.get(c.name)?.gui && !usage.get(c.name).web);
const onlyWeb = commands.filter((c) => usage.get(c.name)?.web && !usage.get(c.name).gui);

for (const locale of ['pt', 'en']) {
  const t = L[locale];
  const base = t.base;
  const outDir = outDirs[locale];

  // ── Comandos ──
  const groups = new Map();
  for (const command of commands) {
    const group = groupOf(command);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(command);
  }
  const page = [];
  page.push('---', `title: ${t.cmdTitle}`, `description: ${JSON.stringify(t.cmdDesc(commands.length))}`, '---', '');
  page.push(t.cmdIntro(commands.length), '');
  page.push(`## ${t.how}`, '', t.howP, '');
  page.push('```bash', t.noFields);
  page.push(`curl -s -H "Authorization: Bearer $TOKEN" https://SERVIDOR:9797/api/rpc -d '"ProjectList"'`);
  page.push('', t.withFields);
  page.push(`curl -s -H "Authorization: Bearer $TOKEN" https://SERVIDOR:9797/api/rpc \\`);
  page.push(`  -d '{"DeployStart":{"service_id":"svc_01J…"}}'`);
  page.push('```', '', t.errP, '', t.destructive, '');
  page.push(`## ${t.groupsH}`, '');
  for (const group of groups.keys()) page.push(`- [${t.group(group)}](#${slugify(t.group(group))})`);
  page.push('');
  for (const [group, items] of groups) {
    page.push(`## ${t.group(group)}`, '');
    for (const command of items) {
      page.push(`### ${command.name}`, '');
      const doc = t.docOf(command.name, command.doc);
      if (doc) page.push(safe(doc), '');
      page.push('```json', example(command), '```', '');
      if (command.kind === 'tuple') page.push(t.valueIs(command.type), '');
      if (command.fields.length) {
        page.push(`| ${t.field} | ${t.type} |`, '|---|---|');
        for (const field of command.fields) {
          const fdoc = t.fieldDoc(`${command.name}.${field.name}`, field.doc);
          const note = fdoc ? ` ${safe(fdoc)}` : '';
          page.push(`| \`${field.name}\` | \`${pipe(field.type)}\`${note ? '<br />' + note.trim() : ''} |`);
        }
        page.push('');
      }
      const where = usage.get(command.name);
      if (where) {
        const parts = [];
        if (where.gui) parts.push(t.gui);
        if (where.web) parts.push(t.web);
        page.push(`**${t.usedBy}** ${parts.length ? parts.join(t.and) : t.onlyApiLabel}.`, '');
      }
    }
  }
  writeFileSync(new URL('comandos.md', outDir), page.join('\n'));

  // ── Eventos ──
  const ep = ['---', `title: ${t.evTitle}`, `description: ${JSON.stringify(t.evDesc(events.length))}`, '---', ''];
  ep.push(t.ev1, '', '```bash', `curl -N -H "Authorization: Bearer $TOKEN" https://SERVIDOR:9797/api/events`, '```', '', t.ev2, '', t.ev3, '', `## ${t.evH}`, '');
  for (const event of events) {
    ep.push(`### ${event.name}`, '');
    const doc = t.docOf(event.name, event.doc);
    if (doc) ep.push(safe(doc), '');
    if (event.kind === 'tuple') {
      ep.push(t.carries(event.type), '');
    } else if (event.fields.length) {
      ep.push(`| ${t.field} | ${t.type} |`, '|---|---|');
      for (const field of event.fields) ep.push(`| \`${field.name}\` | \`${pipe(field.type)}\` |`);
      ep.push('');
    }
  }
  writeFileSync(new URL('eventos.md', outDir), ep.join('\n'));

  // ── Respostas ──
  const rp = ['---', `title: ${t.resTitle}`, `description: ${JSON.stringify(t.resDesc(responses.length))}`, '---', ''];
  rp.push(t.res1(`${base}/referencia/comandos/`), '', t.res2, '', `| ${t.resCol} | ${t.carriesCol} |`, '|---|---|');
  for (const response of responses) {
    const carries = response.kind === 'unit' ? '—' : response.kind === 'tuple' ? `\`${pipe(response.type)}\`` : response.fields.map((f) => `\`${f.name}: ${pipe(f.type)}\``).join(', ');
    rp.push(`| \`${response.name}\` | ${carries} |`);
  }
  rp.push('');
  writeFileSync(new URL('respostas.md', outDir), rp.join('\n'));

  // ── Paridade ──
  const list = (items) => items.map((c) => `- [\`${c.name}\`](${base}/referencia/comandos/#${c.name.toLowerCase()})`).join('\n');
  const parity = `---
title: ${t.parTitle}
description: ${JSON.stringify(t.parDesc)}
---

${t.par1}

## ${t.parA(onlyApi.length)}

${t.parAp(`${base}/agentes/ferramentas/`)}

${list(onlyApi)}

## ${t.parG(onlyGui.length)}

${list(onlyGui)}

## ${t.parW(onlyWeb.length)}

${list(onlyWeb)}

${t.parEnd}
`;
  writeFileSync(new URL('paridade.md', outDir), parity);
}

console.log(`gen-protocol: ${commands.length} comandos, ${responses.length} respostas, ${events.length} eventos (pt + en)`);
