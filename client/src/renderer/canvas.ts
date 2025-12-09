import { Palette } from "./palette";

type Renderer = {
  drawGrid: () => void;
  drawAvatar: (gx: number, gy: number) => void;
};

const TILE = 32;
const GRID_W = 20;
const GRID_H = 12;

export function createRenderer(root: HTMLElement, palette: Palette): Renderer {
  const canvas = document.createElement("canvas");
  canvas.width = GRID_W * TILE;
  canvas.height = GRID_H * TILE;
  canvas.style.imageRendering = "pixelated";
  canvas.style.background = palette.background;
  root.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  const drawTile = (x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
  };

  const drawGrid = () => {
    for (let y = 0; y < GRID_H; y++) {
      for (let x = 0; x < GRID_W; x++) {
        const color = (x + y) % 2 === 0 ? palette.grass : palette.dirt;
        drawTile(x, y, color);
      }
    }
  };

  const drawAvatar = (gx: number, gy: number) => {
    ctx.fillStyle = palette.outline;
    ctx.fillRect(gx * TILE + 6, gy * TILE + 4, TILE - 12, TILE - 8);

    ctx.fillStyle = palette.avatar;
    ctx.fillRect(gx * TILE + 8, gy * TILE + 6, TILE - 16, TILE - 12);
  };

  return { drawGrid, drawAvatar };
}
