# NewUO (Ultima Remastered)

## Visão Geral
Remaster inspirado em Ultima Online, focado em jogabilidade top-down com movimentação por mouse, combate leve e UI estilo gump. Runtime alvo: **Bun 1.1+** (Node não é necessário). A pasta `ServUO/` é apenas referência histórica de configs do jogo original.

## Estrutura
- `client/`: renderer Canvas, UI (HUD, minimapa, chat, inventário), rede WebSocket.
- `server/`: WebSocket server (login, ping, chat, target, attack, kill, role, give, save, respawn), validação de colisão/mapa e persistência em `server/data/*.json`.
- `shared/`: contratos e tipos de rede (`shared/packets`, `shared/types`).
- `desktop/`: bootstrap Electron para build desktop.  
Aliases TS: `@client/*`, `@server/*`, `@shared/*`.

## Como Rodar
```bash
# instalar deps (apenas Bun)
bun install

# servidor (watch)
bun run dev

# client em dev (watch no TS; para UI use desktop)
bun run dev:client

# UI desktop (gera build do client e abre Electron)
bun run desktop:dev

# builds
bun run build           # server -> dist/server
bun run build:client    # client -> dist/client
```

## Controles
- Botão direito (segurar): move em direção ao cursor; perto = andar, longe = correr. Soltar ou clique esquerdo para parar.
- Setas: movimento básico.
- Botão esquerdo (clique): seleciona alvo/terreno.
- Botão esquerdo (duplo clique): interage/ataca alvo.
- Chat: `/ping`, `/who`, `/save`, `/respawn`, `/kill <id>` (restrito), `/role <nome> <Role>` (Owner/Admin), `/give <nome> <item> [qty]` (GM+).

## Recursos Atuais
- HUD com HP/Mana/Stamina/EXP/role e retrato; painel de ações estilo gump.
- Minimapa circular com bússola, terreno/bloqueios, entidades e destino.
- Tiles texturizados (grama/areia/água/pedra), avatar com sombra, highlight de destino/erro.
- Regen de stats, combate básico com dano e pacote `damage`, inventário simples.
- Persistência: contas/roles em `server/data/accounts.json`, sessões em `server/data/sessions.json`.

## Notas de Desenvolvimento
- Atualize `STATUS.md` e `uoContext.md` a cada etapa para transferência entre agentes.
- Rode `bun run typecheck` e `bun run lint` antes de commits (quando as deps estiverem instaladas).
- Não commitar segredos; mantenha arquivos `server/data/*.json` consistentes se alterar roles/contas.
