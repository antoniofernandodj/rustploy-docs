# rustploy-docs

Site de documentação do Rustploy (Astro + Starlight, SSG). O plano completo
está em `../docs/plano-site-documentacao.md`.

```bash
nvm use            # Node 22.12+ (o .nvmrc pede 24)
npm install
npm run dev        # http://localhost:4321
npm run build      # gera dist/ (HTML estático, sitemap, llms.txt, índice Pagefind)
```

- O domínio ainda não foi decidido: `SITE_URL=https://… npm run build` define o
  canonical e o sitemap. Troque também o `Sitemap:` de `public/robots.txt`.
- Corpo em 15 px, tema e fontes em `src/styles/custom.css`.
- Conteúdo em `src/content/docs/` (`.mdx`), um diretório por trilha; a barra
  lateral é declarada em `astro.config.mjs`.

## Páginas geradas do código

`npm run build` roda antes o `npm run gen`, que regenera:

| Script | Lê | Gera |
|---|---|---|
| `scripts/sync-manual.mjs` | `rustploy-daemon/.../agent/manual.md` | `agentes/manual.md` |
| `scripts/gen-templates.mjs` | `rustploy-shared/templates/blueprints/` e `docs/services.md` | uma página por template em `templates/` |
| `scripts/gen-protocol.mjs` | `rustploy-shared/src/protocol.rs` e `docs/indice/comandos.md` | `referencia/{comandos,respostas,eventos,paridade}.md` |

Sem o agregador ao lado (clone só deste repo) os scripts não fazem nada e o build
usa as páginas já commitadas. **Não edite essas páginas à mão.**
