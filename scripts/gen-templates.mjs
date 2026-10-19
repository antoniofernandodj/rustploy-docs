// Gera uma página por template do catálogo (rustploy-daemon/crates/daemon/templates/blueprints)
// e a página-índice. As descrições (pt-BR) vêm de docs/services.md do agregador.
// Sem o agregador ao lado, mantém as páginas já commitadas.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { parse as parseToml } from 'smol-toml';
import { parse as parseYaml } from 'yaml';

const root = new URL('../../', import.meta.url);
const blueprints = new URL('rustploy-daemon/crates/daemon/templates/blueprints/', root);
const servicesList = new URL('docs/services.md', root);
const outDir = new URL('../src/content/docs/templates/', import.meta.url);

if (!existsSync(blueprints)) {
  console.log('gen-templates: blueprints não encontrados, mantendo as páginas atuais');
  process.exit(0);
}

const normalize = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
const prettify = (id) => id.split(/[-_]/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

// "[x] Ackee – Analytics focado em privacidade." -> { ackee: { name, description } }
const catalogInfo = new Map();
if (existsSync(servicesList)) {
  for (const line of readFileSync(servicesList, 'utf8').split('\n')) {
    const match = line.match(/^\[.\]\s+(.+?)\s+[–-]\s+(.+)$/);
    if (match) catalogInfo.set(normalize(match[1]), { name: match[1], description: match[2].trim() });
  }
}

// Descrições em inglês: scripts/data/template-descriptions-en.tsv (nome<TAB>texto).
const descriptionsEn = new Map();
const tsvEn = new URL('./data/template-descriptions-en.tsv', import.meta.url);
if (existsSync(tsvEn)) {
  for (const line of readFileSync(tsvEn, 'utf8').split('\n')) {
    const [name, text] = line.split('\t');
    if (name && text) descriptionsEn.set(normalize(name), text.trim());
  }
}

const T = {
  pt: {
    domain: '*domínio (gerado; troque pelo seu)*', password: (n) => `*senha aleatória de ${n} caracteres*`, passwordAny: '*senha aleatória*',
    base64: (n) => `*chave base64 aleatória (${n} bytes)*`, hash: '*hash aleatório*', uuid: '*UUID aleatório*', email: '*e-mail gerado*', username: '*usuário gerado*', jwt: '*JWT gerado*',
  },
  en: {
    domain: '*domain (generated; replace it with yours)*', password: (n) => `*random password, ${n} characters*`, passwordAny: '*random password*',
    base64: (n) => `*random base64 key (${n} bytes)*`, hash: '*random hash*', uuid: '*random UUID*', email: '*generated email*', username: '*generated username*', jwt: '*generated JWT*',
  },
};

const describeToken = (raw, t = T.pt) =>
  raw
    .replace(/\$\{domain\}/g, t.domain)
    .replace(/\$\{password:(\d+)\}/g, (_, n) => t.password(n))
    .replace(/\$\{password\}/g, t.passwordAny)
    .replace(/\$\{base64:(\d+)\}/g, (_, n) => t.base64(n))
    .replace(/\$\{hash(?::(\d+))?\}/g, t.hash)
    .replace(/\$\{uuid\}/g, t.uuid)
    .replace(/\$\{email\}/g, t.email)
    .replace(/\$\{username\}/g, t.username)
    .replace(/\$\{jwt[^}]*\}/g, t.jwt);

const slugOf = (id) => id.replace(/[^a-zA-Z0-9_-]/g, '-');
const cell = (text) => String(text).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const inlineCode = (text) => '`' + String(text).replace(/`/g, "'") + '`';

const outDirEn = new URL('../src/content/docs/en/templates/', import.meta.url);
mkdirSync(outDirEn, { recursive: true });

const STR = {
  pt: {
    title: (n) => `Hospedar ${n} com Rustploy`,
    desc: (sum, n, c) => `${sum}. Crie ${n} em um clique no Rustploy: ${c} container${c === 1 ? '' : 's'}, variáveis geradas, domínio e HTTPS automático.`,
    intro: (n, sum) => `**${n}**: ${sum}. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.`,
    summary: 'Resumo', id: 'Identificador', containers: 'Containers', none: 'nenhum', images: 'Imagens', uiPort: 'Porta da interface', onService: 'no serviço', kind: 'Tipo no Rustploy', kindV: 'Stack Compose',
    how: 'Como criar', s1: 'No projeto, clique em **+ Novo serviço → Template**.', s2: (n) => `Busque por **${n}** e selecione.`, s3: 'Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.', s4: 'Crie e faça o **Deploy**.', s5: 'Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).',
    envH: 'Variáveis de ambiente', tplVars: '**Variáveis do template** (valores calculados na criação):', variable: 'Variável', value: 'Valor', delivered: '**Entregues ao container:**',
    domH: 'Domínios', service: 'Serviço', port: 'Porta', host: 'Host', filesH: 'Arquivos de configuração', filesP: 'O template grava estes arquivos no servidor e os monta nos containers:',
    composeH: 'docker-compose.yml do template', see: 'Veja também', l1: '[Templates de um clique](/guias/templates/)', l2: '[Stacks Docker Compose](/guias/compose/)', l3: '[Diagnosticar um 502](/guias/diagnosticar-502/)',
  },
  en: {
    title: (n) => `Host ${n} with Rustploy`,
    desc: (sum, n, c) => `${sum}. Create ${n} in one click on Rustploy: ${c} container${c === 1 ? '' : 's'}, generated variables, domain and automatic HTTPS.`,
    intro: (n, sum) => `**${n}**: ${sum}. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.`,
    summary: 'Summary', id: 'Identifier', containers: 'Containers', none: 'none', images: 'Images', uiPort: 'UI port', onService: 'on service', kind: 'Type in Rustploy', kindV: 'Compose stack',
    how: 'How to create it', s1: 'In the project, click **+ Novo serviço → Template** (New service → Template).', s2: (n) => `Search for **${n}** and select it.`, s3: 'Name the service and review the variables. Passwords and keys come already generated.', s4: 'Create it and run **Deploy**.', s5: 'Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).',
    envH: 'Environment variables', tplVars: '**Template variables** (values computed at creation):', variable: 'Variable', value: 'Value', delivered: '**Delivered to the container:**',
    domH: 'Domains', service: 'Service', port: 'Port', host: 'Host', filesH: 'Configuration files', filesP: 'The template writes these files on the server and mounts them in the containers:',
    composeH: 'The template docker-compose.yml', see: 'See also', l1: '[One-click templates](/en/guias/templates/)', l2: '[Docker Compose stacks](/en/guias/compose/)', l3: '[Diagnosing a 502](/en/guias/diagnosticar-502/)',
  },
};

function render(locale, rec) {
  const { id, name, services, domains, env, variables, mounts, images, primaryPort, composeText } = rec;
  const t = T[locale];
  const L = STR[locale];
  const summary = locale === 'en' ? (descriptionsEn.get(normalize(id)) ?? descriptionsEn.get(normalize(name)))?.replace(/\.$/, '') ?? (rec.hasInfo ? rec.summaryPt : `${name} application`) : rec.summaryPt;
  const lines = [];
  lines.push('---');
  lines.push(`title: ${L.title(name)}`);
  lines.push(`description: ${JSON.stringify(L.desc(summary, name, services.length))}`);
  lines.push('sidebar:');
  lines.push('  hidden: true');
  lines.push('---');
  lines.push('');
  lines.push(L.intro(name, summary));
  lines.push('');
  lines.push(`## ${L.summary}`);
  lines.push('');
  lines.push('| | |');
  lines.push('|---|---|');
  lines.push(`| **${L.id}** | ${inlineCode(id)} |`);
  lines.push(`| **${L.containers}** | ${services.length} (${services.map((s) => inlineCode(s.name)).join(', ') || L.none}) |`);
  if (images.length) lines.push(`| **${L.images}** | ${images.map(inlineCode).join(', ')} |`);
  if (primaryPort) lines.push(`| **${L.uiPort}** | ${primaryPort}, ${L.onService} ${inlineCode(domains[0].serviceName)} |`);
  lines.push(`| **${L.kind}** | ${L.kindV} |`);
  lines.push('');
  lines.push(`## ${L.how}`);
  lines.push('');
  lines.push(`1. ${L.s1}`);
  lines.push(`2. ${L.s2(name)}`);
  lines.push(`3. ${L.s3}`);
  lines.push(`4. ${L.s4}`);
  lines.push(`5. ${L.s5}`);
  lines.push('');
  if (variables.length || env.length) {
    lines.push(`## ${L.envH}`);
    lines.push('');
    if (variables.length) {
      lines.push(L.tplVars);
      lines.push('');
      lines.push(`| ${L.variable} | ${L.value} |`);
      lines.push('|---|---|');
      for (const [key, raw] of variables) lines.push(`| ${inlineCode(key)} | ${cell(describeToken(String(raw), t))} |`);
      lines.push('');
    }
    if (env.length) {
      lines.push(L.delivered);
      lines.push('');
      lines.push(`| ${L.variable} | ${L.value} |`);
      lines.push('|---|---|');
      for (const [key, raw] of env) lines.push(`| ${inlineCode(key)} | ${cell(describeToken(String(raw ?? ''), t))} |`);
      lines.push('');
    }
  }
  if (domains.length) {
    lines.push(`## ${L.domH}`);
    lines.push('');
    lines.push(`| ${L.service} | ${L.port} | ${L.host} |`);
    lines.push('|---|---|---|');
    for (const domain of domains) lines.push(`| ${inlineCode(domain.serviceName)} | ${domain.port} | ${cell(describeToken(String(domain.host ?? ''), t))} |`);
    lines.push('');
  }
  if (mounts.length) {
    lines.push(`## ${L.filesH}`);
    lines.push('');
    lines.push(L.filesP);
    lines.push('');
    for (const mount of mounts) lines.push(`- ${inlineCode(mount.filePath)}`);
    lines.push('');
  }
  lines.push(`## ${L.composeH}`);
  lines.push('');
  lines.push('```yaml');
  lines.push(composeText.trimEnd());
  lines.push('```');
  lines.push('');
  lines.push(`## ${L.see}`);
  lines.push('');
  lines.push(`- ${L.l1}`);
  lines.push(`- ${L.l2}`);
  lines.push(`- ${L.l3}`);
  lines.push('');
  rec[`summary_${locale}`] = summary;
  writeFileSync(new URL(`${slugOf(id)}.md`, locale === 'en' ? outDirEn : outDir), lines.join('\n'));
}

const entries = [];
const skipped = [];

for (const id of readdirSync(blueprints).sort()) {
  const dir = new URL(`${id}/`, blueprints);
  const tomlFile = new URL('template.toml', dir);
  const composeFile = new URL('docker-compose.yml', dir);
  if (!existsSync(tomlFile) || !existsSync(composeFile)) continue;

  let template;
  try {
    template = parseToml(readFileSync(tomlFile, 'utf8'));
  } catch {
    skipped.push(id);
    continue;
  }
  const composeText = readFileSync(composeFile, 'utf8');

  let services = [];
  try {
    const compose = parseYaml(composeText);
    services = Object.entries(compose?.services ?? {}).map(([name, spec]) => ({ name, image: spec?.image ?? null }));
  } catch {
    services = [...composeText.matchAll(/^\s+image:\s*(\S+)/gm)].map((match, index) => ({ name: `servico-${index + 1}`, image: match[1] }));
  }

  const info = catalogInfo.get(normalize(id));
  const name = info?.name ?? prettify(id);
  const summary = info?.description?.replace(/\.$/, '') ?? `Aplicação ${name}`;
  const domains = template.config?.domains ?? [];
  const envRaw = template.config?.env;
  const env = Array.isArray(envRaw)
    ? envRaw.map((entry) => entry.split(/=(.*)/s).slice(0, 2))
    : Object.entries(envRaw ?? {});
  const variables = Object.entries(template.variables ?? {});
  const mounts = (template.config?.mounts ?? []).filter((mount) => mount.filePath && mount.content);
  const images = [...new Set(services.map((service) => service.image).filter(Boolean))];
  const primaryPort = domains[0]?.port ?? null;

  const rec = { id, name, services, domains, env, variables, mounts, images, primaryPort, composeText, summaryPt: summary, hasInfo: Boolean(info) };
  render('pt', rec);
  render('en', rec);
  entries.push({ id, slug: slugOf(id), name, summary, summaryEn: rec.summary_en });
}

// Recria o diretório: remove páginas de templates que saíram do catálogo.
void rmSync;

const INDEX = {
  pt: {
    title: 'Catálogo de templates',
    desc: (n) => `Catálogo com ${n} aplicações prontas para criar em um clique no Rustploy: nome, containers, imagens, porta e variáveis de cada template.`,
    intro: (n) => `O Rustploy traz **${n} templates** de aplicações. Cada página mostra os containers, as imagens, a porta, as variáveis geradas e o compose completo. Para usar, veja [Templates de um clique](/guias/templates/).`,
    gen: 'Geradores de valores', genP: 'Nas variáveis dos templates, estes marcadores viram valores na hora de criar o serviço:', marker: 'Marcador', result: 'Resultado',
    rows: ['um domínio provisório (`app-xxxx.example.com`), que você troca pelo seu', 'senha aleatória de N caracteres', 'chave aleatória em base64', 'hash aleatório', 'UUID aleatório', 'e-mail e usuário gerados', 'JWT gerado'],
    all: 'Todos os templates', base: '/templates/',
  },
  en: {
    title: 'Template catalog',
    desc: (n) => `Catalog of ${n} applications ready to create in one click on Rustploy: name, containers, images, port and variables of each template.`,
    intro: (n) => `Rustploy ships **${n} application templates**. Each page shows the containers, images, port, generated variables and the full compose file. To use one, see [One-click templates](/en/guias/templates/).`,
    gen: 'Value generators', genP: 'In template variables, these markers turn into values when the service is created:', marker: 'Marker', result: 'Result',
    rows: ['a provisional domain (`app-xxxx.example.com`) that you replace with yours', 'random password of N characters', 'random base64 key', 'random hash', 'random UUID', 'generated email and username', 'generated JWT'],
    all: 'All templates', base: '/en/templates/',
  },
};

for (const locale of ['pt', 'en']) {
  const X = INDEX[locale];
  const index = [];
  index.push('---');
  index.push(`title: ${X.title}`);
  index.push(`description: ${JSON.stringify(X.desc(entries.length))}`);
  index.push('---');
  index.push('');
  index.push(X.intro(entries.length));
  index.push('');
  index.push(`## ${X.gen}`);
  index.push('');
  index.push(X.genP);
  index.push('');
  index.push(`| ${X.marker} | ${X.result} |`);
  index.push('|---|---|');
  const keys = ['`${domain}`', '`${password:N}`', '`${base64:N}`', '`${hash:N}`', '`${uuid}`', '`${email}` / `${username}`', '`${jwt}`'];
  keys.forEach((key, i) => index.push(`| ${key} | ${X.rows[i]} |`));
  index.push('');
  index.push(`## ${X.all}`);
  index.push('');
  let letter = '';
  for (const entry of entries) {
    const first = entry.name[0].toUpperCase();
    if (first !== letter) {
      letter = first;
      index.push('');
      index.push(`### ${letter}`);
      index.push('');
    }
    index.push(`- [${entry.name}](${X.base}${entry.slug}/): ${locale === 'en' ? entry.summaryEn : entry.summary}`);
  }
  index.push('');
  writeFileSync(new URL('index.md', locale === 'en' ? outDirEn : outDir), index.join('\n'));
}

console.log(`gen-templates: ${entries.length} páginas geradas, ${skipped.length} ignoradas (TOML inválido)${skipped.length ? ': ' + skipped.join(', ') : ''}`);
