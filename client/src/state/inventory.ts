export type Item = {
  id: string;
  name: string;
  qty: number;
};

export class Inventory {
  private items: Item[] = [];

  addItem(name: string, qty = 1) {
    const existing = this.items.find((i) => i.name === name);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({ id: crypto.randomUUID(), name, qty });
    }
  }

  getItems() {
    return [...this.items];
  }

  setItems(items: Array<{ name: string; qty: number }>) {
    this.items = items.map((i) => ({ ...i, id: crypto.randomUUID() }));
  }
}
