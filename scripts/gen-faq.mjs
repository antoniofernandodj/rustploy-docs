// Gera faq.mdx (pt) e en/faq.mdx a partir de scripts/data/faq.mjs, com JSON-LD FAQPage.
import { writeFileSync } from 'node:fs';
import { sections } from './data/faq.mjs';
import { withLocaleLinks, plainText } from './lib/i18n.mjs';

const T = {
  pt: {
    title: 'Perguntas frequentes (FAQ)',
    description: 'Respostas curtas às dúvidas mais comuns sobre o Rustploy: instalação, deploy, domínios e HTTPS, variáveis de ambiente, backup, segurança, agentes de IA e migração do Dokploy.',
    intro: 'Respostas diretas para as perguntas mais comuns. Cada uma aponta para a página que explica o assunto por completo. Não achou a sua? Veja o [glossário](/comece/glossario/) ou a [seção de operação](/operacao/seguranca-do-servidor/).',
    out: new URL('../src/content/docs/faq.mdx', import.meta.url),
  },
  en: {
    title: 'Frequently asked questions (FAQ)',
    description: 'Short answers to the most common questions about Rustploy: installation, deploys, domains and HTTPS, environment variables, backups, security, AI agents and migrating from Dokploy.',
    intro: 'Direct answers to the most common questions. Each one links to the page that covers the topic in full. Did not find yours? See the [glossary](/comece/glossario/) or the [operations section](/operacao/seguranca-do-servidor/).',
    out: new URL('../src/content/docs/en/faq.mdx', import.meta.url),
  },
};

for (const locale of ['pt', 'en']) {
  const t = T[locale];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale === 'pt' ? 'pt-BR' : 'en',
    mainEntity: sections.flatMap((s) =>
      s.items.map((item) => ({
        '@type': 'Question',
        name: item.q[locale],
        acceptedAnswer: { '@type': 'Answer', text: plainText(item.a[locale]) },
      })),
    ),
  };

  let body = '';
  for (const s of sections) {
    body += `## ${s.title[locale]}\n\n`;
    for (const item of s.items) {
      body += `### ${item.q[locale]}\n\n${withLocaleLinks(item.a[locale], locale)}\n\n`;
    }
  }

  const page = `---
title: ${JSON.stringify(t.title)}
description: ${JSON.stringify(t.description)}
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: ${JSON.stringify(JSON.stringify(jsonLd))}
---

${withLocaleLinks(t.intro, locale)}

${body}`;
  writeFileSync(t.out, page);
}
const n = sections.reduce((a, s) => a + s.items.length, 0);
console.log(`gen-faq: ${n} perguntas em pt e en`);
