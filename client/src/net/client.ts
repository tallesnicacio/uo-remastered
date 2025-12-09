import type { ClientMessage, ServerMessage } from "@shared/packets/messages";
import type { Position } from "@shared/types/position";

type WelcomeInfo = { motd: string; tickRate: number };
type LoginInfo = { playerId: string; name: string; position: Position; sessionId: string };

export class NetClient {
  private socket: WebSocket | null = null;
  private sessionId: string | undefined;
  private heartbeat?: number;

  constructor(private url: string, private version: string) {}

  onWelcome?: (info: WelcomeInfo) => void;
  onLogin?: (info: LoginInfo) => void;
  onSpawn?: (payload: { entityId: string; name: string; position: Position }) => void;
  onMove?: (entityId: string, position: Position) => void;
  onChat?: (from: string, text: string) => void;

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.send({ type: "hello", version: this.version, session: this.sessionId });
      this.startHeartbeat();
    };

    this.socket.onmessage = (ev) => {
      this.handleMessage(ev.data);
    };

    this.socket.onclose = () => {
      this.stopHeartbeat();
      console.warn("Conexão encerrada");
    };
  }

  login(name: string) {
    this.send({
      type: "login",
      name,
      sessionId: this.sessionId
    });
  }

  sendChat(text: string) {
    this.send({ type: "chat", text });
  }

  sendMove(position: Position) {
    this.send({ type: "move", position });
  }

  private send(msg: ClientMessage) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify(msg));
  }

  private handleMessage(raw: unknown) {
    if (typeof raw !== "string") return;
    let data: ServerMessage;
    try {
      data = JSON.parse(raw) as ServerMessage;
    } catch (err) {
      console.warn("Mensagem inválida", err);
      return;
    }

    switch (data.type) {
      case "welcome":
        this.onWelcome?.({ motd: data.motd, tickRate: data.tickRate });
        return;
      case "login_ok":
        this.sessionId = data.sessionId;
        this.onLogin?.({ playerId: data.playerId, name: data.name, position: data.position, sessionId: data.sessionId });
        return;
      case "spawn":
        this.onSpawn?.({ entityId: data.entityId, name: data.name, position: data.position });
        return;
      case "entity_move":
        this.onMove?.(data.entityId, data.position);
        return;
      case "chat":
        this.onChat?.(data.from, data.text);
        return;
      case "pong":
        return;
      case "error":
        console.error(`[server error] ${data.code}: ${data.message}`);
        return;
      default:
        console.warn("Mensagem desconhecida", data);
    }
  }

  private startHeartbeat() {
    this.heartbeat = setInterval(() => {
      this.send({ type: "ping", nonce: Date.now() });
    }, 5000) as unknown as number;
  }

  private stopHeartbeat() {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
    }
  }
}
