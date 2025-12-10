import type { Item } from "../state/inventory";

export class InventoryPanel {
  private container: HTMLDivElement;
  private listEl: HTMLDivElement;

  constructor(root: HTMLElement) {
    this.container = document.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.top = "120px";
    this.container.style.right = "12px";
    this.container.style.background = "rgba(0,0,0,0.35)";
    this.container.style.padding = "10px 12px";
    this.container.style.borderRadius = "8px";
    this.container.style.fontFamily = "Courier New, monospace";
    this.container.style.color = "#e0e0e0";
    this.container.style.minWidth = "180px";
    this.container.style.fontSize = "12px";
    this.container.style.lineHeight = "16px";

    const title = document.createElement("div");
    title.textContent = "Inventário";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "6px";

    this.listEl = document.createElement("div");

    this.container.appendChild(title);
    this.container.appendChild(this.listEl);
    root.appendChild(this.container);
  }

  render(items: Item[]) {
    if (items.length === 0) {
      this.listEl.textContent = "Vazio";
      return;
    }
    this.listEl.innerHTML = items.map((i) => `<div>${i.name} x${i.qty}</div>`).join("");
  }
}
