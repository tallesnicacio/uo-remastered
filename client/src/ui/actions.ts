export class ActionPanel {
  private container: HTMLDivElement;

  constructor(root: HTMLElement, onAction: (action: string) => void) {
    this.container = document.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.right = "12px";
    this.container.style.bottom = "12px";
    this.container.style.width = "140px";
    this.container.style.background = "linear-gradient(180deg, rgba(46,35,26,0.92), rgba(22,15,12,0.9))";
    this.container.style.border = "2px solid rgba(221,189,130,0.55)";
    this.container.style.borderRadius = "12px";
    this.container.style.padding = "10px 8px";
    this.container.style.display = "grid";
    this.container.style.gridTemplateColumns = "1fr";
    this.container.style.gap = "8px";
    this.container.style.fontFamily = "'Georgia', 'Times New Roman', serif";
    this.container.style.boxShadow = "0 0 12px rgba(0,0,0,0.6)";

    const buttons = ["HELP", "OPTIONS", "LOG OUT", "JOURNAL", "SKILLS", "CHAT", "PEACE", "STATUS"];

    buttons.forEach((label) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.style.background = "linear-gradient(180deg,#3d2b1d,#1d1410)";
      btn.style.border = "1px solid rgba(255,222,180,0.35)";
      btn.style.borderRadius = "8px";
      btn.style.color = "#f1e0c8";
      btn.style.fontWeight = "bold";
      btn.style.padding = "8px 4px";
      btn.style.cursor = "pointer";
      btn.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.15)";
      btn.addEventListener("click", () => onAction(label.toLowerCase()));
      this.container.appendChild(btn);
    });

    root.appendChild(this.container);
  }
}
