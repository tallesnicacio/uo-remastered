import { handleClientMessage, parseClientMessage } from "./protocol";
import { loadConfig } from "./config";
import { SessionStore } from "./session";
import type { ServerMessage } from "@shared/packets/messages";
import { GAME_NAME } from "@shared/constants/runtime";
import type { Position } from "@shared/types/position";
import collision from "../data/collision.json";

const config = loadConfig();
const TICK_RATE = config.server.tickRate;
const PORT = Number(process.env.PORT || config.server.port);
const clients = new Set<WebSocket>();
const identities = new Map<WebSocket, { sessionId: string; entityId: string; name: string }>();
type EntityState = {
  name: string;
  position: Position;
  dead?: boolean;
  stats: { hp: number; hpMax: number; mana: number; manaMax: number; level: number; exp: number; expMax: number };
};

const entities = new Map<string, EntityState>();
let nextEntityId = 1;
const sessions = new SessionStore();
const blocked = new Set<string>((collision.blocked as [number, number][]).map(([x, y]) => `${x},${y}`));
const mapBounds = { width: collision.width ?? 0, height: collision.height ?? 0 };

const startPosition = (): Position => ({
  x: 0,
  y: 0,
  z: 0,
  map: config.players.startMap,
  facing: 0
});

const baseStats = () => ({
  hp: 100,
  hpMax: 100,
  mana: 60,
  manaMax: 60,
  level: 1,
  exp: 0,
  expMax: 100
});

const server = Bun.serve<WebSocket>({
  port: PORT,
  fetch(req, srv) {
    if (srv.upgrade(req)) {
      return undefined;
    }

    return new Response(`${GAME_NAME} server running (Bun)`);
  },
  websocket: {
    open(ws) {
      clients.add(ws);
      console.log("[conn] novo cliente conectado");
      ws.send(
        JSON.stringify({
          type: "welcome",
          motd: config.server.motd,
          serverTime: Date.now(),
          tickRate: TICK_RATE
        })
      );
    },
    message(ws, message) {
      const parsed = parseClientMessage(message);
      if (!parsed) {
        ws.send(JSON.stringify({ type: "error", code: "invalid_payload", message: "Mensagem inválida" }));
        return;
      }

      const send = (msg: ServerMessage) => {
        ws.send(JSON.stringify(msg));
      };

      const broadcast = (msg: ServerMessage) => {
        const payload = JSON.stringify(msg);
        for (const client of clients) {
          try {
            client.send(payload);
          } catch (err) {
            console.warn("[broadcast] erro ao enviar para cliente", err);
          }
        }
      };

      const identity = identities.get(ws);
      const bindSession = (sessionId: string, entityId: string, name: string, position: Position) => {
        identities.set(ws, { sessionId, entityId, name });
        sessions.updatePosition(sessionId, position);
        const existingStats = sessions.get(sessionId)?.stats;
        entities.set(entityId, { name, position, stats: existingStats ?? baseStats() });
        console.log(`[login] ${name} (${entityId})`);
      };

      handleClientMessage(parsed, {
        send,
        broadcast,
        startPosition,
        allocateEntityId: () => `p-${nextEntityId++}`,
        createSession: (name, position, entityId) => sessions.create(name, position, entityId),
        findSession: (sessionId) => sessions.get(sessionId),
        updateSessionPosition: (sessionId, position) => sessions.updatePosition(sessionId, position),
        bindSession,
        entityId: identity?.entityId,
        entityName: identity?.name,
        sessionId: identity?.sessionId,
        tickRate: TICK_RATE,
        motd: config.server.motd,
        requireLogin: true,
        isWalkable: (x, y) => {
          if (x < 0 || y < 0 || x >= mapBounds.width || y >= mapBounds.height) {
            return false;
          }
          return !blocked.has(`${Math.round(x)},${Math.round(y)}`);
        },
        listPlayers: () => [...entities.entries()].map(([id, data]) => ({ id, name: data.name })),
        findEntity: (entityId) => {
          const ent = entities.get(entityId);
          if (!ent) return null;
          return { id: entityId, name: ent.name, position: ent.position };
        },
        killEntity: (entityId) => {
          const ent = entities.get(entityId);
          if (!ent) return null;
          entities.delete(entityId);
          return { id: entityId, name: ent.name };
        },
        saveStats: (sessionId, stats) => sessions.updateStats(sessionId, stats),
        currentStats: identity?.entityId ? entities.get(identity.entityId)?.stats ?? null : null
      });
    },
    close(ws) {
      clients.delete(ws);
      const identity = identities.get(ws);
      if (identity) {
        entities.delete(identity.entityId);
        const payload: ServerMessage = { type: "despawn", entityId: identity.entityId };
        const msg = JSON.stringify(payload);
        for (const client of clients) {
          try {
            client.send(msg);
          } catch (err) {
            console.warn("[despawn] erro ao enviar", err);
          }
        }
        console.log(`[disconnect] ${identity.name} (${identity.entityId})`);
      }
      identities.delete(ws);
    }
  }
});

console.log(`[${GAME_NAME}] ${config.server.name} escutando em ${config.server.host}:${PORT}`);
console.log(`[${GAME_NAME}] Players máximo: ${config.server.maxPlayers}`);
console.log(`[${GAME_NAME}] Config de jogadores: start=${config.players.startLocation} gold=${config.players.startGold}`);

let lastTick = performance.now();
const tickInterval = 1000 / TICK_RATE;
const snapshotInterval = 1000;
let lastSnapshot = performance.now();
const HP_REGEN_PER_SEC = 1;
const MANA_REGEN_PER_SEC = 1.5;

function tick() {
  const now = performance.now();
  const delta = now - lastTick;
  lastTick = now;

  // TODO: plug in world/game loop systems
  if (Math.round(now / 1000) % 5 === 0) {
    console.debug(`[tick] Δ=${delta.toFixed(2)}ms`);
  }

  regenStats(delta);

  if (now - lastSnapshot >= snapshotInterval) {
    sendSnapshot();
    lastSnapshot = now;
  }
}

setInterval(tick, tickInterval);

const shutdown = () => {
  console.log(`[${GAME_NAME}] Shutting down...`);
  server.stop();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function sendSnapshot() {
  const snapshot = {
    type: "snapshot",
    entities: [...entities.entries()].map(([id, data]) => ({
      id,
      name: data.name,
      position: data.position,
      stats: data.stats
    }))
  } satisfies ServerMessage;

  const payload = JSON.stringify(snapshot);
  for (const client of clients) {
    try {
      client.send(payload);
    } catch (err) {
      console.warn("[snapshot] erro ao enviar", err);
    }
  }
}

function regenStats(deltaMs: number) {
  const factor = deltaMs / 1000;
  for (const [, data] of entities) {
    if (!data.stats) continue;
    data.stats.hp = Math.min(data.stats.hpMax, data.stats.hp + HP_REGEN_PER_SEC * factor);
    data.stats.mana = Math.min(data.stats.manaMax, data.stats.mana + MANA_REGEN_PER_SEC * factor);
  }
}
