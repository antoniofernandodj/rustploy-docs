// Copia o manual do agente (fonte da verdade, servido pelo daemon) para uma
// página do site. Sem o repositório do daemon ao lado, mantém a cópia commitada.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const source = new URL('../../rustploy-daemon/crates/daemon/src/api/agent/manual.md', import.meta.url);
const target = new URL('../src/content/docs/agentes/manual.md', import.meta.url);

if (!existsSync(source)) {
  console.log('sync-manual: manual do daemon não encontrado, mantendo a cópia atual');
  process.exit(0);
}

const body = readFileSync(source, 'utf8').replace(/^# .*\n/, '');
const header = `---
title: Manual do agente (texto completo)
description: O manual que o daemon do Rustploy serve aos agentes de IA - login, MCP, ferramentas, rotas HTTP, protocolo de comandos e armadilhas. Mesmo texto de GET /api/agent/manual.
---

> Este é o texto que o daemon entrega ao agente no handshake do MCP, em
> \`GET /api/agent/manual\` e na ferramenta \`manual\`. Está escrito em segunda
> pessoa, para o agente.

`;
writeFileSync(target, header + body);
console.log('sync-manual: página do manual atualizada');
