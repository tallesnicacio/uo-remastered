import type { ClientMessage, ServerMessage } from "@shared/packets/messages";
import type { Position } from "@shared/types/position";

type DispatchContext = {
  send: (msg: ServerMessage) => void;
  broadcast: (msg: ServerMessage) => void;
  startPosition: () => Position;
  allocateEntityId: () => string;
  createSession: (name: string, position: Position, entityId: string) => { id: string; entityId: string };
  findSession: (sessionId: string) => { id: string; name: string; position: Position; entityId: string } | undefined;
  updateSessionPosition: (sessionId: string, position: Position) => void;
  bindSession: (id: string, entityId: string, name: string, position: Position) => void;
  entityId?: string;
  entityName?: string;
  sessionId?: string;
  tickRate: number;
  motd: string;
  requireLogin: boolean;
  isWalkable: (x: number, y: number) => boolean;
  listPlayers: () => Array<{ id: string; name: string }>;
  findEntity: (entityId: string) => { id: string; name: string; position: Position } | null;
};

const decoder = new TextDecoder();

function validatePosition(pos: unknown): pos is Position {
  if (!pos || typeof pos !== "object") return false;
  const p = pos as Record<string, unknown>;
  return typeof p.x === "number" && typeof p.y === "number" && typeof p.map === "string" && (p.z === undefined || typeof p.z === "number");
}

export function parseClientMessage(raw: string | ArrayBuffer | Uint8Array): ClientMessage | null {
  try {
    const text =
      typeof raw === "string"
        ? raw
        : raw instanceof ArrayBuffer
        ? decoder.decode(new Uint8Array(raw))
        : decoder.decode(raw);

    const data = JSON.parse(text) as Partial<ClientMessage>;

    if (data && typeof data === "object" && "type" in data) {
      switch (data.type) {
        case "hello":
          if (typeof data.version === "string") {
            return { type: "hello", version: data.version, session: typeof data.session === "string" ? data.session : undefined };
          }
          break;
        case "login":
          if (typeof data.name === "string" && data.name.length > 0) {
            return {
              type: "login",
              name: data.name,
              password: typeof data.password === "string" ? data.password : undefined,
              clientVersion: typeof data.clientVersion === "string" ? data.clientVersion : undefined
            };
          }
          break;
        case "ping":
          if (typeof data.nonce === "number") {
            return { type: "ping", nonce: data.nonce };
          }
          break;
        case "chat":
          if (typeof (data as { text?: unknown }).text === "string") {
            return { type: "chat", text: (data as { text: string }).text };
          }
          break;
        case "move":
          if (validatePosition((data as { position?: unknown }).position)) {
            return { type: "move", position: (data as { position: Position }).position };
          }
          break;
        default:
          return null;
      }
    }
  } catch (err) {
    console.warn("[protocol] JSON parse error", err);
  }

  return null;
}

export function handleClientMessage(msg: ClientMessage, ctx: DispatchContext) {
  switch (msg.type) {
    case "hello":
      ctx.send({
        type: "welcome",
        motd: ctx.motd,
        serverTime: Date.now(),
        tickRate: ctx.tickRate
      });
      return;
    case "login": {
      const existing = msg.sessionId ? ctx.findSession(msg.sessionId) : undefined;
      const spawnPos = existing?.position ?? ctx.startPosition();
      const playerId = existing?.entityId ?? ctx.allocateEntityId();
      const session = existing ?? ctx.createSession(msg.name, spawnPos, playerId);

      ctx.bindSession(session.id, playerId, msg.name, spawnPos);

      const loginMsg: ServerMessage = {
        type: "login_ok",
        playerId,
        name: msg.name,
        position: spawnPos,
        sessionId: session.id
      };

      ctx.send(loginMsg);
      ctx.broadcast(loginMsg);
      return;
    }
    case "ping":
      ctx.send({
        type: "pong",
        nonce: msg.nonce,
        serverTime: Date.now()
      });
      return;
    case "chat":
      if (ctx.requireLogin && !ctx.entityId) {
        ctx.send({ type: "error", code: "not_logged_in", message: "É necessário efetuar login antes de enviar chat." });
        return;
      }
      if (msg.text.startsWith("/who")) {
        const players = ctx.listPlayers();
        const names = players.map((p) => p.name).join(", ") || "Nenhum";
        ctx.send({
          type: "chat",
          from: "server",
          text: `Online (${players.length}): ${names}`
        });
        return;
      }
      ctx.broadcast({
        type: "chat",
        from: ctx.entityName ?? "anon",
        text: msg.text
      });
      return;
    case "move":
      if (ctx.requireLogin && !ctx.entityId) {
        ctx.send({ type: "error", code: "not_logged_in", message: "É necessário efetuar login antes de mover." });
        return;
      }
      if (!Number.isFinite(msg.position.x) || !Number.isFinite(msg.position.y)) {
        ctx.send({ type: "error", code: "invalid_move", message: "Coordenadas inválidas." });
        return;
      }
      if (!ctx.isWalkable(msg.position.x, msg.position.y)) {
        ctx.send({ type: "error", code: "blocked_tile", message: "Destino bloqueado." });
        return;
      }

      if (ctx.sessionId) {
        ctx.updateSessionPosition(ctx.sessionId, msg.position);
      }

      ctx.broadcast({
        type: "entity_move",
        entityId: ctx.entityId ?? "anon",
        position: msg.position
      });
      return;
    case "target": {
      if (ctx.requireLogin && !ctx.entityId) {
        ctx.send({ type: "error", code: "not_logged_in", message: "É necessário efetuar login antes de usar target." });
        return;
      }
      const found = ctx.findEntity(msg.entityId);
      if (!found) {
        ctx.send({ type: "error", code: "invalid_target", message: "Alvo não encontrado." });
        return;
      }
      ctx.send({ type: "target_ack", entityId: found.id, name: found.name });
      return;
    }
    default:
      ctx.send({
        type: "error",
        code: "unknown_message",
        message: `Tipo de mensagem não suportado: ${(msg as { type: string }).type}`
      });
  }
}
