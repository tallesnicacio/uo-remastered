# NewUO - Status e Contexto (atualizar sempre)

## Contexto Rápido
- Runtime: Bun (1.0+). Node.js não usado; `ServUO/` é só referência de configs/arquivos antigos.
- Estrutura: `client/`, `server/`, `shared/`, `tools/` (placeholder). Aliases em `tsconfig.json` (`@shared/*`, `@server/*`, `@client/*`).
- Config global: `bunfig.toml`, `.editorconfig`, `package.json` (workspaces).

## Comandos úteis (raiz)
- `bun run dev` — servidor com watch (`server/src/index.ts`).
- `bun run dev:client` — client placeholder com watch.
- `bun run dev:both` — server + client em paralelo.
- `bun run build` — build do servidor para `dist/server`.
- `bun run build:client` — build do client para `dist/client`.
- `bun test` — test runner do Bun (sem testes ainda).
- `bunx eslint .` / `bunx prettier --write .` / `bunx tsc --noEmit` — lint/format/typecheck (deps ainda não instaladas).

## Estado Atual
- Protocolos: `shared/packets/messages.ts` define mensagens hello/login/ping/chat/move; `shared/index.ts` exporta constantes e pacotes.
- Configs: exemplos em `server/config/server.json`, `players.json`, `combat.json`.
- Server: `server/src/index.ts` carrega configs, usa WebSocket Bun, responde welcome/pong/login/spawn/move, faz broadcast de chat; tick loop 20 t/s.
- Server protocolo: `server/src/protocol.ts` com parse/handler (hello/login/ping/chat/move), validação básica de payloads e posição, e callbacks para identidades.
- Client: bootstrap mínimo em `client/src/index.ts` que escreve um banner em DOM.
- Shared: constantes em `shared/constants/runtime.ts`; DTOs e tipos de posição em `shared/packets/messages.ts` e `shared/types/position.ts`.

## Próximos Passos Sugeridos
- Expandir autenticação/identidade (persistir sessions) e mapear entidade por WebSocket no servidor.
- Escolher stack de renderização do client (Canvas/Pixi) e montar pipeline de assets.
- Adicionar ESLint/Prettier/TS config específicos se necessário.
