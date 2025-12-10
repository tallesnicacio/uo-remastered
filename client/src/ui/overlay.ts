export class Overlay {
  private container: HTMLDivElement;
  private logEl: HTMLDivElement;
  private detailEl: HTMLDivElement;
  private tooltipEl: HTMLDivElement;
  private logLines: string[] = [];
  private maxLines = 6;

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

    const tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.pointerEvents = "none";
    tooltip.style.background = "rgba(0,0,0,0.6)";
    tooltip.style.border = "1px solid rgba(255,255,255,0.2)";
    tooltip.style.padding = "6px 8px";
    tooltip.style.borderRadius = "4px";
    tooltip.style.fontSize = "12px";
    tooltip.style.lineHeight = "16px";
    tooltip.style.visibility = "hidden";
    this.container.appendChild(tooltip);
    this.tooltipEl = tooltip;
  }

  log(message: string) {
    this.logLines.unshift(message);
    this.logLines = this.logLines.slice(0, this.maxLines);
    this.logEl.innerHTML = this.logLines.map((l) => `<div>${l}</div>`).join("");
  }

  showDetails(title: string, lines: string[]) {
    this.detailEl.innerHTML = `<strong>${title}</strong><br/>` + lines.map((l) => `<div>${l}</div>`).join("");
  }

  showTooltip(x: number, y: number, title: string, lines: string[]) {
    this.tooltipEl.style.left = `${x + 12}px`;
    this.tooltipEl.style.top = `${y + 12}px`;
    this.tooltipEl.innerHTML = `<strong>${title}</strong><br/>` + lines.map((l) => `<div>${l}</div>`).join("");
    this.tooltipEl.style.visibility = "visible";
  }

  hideTooltip() {
    this.tooltipEl.style.visibility = "hidden";
  }
}
