import type { Position } from "@shared/types/position";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

export type Session = {
  id: string; // sessionId
  entityId: string;
  name: string;
  position: Position;
  stats?: {
    hp: number;
    hpMax: number;
    mana: number;
    manaMax: number;
    stamina: number;
    staminaMax: number;
    level: number;
    exp: number;
    expMax: number;
  };
};

export class SessionStore {
  private sessions = new Map<string, Session>();
  private filePath: string;

  constructor() {
    this.filePath = path.resolve(import.meta.dir, "../data/sessions.json");
    this.loadFromDisk();
  }

  create(name: string, position: Position, entityId: string): Session {
    const id = crypto.randomUUID();
    const session: Session = { id, name, position, entityId };
    this.sessions.set(id, session);
    this.persist();
    return session;
  }

  get(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  updatePosition(id: string, position: Position) {
    const session = this.sessions.get(id);
    if (session) {
      session.position = position;
      this.sessions.set(id, session);
      this.persist();
    }
  }

  updateStats(id: string, stats: Session["stats"]) {
    const session = this.sessions.get(id);
    if (session) {
      session.stats = stats;
      this.sessions.set(id, session);
      this.persist();
    }
  }

  private persist() {
    const data = JSON.stringify([...this.sessions.values()], null, 2);
    try {
      writeFileSync(this.filePath, data, "utf8");
    } catch (err) {
      console.warn("[sessions] erro ao salvar", err);
    }
  }

  private loadFromDisk() {
    if (!existsSync(this.filePath)) return;
    try {
      const raw = readFileSync(this.filePath, "utf8");
      const arr = JSON.parse(raw) as Session[];
      arr.forEach((s) => this.sessions.set(s.id, s));
      console.log(`[sessions] carregadas ${arr.length} sessões`);
    } catch (err) {
      console.warn("[sessions] erro ao carregar", err);
    }
  }
}
