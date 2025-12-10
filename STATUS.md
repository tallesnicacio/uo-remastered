# NewUO - Status e Contexto (atualizar sempre)

## Contexto Rápido
- Runtime: Bun (1.0+). Node.js não usado; `ServUO/` é só referência de configs/arquivos antigos.
- Estrutura: `client/`, `server/`, `shared/`, `tools/` (placeholder). Aliases em `tsconfig.json` (`@shared/*`, `@server/*`, `@client/*`).
- Config global: `bunfig.toml`, `.editorconfig`, `package.json` (workspaces).

## Comandos úteis (raiz)
- `bun run dev` — servidor com watch (`server/src/index.ts`).
- `bun run dev:client` — client com watch (`client/src/index.ts`).
- `bun run dev:both` — server + client em paralelo.
- `bun run build` — build do servidor para `dist/server`.
- `bun run build:client` — build do client para `dist/client`.
- `bun run desktop:dev` — abre client via Electron (desktop).
- `bun test` — sem suites ainda, retorna “No tests found”.
- `bunx eslint .` / `bunx prettier --write .` / `bunx tsc --noEmit` — lint/format/typecheck (deps ainda não instaladas).

## Estado Atual
- Protocolos: `shared/packets/messages.ts` cobre hello/login/ping/chat/move/target/attack/inventory/role/kill/save/respawn/damage; tipos compartilhados em `shared/types`.
- Server: WebSocket Bun com validação de colisão/mapa, comandos `/who` `/ping` `/kill` (restrito) `/role` (Owner/Admin) `/give`, `/save`, `/respawn`, `/attack`; regen de HP/Mana/Stamina; persistência de contas/sessões em disco (`server/data/*.json`); roles Owner/Admin/GM/Player.
- Client: canvas com tiles texturizados, múltiplos layers, sprites do avatar com sombra; câmera centrada no player; HUD gump (HP/Mana/Stamina/EXP/role/retrato), painel de ações, overlay/log, chat, inventário simples.
- Movimento: botão direito segurado move e corre/anda conforme distância; fila de passos A* com reconciliação; setas movem; erro de colisão limpa fila/destino. Esquerdo seleciona alvo; duplo clique interage/ataca. Destino marcado no mapa e minimapa.
- Minimap: círculo estilizado com bússola, terreno/bloqueios renderizados, marcador de player/entidades e destino.
- Rede cliente: login com nome/senha (default 1234), prevenção de reconexão duplicada, snapshots periódicos com reconciliação, eventos de dano/inventory/target ack/despawn.
- Desktop: `bun run desktop:dev` abre Electron usando build do client; `desktop:build` gera pacote Linux x64.

## Próximos Passos Sugeridos
 - Completar pipeline de assets (animações, layers extras, novos tilesets) e mapa maior.
 - Polir UI (gumps adicionais, chat/inventário mais ricos) e adicionar minimapa com zoom/pan.
 - Testes automatizados básicos (protocolos e validação de colisão) para estabilizar mudanças.
 - Fortalecer auth (hash de senha, bans, rate-limit) e logs persistentes.
