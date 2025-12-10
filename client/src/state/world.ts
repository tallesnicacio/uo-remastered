import type { Position } from "@shared/types/position";

export type Entity = {
  id: string;
  name: string;
  position: Position;
  target?: Position;
  stats?: EntityStats;
  lastPos?: Position;
};

export type EntityStats = {
  hp: number;
  hpMax: number;
  mana: number;
  manaMax: number;
  level: number;
  title?: string;
};

export class World {
  private entities = new Map<string, Entity>();
  localId: string | null = null;
  private walkableFn: (x: number, y: number) => boolean = () => true;
  private obstacles = new Set<string>();

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

  getLocalPosition(): Position | null {
    if (!this.localId) return null;
    return this.getPosition(this.localId);
  }

  findEntityAt(tileX: number, tileY: number): Entity | null {
    for (const entity of this.entities.values()) {
      if (Math.round(entity.position.x) === tileX && Math.round(entity.position.y) === tileY) {
        return entity;
      }
    }
    return null;
  }

  setWalkable(fn: (x: number, y: number) => boolean) {
    this.walkableFn = fn;
  }

  isWalkable(x: number, y: number): boolean {
    const key = `${Math.round(x)},${Math.round(y)}`;
    if (this.obstacles.has(key)) return false;
    return this.walkableFn(x, y);
  }

  setObstacles(coords: Array<{ x: number; y: number }>) {
    coords.forEach((c) => this.obstacles.add(`${c.x},${c.y}`));
  }

  getObstacles(): Array<{ x: number; y: number }> {
    return [...this.obstacles].map((k) => {
      const [x, y] = k.split(",").map(Number);
      return { x, y };
    });
  }

  clearObstacles() {
    this.obstacles.clear();
  }

  applySnapshot(entities: Array<{ id: string; name: string; position: Position }>) {
    entities.forEach((e) => {
      this.upsertEntity(e.id, e.name, e.position);
    });
  }
}
