import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';

// O domínio ainda não foi definido: SITE_URL sobrescreve o placeholder no build.
const site = process.env.SITE_URL ?? 'https://docs.rustploy.example';

export default defineConfig({
  site,
  integrations: [
    starlight({
      title: 'Rustploy',
      description:
        'Documentação do Rustploy: PaaS self-hosted em Rust, um binário só, sobre Docker. Instalação, deploy, domínios, TLS, jobs, registry e MCP para agentes de IA.',
      defaultLocale: 'root',
      locales: {
        root: { label: 'Português', lang: 'pt-BR' },
        en: { label: 'English', lang: 'en' },
      },
      logo: { src: './src/assets/logo.svg', alt: 'Rustploy' },
      customCss: ['./src/styles/custom.css'],
      editLink: { baseUrl: 'https://github.com/antoniofernandodj/rustploy/edit/main/rustploy-docs/' },
      lastUpdated: true,
      head: [
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          content: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Rustploy',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Linux',
            description:
              'PaaS self-hosted de nó único, escrito em Rust, que faz deploy de containers Docker com zero-downtime, proxy reverso e TLS embutidos.',
            codeRepository: 'https://github.com/antoniofernandodj/rustploy',
          }),
        },
      ],
      sidebar: [
        { label: 'Comece aqui', translations: { en: 'Start here' }, items: [
          { slug: 'comece/o-que-e' },
          { slug: 'comece/docker-para-rustploy' },
          { slug: 'comece/glossario' },
        ]},
        { label: 'Instalação', translations: { en: 'Installation' }, items: [
          { slug: 'instalacao/requisitos' },
          { slug: 'instalacao/instalacao-rapida' },
          { slug: 'instalacao/instalar-daemon' },
          { slug: 'instalacao/instalar-clientes' },
          { slug: 'instalacao/primeiro-acesso' },
          { slug: 'instalacao/config-toml' },
          { slug: 'instalacao/atualizar' },
        ]},
        { label: 'Tutorial', translations: { en: 'Tutorial' }, items: [
          { slug: 'tutorial/primeiro-deploy' },
        ]},
        { label: 'Conceitos', translations: { en: 'Concepts' }, items: [
          { slug: 'conceitos/projeto' },
          { slug: 'conceitos/servico-e-fontes' },
          { slug: 'conceitos/rede-e-nomes' },
          { slug: 'conceitos/variaveis-de-ambiente' },
          { slug: 'conceitos/ciclo-de-vida' },
        ]},
        { label: 'Interface desktop', translations: { en: 'Desktop app' }, items: [
          { slug: 'interface/visao-geral' },
          { slug: 'interface/web-ui' },
          { slug: 'interface/entrar' },
          { slug: 'interface/projetos' },
          { slug: 'interface/novo-servico' },
          { slug: 'interface/servico' },
          { slug: 'interface/servico-configuracao' },
          { slug: 'interface/em-execucao' },
          { slug: 'interface/deploy-engine' },
          { slug: 'interface/ingress' },
          { slug: 'interface/schedules' },
          { slug: 'interface/monitoring' },
          { slug: 'interface/logs' },
          { slug: 'interface/docker-e-registry' },
          { slug: 'interface/configuracoes' },
        ]},
        { label: 'Guias', translations: { en: 'Guides' }, items: [
          { slug: 'guias/git' },
          { slug: 'guias/zip' },
          { slug: 'guias/compose' },
          { slug: 'guias/variaveis-e-secrets' },
          { slug: 'guias/healthcheck' },
          { slug: 'guias/dominios-e-tls' },
          { slug: 'guias/diagnosticar-502' },
          { slug: 'guias/webhooks' },
          { slug: 'guias/fila-de-deploys' },
          { slug: 'guias/pre-deploy' },
          { slug: 'guias/jobs' },
          { slug: 'guias/bancos-e-brokers' },
          { slug: 'guias/templates' },
          { slug: 'guias/banco-compartilhado' },
          { slug: 'guias/migrar-banco' },
          { slug: 'guias/infra-as-code' },
          { slug: 'guias/copiar-servico' },
          { slug: 'guias/registry' },
          { slug: 'guias/limpeza-docker' },
          { slug: 'guias/backup' },
        ]},
        { label: 'Agentes de IA (MCP)', translations: { en: 'AI agents (MCP)' }, items: [
          { slug: 'agentes/visao-geral' },
          { slug: 'agentes/conectar-claude-code' },
          { slug: 'agentes/ferramentas' },
          { slug: 'agentes/receitas' },
          { slug: 'agentes/seguranca' },
          { slug: 'agentes/manual' },
        ]},
        { label: 'Operação', translations: { en: 'Operations' }, items: [
          { slug: 'operacao/monitoramento-e-saude' },
          { slug: 'operacao/seguranca-do-servidor' },
        ]},
        { label: 'Migração', translations: { en: 'Migration' }, items: [
          { slug: 'migracao/dokploy' },
        ]},
        { label: 'Comparativos', translations: { en: 'Comparisons' }, items: [
          { slug: 'comparativos/visao-geral' },
          { slug: 'comparativos/rustploy-vs-dokploy' },
          { slug: 'comparativos/rustploy-vs-coolify' },
          { slug: 'comparativos/rustploy-vs-caprover' },
        ]},
        { label: 'Referência', translations: { en: 'Reference' }, items: [
          { slug: 'referencia/manifesto' },
          { slug: 'referencia/api-http' },
          { slug: 'referencia/comandos' },
          { slug: 'referencia/respostas' },
          { slug: 'referencia/eventos' },
          { slug: 'referencia/paridade' },
          { slug: 'templates' },
        ]},
        { slug: 'faq' },
      ],
      plugins: [
        starlightLlmsTxt({
          projectName: 'Rustploy',
          // As ~386 páginas de template ficam fora do llms-full.txt (afogariam o
          // resto) e formam um conjunto próprio em /_llms-txt/templates.txt.
          exclude: ['templates/**'],
          customSets: [
            { label: 'Templates', paths: ['templates/**'], description: 'Catálogo de aplicações prontas, com containers, imagens, porta e variáveis de cada uma' },
          ],
          description:
            'Rustploy é um PaaS self-hosted de nó único em Rust: projetos, serviços em container, deploy zero-downtime, ingress com TLS (ACME), registry OCI embutido, jobs agendados, GUI desktop, web UI e servidor MCP.',
        }),
      ],
    }),
  ],
});
