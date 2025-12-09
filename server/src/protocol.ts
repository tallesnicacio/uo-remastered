import type { ClientMessage, ServerMessage } from "@shared/packets/messages";
import type { Position } from "@shared/types/position";

type DispatchContext = {
  send: (msg: ServerMessage) => void;
  broadcast: (msg: ServerMessage) => void;
  startPosition: () => Position;
  allocateEntityId: () => string;
  onLogin?: (id: string, name: string) => void;
  entityId?: string;
  entityName?: string;
  tickRate: number;
  motd: string;
  requireLogin: boolean;
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
      const playerId = ctx.allocateEntityId();
      const start = ctx.startPosition();

      ctx.onLogin?.(playerId, msg.name);

      ctx.send({
        type: "login_ok",
        playerId,
        name: msg.name,
        position: start
      });

      ctx.broadcast({
        type: "spawn",
        entityId: playerId,
        name: msg.name,
        position: start
      });
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
      ctx.broadcast({
        type: "entity_move",
        entityId: ctx.entityId ?? "anon",
        position: msg.position
      });
      return;
    default:
      ctx.send({
        type: "error",
        code: "unknown_message",
        message: `Tipo de mensagem não suportado: ${(msg as { type: string }).type}`
      });
  }
}
