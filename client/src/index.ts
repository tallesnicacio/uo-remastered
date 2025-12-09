import { GAME_NAME } from "@shared/constants/runtime";
import { createRenderer } from "./renderer/canvas";
import { Palette } from "./renderer/palette";

function bootstrap() {
  console.info(`[${GAME_NAME}] Client bootstrap`);

  if (typeof document === "undefined") {
    console.warn("Client requires browser environment");
    return;
  }

  const root = document.getElementById("app") ?? document.body;

  const palette = new Palette();
  const renderer = createRenderer(root, palette);

  renderer.drawGrid();
  renderer.drawAvatar(5, 5);
}

bootstrap();
