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

    ctx.fillStyle = palette.outline;
    ctx.fillRect(6, 4, size - 12, size - 8);

    ctx.fillStyle = palette.avatar;
    ctx.fillRect(8, 6, size - 16, size - 12);

    ctx.fillStyle = i === 0 ? palette.avatarShadow : palette.avatar;
    ctx.fillRect(size / 2 - 4, size / 2, 8, 6);

    frames.push(canvas);
  }

  return { frames, width: size, height: size, shadow };
}
