import { Palette } from "./palette";
import type { SpriteFrames } from "./sprites";
import type { World } from "../state/world";
import type { Position } from "@shared/types/position";

type Renderer = {
  setWorld: (world: World) => void;
};

const TILE = 32;
const GRID_W = 20;
const GRID_H = 12;
const LERP_SPEED = 10; // maior = mais rápido

type DrawEntity = {
  id: string;
  x: number;
  y: number;
  name: string;
};

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
  let last = performance.now();

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const blendPosition = (current: Position, target: Position, delta: number): Position => {
    const t = Math.min(1, delta * (LERP_SPEED / 1000));
    return {
      ...target,
      x: lerp(current.x, target.x, t),
      y: lerp(current.y, target.y, t),
      z: target.z
    };
  };

  const drawTile = (x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x * TILE), Math.floor(y * TILE), TILE, TILE);
  };

  const drawGround = () => {
    for (let y = 0; y < GRID_H; y++) {
      for (let x = 0; x < GRID_W; x++) {
        const color = (x + y) % 2 === 0 ? palette.grass : palette.dirt;
        drawTile(x, y, color);
      }
    }
  };

  const drawEntities = (delta: number) => {
    if (!worldRef) return;

    const entities: DrawEntity[] = worldRef.getEntities().map((entity) => {
      const target = entity.target ?? entity.position;
      const blended = blendPosition(entity.position, target, delta);
      // Atualiza posição interpolada para próxima iteração
      worldRef?.updatePosition(entity.id, blended);
      return { id: entity.id, x: blended.x, y: blended.y, name: entity.name };
    });

    const sprite = avatarSprite.frames[frame % avatarSprite.frames.length];

    entities.forEach((entity) => {
      ctx.drawImage(sprite, entity.x * TILE + 2, entity.y * TILE + 2);
      ctx.fillStyle = palette.outline;
      ctx.fillText(entity.name, entity.x * TILE + 4, entity.y * TILE + TILE - 4);
    });
  };

  const render = () => {
    const now = performance.now();
    const delta = now - last;
    last = now;
    frame++;
    drawGround();
    drawEntities(delta);
    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);

  return {
    setWorld(world: World) {
      worldRef = world;
    }
  };
}
