import { GAME_NAME } from "@shared/constants/runtime";

function bootstrap() {
  console.info(`[${GAME_NAME}] Client bootstrap`);

  if (typeof document !== "undefined") {
    const root = document.getElementById("app") ?? document.body;
    const banner = document.createElement("div");
    banner.textContent = `${GAME_NAME} client placeholder`;
    banner.style.padding = "12px";
    banner.style.fontFamily = "monospace";
    root.appendChild(banner);
  }
}

bootstrap();
