// Gera a referência do protocolo (Command, Response, Event) lendo o
// rustploy-shared/src/protocol.rs e o comandos.md do agregador.
// Sem o agregador ao lado, mantém as páginas já commitadas.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const protocolFile = new URL('rustploy-shared/src/protocol.rs', root);
const parityFile = new URL('docs/indice/comandos.md', root);
const outDir = new URL('../src/content/docs/referencia/', import.meta.url);

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

// ── Página de comandos ──
const groups = new Map();
for (const command of commands) {
  const group = groupOf(command);
  if (!groups.has(group)) groups.set(group, []);
  groups.get(group).push(command);
}

const page = [];
page.push('---');
page.push('title: Comandos do protocolo');
page.push(`description: "Referência dos ${commands.length} comandos da API do Rustploy (POST /api/rpc): nome, campos, exemplo JSON e se a GUI ou a web UI os usam."`);
page.push('---');
page.push('');
page.push(`Toda a API do Rustploy passa por **um** endpoint, \`POST /api/rpc\`, que recebe um **comando** em JSON e devolve uma **resposta**. Esta página lista os **${commands.length} comandos**. A mesma lista vale para a ferramenta \`rpc\` do [MCP](/agentes/ferramentas/).`);
page.push('');
page.push('## Como chamar');
page.push('');
page.push('A codificação é *externally tagged*: um comando **com campos** é um objeto de uma chave; um comando **sem campos** é a string nua. O mesmo vale para as respostas.');
page.push('');
page.push('```bash');
page.push('# sem campos');
page.push(`curl -s -H "Authorization: Bearer $TOKEN" https://SERVIDOR:9797/api/rpc -d '"ProjectList"'`);
page.push('');
page.push('# com campos');
page.push(`curl -s -H "Authorization: Bearer $TOKEN" https://SERVIDOR:9797/api/rpc \\`);
page.push(`  -d '{"DeployStart":{"service_id":"svc_01J…"}}'`);
page.push('```');
page.push('');
page.push('Uma falha vem como `{"Err":{"code":"…","message":"…"}}`. Os exemplos abaixo usam `…` e `{…}` como marcadores: troque pelos valores reais. Para saber a forma de um tipo composto (como `ServiceSpec`), leia um existente com `ServiceGet` e use-o de molde.');
page.push('');
page.push('<aside>');
page.push('');
page.push('**Comandos destrutivos não pedem confirmação:** `ServiceDelete`, `Prune*`, `Remove*`, `StopAllManaged`, `RegistryRepoDelete`, `ManagedDatabaseDelete` e `MigrationDiscard`. E `ServiceUpdate` **substitui** o serviço inteiro, não é um patch.');
page.push('');
page.push('</aside>');
page.push('');
page.push('## Grupos');
page.push('');
for (const group of groups.keys()) page.push(`- [${group}](#${group.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')})`);
page.push('');

for (const [group, items] of groups) {
  page.push(`## ${group}`);
  page.push('');
  for (const command of items) {
    page.push(`### ${command.name}`);
    page.push('');
    if (command.doc) {
      page.push(safe(command.doc));
      page.push('');
    }
    page.push('```json');
    page.push(example(command));
    page.push('```');
    page.push('');
    if (command.kind === 'tuple') {
      page.push(`O valor é um \`${command.type}\`.`);
      page.push('');
    }
    if (command.fields.length) {
      page.push('| Campo | Tipo |');
      page.push('|---|---|');
      for (const field of command.fields) {
        const note = field.doc ? ` ${safe(field.doc)}` : '';
        page.push(`| \`${field.name}\` | \`${field.type.replace(/\|/g, '\\|')}\`${note ? '<br />' + note.trim() : ''} |`);
      }
      page.push('');
    }
    const where = usage.get(command.name);
    if (where) {
      const parts = [];
      if (where.gui) parts.push('GUI');
      if (where.web) parts.push('web UI');
      page.push(`**Usado por:** ${parts.length ? parts.join(' e ') : 'só pela API e pelo MCP (nenhuma tela)'}.`);
      page.push('');
    }
  }
}

writeFileSync(new URL('comandos.md', outDir), page.join('\n').replace('<aside>\n\n', '').replace('\n</aside>\n', ''));

// ── Eventos ──
const eventPage = [];
eventPage.push('---');
eventPage.push('title: Eventos em tempo real (SSE)');
eventPage.push(`description: "Os ${events.length} eventos que o daemon do Rustploy publica em GET /api/events (Server-Sent Events): mudança de estado de deploy, logs de build, métricas e status de serviço."`);
eventPage.push('---');
eventPage.push('');
eventPage.push('`GET /api/events` é um stream **SSE**. Ele entrega um **snapshot** completo do painel a cada 2 segundos e os **eventos** abaixo assim que acontecem. Cada registro traz um campo `kind` no `data` JSON: `"snapshot"` ou `"bus"`.');
eventPage.push('');
eventPage.push('```bash');
eventPage.push(`curl -N -H "Authorization: Bearer $TOKEN" https://SERVIDOR:9797/api/events`);
eventPage.push('```');
eventPage.push('');
eventPage.push('O navegador não consegue usar `EventSource` aqui, porque ele não permite enviar o cabeçalho `Authorization`: a web UI lê o stream com `fetch`.');
eventPage.push('');
eventPage.push('Se o canal interno encher, um evento é **descartado em silêncio**: o snapshot periódico corrige a tela.');
eventPage.push('');
eventPage.push('## Eventos');
eventPage.push('');
for (const event of events) {
  eventPage.push(`### ${event.name}`);
  eventPage.push('');
  if (event.doc) {
    eventPage.push(safe(event.doc));
    eventPage.push('');
  }
  if (event.kind === 'tuple') {
    eventPage.push(`Carrega um \`${event.type}\`.`);
    eventPage.push('');
  } else if (event.fields.length) {
    eventPage.push('| Campo | Tipo |');
    eventPage.push('|---|---|');
    for (const field of event.fields) eventPage.push(`| \`${field.name}\` | \`${field.type.replace(/\|/g, '\\|')}\` |`);
    eventPage.push('');
  }
}
writeFileSync(new URL('eventos.md', outDir), eventPage.join('\n'));

// ── Respostas ──
const responsePage = [];
responsePage.push('---');
responsePage.push('title: Respostas do protocolo');
responsePage.push(`description: "As ${responses.length} variantes de resposta de POST /api/rpc no Rustploy, com o tipo que cada uma carrega, e como reconhecer um erro."`);
responsePage.push('---');
responsePage.push('');
responsePage.push('Cada [comando](/referencia/comandos/) devolve uma destas variantes. Uma resposta **com campos** é um objeto de uma chave; **sem campos**, a string nua (`"Ok"`).');
responsePage.push('');
responsePage.push('Um erro vem como `{"Err":{"code":"…","message":"…"}}`.');
responsePage.push('');
responsePage.push('| Resposta | Carrega |');
responsePage.push('|---|---|');
for (const response of responses) {
  const carries = response.kind === 'unit' ? '—' : response.kind === 'tuple' ? `\`${response.type.replace(/\|/g, '\\|')}\`` : response.fields.map((f) => `\`${f.name}: ${f.type.replace(/\|/g, '\\|')}\``).join(', ');
  responsePage.push(`| \`${response.name}\` | ${carries} |`);
}
responsePage.push('');
writeFileSync(new URL('respostas.md', outDir), responsePage.join('\n'));

// ── Paridade entre GUI, web UI e API ──
const onlyApi = commands.filter((c) => usage.has(c.name) && !usage.get(c.name).gui && !usage.get(c.name).web && !/Subscribe$/.test(c.name));
const onlyGui = commands.filter((c) => usage.get(c.name)?.gui && !usage.get(c.name).web);
const onlyWeb = commands.filter((c) => usage.get(c.name)?.web && !usage.get(c.name).gui);
const list = (items) => items.map((c) => `- [\`${c.name}\`](/referencia/comandos/#${c.name.toLowerCase()})`).join('\n');
const parity = `---
title: Qual cliente faz o quê
description: "Quais comandos do Rustploy existem só pela API e pelo MCP, quais só na GUI desktop e quais só na web UI - para saber quando usar cada interface."
---

A GUI desktop e a web UI falam com a mesma API, mas cobrem conjuntos um pouco diferentes. Esta lista é gerada do código a cada versão.

## Sem chamada direta de nenhuma tela (${onlyApi.length})

Nenhuma tela dispara estes comandos diretamente. Alguns dados (as listas do Docker, os jobs) aparecem nas telas mesmo assim, porque chegam no *snapshot* do painel. Para agir sobre eles, use \`curl\`, a ferramenta \`rpc\` do [MCP](/agentes/ferramentas/) ou um agente de IA.

${list(onlyApi)}

## Só na GUI desktop (${onlyGui.length})

${list(onlyGui)}

## Só na web UI (${onlyWeb.length})

${list(onlyWeb)}

Todo o resto existe nas duas interfaces. Os comandos de assinatura de logs e métricas (\`LogsSubscribe\`, \`MetricsSubscribe\`) foram trocados pelos streams SSE e não aparecem aqui.
`;
writeFileSync(new URL('paridade.md', outDir), parity);

console.log(`gen-protocol: ${commands.length} comandos, ${responses.length} respostas, ${events.length} eventos`);
