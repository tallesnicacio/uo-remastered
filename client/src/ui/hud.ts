import type { EntityStats } from "../state/world";

export class Hud {
  private container: HTMLDivElement;
  private hpEl: HTMLDivElement;
  private hpBar: HTMLDivElement;
  private manaEl: HTMLDivElement;
  private manaBar: HTMLDivElement;
  private levelEl: HTMLDivElement;
  private expBar: HTMLDivElement;
  private expEl: HTMLDivElement;

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
    this.hpBar = document.createElement("div");
    this.manaEl = document.createElement("div");
    this.manaBar = document.createElement("div");
    this.levelEl = document.createElement("div");
    this.expBar = document.createElement("div");
    this.expEl = document.createElement("div");

    this.container.appendChild(this.hpEl);
    this.container.appendChild(this.makeBarContainer(this.hpBar, "#6bc46b"));
    this.container.appendChild(this.manaEl);
    this.container.appendChild(this.makeBarContainer(this.manaBar, "#6b7bc4"));
    this.container.appendChild(this.levelEl);
    this.container.appendChild(this.expEl);
    this.container.appendChild(this.makeBarContainer(this.expBar, "#f5c542"));

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
    this.hpBar.style.width = `${Math.max(0, Math.min(1, stats.hp / stats.hpMax)) * 100}%`;
    this.manaEl.textContent = `Mana: ${stats.mana}/${stats.manaMax}`;
    this.manaBar.style.width = `${Math.max(0, Math.min(1, stats.mana / stats.manaMax)) * 100}%`;
    this.levelEl.textContent = `Nível: ${stats.level}`;
    if (stats.exp !== undefined && stats.expMax) {
      this.expEl.textContent = `EXP: ${stats.exp}/${stats.expMax}`;
      this.expBar.style.width = `${Math.max(0, Math.min(1, stats.exp / stats.expMax)) * 100}%`;
    } else {
      this.expEl.textContent = "EXP: -";
      this.expBar.style.width = "0%";
    }
  }

  private makeBarContainer(fill: HTMLDivElement, color: string) {
    const container = document.createElement("div");
    container.style.background = "rgba(255,255,255,0.1)";
    container.style.borderRadius = "6px";
    container.style.height = "8px";
    container.style.marginBottom = "6px";
    fill.style.height = "100%";
    fill.style.width = "0%";
    fill.style.background = color;
    fill.style.borderRadius = "6px";
    container.appendChild(fill);
    return container;
  }
}
