import type { EntityStats } from "../state/world";

export class Hud {
  private container: HTMLDivElement;
  private hpEl: HTMLDivElement;
  private manaEl: HTMLDivElement;
  private levelEl: HTMLDivElement;

  constructor(root: HTMLElement) {
    this.container = document.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.bottom = "12px";
    this.container.style.right = "12px";
    this.container.style.background = "rgba(0,0,0,0.35)";
    this.container.style.padding = "10px 12px";
    this.container.style.borderRadius = "8px";
    this.container.style.fontFamily = "Courier New, monospace";
    this.container.style.color = "#e0e0e0";
    this.container.style.minWidth = "160px";
    this.container.style.fontSize = "12px";
    this.container.style.lineHeight = "16px";

    this.hpEl = document.createElement("div");
    this.manaEl = document.createElement("div");
    this.levelEl = document.createElement("div");

    this.container.appendChild(this.hpEl);
    this.container.appendChild(this.manaEl);
    this.container.appendChild(this.levelEl);

    root.appendChild(this.container);

    this.update({
      hp: 50,
      hpMax: 100,
      mana: 30,
      manaMax: 60,
      level: 5
    });
  }

  update(stats: EntityStats) {
    this.hpEl.textContent = `HP: ${stats.hp}/${stats.hpMax}`;
    this.manaEl.textContent = `Mana: ${stats.mana}/${stats.manaMax}`;
    this.levelEl.textContent = `Nível: ${stats.level}`;
  }
}
