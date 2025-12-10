export class Overlay {
  private container: HTMLDivElement;
  private logEl: HTMLDivElement;
  private detailEl: HTMLDivElement;

  constructor(root: HTMLElement) {
    this.container = document.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.top = "12px";
    this.container.style.left = "12px";
    this.container.style.right = "12px";
    this.container.style.pointerEvents = "none";
    this.container.style.color = "#e0e0e0";
    this.container.style.fontFamily = "Courier New, monospace";
    root.appendChild(this.container);

    const log = document.createElement("div");
    log.style.background = "rgba(0,0,0,0.4)";
    log.style.padding = "8px 10px";
    log.style.borderRadius = "6px";
    log.style.maxWidth = "360px";
    log.style.minHeight = "40px";
    log.style.fontSize = "13px";
    log.style.lineHeight = "18px";
    this.container.appendChild(log);
    this.logEl = log;

    const detail = document.createElement("div");
    detail.style.background = "rgba(0,0,0,0.3)";
    detail.style.padding = "8px 10px";
    detail.style.borderRadius = "6px";
    detail.style.maxWidth = "360px";
    detail.style.minHeight = "24px";
    detail.style.marginTop = "8px";
    detail.style.fontSize = "12px";
    detail.style.lineHeight = "16px";
    this.container.appendChild(detail);
    this.detailEl = detail;
  }

  log(message: string) {
    this.logEl.textContent = message;
  }

  showDetails(title: string, lines: string[]) {
    this.detailEl.innerHTML = `<strong>${title}</strong><br/>` + lines.map((l) => `<div>${l}</div>`).join("");
  }
}
