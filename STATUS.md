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
- Pathfinding: A* simples em `client/src/pathfinding.ts` (grid, 4 direções) usando função `isWalkable`; obstáculos demo em `client/src/data/obstacles.ts` renderizados como blocos.
- Snapshots: servidor mantém mapa de entidades e envia snapshot periódico (1s); cliente aplica snapshot via `NetClient.onSnapshot` e `World.applySnapshot`.
- Colisão servidor: mapa `server/data/collision.json`; servidor bloqueia movimentos em tiles ocupados e retorna erro `blocked_tile`.
- Cliente exibe erros de server (ex.: `blocked_tile`) no overlay.
- Cliente valida caminho; se inalcançável ou bloqueado, não move localmente e limpa destino ao receber erro.
- Overlay agora possui tooltip e detalhes simulados no clique esquerdo.
- Login broadcast: servidor envia login_ok e spawn para todos (via broadcast do login message).
- Renderer: animação só avança quando há movimento; sombras sob os sprites; tooltip mostra distância ao alvo.
- Despawn: servidor envia `despawn` ao desconectar; cliente remove entidade ao receber.
- Chat: input simples em `client/src/ui/chat.ts`; mensagens aparecem no overlay.
- Ping: `onPong` mostra latência no overlay.
- Logging: servidor loga conexões/login/desconexão; validação extra para moves inválidos. Overlay agora mantém histórico recente de mensagens.
- Status UI: overlay mostra ping/conexão e aceita `/ping` no chat para round-trip rápido.
- Movimento: clique direito agora enfileira todo o caminho A* e envia passos sequenciais a cada 150ms; fila limpa ao receber erro de bloqueio.
- Snapshot limpa fila local se player não for encontrado; overlay loga cada passo enviado.
- Map bounds: server e client validam limites (20x12) e bloqueiam destino fora do mapa.
- Status mostra contagem de entidades do último snapshot e tamanho da fila de passos.
- Chat server: comando `/who` retorna contagem e nomes online.
- Server mantém mapa de entidades em memória para sessões e movimentos (ainda sem broadcast de snapshot).
- Tooling: configs adicionadas `.eslintrc.cjs` e `.prettierrc` (deps já listadas em package.json).
- Desktop: alvo Electron via `desktop/main.cjs`; build do client copia `client/public/index.html` para `dist/client`. Scripts: `bun run build:client` e `bun run desktop:dev` (requer `electron` instalado).

## Próximos Passos Sugeridos
- Expandir autenticação/identidade (persistir sessions) e mapear entidade por WebSocket no servidor.
- Integrar render/anim com dados de rede (exibir múltiplas entidades, prever latência).
- Rodar lint/format/typecheck quando dependências estiverem instaladas.
- Empacotar desktop (Electron/Tauri) e melhorar pipeline de assets (layers/sombras/animações).
