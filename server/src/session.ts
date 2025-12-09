import type { Position } from "@shared/types/position";

export type Session = {
  id: string;
  name: string;
  position: Position;
};

export class SessionStore {
  private sessions = new Map<string, Session>();

  create(name: string, position: Position): Session {
    const id = crypto.randomUUID();
    const session: Session = { id, name, position };
    this.sessions.set(id, session);
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
    }
  }
}
