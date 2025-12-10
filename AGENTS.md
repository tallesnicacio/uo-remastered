# Repository Guidelines

## Estrutura do Projeto
- Raiz gerenciada por Bun workspaces: `server/` (WebSocket + jogo), `client/` (renderer Canvas + UI), `shared/` (protocolos/tipos), `tools/` (scripts auxiliares). `ServUO/` é apenas referência histórica, não modifique.
- Server: configs em `server/config/*.json`; dados persistidos em `server/data/accounts.json` e `server/data/sessions.json`; colisão/mapa em `server/data/collision.json` e `server/config/map.json`.
- Client: código em `client/src/` (renderer, HUD, UI, networking); assets/dados em `client/data/`; HTML base em `client/public/`. Desktop usa `desktop/main.cjs` com Electron.
- Shared: contratos de rede em `shared/packets/*.ts`, constantes em `shared/constants`, tipos em `shared/types`.
- Arquivos de contexto: mantenha `STATUS.md`, `uoContext.md` e `PLANO_DESENVOLVIMENTO_NEWUO.md` atualizados a cada etapa relevante.

## Comandos de Build, Teste e Desenvolvimento
- Dev server: `bun run dev` (watch em `server/src/index.ts`). Dev client: `bun run dev:client`. Ambos: `bun run dev:both`.
- Build: `bun run build` (server para `dist/server`), `bun run build:client` (client browser). Desktop: `bun run desktop:dev` para testar, `bun run desktop:build` para empacotar (Linux x64).
- Lint/format/typecheck: `bun run lint`, `bun run format`, `bun run typecheck`. Testes: `bun test` (sem suites ainda).
- Runtime esperado: Bun 1.1+. Não use NodeJS como alvo principal.

## Estilo de Código e Convenções
- TypeScript em modo ESM. Prettier (`.prettierrc`): aspas duplas, tabWidth 2, ponto e vírgula. ESLint baseado em `@typescript-eslint` (ver `eslint.config.js`); `ServUO/**` e `dist/**` ignorados.
- Respeite aliases do `tsconfig.json` (`@shared/*`, `@server/*`, `@client/*`). Prefira funções puras nos módulos `shared/`.
- Nomes: PascalCase para tipos/classes, camelCase para funções/variáveis. Evite `any` (marcado como warn).

## Testes e Qualidade
- Ainda não há testes automatizados; valide manualmente executando server+client: verificar login, chat, ping, movimentação, combate, inventário, HUD e minimapa.
- Antes de abrir PR/commit, rode `bun run lint` e `bun run typecheck`. Se alterar protocolos, sincronize `shared/` e atualize cliente e servidor juntos.

## Commits e Pull Requests
- Commits curtos em imperativo (`feat:`, `fix:`, `chore:` opcionais). Sempre descreva impacto em rede/protocolo e arquivos de dados (`server/data/*.json`).
- PRs: inclua resumo, comandos rodados, screenshots/gifs para UI, e checklist de compatibilidade (client/server/desktop). Não suba segredos ou tokens.

## Dicas Rápidas de Desenvolvimento
- Novos assets/mapas: alinhe `client/data/map.json` e `server/data/collision.json`; mantenha múltiplos layers e tiles coerentes.
- Persistência: ao mexer em contas/sessões/roles, garanta migração dos arquivos em `server/data/`. Registros devem sobreviver a restart.
- Interações: siga mecânicas de clique direito (mover) e esquerdo (seleção/duplo clique para interação); setas continuam válidas.
