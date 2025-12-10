import type { EntityStats } from "../state/world";

export class Hud {
  private container: HTMLDivElement;
  private hpEl: HTMLDivElement;
  private hpBar: HTMLDivElement;
  private manaEl: HTMLDivElement;
  private manaBar: HTMLDivElement;
  private staminaEl: HTMLDivElement;
  private staminaBar: HTMLDivElement;
  private levelEl: HTMLDivElement;
  private expBar: HTMLDivElement;
  private expEl: HTMLDivElement;
  private roleEl: HTMLDivElement;
  private portrait: HTMLDivElement;
  private title: HTMLDivElement;

  constructor(root: HTMLElement) {
    this.container = document.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.bottom = "12px";
    this.container.style.right = "140px";
    this.container.style.background = "linear-gradient(180deg, rgba(55,55,55,0.8), rgba(25,25,25,0.8))";
    this.container.style.padding = "12px";
    this.container.style.borderRadius = "10px";
    this.container.style.border = "2px solid rgba(255,222,180,0.35)";
    this.container.style.fontFamily = "'Georgia','Times New Roman',serif";
    this.container.style.color = "#e0e0e0";
    this.container.style.minWidth = "200px";
    this.container.style.fontSize = "12px";
    this.container.style.lineHeight = "16px";
    this.container.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";

    this.title = document.createElement("div");
    this.title.textContent = "STATUS";
    this.title.style.fontSize = "13px";
    this.title.style.fontWeight = "bold";
    this.title.style.letterSpacing = "1px";
    this.title.style.marginBottom = "8px";
    this.title.style.color = "#f5e2ba";
    this.title.style.textAlign = "center";

    this.portrait = document.createElement("div");
    this.portrait.style.width = "64px";
    this.portrait.style.height = "64px";
    this.portrait.style.borderRadius = "8px";
    this.portrait.style.background = "radial-gradient(circle at 30% 30%, #6b5a49 0%, #2f2922 90%)";
    this.portrait.style.margin = "0 auto 10px auto";
    this.portrait.style.display = "flex";
    this.portrait.style.alignItems = "center";
    this.portrait.style.justifyContent = "center";
    this.portrait.textContent = "Avatar";
    this.portrait.style.fontWeight = "bold";
    this.portrait.style.color = "#f5e2ba";
    this.portrait.style.border = "1px solid rgba(255,222,180,0.35)";
    this.portrait.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.4)";

    this.hpEl = document.createElement("div");
    this.hpBar = document.createElement("div");
    this.manaEl = document.createElement("div");
    this.manaBar = document.createElement("div");
    this.staminaEl = document.createElement("div");
    this.staminaBar = document.createElement("div");
    this.levelEl = document.createElement("div");
    this.expBar = document.createElement("div");
    this.expEl = document.createElement("div");
    this.roleEl = document.createElement("div");

    this.container.appendChild(this.title);
    this.container.appendChild(this.portrait);
    this.container.appendChild(this.hpEl);
    this.container.appendChild(this.makeBarContainer(this.hpBar, "#6bc46b"));
    this.container.appendChild(this.manaEl);
    this.container.appendChild(this.makeBarContainer(this.manaBar, "#6b7bc4"));
    this.container.appendChild(this.staminaEl);
    this.container.appendChild(this.makeBarContainer(this.staminaBar, "#c4b36b"));
    this.container.appendChild(this.levelEl);
    this.container.appendChild(this.roleEl);
    this.container.appendChild(this.expEl);
    this.container.appendChild(this.makeBarContainer(this.expBar, "#f5c542"));

    root.appendChild(this.container);

    this.update({
      hp: 50,
      hpMax: 100,
      mana: 30,
      manaMax: 60,
      stamina: 80,
      staminaMax: 100,
      level: 5,
      exp: 0,
      expMax: 100
    });
  }

  update(stats: EntityStats) {
    this.hpEl.textContent = `HP: ${Math.floor(stats.hp)}/${stats.hpMax}`;
    this.hpBar.style.width = `${Math.max(0, Math.min(1, stats.hp / stats.hpMax)) * 100}%`;
    this.manaEl.textContent = `Mana: ${Math.floor(stats.mana)}/${stats.manaMax}`;
    this.manaBar.style.width = `${Math.max(0, Math.min(1, stats.mana / stats.manaMax)) * 100}%`;
    this.staminaEl.textContent = `Stamina: ${Math.floor(stats.stamina ?? 0)}/${stats.staminaMax ?? 0}`;
    const staminaPct =
      stats.staminaMax && stats.staminaMax > 0 ? Math.max(0, Math.min(1, (stats.stamina ?? 0) / stats.staminaMax)) : 0;
    this.staminaBar.style.width = `${staminaPct * 100}%`;
    this.levelEl.textContent = `Nível: ${stats.level}`;
    if (stats.exp !== undefined && stats.expMax) {
      this.expEl.textContent = `EXP: ${stats.exp}/${stats.expMax}`;
      this.expBar.style.width = `${Math.max(0, Math.min(1, stats.exp / stats.expMax)) * 100}%`;
    } else {
      this.expEl.textContent = "EXP: -";
      this.expBar.style.width = "0%";
    }
    if ((stats as { role?: string }).role) {
      this.roleEl.textContent = `Role: ${(stats as { role: string }).role}`;
    }
  }

  private makeBarContainer(fill: HTMLDivElement, color: string) {
    const container = document.createElement("div");
    container.style.background = "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.25))";
    container.style.borderRadius = "6px";
    container.style.height = "8px";
    container.style.marginBottom = "6px";
    container.style.border = "1px solid rgba(255,222,180,0.25)";
    fill.style.height = "100%";
    fill.style.width = "0%";
    fill.style.background = color;
    fill.style.borderRadius = "6px";
    fill.style.boxShadow = "0 0 6px rgba(0,0,0,0.3)";
    container.appendChild(fill);
    return container;
  }
}
