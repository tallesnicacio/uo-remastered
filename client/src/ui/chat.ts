export class ChatBox {
  private container: HTMLDivElement;
  private input: HTMLInputElement;
  onSend?: (text: string) => void;

  constructor(root: HTMLElement) {
    this.container = document.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.bottom = "12px";
    this.container.style.left = "12px";
    this.container.style.right = "12px";
    this.container.style.display = "flex";
    this.container.style.gap = "8px";

    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.placeholder = "Enter para enviar chat";
    this.input.style.flex = "1";
    this.input.style.padding = "8px 10px";
    this.input.style.borderRadius = "6px";
    this.input.style.border = "1px solid rgba(255,255,255,0.2)";
    this.input.style.background = "rgba(0,0,0,0.4)";
    this.input.style.color = "#e0e0e0";
    this.input.style.fontFamily = "Courier New, monospace";
    this.container.appendChild(this.input);

    this.input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" && this.input.value.trim().length > 0) {
        this.onSend?.(this.input.value.trim());
        this.input.value = "";
      }
    });

    root.appendChild(this.container);
  }
}
