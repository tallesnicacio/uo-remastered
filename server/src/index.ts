import { handleClientMessage, parseClientMessage } from "./protocol";
import { loadConfig } from "./config";
import { SessionStore } from "./session";
import { AccountStore } from "./accounts";
import { InventoryStore } from "./inventory";
import type { ServerMessage } from "@shared/packets/messages";
import { GAME_NAME } from "@shared/constants/runtime";
import type { Position } from "@shared/types/position";
import collision from "../data/collision.json";
import type { ServerWebSocket } from "bun";

const config = loadConfig();
const TICK_RATE = config.server.tickRate;
const PORT = Number(process.env.PORT || config.server.port);
type WS = ServerWebSocket<unknown>;
const clients = new Set<WS>();
const identities = new Map<WS, { sessionId: string; entityId: string; name: string; role: import("@shared/packets/messages").UserRole }>();
type EntityState = {
  name: string;
  position: Position;
  dead?: boolean;
  stats: { hp: number; hpMax: number; mana: number; manaMax: number; stamina: number; staminaMax: number; level: number; exp: number; expMax: number };
  role: import("@shared/packets/messages").UserRole;
};

const entities = new Map<string, EntityState>();
let nextEntityId = 1;
const sessions = new SessionStore();
const accounts = new AccountStore();
const inventories = new InventoryStore();
const collisionConfig = config.collision ?? collision;
const blocked = new Set<string>((collisionConfig?.blocked as [number, number][])?.map(([x, y]) => `${x},${y}`) ?? []);
const mapBounds = { width: collisionConfig?.width ?? 0, height: collisionConfig?.height ?? 0 };

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
  stamina: 100,
  staminaMax: 100,
  level: 1,
  exp: 0,
  expMax: 100
});

const server = Bun.serve({
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
        const role = sessions.get(sessionId)?.role ?? "Player";
        identities.set(ws, { sessionId, entityId, name, role });
        sessions.updatePosition(sessionId, position);
        const existingStats = sessions.get(sessionId)?.stats ?? baseStats();
        entities.set(entityId, { name, position, stats: existingStats, role });
        inventories.ensure(entityId);
        console.log(`[login] ${name} (${entityId}) role=${role}`);
        // Envia inventário ao jogador
        ws.send(
          JSON.stringify({
            type: "inventory",
            items: inventories.toArray(entityId)
          } satisfies ServerMessage)
        );
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
          ent.stats.hp = 0;
          ent.stats.mana = 0;
          entities.set(entityId, ent);
          return { id: entityId, name: ent.name };
        },
        saveStats: (sessionId, stats) => sessions.updateStats(sessionId, stats),
        currentStats: identity?.entityId ? entities.get(identity.entityId)?.stats ?? null : null,
        saveAll: () => sessions.saveAll(),
        auth: (name, password) => accounts.validateOrCreate(name, password),
        respawn: () => {
          if (!identity) return null;
          const ent = entities.get(identity.entityId);
          if (!ent) return null;
          const pos = startPosition();
          ent.position = pos;
          ent.stats = baseStats();
          entities.set(identity.entityId, ent);
          if (identity.sessionId) {
            sessions.updatePosition(identity.sessionId, pos);
            sessions.updateStats(identity.sessionId, ent.stats);
          }
          return { position: pos, stats: ent.stats };
        },
        changeRole: (target, role) => {
          const ok = sessions.setRoleByName(target, role);
          if (!ok) return false;
          for (const [id, ent] of entities.entries()) {
            const sess = sessions.getByEntity(id);
            if (sess && sess.name === target) {
              ent.role = role;
              entities.set(id, ent);
              break;
            }
          }
          return true;
        },
        applyDamage: (entityId, amount) => {
          const ent = entities.get(entityId);
          if (!ent) return null;
          ent.stats.hp = Math.max(0, ent.stats.hp - amount);
          entities.set(entityId, ent);
          const sess = sessions.getByEntity(entityId);
          if (sess) {
            sessions.updateStats(sess.id, ent.stats);
          }
          return { id: entityId, name: ent.name, hp: ent.stats.hp, hpMax: ent.stats.hpMax };
        },
        giveItem: (targetName, item, qty) => {
          for (const [sid, sess] of sessions["sessions"]) {
            if (sess.name === targetName) {
              inventories.add(sess.entityId, item, qty);
              const socket = [...identities.entries()].find(([, v]) => v.entityId === sess.entityId)?.[0];
              if (socket) {
                socket.send(
                  JSON.stringify({
                    type: "inventory",
                    items: inventories.toArray(sess.entityId)
                  } satisfies ServerMessage)
                );
              }
              sessions.saveAll();
              return true;
            }
          }
          return false;
        }
      });
    },
    close(ws) {
      clients.delete(ws);
      const identity = identities.get(ws);
      if (identity) {
        entities.delete(identity.entityId);
        inventories.removeEntity(identity.entityId);
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
const STAMINA_REGEN_PER_SEC = 2;

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
  const saved = sessions.saveAll();
  console.log(saved ? "[sessions] salvas com sucesso" : "[sessions] falha ao salvar");
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
    data.stats.stamina = Math.min(data.stats.staminaMax, data.stats.stamina + STAMINA_REGEN_PER_SEC * factor);
  }
}
