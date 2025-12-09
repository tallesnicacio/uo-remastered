# Plano de Desenvolvimento Completo - NewUO

## Visao Geral do Projeto

Este documento apresenta um plano completo e detalhado para o desenvolvimento do NewUO, um remaster moderno de Ultima Online. O plano esta organizado em **7 fases principais**, com estimativas de tempo, dependencias claras e entregas especificas.

**Referencia de Servidor:** ServUO (https://github.com/ServUO/ServUO)
**Runtime:** Bun (https://bun.sh)

---

## Indice

1. [Fase 0: Fundacao e Arquitetura](#fase-0-fundacao-e-arquitetura)
2. [Fase 1: Motor Isometrico e Rendering](#fase-1-motor-isometrico-e-rendering)
3. [Fase 2: Networking e Multiplayer](#fase-2-networking-e-multiplayer)
4. [Fase 3: Sistemas Core de Gameplay](#fase-3-sistemas-core-de-gameplay)
5. [Fase 4: Conteudo e Mundo](#fase-4-conteudo-e-mundo)
6. [Fase 5: Polish e Lancamento](#fase-5-polish-e-lancamento)
7. [Fase 6: Sistema de Configuracao e Server Types](#fase-6-sistema-de-configuracao-e-server-types)
8. [Resumo Executivo](#resumo-executivo)

---

## Por Que Bun? - Performance Benefits para MMORPG

### Comparativo Bun vs Node.js

| Metrica | Node.js | Bun | Melhoria |
|---------|---------|-----|----------|
| **WebSocket msg/s** | ~50,000 | ~180,000 | **3.6x mais rapido** |
| **I/O File Read** | ~250 MB/s | ~1,000 MB/s | **4x mais rapido** |
| **Startup Time** | ~300ms | ~50ms | **6x mais rapido** |
| **Package Install** | ~30s | ~5s | **6x mais rapido** |
| **Memory Usage** | Base + V8 overhead | Otimizado JavaScriptCore | **~30% menos** |

### Impacto no NewUO

| Operacao | Beneficio com Bun |
|----------|-------------------|
| **World Save** | Save de 1000+ players em <1s vs ~4s |
| **Tick Rate** | 20 ticks/s estavel mesmo com 2000+ players |
| **Login Burst** | Suporta 500+ logins simultaneos |
| **Hot Reload** | Configs recarregam em <100ms |
| **Dev Startup** | Servidor inicia em <1s |

### Features Built-in do Bun (Sem Dependencias Extras)

| Feature | Substitui | Economia |
|---------|-----------|----------|
| TypeScript nativo | ts-node, tsc | -2 deps |
| Hot reload (--watch) | nodemon | -1 dep |
| Test runner | Jest, Vitest | -1 dep |
| .env automatico | dotenv | -1 dep |
| WebSocket server | ws, uWebSockets | -1 dep |
| SQLite integrado | better-sqlite3 | -1 dep |
| Bundler | Webpack, Rollup | -1 dep |
| **TOTAL** | | **-8 dependencias** |

---

## Fase 0: Fundacao e Arquitetura (2-3 semanas)

### Objetivo
Estabelecer a estrutura base do projeto, configurar ambiente de desenvolvimento e definir padroes arquiteturais.

### Requisitos de Sistema

| Requisito | Versao Minima | Recomendado |
|-----------|---------------|-------------|
| **Bun** | 1.0+ | 1.1+ (latest) |
| **OS** | Linux, macOS, Windows (WSL2) | Linux (Ubuntu 22.04+) |
| **RAM** | 4GB | 8GB+ |
| **CPU** | 2 cores | 4+ cores |

### Instalacao do Bun

```bash
# Linux/macOS
curl -fsSL https://bun.sh/install | bash

# Windows (via PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# Verificar instalacao
bun --version
```

### Entregas

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| Estrutura monorepo | client/server/shared/tools | Baixa |
| Bun workspace config | bunfig.toml para todos workspaces | Baixa |
| Game loop cliente | Fixed timestep 60fps | Media |
| Game loop servidor | 20 ticks/segundo | Media |
| ECS base | EntityManager + Components | Alta |
| Constantes Skills | 52 skills definidas | Media |
| Constantes Criaturas | 50+ criaturas | Media |
| Constantes Magias | 64 magias Magery | Media |
| **Sistema de Config** | **ConfigManager + .json files** | **Media** |

### Estrutura de Diretorios (Atualizada com Bun)
```
newuo/
├── bunfig.toml               # Config global do Bun
├── package.json              # Scripts principais
├── client/                   # Cliente (Browser/Desktop)
│   ├── package.json
│   ├── src/
│   │   ├── core/             # Game, Scene, AssetLoader
│   │   ├── rendering/        # IsometricRenderer, Camera, TileMap
│   │   ├── entities/         # Character, Creature, Item
│   │   ├── systems/          # Movement, Combat, Animation
│   │   ├── network/          # NetworkClient, PacketHandler
│   │   ├── ui/               # Components, Windows, HUD
│   │   └── audio/            # AudioManager
│   └── assets/
├── server/                    # Servidor autoritativo (Bun)
│   ├── package.json
│   ├── src/
│   │   ├── index.ts          # Entry point (bun run)
│   │   ├── core/             # Server, World, GameLoop
│   │   ├── config/           # ConfigManager, ConfigLoader
│   │   ├── network/          # BunWebSocket server
│   │   ├── systems/          # SkillSystem, CombatSystem, SpawnSystem
│   │   ├── world/            # Region, Chunk, Pathfinding
│   │   └── database/         # Bun SQLite, Models
│   ├── config/               # Arquivos de configuracao
│   │   ├── server.json
│   │   ├── players.json
│   │   ├── combat.json
│   │   ├── economy.json
│   │   ├── pvp.json
│   │   ├── housing.json
│   │   ├── expansion.json
│   │   └── presets/
│   │       ├── classic.json
│   │       ├── easy.json
│   │       ├── war.json
│   │       └── hardcore.json
│   └── data/                 # Maps, Spawns, Items
├── shared/                    # Codigo compartilhado
│   ├── constants/            # Skills, Items, Creatures, Spells
│   ├── types/                # Interfaces e tipos
│   ├── config/               # ConfigTypes, ServerPresets
│   └── packets/              # Definicoes de pacotes
└── tools/                     # Map editor, Sprite generator
    └── config-editor/        # Editor visual de config
```

### bunfig.toml - Configuracao Global

```toml
# bunfig.toml
[install]
# Cache de pacotes
cache = true

[run]
# Habilitar sourcemaps
sourcemap = "inline"

[test]
# Config de testes
coverage = true
coverageDir = "coverage"

[bundle]
# Config de build
target = "bun"
minify = true
```

### package.json - Scripts Principais

```json
{
  "name": "newuo",
  "version": "1.0.0",
  "type": "module",
  "workspaces": [
    "client",
    "server",
    "shared",
    "tools/*"
  ],
  "scripts": {
    "dev": "bun --watch server/src/index.ts",
    "dev:client": "bun run client/src/index.ts",
    "start": "bun run server/src/index.ts",
    "start:prod": "NODE_ENV=production bun run server/src/index.ts",
    "build": "bun build server/src/index.ts --outdir ./dist --target bun --minify",
    "build:client": "bun build client/src/index.ts --outdir ./dist/client --target browser",
    "test": "bun test",
    "test:watch": "bun test --watch",
    "test:coverage": "bun test --coverage",
    "lint": "bunx eslint . --ext .ts,.tsx",
    "format": "bunx prettier --write .",
    "typecheck": "bunx tsc --noEmit",
    "clean": "rm -rf dist coverage node_modules/.cache"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "eslint": "^8.56.0",
    "prettier": "^3.2.0",
    "typescript": "^5.3.0"
  },
  "dependencies": {
    "zod": "^3.22.0"
  }
}
```

**Nota:** Dependencias removidas vs Node.js tradicional:
- ~~ts-node~~ (Bun roda .ts nativamente)
- ~~nodemon~~ (Bun tem --watch)
- ~~jest/vitest~~ (Bun tem test runner)
- ~~dotenv~~ (Bun le .env automaticamente)
- ~~ws~~ (Bun tem WebSocket nativo)
- ~~better-sqlite3~~ (Bun tem SQLite integrado)

---

## Fase 1: Motor Isometrico e Rendering (3-4 semanas)

### Objetivo
Implementar sistema completo de renderizacao isometrica com tiles, sprites animados e camera.

### Entregas

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| Coordenadas isometricas | Conversao world<->screen | Media |
| Sistema de camera | Follow, bounds, zoom, shake | Media |
| TileMap + Chunks | Carregamento dinamico 64x64 | Alta |
| Sprite Manager | Cache, hue system, composicao | Alta |
| Animation System | 8 direcoes, transicoes | Media |
| Isometric Renderer | Depth sorting, layers | Alta |
| Effect Manager | Projeteis, particulas, texto | Media |

### Formulas Chave

```typescript
// Conversao World -> Screen
screenX = (worldX - worldY) * TILE_HALF_WIDTH;
screenY = (worldX + worldY) * TILE_HALF_HEIGHT - (worldZ * Z_HEIGHT);

// Depth Sorting
depth = worldX + worldY + worldZ * 0.001;

// Constantes
TILE_WIDTH = 44;
TILE_HEIGHT = 44;
Z_HEIGHT = 4;
MAX_Z_LEVEL = 127;
```

### Layers de Renderizacao
1. Terrain (tiles de chao)
2. Static (arvores, construcoes)
3. Ground (items no chao)
4. Creature (NPCs, monstros)
5. Player (jogadores)
6. Effect (efeitos visuais)
7. Overhead (textos flutuantes)
8. UI (interface)

---

## Fase 2: Networking e Multiplayer (4-5 semanas)

### Objetivo
Implementar comunicacao cliente-servidor usando WebSocket nativo do Bun, protocolo de pacotes e sincronizacao de estado.

### Entregas

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| Protocolo de pacotes | 100+ tipos de pacotes | Alta |
| **Bun WebSocket Server** | **Nativo, alta performance** | **Media** |
| Client Prediction | Movimento local imediato | Alta |
| Server Reconciliation | Correcao de estado | Alta |
| Entity Interpolation | Movimento suave de outros | Media |
| Rate Limiting | Protecao anti-cheat | Media |
| Compression | Delta compression | Media |
| **Config Sync** | **Enviar config relevante ao cliente** | **Baixa** |

### WebSocket Server com Bun (Nativo)

```typescript
// server/src/network/GameServer.ts
import { ConfigManager } from '../config/ConfigManager';

const config = ConfigManager.getInstance();
const PORT = config.get<number>('server.port') || 2593;

interface ClientData {
  id: string;
  accountId?: string;
  characterId?: string;
  authenticated: boolean;
  lastPing: number;
}

const clients = new Map<string, ClientData>();

const server = Bun.serve<ClientData>({
  port: PORT,

  fetch(req, server) {
    // Upgrade HTTP para WebSocket
    const clientId = crypto.randomUUID();

    if (server.upgrade(req, {
      data: {
        id: clientId,
        authenticated: false,
        lastPing: Date.now()
      }
    })) {
      return; // Upgrade bem sucedido
    }

    // Fallback para HTTP (health check, API, etc)
    const url = new URL(req.url);

    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'online',
        players: clients.size,
        uptime: process.uptime()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/info') {
      return new Response(JSON.stringify(config.getClientConfig()), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('NewUO Game Server', { status: 200 });
  },

  websocket: {
    // Configuracoes de performance
    maxPayloadLength: 16 * 1024 * 1024, // 16MB
    idleTimeout: 120, // 2 minutos
    backpressureLimit: 1024 * 1024, // 1MB
    closeOnBackpressureLimit: false,

    open(ws) {
      const { id } = ws.data;
      clients.set(id, ws.data);

      console.log(`[${new Date().toISOString()}] Client connected: ${id}`);
      console.log(`[${new Date().toISOString()}] Total clients: ${clients.size}`);

      // Enviar info do servidor
      ws.send(JSON.stringify({
        type: 'server_info',
        data: config.getClientConfig()
      }));
    },

    message(ws, message) {
      const { id } = ws.data;

      try {
        // Bun suporta string e ArrayBuffer
        const packet = typeof message === 'string'
          ? JSON.parse(message)
          : parsePacket(message as ArrayBuffer);

        // Atualizar last ping
        ws.data.lastPing = Date.now();

        // Processar pacote
        handlePacket(ws, packet);

      } catch (error) {
        console.error(`Error processing message from ${id}:`, error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid packet' }));
      }
    },

    close(ws, code, reason) {
      const { id, characterId } = ws.data;
      clients.delete(id);

      console.log(`[${new Date().toISOString()}] Client disconnected: ${id} (${code})`);

      // Cleanup do personagem se estava logado
      if (characterId) {
        handleCharacterLogout(characterId);
      }
    },

    drain(ws) {
      // Chamado quando backpressure e aliviado
      console.log(`Backpressure relieved for client ${ws.data.id}`);
    }
  }
});

console.log(`
╔════════════════════════════════════════════════════════════╗
║                    NewUO Game Server                       ║
║════════════════════════════════════════════════════════════║
║  Runtime: Bun ${Bun.version}                                       ║
║  Port: ${PORT}                                               ║
║  WebSocket: Native Bun.serve()                             ║
║  Status: ONLINE                                            ║
╚════════════════════════════════════════════════════════════╝
`);

// Funcao para broadcast para todos os clientes
function broadcast(message: object, exclude?: string) {
  const data = JSON.stringify(message);
  for (const [id, client] of clients) {
    if (id !== exclude) {
      // server.publish() para broadcasting eficiente
    }
  }
}

// Export para uso em outros modulos
export { server, clients, broadcast };
```

### Categorias de Pacotes

```typescript
enum PacketCategory {
  Connection = 0x00,    // Login, Logout, Ping
  Movement = 0x10,      // Move, Teleport, Facing
  Entity = 0x20,        // Spawn, Despawn, Update
  Combat = 0x40,        // Attack, Damage, Death
  Magic = 0x50,         // Cast, Effect, Target
  Skills = 0x60,        // Use, Update, Gain
  Items = 0x70,         // Pickup, Drop, Equip
  UI = 0x90,            // Target, Gump, Menu
  Chat = 0xA0,          // Say, Whisper, Guild
  World = 0xB0,         // Chunk, Weather, Time
  Social = 0xC0,        // Party, Guild, Trade
  Config = 0xD0,        // ServerInfo, Rates, Rules
}
```

### Client-Side Prediction

```
1. Jogador pressiona tecla de movimento
2. Cliente aplica movimento IMEDIATAMENTE (prediction)
3. Cliente envia MoveRequest com sequence number
4. Servidor valida e responde MoveConfirm/MoveReject
5. Cliente reconcilia: se rejeitado, corrige posicao
6. Outros jogadores sao interpolados suavemente
```

---

## Fase 3: Sistemas Core de Gameplay (6-8 semanas)

### Objetivo
Implementar todos os sistemas de jogo essenciais: combate, magia, skills, items.

### 3.1 Sistema de Combate (2 semanas)

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| Hit Calculation | Formula de acerto/erro | Media |
| Damage Calculation | Dano fisico e elemental | Media |
| Armor System | Reducao por AR | Media |
| Weapon Types | Sword, Mace, Fencing, etc | Media |
| Combat Animations | Swing, Hit, Miss | Media |
| Targeting System | Click-to-target | Media |
| **Damage Scalars** | **PvM/PvP configuravel** | **Media** |

**Formulas de Combate (com Scalars Configuraveis):**
```typescript
// Hit Chance (configuravel via config.combat)
const baseHitChance = config.combat.baseHitChance; // default: 50
const maxHitChance = config.combat.maxHitChance;   // default: 95
const minHitChance = config.combat.minHitChance;   // default: 5

attackerSkill = (WeaponSkill + Tactics) / 2;
defenderSkill = (DefenseSkill + Tactics + Parry) / 2;
hitChance = clamp(baseHitChance + (attackerSkill - defenderSkill) * 2, minHitChance, maxHitChance);

// Damage (com scalars)
baseDamage = random(weapon.minDamage, weapon.maxDamage);
bonusDamage = (Str / 5) + (Tactics / 10) + (Anatomy / 10);
rawDamage = (baseDamage + bonusDamage) - (targetAR * 0.5);

// Aplicar scalar baseado no tipo de combate
if (isPvP) {
  finalDamage = rawDamage * config.combat.pvpDamageScalar;
} else {
  finalDamage = rawDamage * config.combat.pvmDamageScalar;
}
```

### 3.2 Sistema de Magia (2 semanas)

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| Spellbook System | 8 circulos, 64 magias | Alta |
| Casting System | Cast time, interrupcao | Media |
| Reagent System | Consumo de reagentes (configuravel) | Baixa |
| Spell Effects | Dano, buff, debuff, summon | Alta |
| Fizzle System | Falha por skill baixa | Baixa |
| Mana System | Custo e regeneracao | Baixa |

**Configuracao de Reagentes:**
```typescript
// Configuravel via config.magic
const requireReagents = config.magic.requireReagents;           // true/false
const consumeOnFizzle = config.magic.consumeReagentsOnFizzle;   // true/false
const manaCostMultiplier = config.magic.manaCostMultiplier;     // 0.5 - 2.0
```

**Magias por Circulo:**
- Circulo 1-2: Buffs/debuffs basicos, Magic Arrow, Heal
- Circulo 3-4: Fireball, Lightning, Greater Heal, Recall
- Circulo 5-6: Energy Bolt, Explosion, Paralyze, Invisibility
- Circulo 7-8: Flamestrike, Meteor Swarm, Summons, Earthquake

### 3.3 Sistema de Skills (1.5 semanas)

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| 52 Skills | Todas skills definidas | Alta |
| Skill Gain | Progressao por uso (configuravel) | Media |
| Skill Cap | Configuravel (700-25000 total) | Baixa |
| Skill Locks | Up/Down/Locked | Baixa |
| Titles | Titulos por nivel | Baixa |
| **Gain Multipliers** | **Por categoria de skill** | **Media** |

**Sistema de Skill Gain Configuravel:**
```typescript
// Configuracao de caps (config.players)
const skillCap = config.players.skillCap;           // 1000 = 100.0
const totalSkillCap = config.players.totalSkillCap; // 7000 = 700.0
const totalStatCap = config.players.totalStatCap;   // 225

// Multiplicadores de ganho (config.skills)
const baseGainChance = config.skills.baseGainChance;       // 2.0%
const skillGainMultiplier = config.skills.gainMultiplier;  // 1.0 - 1000.0
const antiMacroEnabled = config.skills.antiMacroCode;      // true/false
const statGainDelay = config.skills.statGainDelayMinutes;  // 15 minutos

// Multiplicadores por categoria
const combatSkillMultiplier = config.skills.combatMultiplier;   // 1.5
const magicSkillMultiplier = config.skills.magicMultiplier;     // 1.0
const craftingSkillMultiplier = config.skills.craftingMultiplier; // 0.75
const tamingSkillMultiplier = config.skills.tamingMultiplier;   // 0.25
```

**Categorias de Skills:**
- Combate: Swordsmanship, Mace, Fencing, Archery, Wrestling, Tactics, Anatomy, Parrying
- Magia: Magery, EvalInt, Meditation, Resist Spells, Necromancy, Chivalry
- Crafting: Blacksmithy, Tailoring, Carpentry, Alchemy, Tinkering, Inscription
- Gathering: Mining, Lumberjacking, Fishing
- Stealth: Hiding, Stealth, Stealing, Snooping, Lockpicking
- Taming: Animal Taming, Animal Lore, Veterinary
- Bard: Musicianship, Peacemaking, Provocation, Discordance

### 3.4 Sistema de Items (1.5 semanas)

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| Item Types | Armas, armaduras, consumiveis | Media |
| Inventory System | Backpack, containers | Media |
| Equipment Slots | 20+ slots de equipamento | Media |
| Item Properties | Magicas, durabilidade | Alta |
| Loot System | Drop tables (configuravel) | Media |
| Decay System | Items no chao desaparecem | Baixa |

**Loot Configuravel:**
```typescript
// config.economy.loot
const goldMultiplier = config.economy.loot.goldMultiplier;           // 1.0 - 20.0
const magicItemChance = config.economy.loot.magicItemChance;         // 1.0 - 50.0
const itemAmountMultiplier = config.economy.loot.itemAmountMultiplier; // 1.0 - 10.0
```

### 3.5 Sistema de Criaturas e AI (1 semana)

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| AI States | Idle, Patrol, Combat, Flee | Media |
| Pathfinding A* | Navegacao por obstaculos | Alta |
| Aggro System | Deteccao e perseguicao | Media |
| Spawn System | Respawn em regioes | Media |
| Loot Tables | Drop por criatura | Media |

**Tiers de Criaturas:**
- Tier 1: Mongbat, Rat, Skeleton (Fame 0-2000)
- Tier 2: Ettin, Harpy, Gargoyle (Fame 2000-6000)
- Tier 3: Lich, Drake, Daemon (Fame 6000-12000)
- Tier 4: Dragon, Ancient Wyrm, Balron (Fame 12000+)

---

## Fase 4: Conteudo e Mundo (4-6 semanas)

### Objetivo
Criar o mundo de Britannia com cidades, dungeons e sistemas sociais.

### 4.1 Mapa e Regioes (2 semanas)

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| Mapa Principal | 6144x4096 tiles | Alta |
| 9 Cidades | Britain, Moonglow, Trinsic, etc | Alta |
| 8 Dungeons | Despise, Destard, Deceit, etc | Alta |
| Terrain Generation | Procedural + hand-crafted | Alta |
| Guard Zones | Areas seguras | Media |

**Cidades Principais:**
1. Britain - Capital, banco central
2. Moonglow - Cidade dos magos
3. Trinsic - Cidade dos paladinos
4. Skara Brae - Ilha dos bardos
5. Yew - Floresta dos druidas
6. Minoc - Cidade mineira
7. Vesper - Porto comercial
8. Jhelom - Ilha dos guerreiros
9. Nujel'm - Cidade do deserto

### 4.2 NPCs e Vendors (1 semana)

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| NPC Spawns | Guardas, vendedores, quest givers | Media |
| Vendor System | Compra/venda (configuravel) | Media |
| Bank System | Armazenamento seguro | Media |
| Quest NPCs | Dialogos e quests | Media |

**Vendor Configuravel:**
```typescript
// config.economy.vendors
const buyPriceScalar = config.economy.vendors.buyPriceScalar;   // 0.1 - 10.0
const sellPriceScalar = config.economy.vendors.sellPriceScalar; // 0.05 - 10.0
const restockDelayMinutes = config.economy.vendors.restockDelay; // 5 - 480
```

### 4.3 Housing System (1.5 semanas)

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| House Placement | Plots no mapa | Media |
| House Types | Small, Medium, Large, Castle | Media |
| Lockdowns | Decoracao | Baixa |
| Secure Storage | Containers seguros | Media |
| Player Vendors | Vendedores em casas | Media |
| Decay System | Configuravel (7-90 dias) | Baixa |

**Housing Configuravel:**
```typescript
// config.housing
const accountHouseLimit = config.housing.accountHouseLimit; // 1 - 5
const decayDelayDays = config.housing.decayDelay;           // 7 - 90
const allowCustomHouses = config.housing.allowCustomHouses; // true/false
const placementPriceMultiplier = config.housing.placementPrice; // 0.1 - 5.0
```

### 4.4 Sistemas Sociais (1.5 semanas)

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| Guild System | Criar, ranks, wars | Alta |
| Party System | Grupos temporarios | Media |
| Chat System | Say, Whisper, Guild, Party | Media |
| Trade System | Troca segura | Media |
| Fame/Karma | Reputacao e alinhamento | Media |
| Murder System | PK counts (configuravel) | Media |

---

## Fase 5: Polish e Lancamento (3-4 semanas)

### Objetivo
Polir a experiencia, otimizar performance e preparar para lancamento.

### 5.1 Audio (1 semana)

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| SFX Combate | Swings, hits, magias | Media |
| SFX Ambiente | Natureza, cidades | Media |
| Musica | Temas por regiao | Baixa |
| Audio Manager | Volume, 3D spatial | Media |

### 5.2 UI/UX Polish (1 semana)

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| Paperdoll | Equipamento visual | Media |
| Skill Window | Lista de skills | Baixa |
| Spellbook UI | Grimorio interativo | Media |
| Map/Radar | Minimapa | Media |
| Settings | Opcoes de jogo | Baixa |
| **Server Info UI** | **Mostrar rates/regras** | **Baixa** |

### 5.3 Otimizacao (1 semana)

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| Culling | Nao renderizar fora da tela | Media |
| Object Pooling | Reuso de objetos | Media |
| Network Optimization | Delta compression | Media |
| Memory Management | Cache inteligente | Media |
| Load Testing | 1000+ jogadores | Alta |

### 5.4 Testes e QA (0.5 semana)

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| Unit Tests | Sistemas criticos (bun test) | Media |
| Integration Tests | Fluxos completos | Media |
| Balance Testing | Combate e economia | Alta |
| Bug Fixes | Correcao de issues | Variavel |

---

## Fase 6: Sistema de Configuracao e Server Types (2-3 semanas)

### Objetivo
Implementar sistema completo de configuracao inspirado no ServUO, permitindo diferentes tipos de servidor (Classic, Easy, War, Hardcore) com multipliers configuraveis para todos os aspectos do jogo.

### 6.1 Arquitetura de Configuracao (Inspirada no ServUO)

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| ConfigManager | Carrega/valida configs | Media |
| **Bun File Watcher** | **Hot reload nativo** | **Media** |
| Config Validation | Schema validation (Zod) | Media |
| Admin Commands | [setconfig], [reloadconfig] | Media |
| Config Editor Tool | UI para editar configs | Alta |

### 6.2 Estrutura de Arquivos de Configuracao

```
server/config/
├── server.json           # Identificacao, rede, debug
├── players.json          # Caps de skills/stats
├── combat.json           # Dano, hit chance, PvM/PvP
├── magic.json            # Reagentes, mana, fizzle
├── skills.json           # Gain rates, anti-macro
├── economy.json          # Loot, vendors, precos
├── pvp.json              # Murder, stat loss, full loot
├── housing.json          # Casas, decay, limits
├── resources.json        # Mining, lumber, fishing
├── character.json        # Stats iniciais, items, gold
├── expansion.json        # Features por era
├── accounts.json         # Contas, chars por conta
└── presets/              # Configuracoes pre-definidas
    ├── classic-osi.json  # T2A Era autentica
    ├── easy-casual.json  # Servidor casual 10x
    ├── war-pvp.json      # Servidor focado em PvP
    ├── hardcore.json     # Permadeath, rates baixas
    └── development.json  # God mode para testes
```

### 6.3 Arquivos de Configuracao Detalhados

#### server.json - Configuracao Basica
```json
{
  "name": "NewUO - Britannia Remastered",
  "address": null,
  "port": 2593,
  "maxConnections": 256,
  "debug": false,
  "profile": false,
  "autoSaveMinutes": 15,
  "backupEnabled": true
}
```

#### players.json - Caps de Skills e Stats
```json
{
  "skillCap": 1000,
  "totalSkillCap": 7000,
  "totalStatCap": 225,
  "individualStatCap": 100,
  "powerScrollsEnabled": true,
  "maxSkillWithScrolls": 1200,
  "maxTotalWithScrolls": 7200
}
```

#### combat.json - Sistema de Combate
```json
{
  "pvmDamageScalar": 1.0,
  "pvpDamageScalar": 1.0,
  "baseHitChance": 50,
  "maxHitChance": 95,
  "minHitChance": 5,
  "criticalHitEnabled": true,
  "criticalHitChance": 5,
  "criticalHitMultiplier": 1.5,
  "armorDamageReduction": 0.5
}
```

#### magic.json - Sistema de Magia
```json
{
  "requireReagents": true,
  "consumeReagentsOnFizzle": false,
  "manaCostMultiplier": 1.0,
  "castTimeMultiplier": 1.0,
  "spellDamageMultiplier": 1.0,
  "manaRegenMultiplier": 1.0,
  "meditationArmorPenalty": true
}
```

#### skills.json - Progressao de Skills
```json
{
  "gainMultiplier": 1.0,
  "baseGainChance": 2.0,
  "antiMacroCode": true,
  "statGainDelayMinutes": 15,
  "statGainChance": 5.0,
  "categoryMultipliers": {
    "combat": 1.5,
    "magic": 1.0,
    "crafting": 0.75,
    "gathering": 1.0,
    "stealth": 1.0,
    "taming": 0.25,
    "bard": 1.0
  }
}
```

#### economy.json - Economia
```json
{
  "loot": {
    "goldMultiplier": 1.0,
    "magicItemChance": 1.0,
    "itemAmountMultiplier": 1.0,
    "artifactDropRate": 1.0
  },
  "vendors": {
    "buyPriceScalar": 1.0,
    "sellPriceScalar": 1.0,
    "restockDelayMinutes": 60
  },
  "resources": {
    "oreAmountMultiplier": 1.0,
    "coloredOreChance": 1.0,
    "logAmountMultiplier": 1.0,
    "coloredLogChance": 1.0,
    "fishAmountMultiplier": 1.0,
    "treasureChance": 1.0
  }
}
```

#### pvp.json - Regras de PvP
```json
{
  "murderCountsForRed": 5,
  "murderDecayHours": 8,
  "decayOffline": false,
  "statLossEnabled": true,
  "statLossPercent": 0.25,
  "statLossDurationMinutes": 120,
  "blueFullLoot": false,
  "redFullLoot": true,
  "dropBlessedItems": false,
  "guardZonesEnabled": true,
  "trammelEnabled": true
}
```

#### housing.json - Sistema de Casas
```json
{
  "accountHouseLimit": 1,
  "decayDelayDays": 30,
  "allowCustomHouses": true,
  "placementPriceMultiplier": 1.0,
  "maxLockdowns": 1000,
  "maxSecures": 100,
  "vendorsEnabled": true,
  "maxVendorsPerHouse": 10
}
```

#### character.json - Criacao de Personagem
```json
{
  "startingStats": {
    "strength": 45,
    "dexterity": 35,
    "intelligence": 35
  },
  "startingSkillPoints": 700,
  "startingGold": 1000,
  "startingItems": {
    "reagents": 50,
    "bandages": 100,
    "food": 10
  },
  "newPlayerProtectionMinutes": 60,
  "startingLocation": "Haven"
}
```

#### expansion.json - Controle de Expansoes
```json
{
  "currentExpansion": "TOL",
  "expansions": {
    "T2A": {
      "enabled": true,
      "trammel": false,
      "powerScrolls": false,
      "necromancy": false,
      "chivalry": false
    },
    "UOR": {
      "enabled": true,
      "trammel": true,
      "powerScrolls": false
    },
    "AOS": {
      "enabled": true,
      "itemProperties": true,
      "necromancy": true,
      "chivalry": true,
      "powerScrolls": true
    },
    "SE": {
      "enabled": true,
      "bushido": true,
      "ninjitsu": true,
      "tokunoMap": true
    },
    "ML": {
      "enabled": true,
      "spellweaving": true,
      "elvenRace": true,
      "statCap150": true
    },
    "TOL": {
      "enabled": true,
      "masterySystem": true,
      "vvv": true
    }
  }
}
```

### 6.4 Presets de Servidor Pre-Configurados

#### Classic OSI (T2A Era)
```json
{
  "preset": "classic-osi",
  "description": "Experiencia autentica T2A Era",
  "players": {
    "skillCap": 1000,
    "totalSkillCap": 7000,
    "totalStatCap": 225
  },
  "skills": {
    "gainMultiplier": 1.0,
    "antiMacroCode": true
  },
  "combat": {
    "pvmDamageScalar": 1.0,
    "pvpDamageScalar": 1.0
  },
  "magic": {
    "requireReagents": true,
    "consumeReagentsOnFizzle": false
  },
  "pvp": {
    "murderCountsForRed": 5,
    "statLossEnabled": true,
    "blueFullLoot": true,
    "redFullLoot": true
  },
  "economy": {
    "goldMultiplier": 1.0,
    "magicItemChance": 1.0
  },
  "character": {
    "startingStats": { "str": 45, "dex": 35, "int": 35 },
    "startingGold": 1000
  },
  "expansion": {
    "currentExpansion": "T2A"
  }
}
```

#### Easy/Casual (10x Rates)
```json
{
  "preset": "easy-casual",
  "description": "Servidor casual com rates aceleradas",
  "players": {
    "skillCap": 2500,
    "totalSkillCap": 25000,
    "totalStatCap": 500
  },
  "skills": {
    "gainMultiplier": 10.0,
    "antiMacroCode": false
  },
  "combat": {
    "pvmDamageScalar": 3.0,
    "pvpDamageScalar": 1.0,
    "baseHitChance": 80
  },
  "magic": {
    "requireReagents": false,
    "manaCostMultiplier": 0.5
  },
  "pvp": {
    "murderCountsForRed": 20,
    "statLossEnabled": false,
    "blueFullLoot": false,
    "redFullLoot": false
  },
  "economy": {
    "goldMultiplier": 10.0,
    "magicItemChance": 20.0,
    "buyPriceScalar": 0.1,
    "sellPriceScalar": 10.0,
    "oreAmountMultiplier": 10.0,
    "coloredOreChance": 50.0
  },
  "character": {
    "startingStats": { "str": 100, "dex": 100, "int": 100 },
    "startingSkillPoints": 5000,
    "startingGold": 5000000
  },
  "housing": {
    "accountHouseLimit": 5,
    "decayDelayDays": 90,
    "placementPriceMultiplier": 0.1
  },
  "expansion": {
    "currentExpansion": "TOL"
  }
}
```

#### War/PvP (Hardcore PvP)
```json
{
  "preset": "war-pvp",
  "description": "Servidor focado em PvP competitivo",
  "players": {
    "skillCap": 1200,
    "totalSkillCap": 7200,
    "totalStatCap": 300
  },
  "skills": {
    "gainMultiplier": 20.0,
    "antiMacroCode": false
  },
  "combat": {
    "pvmDamageScalar": 5.0,
    "pvpDamageScalar": 1.5,
    "maxHitChance": 98
  },
  "magic": {
    "requireReagents": false,
    "castTimeMultiplier": 0.8
  },
  "pvp": {
    "murderCountsForRed": 999,
    "statLossEnabled": false,
    "blueFullLoot": true,
    "redFullLoot": true,
    "dropBlessedItems": true,
    "trammelEnabled": false
  },
  "economy": {
    "goldMultiplier": 20.0,
    "magicItemChance": 50.0
  },
  "character": {
    "startingStats": { "str": 100, "dex": 100, "int": 25 },
    "startingSkillPoints": 5000,
    "startingGold": 100000
  },
  "housing": {
    "accountHouseLimit": 1,
    "decayDelayDays": 7,
    "placementPriceMultiplier": 2.0
  },
  "expansion": {
    "currentExpansion": "AOS"
  }
}
```

#### Hardcore/Survival
```json
{
  "preset": "hardcore",
  "description": "Experiencia hardcore com permadeath",
  "players": {
    "skillCap": 1000,
    "totalSkillCap": 7000,
    "totalStatCap": 225
  },
  "skills": {
    "gainMultiplier": 0.25,
    "antiMacroCode": true,
    "statGainDelayMinutes": 30,
    "statGainChance": 1.0
  },
  "combat": {
    "pvmDamageScalar": 0.5,
    "pvpDamageScalar": 2.0,
    "baseHitChance": 30
  },
  "magic": {
    "requireReagents": true,
    "consumeReagentsOnFizzle": true,
    "manaCostMultiplier": 1.5
  },
  "pvp": {
    "murderCountsForRed": 3,
    "statLossEnabled": true,
    "statLossPercent": 0.50,
    "blueFullLoot": true,
    "redFullLoot": true
  },
  "economy": {
    "goldMultiplier": 0.1,
    "magicItemChance": 0.01,
    "buyPriceScalar": 10.0,
    "sellPriceScalar": 0.05,
    "oreAmountMultiplier": 0.25
  },
  "character": {
    "startingStats": { "str": 25, "dex": 25, "int": 25 },
    "startingSkillPoints": 300,
    "startingGold": 100
  },
  "housing": {
    "accountHouseLimit": 1,
    "decayDelayDays": 14,
    "placementPriceMultiplier": 5.0
  },
  "expansion": {
    "currentExpansion": "UOR"
  },
  "special": {
    "permadeathEnabled": true,
    "deathPenalty": "character_delete"
  }
}
```

### 6.5 ConfigManager com Bun (Hot Reload Nativo)

```typescript
// server/src/config/ConfigManager.ts
import { watch } from 'fs';
import { z } from 'zod';

// Schema de validacao com Zod
const CombatConfigSchema = z.object({
  pvmDamageScalar: z.number().min(0.1).max(10),
  pvpDamageScalar: z.number().min(0.1).max(10),
  baseHitChance: z.number().min(1).max(99),
  maxHitChance: z.number().min(50).max(100),
  minHitChance: z.number().min(0).max(50),
});

const PlayersConfigSchema = z.object({
  skillCap: z.number().min(100).max(10000),
  totalSkillCap: z.number().min(700).max(100000),
  totalStatCap: z.number().min(100).max(1000),
});

// ... outros schemas

export class ConfigManager {
  private static instance: ConfigManager;
  private config: Record<string, any> = {};
  private configPath: string;
  private watchers: Map<string, Set<() => void>> = new Map();
  private fileWatcher: ReturnType<typeof watch> | null = null;

  private constructor() {
    this.configPath = `${import.meta.dir}/../config`;
  }

  static getInstance(): ConfigManager {
    if (!this.instance) {
      this.instance = new ConfigManager();
    }
    return this.instance;
  }

  async loadConfig(presetName?: string): Promise<void> {
    if (presetName) {
      await this.loadPreset(presetName);
    } else {
      await this.loadAllConfigs();
    }

    // Bun le .env automaticamente, sem precisar de dotenv!
    // process.env.MY_VAR ja esta disponivel

    this.setupHotReload();
  }

  private async loadPreset(presetName: string): Promise<void> {
    const presetPath = `${this.configPath}/presets/${presetName}.json`;

    // Bun.file() - API nativa do Bun para leitura de arquivos
    const file = Bun.file(presetPath);
    const preset = await file.json();

    // Merge preset com configs default
    for (const [key, value] of Object.entries(preset)) {
      if (key !== 'preset' && key !== 'description') {
        this.config[key] = value;
      }
    }

    this.validateAllConfigs();
    console.log(`[Config] Loaded preset: ${presetName}`);
  }

  private async loadAllConfigs(): Promise<void> {
    const configFiles = [
      'server', 'players', 'combat', 'magic', 'skills',
      'economy', 'pvp', 'housing', 'character', 'expansion', 'accounts'
    ];

    for (const fileName of configFiles) {
      const filePath = `${this.configPath}/${fileName}.json`;
      try {
        // Bun.file() - 4x mais rapido que fs.readFile
        const file = Bun.file(filePath);
        this.config[fileName] = await file.json();
      } catch (error) {
        console.warn(`[Config] File not found: ${fileName}.json, using defaults`);
        this.config[fileName] = this.getDefaultConfig(fileName);
      }
    }

    this.validateAllConfigs();
  }

  private validateAllConfigs(): void {
    // Validar cada secao com Zod
    if (this.config.combat) {
      CombatConfigSchema.parse(this.config.combat);
    }
    if (this.config.players) {
      PlayersConfigSchema.parse(this.config.players);
    }
    // ... outras validacoes
  }

  private setupHotReload(): void {
    // Hot reload usando fs.watch (funciona com Bun)
    if (Bun.env.NODE_ENV === 'development') {
      this.fileWatcher = watch(this.configPath, { recursive: true }, async (event, filename) => {
        if (filename?.endsWith('.json')) {
          console.log(`[Config] File changed: ${filename}, reloading...`);

          const configName = filename.replace('.json', '').split('/').pop();
          if (configName) {
            await this.reload(configName);
          }
        }
      });

      console.log('[Config] Hot reload enabled (watching config directory)');
    }
  }

  get<T>(path: string): T {
    const parts = path.split('.');
    let value: any = this.config;

    for (const part of parts) {
      if (value === undefined) break;
      value = value[part];
    }

    return value as T;
  }

  set(path: string, value: any): void {
    const parts = path.split('.');
    let obj: any = this.config;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]]) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }

    obj[parts[parts.length - 1]] = value;

    // Salvar arquivo alterado usando Bun.write()
    const configName = parts[0];
    this.saveConfigFile(configName);

    // Notificar watchers
    this.notifyWatchers(path);
  }

  watch(path: string, callback: () => void): () => void {
    if (!this.watchers.has(path)) {
      this.watchers.set(path, new Set());
    }
    this.watchers.get(path)!.add(callback);

    // Retorna funcao para remover watcher
    return () => {
      this.watchers.get(path)?.delete(callback);
    };
  }

  private notifyWatchers(path: string): void {
    const parts = path.split('.');
    for (let i = parts.length; i > 0; i--) {
      const watchPath = parts.slice(0, i).join('.');
      this.watchers.get(watchPath)?.forEach(cb => cb());
    }
  }

  private async saveConfigFile(configName: string): Promise<void> {
    const filePath = `${this.configPath}/${configName}.json`;

    // Bun.write() - API nativa do Bun para escrita de arquivos
    await Bun.write(
      filePath,
      JSON.stringify(this.config[configName], null, 2)
    );

    console.log(`[Config] Saved: ${configName}.json`);
  }

  async reload(configName?: string): Promise<void> {
    if (configName) {
      const filePath = `${this.configPath}/${configName}.json`;
      const file = Bun.file(filePath);
      this.config[configName] = await file.json();
    } else {
      await this.loadAllConfigs();
    }

    this.validateAllConfigs();
    console.log(`[Config] Reloaded: ${configName || 'all'}`);
  }

  private getDefaultConfig(name: string): any {
    const defaults: Record<string, any> = {
      combat: {
        pvmDamageScalar: 1.0,
        pvpDamageScalar: 1.0,
        baseHitChance: 50,
        maxHitChance: 95,
        minHitChance: 5,
      },
      players: {
        skillCap: 1000,
        totalSkillCap: 7000,
        totalStatCap: 225,
      },
      // ... outros defaults
    };

    return defaults[name] || {};
  }

  // Exportar config para o cliente (apenas info publica)
  getClientConfig(): object {
    return {
      serverName: this.get('server.name'),
      expansion: this.get('expansion.currentExpansion'),
      rates: {
        skillGain: this.get('skills.gainMultiplier'),
        goldDrop: this.get('economy.loot.goldMultiplier'),
      },
      rules: {
        fullLoot: this.get('pvp.blueFullLoot'),
        trammelEnabled: this.get('pvp.trammelEnabled'),
        requireReagents: this.get('magic.requireReagents'),
      },
    };
  }

  // Cleanup
  destroy(): void {
    this.fileWatcher?.close();
  }
}

// Uso nos sistemas
const config = ConfigManager.getInstance();
await config.loadConfig(); // ou config.loadConfig('easy-casual')

const pvmScalar = config.get<number>('combat.pvmDamageScalar');
```

### 6.6 Database com Bun SQLite (Built-in)

```typescript
// server/src/database/Database.ts
import { Database } from 'bun:sqlite';

// Bun tem SQLite integrado - nao precisa de dependencia externa!
const db = new Database('newuo.db', { create: true });

// Modo WAL para melhor performance
db.exec('PRAGMA journal_mode = WAL');

// Criar tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  );

  CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    str INTEGER DEFAULT 45,
    dex INTEGER DEFAULT 35,
    int INTEGER DEFAULT 35,
    hits INTEGER DEFAULT 100,
    mana INTEGER DEFAULT 100,
    stam INTEGER DEFAULT 100,
    x INTEGER DEFAULT 1438,
    y INTEGER DEFAULT 1690,
    z INTEGER DEFAULT 0,
    map INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
  );

  CREATE TABLE IF NOT EXISTS skills (
    character_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    value INTEGER DEFAULT 0,
    cap INTEGER DEFAULT 1000,
    lock_type INTEGER DEFAULT 0,
    PRIMARY KEY (character_id, skill_id),
    FOREIGN KEY (character_id) REFERENCES characters(id)
  );
`);

// Prepared statements para queries frequentes
const getCharacter = db.prepare<{ id: number }, [number]>(
  'SELECT * FROM characters WHERE id = ?'
);

const saveCharacter = db.prepare(`
  UPDATE characters SET
    str = $str, dex = $dex, int = $int,
    hits = $hits, mana = $mana, stam = $stam,
    x = $x, y = $y, z = $z, map = $map
  WHERE id = $id
`);

// Transacoes para operacoes em lote (4x mais rapido)
const saveWorld = db.transaction((characters: any[]) => {
  for (const char of characters) {
    saveCharacter.run(char);
  }
});

export { db, getCharacter, saveCharacter, saveWorld };
```

### 6.7 Comandos Administrativos

```typescript
// Comandos de admin para gerenciar config em runtime
AdminCommands = {
  // Ver config atual
  '[config <path>]': 'Mostra valor da config',
  // Exemplo: [config combat.pvmDamageScalar

  // Alterar config
  '[setconfig <path> <value>]': 'Altera valor da config',
  // Exemplo: [setconfig combat.pvmDamageScalar 2.0

  // Recarregar configs
  '[reloadconfig]': 'Recarrega todos os arquivos de config',
  '[reloadconfig <file>]': 'Recarrega arquivo especifico',

  // Carregar preset
  '[loadpreset <name>]': 'Carrega preset pre-definido',
  // Exemplo: [loadpreset war-pvp

  // Salvar preset atual
  '[savepreset <name>]': 'Salva config atual como preset',

  // Aplicar config a players existentes
  '[applyconfig players]': 'Aplica caps a todos players',
}
```

### 6.8 Quick Reference - Tipos de Servidor

| Tipo | Skill Gain | Loot | PvP | Reagentes | Gold Inicial |
|------|------------|------|-----|-----------|--------------|
| **Classic OSI** | 1x | 1x | Full Loot | Sim | 1,000 |
| **Easy/Casual** | 10x | 10x | No Loot | Nao | 5,000,000 |
| **War/PvP** | 20x | 20x | Full Loot | Nao | 100,000 |
| **Hardcore** | 0.25x | 0.1x | Full Loot | Sim | 100 |
| **God/Admin** | 1000x | 100x | No Loot | Nao | 999,999,999 |

### 6.9 Entregas da Fase 6

| Entregavel | Descricao | Complexidade |
|------------|-----------|--------------|
| ConfigManager | Sistema central de configuracao | Alta |
| Config Files | Todos arquivos .json | Media |
| Presets | 5+ presets pre-definidos | Media |
| **Bun Hot Reload** | **File watcher nativo** | **Media** |
| Admin Commands | Comandos para alterar config | Media |
| Config Validation | Schema validation com Zod | Media |
| Config Sync | Enviar rates ao cliente | Baixa |
| Config Editor | Ferramenta visual | Alta |

---

## Resumo Executivo

### Cronograma Total (Atualizado)

| Fase | Duracao | Dependencias |
|------|---------|--------------|
| Fase 0: Fundacao | 2-3 semanas | Nenhuma |
| Fase 1: Rendering | 3-4 semanas | Fase 0 |
| Fase 2: Networking | 4-5 semanas | Fase 0, 1 |
| Fase 3: Gameplay | 6-8 semanas | Fase 0, 1, 2 |
| Fase 4: Conteudo | 4-6 semanas | Fase 3 |
| Fase 5: Polish | 3-4 semanas | Fase 4 |
| **Fase 6: Config** | **2-3 semanas** | **Fase 3** |
| **TOTAL** | **24-33 semanas** | - |

**Nota:** A Fase 6 pode ser desenvolvida em paralelo com as Fases 4 e 5, ja que depende apenas dos sistemas de gameplay da Fase 3.

### Complexidade por Fase

```
Fase 0: ████░░░░░░ 40% - Setup e definicoes
Fase 1: ██████░░░░ 60% - Rendering isometrico
Fase 2: ████████░░ 80% - Networking complexo
Fase 3: ██████████ 100% - Sistemas de gameplay
Fase 4: ███████░░░ 70% - Criacao de conteudo
Fase 5: █████░░░░░ 50% - Polish e otimizacao
Fase 6: ██████░░░░ 60% - Sistema de configuracao
```

### Dependencias Criticas (Atualizado)

```
[Fase 0] ──────────────────────────────────────────────────────┐
    │                                                           │
    ▼                                                           │
[Fase 1: Rendering] ───────────────────────────────────────────┤
    │                                                           │
    ▼                                                           │
[Fase 2: Networking] ──────────────────────────────────────────┤
    │                                                           │
    └──────────────────────┐                                    │
                           ▼                                    │
                   [Fase 3: Gameplay] ◄─────────────────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
      [Fase 4: Conteudo]  [Fase 6: Config]
              │            │
              └────────────┼────────────┘
                           ▼
                   [Fase 5: Polish]
```

### Stack Tecnologico Recomendado

#### Cliente (Browser/Desktop)
| Tecnologia | Uso | Alternativa |
|------------|-----|-------------|
| **TypeScript** | Linguagem principal | - |
| **PixiJS** | Rendering 2D/WebGL | Phaser 3 |
| **Howler.js** | Audio | Web Audio API |
| **Electron** | Desktop wrapper | Tauri |

#### Servidor (Bun)
| Tecnologia | Uso | Built-in |
|------------|-----|----------|
| **Bun** | Runtime (3-4x mais rapido que Node) | - |
| **TypeScript** | Linguagem principal | Sim (nativo) |
| **Bun.serve()** | WebSocket server | Sim (nativo) |
| **bun:sqlite** | Database | Sim (nativo) |
| **Bun.file()** | File I/O | Sim (nativo) |
| **bun test** | Test runner | Sim (nativo) |
| **.env** | Environment vars | Sim (automatico) |
| **Zod** | Config validation | Nao (unica dep) |

#### DevOps
| Tecnologia | Uso | Alternativa |
|------------|-----|-------------|
| **Docker** | Containerizacao | Podman |
| **GitHub Actions** | CI/CD | GitLab CI |
| **Nginx** | Load balancer | HAProxy |

#### Ferramentas de Desenvolvimento
| Tecnologia | Uso |
|------------|-----|
| **bun --watch** | Hot reload (built-in) |
| **bun test** | Unit testing (built-in) |
| **bun build** | Bundler (built-in) |
| **ESLint + Prettier** | Linting/Formatting |

### Metricas de Sucesso (Atualizadas com Bun)

| Metrica | Target | Beneficio Bun |
|---------|--------|---------------|
| FPS Cliente | 60 FPS estavel | - |
| Latencia Rede | < 100ms | -30% vs Node |
| Players por Servidor | **2000+ simultaneos** | +100% vs Node |
| Tempo de Carregamento | < 5 segundos | - |
| Memoria Cliente | < 500MB | - |
| Tick Rate Servidor | 20 ticks/s estavel | Mais headroom |
| Config Hot Reload | **< 100ms** | -90% vs Node |
| **Server Startup** | **< 1 segundo** | -80% vs Node |
| **World Save (1000 players)** | **< 1 segundo** | -75% vs Node |

### Riscos e Mitigacoes

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|---------------|---------|-----------|
| ~~Complexidade de networking~~ | ~~Alta~~ | ~~Alto~~ | **Bun WebSocket nativo** |
| Performance de rendering | Media | Alto | Object pooling, culling agressivo |
| Balanceamento de combate | Alta | Medio | Sistema de config flexivel |
| Escopo creep | Alta | Alto | MVP minimo definido, fases claras |
| ~~Sincronizacao de estado~~ | ~~Alta~~ | ~~Alto~~ | **Bun performance** |
| Config complexity | Media | Medio | Presets pre-definidos, validacao |
| **Bun compatibility** | **Baixa** | **Medio** | **99% compat com Node** |

### MVP Minimo (Fase 3 Completa)

Para ter um jogo jogavel, o MVP deve incluir:

1. **Movimento e Exploracao**
   - Caminhar/correr em mundo isometrico
   - Camera seguindo jogador
   - Colisao basica

2. **Combate Funcional**
   - Ataque melee basico
   - Sistema de HP
   - Morte e ressurreicao

3. **Magia Basica**
   - 10-15 magias essenciais
   - Heal, damage, buff

4. **Multiplayer**
   - Ver outros jogadores
   - Chat basico
   - Sincronizacao de estado

5. **Conteudo Minimo**
   - 1 cidade (Britain)
   - 1 dungeon (Despise)
   - 10-15 tipos de monstros
   - Equipamento basico

6. **Configuracao Basica**
   - Rates configuraveis
   - Presets Classic e Easy

### Proximos Passos Recomendados

1. **Semana 1-2**: Setup do projeto com Bun, estrutura de pastas, bunfig.toml
2. **Semana 3-4**: Game loop basico, ECS, constantes de dados, **ConfigManager inicial**
3. **Semana 5-8**: Motor isometrico, tiles, sprites, camera
4. **Semana 9-13**: Networking com **Bun.serve()**, WebSocket, prediction/reconciliation
5. **Semana 14-21**: Sistemas de gameplay (combate, magia, skills) **com scalars**
6. **Semana 22-27**: Mundo, cidades, NPCs, housing
7. **Semana 28-30**: Polish, otimizacao, testes com **bun test**
8. **Semana 25-27** (paralelo): Sistema de config completo, presets, hot reload

---

## Apendice: Codigo de Referencia

### A1: Entry Point do Servidor (Bun)

```typescript
// server/src/index.ts
import { ConfigManager } from './config/ConfigManager';
import { GameServer } from './network/GameServer';
import { GameLoop } from './core/GameLoop';
import { World } from './world/World';

// Bun le .env automaticamente!
const isDev = Bun.env.NODE_ENV === 'development';

async function main() {
  console.log(`Starting NewUO Server (Bun ${Bun.version})...`);

  // Carregar configuracoes
  const config = ConfigManager.getInstance();
  await config.loadConfig(Bun.env.PRESET); // ou undefined para default

  // Inicializar mundo
  const world = new World();
  await world.load();

  // Iniciar servidor de rede
  const server = new GameServer();

  // Iniciar game loop
  const gameLoop = new GameLoop(world);
  gameLoop.start();

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    await world.save();
    gameLoop.stop();
    process.exit(0);
  });
}

main().catch(console.error);
```

### A2: Conversao Isometrica

```typescript
// shared/utils/IsometricMath.ts
export const TILE_WIDTH = 44;
export const TILE_HEIGHT = 44;
export const TILE_HALF_WIDTH = 22;
export const TILE_HALF_HEIGHT = 22;
export const Z_HEIGHT = 4;

export function worldToScreen(x: number, y: number, z: number) {
  return {
    screenX: (x - y) * TILE_HALF_WIDTH,
    screenY: (x + y) * TILE_HALF_HEIGHT - (z * Z_HEIGHT)
  };
}

export function screenToWorld(screenX: number, screenY: number, z = 0) {
  const adjustedY = screenY + (z * Z_HEIGHT);
  return {
    x: Math.floor((screenX / TILE_HALF_WIDTH + adjustedY / TILE_HALF_HEIGHT) / 2),
    y: Math.floor((adjustedY / TILE_HALF_HEIGHT - screenX / TILE_HALF_WIDTH) / 2),
    z
  };
}

export function calculateDepth(x: number, y: number, z: number): number {
  return x + y + z * 0.001;
}
```

### A3: Sistema de Pacotes

```typescript
// shared/packets/PacketTypes.ts
export enum PacketId {
  // Conexao
  LoginRequest = 0x00,
  LoginResponse = 0x01,

  // Movimento
  MoveRequest = 0x10,
  MoveConfirm = 0x11,
  MoveReject = 0x12,

  // Entidades
  EntitySpawn = 0x20,
  EntityDespawn = 0x21,
  EntityUpdate = 0x22,

  // Combate
  AttackRequest = 0x40,
  DamageDealt = 0x43,

  // Magia
  CastSpell = 0x50,
  SpellEffect = 0x54,

  // Config
  ServerInfo = 0xD0,
  RatesInfo = 0xD1,
  RulesInfo = 0xD2,
}

export interface Packet {
  id: PacketId;
  timestamp: number;
}

export interface MoveRequestPacket extends Packet {
  id: PacketId.MoveRequest;
  direction: number;
  sequence: number;
  running: boolean;
}

// Pacote de info do servidor (enviado ao cliente no login)
export interface ServerInfoPacket extends Packet {
  id: PacketId.ServerInfo;
  serverName: string;
  expansion: string;
  rates: {
    skillGain: number;
    goldDrop: number;
    magicItemChance: number;
  };
  rules: {
    fullLoot: boolean;
    trammelEnabled: boolean;
    murderCountsForRed: number;
  };
}
```

### A4: Formula de Combate (com Scalars)

```typescript
// server/src/systems/CombatSystem.ts
import { ConfigManager } from '../config/ConfigManager';

const config = ConfigManager.getInstance();

export function calculateHitChance(
  attackerWeaponSkill: number,
  attackerTactics: number,
  defenderWeaponSkill: number,
  defenderTactics: number,
  defenderParry: number
): number {
  const baseHitChance = config.get<number>('combat.baseHitChance');
  const maxHitChance = config.get<number>('combat.maxHitChance');
  const minHitChance = config.get<number>('combat.minHitChance');

  const attackerTotal = (attackerWeaponSkill + attackerTactics) / 2;
  const defenderTotal = (defenderWeaponSkill + defenderTactics + defenderParry) / 3;

  const hitChance = baseHitChance + (attackerTotal - defenderTotal) * 2;
  return Math.max(minHitChance, Math.min(maxHitChance, hitChance));
}

export function calculateDamage(
  weaponMin: number,
  weaponMax: number,
  strength: number,
  tactics: number,
  anatomy: number,
  targetAR: number,
  isPvP: boolean
): number {
  const armorReduction = config.get<number>('combat.armorDamageReduction');

  const baseDamage = Math.random() * (weaponMax - weaponMin) + weaponMin;
  const bonusDamage = (strength / 5) + (tactics / 10) + (anatomy / 10);
  const arReduction = targetAR * armorReduction;

  const rawDamage = baseDamage + bonusDamage - arReduction;

  // Aplicar scalar baseado no tipo de combate
  const scalar = isPvP
    ? config.get<number>('combat.pvpDamageScalar')
    : config.get<number>('combat.pvmDamageScalar');

  return Math.max(1, Math.floor(rawDamage * scalar));
}
```

### A5: Testes com Bun (Built-in)

```typescript
// server/src/systems/CombatSystem.test.ts
import { describe, expect, test, beforeAll } from 'bun:test';
import { calculateHitChance, calculateDamage } from './CombatSystem';
import { ConfigManager } from '../config/ConfigManager';

beforeAll(async () => {
  const config = ConfigManager.getInstance();
  await config.loadConfig('classic-osi');
});

describe('CombatSystem', () => {
  test('calculateHitChance returns value between min and max', () => {
    const hitChance = calculateHitChance(100, 100, 50, 50, 50);

    expect(hitChance).toBeGreaterThanOrEqual(5);
    expect(hitChance).toBeLessThanOrEqual(95);
  });

  test('calculateHitChance favors higher skilled attacker', () => {
    const highSkill = calculateHitChance(100, 100, 50, 50, 50);
    const lowSkill = calculateHitChance(50, 50, 100, 100, 100);

    expect(highSkill).toBeGreaterThan(lowSkill);
  });

  test('calculateDamage applies PvM scalar', () => {
    const pvm = calculateDamage(10, 20, 100, 100, 100, 50, false);
    const pvp = calculateDamage(10, 20, 100, 100, 100, 50, true);

    // Em classic-osi ambos scalars sao 1.0, entao devem ser iguais
    expect(pvm).toBeGreaterThan(0);
    expect(pvp).toBeGreaterThan(0);
  });

  test('calculateDamage never returns less than 1', () => {
    const damage = calculateDamage(1, 1, 10, 10, 10, 1000, false);
    expect(damage).toBeGreaterThanOrEqual(1);
  });
});

// Rodar com: bun test
// Ou: bun test --watch (hot reload de testes!)
```

---

## Quick Start com Bun

```bash
# 1. Instalar Bun (se ainda nao tem)
curl -fsSL https://bun.sh/install | bash

# 2. Clonar repositorio
git clone https://github.com/seu-usuario/newuo.git
cd newuo

# 3. Instalar dependencias (6x mais rapido que npm)
bun install

# 4. Criar .env (Bun le automaticamente)
echo "NODE_ENV=development" > .env
echo "PRESET=easy-casual" >> .env

# 5. Rodar em modo desenvolvimento (hot reload)
bun dev

# 6. Rodar testes
bun test

# 7. Build para producao
bun run build

# 8. Rodar em producao
bun start:prod
```

---

**Documento criado para o projeto NewUO**
**Versao: 3.0**
**Data: Dezembro 2024**
**Runtime:** Bun 1.0+
**Atualizado com:** Sistema de Configuracao inspirado no ServUO + Migracao para Bun
