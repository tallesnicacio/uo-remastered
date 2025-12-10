export class ActionPanel {
  private container: HTMLDivElement;

  constructor(root: HTMLElement, onAction: (action: string) => void) {
    this.container = document.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.right = "12px";
    this.container.style.bottom = "12px";
    this.container.style.width = "120px";
    this.container.style.background = "rgba(0,0,0,0.45)";
    this.container.style.border = "1px solid rgba(255,255,255,0.2)";
    this.container.style.borderRadius = "10px";
    this.container.style.padding = "8px 6px";
    this.container.style.display = "grid";
    this.container.style.gridTemplateColumns = "1fr";
    this.container.style.gap = "6px";
    this.container.style.fontFamily = "Courier New, monospace";

    const buttons = ["HELP", "OPTIONS", "LOG OUT", "JOURNAL", "SKILLS", "CHAT", "PEACE", "STATUS"];

    buttons.forEach((label) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.style.background = "linear-gradient(180deg,#353535,#1f1f1f)";
      btn.style.border = "1px solid rgba(255,255,255,0.15)";
      btn.style.borderRadius = "6px";
      btn.style.color = "#e6d7b0";
      btn.style.fontWeight = "bold";
      btn.style.padding = "6px 4px";
      btn.style.cursor = "pointer";
      btn.addEventListener("click", () => onAction(label.toLowerCase()));
      this.container.appendChild(btn);
    });

    root.appendChild(this.container);
  }
}
