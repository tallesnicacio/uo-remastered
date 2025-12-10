export class LoginForm {
  private container: HTMLDivElement;
  private input: HTMLInputElement;
  private password: HTMLInputElement;
  onSubmit?: (name: string, password?: string) => void;

  constructor(root: HTMLElement) {
    this.container = document.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.top = "0";
    this.container.style.left = "0";
    this.container.style.right = "0";
    this.container.style.bottom = "0";
    this.container.style.display = "flex";
    this.container.style.alignItems = "center";
    this.container.style.justifyContent = "center";
    this.container.style.background = "rgba(0,0,0,0.65)";
    this.container.style.zIndex = "10";

    const panel = document.createElement("div");
    panel.style.background = "rgba(0,0,0,0.6)";
    panel.style.padding = "16px 20px";
    panel.style.borderRadius = "8px";
    panel.style.color = "#e0e0e0";
    panel.style.fontFamily = "Courier New, monospace";
    panel.style.minWidth = "260px";

    const label = document.createElement("div");
    label.textContent = "Nome do personagem";
    label.style.marginBottom = "6px";

    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.placeholder = "anon-1234";
    this.input.style.width = "100%";
    this.input.style.padding = "8px 10px";
    this.input.style.borderRadius = "6px";
    this.input.style.border = "1px solid rgba(255,255,255,0.2)";
    this.input.style.background = "rgba(0,0,0,0.3)";
    this.input.style.color = "#e0e0e0";
    this.input.style.fontFamily = "Courier New, monospace";

    const pwdLabel = document.createElement("div");
    pwdLabel.textContent = "Senha (opcional, padrão 1234)";
    pwdLabel.style.margin = "10px 0 6px 0";

    this.password = document.createElement("input");
    this.password.type = "password";
    this.password.placeholder = "1234";
    this.password.style.width = "100%";
    this.password.style.padding = "8px 10px";
    this.password.style.borderRadius = "6px";
    this.password.style.border = "1px solid rgba(255,255,255,0.2)";
    this.password.style.background = "rgba(0,0,0,0.3)";
    this.password.style.color = "#e0e0e0";
    this.password.style.fontFamily = "Courier New, monospace";

    const hint = document.createElement("div");
    hint.textContent = "Pressione Enter para conectar.";
    hint.style.marginTop = "8px";
    hint.style.fontSize = "12px";
    hint.style.opacity = "0.8";

    panel.appendChild(label);
    panel.appendChild(this.input);
    panel.appendChild(pwdLabel);
    panel.appendChild(this.password);
    panel.appendChild(hint);
    this.container.appendChild(panel);
    root.appendChild(this.container);

    this.input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        const name = this.input.value.trim() || `anon-${Math.floor(Math.random() * 9999)}`;
        const pwd = this.password.value.trim() || "1234";
        this.onSubmit?.(name, pwd);
        this.container.style.display = "none";
      }
    });
  }
}
