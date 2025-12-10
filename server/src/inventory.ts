import type { InventoryItem } from "@shared/packets/messages";

export class InventoryStore {
  private store = new Map<string, Map<string, number>>();

  ensure(entityId: string) {
    if (!this.store.has(entityId)) {
      this.store.set(entityId, new Map());
    }
    return this.store.get(entityId)!;
  }

  add(entityId: string, item: string, qty: number) {
    const inv = this.ensure(entityId);
    inv.set(item, (inv.get(item) ?? 0) + qty);
  }

  removeEntity(entityId: string) {
    this.store.delete(entityId);
  }

  toArray(entityId: string): InventoryItem[] {
    const inv = this.store.get(entityId);
    if (!inv) return [];
    return [...inv.entries()].map(([name, qty]) => ({ name, qty }));
  }
}
