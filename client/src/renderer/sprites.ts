import { Palette } from "./palette";

export type SpriteFrames = {
  frames: HTMLCanvasElement[];
  width: number;
  height: number;
  shadow?: HTMLCanvasElement;
};

export function makeAvatarSprite(palette: Palette): SpriteFrames {
  const frames: HTMLCanvasElement[] = [];
  const size = 28;
  const shadow = document.createElement("canvas");
  shadow.width = size;
  shadow.height = size;
  const shCtx = shadow.getContext("2d");
  if (shCtx) {
    shCtx.fillStyle = "rgba(0,0,0,0.25)";
    shCtx.beginPath();
    shCtx.ellipse(size / 2, size / 2 + 6, 10, 6, 0, 0, Math.PI * 2);
    shCtx.fill();
  }

  for (let i = 0; i < 2; i++) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    // Corpo
    ctx.fillStyle = palette.outline;
    ctx.fillRect(6, 6, size - 12, size - 10);

    // Armadura
    ctx.fillStyle = "#b0b0b0";
    ctx.fillRect(8, 8, size - 16, size - 14);

    // Capacete
    ctx.fillStyle = "#d0d0d0";
    ctx.fillRect(size / 2 - 5, 2, 10, 8);
    ctx.fillStyle = palette.outline;
    ctx.fillRect(size / 2 - 2, 4, 4, 2);

    // Ombreiras
    ctx.fillStyle = "#c5c5c5";
    ctx.fillRect(4, 8, 6, 4);
    ctx.fillRect(size - 10, 8, 6, 4);

    // Botas
    ctx.fillStyle = "#7a5a3d";
    ctx.fillRect(8, size - 6, 4, 4);
    ctx.fillRect(size - 12, size - 6, 4, 4);

    // Arma
    ctx.fillStyle = "#d1b26f";
    ctx.fillRect(size / 2 + 6, 10, 3, 12);
    ctx.fillStyle = "#c4c4c4";
    ctx.fillRect(size / 2 + 5, 6, 5, 6 + i); // anima levemente o topo

    frames.push(canvas);
  }

  return { frames, width: size, height: size, shadow };
}
