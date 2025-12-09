import { Palette } from "./palette";
import type { SpriteFrames } from "./sprites";
import type { World } from "../state/world";

type Renderer = {
  setWorld: (world: World) => void;
};

const TILE = 32;
const GRID_W = 20;
const GRID_H = 12;

export function createRenderer(root: HTMLElement, palette: Palette, avatarSprite: SpriteFrames): Renderer {
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

  let worldRef: World | null = null;
  let frame = 0;

  const drawTile = (x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
  };

  const drawGround = () => {
    for (let y = 0; y < GRID_H; y++) {
      for (let x = 0; x < GRID_W; x++) {
        const color = (x + y) % 2 === 0 ? palette.grass : palette.dirt;
        drawTile(x, y, color);
      }
    }
  };

  const drawEntities = () => {
    if (!worldRef) return;

    const entities = worldRef.getEntities();
    const sprite = avatarSprite.frames[frame % avatarSprite.frames.length];

    entities.forEach((entity) => {
      const { x, y } = entity.position;
      ctx.drawImage(sprite, x * TILE + 2, y * TILE + 2);
    });
  };

  const render = () => {
    frame++;
    drawGround();
    drawEntities();
    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);

  return {
    setWorld(world: World) {
      worldRef = world;
    }
  };
}
