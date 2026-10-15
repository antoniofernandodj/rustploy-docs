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
      locales: { root: { label: 'Português', lang: 'pt-BR' } },
      customCss: ['./src/styles/custom.css'],
      editLink: { baseUrl: 'https://github.com/antoniofernandodj/rustploy/edit/main/rustploy-docs/' },
      lastUpdated: true,
      head: [
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
        { label: 'Comece aqui', items: [
          { slug: 'comece/o-que-e' },
          { slug: 'comece/docker-para-rustploy' },
          { slug: 'comece/glossario' },
        ]},
        { label: 'Instalação', items: [
          { slug: 'instalacao/requisitos' },
          { slug: 'instalacao/instalar-daemon' },
          { slug: 'instalacao/instalar-clientes' },
          { slug: 'instalacao/primeiro-acesso' },
          { slug: 'instalacao/config-toml' },
          { slug: 'instalacao/atualizar' },
        ]},
        { label: 'Tutorial', items: [
          { slug: 'tutorial/primeiro-deploy' },
        ]},
        { label: 'Guias', items: [
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
          { slug: 'guias/registry' },
          { slug: 'guias/limpeza-docker' },
          { slug: 'guias/backup' },
        ]},
        { label: 'Conceitos', items: [
          { slug: 'conceitos/projeto' },
          { slug: 'conceitos/servico-e-fontes' },
          { slug: 'conceitos/rede-e-nomes' },
          { slug: 'conceitos/ciclo-de-vida' },
        ]},
        { label: 'Agentes de IA (MCP)', items: [
          { slug: 'agentes/visao-geral' },
          { slug: 'agentes/conectar-claude-code' },
          { slug: 'agentes/ferramentas' },
          { slug: 'agentes/receitas' },
          { slug: 'agentes/seguranca' },
          { slug: 'agentes/manual' },
        ]},
      ],
      plugins: [
        starlightLlmsTxt({
          projectName: 'Rustploy',
          description:
            'Rustploy é um PaaS self-hosted de nó único em Rust: projetos, serviços em container, deploy zero-downtime, ingress com TLS (ACME), registry OCI embutido, jobs agendados, GUI desktop, web UI e servidor MCP.',
        }),
      ],
    }),
  ],
});
