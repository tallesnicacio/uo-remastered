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
- Server: `server/src/index.ts` carrega configs, exige login para chat/move, mapeia identidade/sessão por WebSocket, cria/restaura sessão (sessionId), responde welcome/pong/login/spawn/move; tick loop 20 t/s.
- Server protocolo: `server/src/protocol.ts` com parse/handler (hello/login/ping/chat/move), validação básica de payloads/posição, gate de login e criação/restauração de sessão; `sessionId` agora carrega `entityId` consistente e atualiza posição no move.
- Client: renderer Canvas com múltiplos layers e sprites procedurais (`client/src/renderer/canvas.ts`, `renderer/palette.ts`, `renderer/sprites.ts`); `client/src/index.ts` integra renderer, world state e input.
- Shared: constantes em `shared/constants/runtime.ts`; DTOs e tipos de posição em `shared/packets/messages.ts` e `shared/types/position.ts`.
- Rede cliente: `client/src/net/client.ts` implementa hello/login/ping/chat/move e callbacks.
- Estado cliente: `client/src/state/world.ts` mantém entidades, posição local e alvo para interpolação; renderer faz smoothing de movimento. Netcode faz reconciliação básica removendo pendentes e aplicando posição do servidor.
- Controles: clique direito move o player com câmera centrada; clique esquerdo reservado para interações futuras. Renderer converte coordenadas de tela para mundo.
- Seletor: clique esquerdo destaca tile/entidade e desenha retângulo de seleção.
- Inspeção: clique esquerdo mostra info básica (id/nome/pos) em overlay (`client/src/ui/overlay.ts`).
- Destino: clique direito marca destino com highlight circular.
- Pathfinding: caminho em linha reta (Bresenham) em `client/src/pathfinding.ts` usado para cliques de movimento; atualmente envia apenas destino final.
- Tooling: configs adicionadas `.eslintrc.cjs` e `.prettierrc` (deps já listadas em package.json).
- Desktop: alvo Electron via `desktop/main.cjs`; build do client copia `client/public/index.html` para `dist/client`. Scripts: `bun run build:client` e `bun run desktop:dev` (requer `electron` instalado).

## Próximos Passos Sugeridos
- Expandir autenticação/identidade (persistir sessions) e mapear entidade por WebSocket no servidor.
- Integrar render/anim com dados de rede (exibir múltiplas entidades, prever latência).
- Rodar lint/format/typecheck quando dependências estiverem instaladas.
- Empacotar desktop (Electron/Tauri) e melhorar pipeline de assets (layers/sombras/animações).
