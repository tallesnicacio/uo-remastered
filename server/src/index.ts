import { handleClientMessage, parseClientMessage } from "./protocol";
import { loadConfig } from "./config";
import { SessionStore } from "./session";
import type { ServerMessage } from "@shared/packets/messages";
import { GAME_NAME } from "@shared/constants/runtime";
import type { Position } from "@shared/types/position";

const config = loadConfig();
const TICK_RATE = config.server.tickRate;
const PORT = Number(process.env.PORT || config.server.port);
const clients = new Set<WebSocket>();
const identities = new Map<WebSocket, { id: string; name: string }>();
let nextEntityId = 1;
const sessions = new SessionStore();

const startPosition = (): Position => ({
  x: 0,
  y: 0,
  z: 0,
  map: config.players.startMap,
  facing: 0
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
      const bindSession = (sessionId: string, name: string, position: Position) => {
        identities.set(ws, { id: sessionId, name });
        sessions.updatePosition(sessionId, position);
      };

      handleClientMessage(parsed, {
        send,
        broadcast,
        startPosition,
        allocateEntityId: () => `p-${nextEntityId++}`,
        createSession: (name, position) => sessions.create(name, position),
        findSession: (sessionId) => sessions.get(sessionId),
        bindSession,
        entityId: identity?.id,
        entityName: identity?.name,
        tickRate: TICK_RATE,
        motd: config.server.motd,
        requireLogin: true
      });
    },
    close(ws) {
      clients.delete(ws);
      identities.delete(ws);
    }
  }
});

console.log(`[${GAME_NAME}] ${config.server.name} escutando em ${config.server.host}:${PORT}`);
console.log(`[${GAME_NAME}] Players máximo: ${config.server.maxPlayers}`);
console.log(`[${GAME_NAME}] Config de jogadores: start=${config.players.startLocation} gold=${config.players.startGold}`);

let lastTick = performance.now();
const tickInterval = 1000 / TICK_RATE;

function tick() {
  const now = performance.now();
  const delta = now - lastTick;
  lastTick = now;

  // TODO: plug in world/game loop systems
  if (Math.round(now / 1000) % 5 === 0) {
    console.debug(`[tick] Δ=${delta.toFixed(2)}ms`);
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
