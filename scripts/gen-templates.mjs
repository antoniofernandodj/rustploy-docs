// Gera uma página por template do catálogo (rustploy-shared/templates/blueprints)
// e a página-índice. As descrições (pt-BR) vêm de docs/services.md do agregador.
// Sem o agregador ao lado, mantém as páginas já commitadas.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { parse as parseToml } from 'smol-toml';
import { parse as parseYaml } from 'yaml';

const root = new URL('../../', import.meta.url);
const blueprints = new URL('rustploy-shared/templates/blueprints/', root);
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

const describeToken = (raw) =>
  raw
    .replace(/\$\{domain\}/g, '*domínio (gerado; troque pelo seu)*')
    .replace(/\$\{password:(\d+)\}/g, '*senha aleatória de $1 caracteres*')
    .replace(/\$\{password\}/g, '*senha aleatória*')
    .replace(/\$\{base64:(\d+)\}/g, '*chave base64 aleatória ($1 bytes)*')
    .replace(/\$\{hash(?::(\d+))?\}/g, '*hash aleatório*')
    .replace(/\$\{uuid\}/g, '*UUID aleatório*')
    .replace(/\$\{email\}/g, '*e-mail gerado*')
    .replace(/\$\{username\}/g, '*usuário gerado*')
    .replace(/\$\{jwt[^}]*\}/g, '*JWT gerado*');

const slugOf = (id) => id.replace(/[^a-zA-Z0-9_-]/g, '-');
const cell = (text) => String(text).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const inlineCode = (text) => '`' + String(text).replace(/`/g, "'") + '`';

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

  const lines = [];
  lines.push('---');
  lines.push(`title: Hospedar ${name} com Rustploy`);
  lines.push(`description: ${JSON.stringify(`${summary}. Crie ${name} em um clique no Rustploy: ${services.length} container${services.length === 1 ? '' : 's'}, variáveis geradas, domínio e HTTPS automático.`)}`);
  lines.push('sidebar:');
  lines.push('  hidden: true');
  lines.push('---');
  lines.push('');
  lines.push(`**${name}**: ${summary}. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.`);
  lines.push('');
  lines.push('## Resumo');
  lines.push('');
  lines.push('| | |');
  lines.push('|---|---|');
  lines.push(`| **Identificador** | ${inlineCode(id)} |`);
  lines.push(`| **Containers** | ${services.length} (${services.map((s) => inlineCode(s.name)).join(', ') || 'nenhum'}) |`);
  if (images.length) lines.push(`| **Imagens** | ${images.map(inlineCode).join(', ')} |`);
  if (primaryPort) lines.push(`| **Porta da interface** | ${primaryPort}, no serviço ${inlineCode(domains[0].serviceName)} |`);
  lines.push(`| **Tipo no Rustploy** | Stack Compose |`);
  lines.push('');
  lines.push('## Como criar');
  lines.push('');
  lines.push('1. No projeto, clique em **+ Novo serviço → Template**.');
  lines.push(`2. Busque por **${name}** e selecione.`);
  lines.push('3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.');
  lines.push('4. Crie e faça o **Deploy**.');
  lines.push('5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).');
  lines.push('');

  if (variables.length || env.length) {
    lines.push('## Variáveis de ambiente');
    lines.push('');
    if (variables.length) {
      lines.push('**Variáveis do template** (valores calculados na criação):');
      lines.push('');
      lines.push('| Variável | Valor |');
      lines.push('|---|---|');
      for (const [key, raw] of variables) lines.push(`| ${inlineCode(key)} | ${cell(describeToken(String(raw)))} |`);
      lines.push('');
    }
    if (env.length) {
      lines.push('**Entregues ao container:**');
      lines.push('');
      lines.push('| Variável | Valor |');
      lines.push('|---|---|');
      for (const [key, raw] of env) lines.push(`| ${inlineCode(key)} | ${cell(describeToken(String(raw ?? '')))} |`);
      lines.push('');
    }
  }

  if (domains.length) {
    lines.push('## Domínios');
    lines.push('');
    lines.push('| Serviço | Porta | Host |');
    lines.push('|---|---|---|');
    for (const domain of domains) lines.push(`| ${inlineCode(domain.serviceName)} | ${domain.port} | ${cell(describeToken(String(domain.host ?? '')))} |`);
    lines.push('');
  }

  if (mounts.length) {
    lines.push('## Arquivos de configuração');
    lines.push('');
    lines.push('O template grava estes arquivos no servidor e os monta nos containers:');
    lines.push('');
    for (const mount of mounts) lines.push(`- ${inlineCode(mount.filePath)}`);
    lines.push('');
  }

  lines.push('## docker-compose.yml do template');
  lines.push('');
  lines.push('```yaml');
  lines.push(composeText.trimEnd());
  lines.push('```');
  lines.push('');
  lines.push('## Veja também');
  lines.push('');
  lines.push('- [Templates de um clique](/guias/templates/)');
  lines.push('- [Stacks Docker Compose](/guias/compose/)');
  lines.push('- [Diagnosticar um 502](/guias/diagnosticar-502/)');
  lines.push('');

  entries.push({ id, slug: slugOf(id), name, summary });
  writeFileSync(new URL(`${slugOf(id)}.md`, outDir), lines.join('\n'));
}

// Recria o diretório: remove páginas de templates que saíram do catálogo.
void rmSync;

const index = [];
index.push('---');
index.push('title: Catálogo de templates');
index.push(`description: "Catálogo com ${entries.length} aplicações prontas para criar em um clique no Rustploy: nome, containers, imagens, porta e variáveis de cada template."`);
index.push('---');
index.push('');
index.push(`O Rustploy traz **${entries.length} templates** de aplicações. Cada página mostra os containers, as imagens, a porta, as variáveis geradas e o compose completo. Para usar, veja [Templates de um clique](/guias/templates/).`);
index.push('');
index.push('## Geradores de valores');
index.push('');
index.push('Nas variáveis dos templates, estes marcadores viram valores na hora de criar o serviço:');
index.push('');
index.push('| Marcador | Resultado |');
index.push('|---|---|');
index.push('| `${domain}` | um domínio provisório (`app-xxxx.example.com`), que você troca pelo seu |');
index.push('| `${password:N}` | senha aleatória de N caracteres |');
index.push('| `${base64:N}` | chave aleatória em base64 |');
index.push('| `${hash:N}` | hash aleatório |');
index.push('| `${uuid}` | UUID aleatório |');
index.push('| `${email}` e `${username}` | e-mail e usuário gerados |');
index.push('| `${jwt}` | JWT gerado |');
index.push('');
index.push('## Todos os templates');
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
  index.push(`- [${entry.name}](/templates/${entry.slug}/): ${entry.summary}`);
}
index.push('');
writeFileSync(new URL('index.md', outDir), index.join('\n'));

console.log(`gen-templates: ${entries.length} páginas geradas, ${skipped.length} ignoradas (TOML inválido)${skipped.length ? ': ' + skipped.join(', ') : ''}`);
