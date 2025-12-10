import type { Position } from "@shared/types/position";

export type Entity = {
  id: string;
  name: string;
  position: Position;
  target?: Position;
};

export class World {
  private entities = new Map<string, Entity>();
  localId: string | null = null;

  setLocal(id: string, name: string, position: Position) {
    this.localId = id;
    this.upsertEntity(id, name, position);
  }

  upsertEntity(id: string, name: string, position: Position) {
    this.entities.set(id, { id, name, position, target: position });
  }

  updatePosition(id: string, position: Position) {
    const entity = this.entities.get(id);
    if (!entity) return;
    this.entities.set(id, { ...entity, position, target: position });
  }

  setTarget(id: string, target: Position) {
    const entity = this.entities.get(id);
    if (!entity) return;
    this.entities.set(id, { ...entity, target });
  }

  getEntities(): Entity[] {
    return [...this.entities.values()];
  }

  getPosition(id: string): Position | null {
    return this.entities.get(id)?.position ?? null;
  }
}
