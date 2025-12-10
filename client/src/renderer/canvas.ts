import { Palette } from "./palette";
import type { SpriteFrames } from "./sprites";
import type { World } from "../state/world";
import type { Position } from "@shared/types/position";

type Renderer = {
  setWorld: (world: World) => void;
  onRightClick: (handler: (pos: Position) => void) => void;
  onLeftClick: (handler: (pos: Position) => void) => void;
  highlight: (pos: Position | null) => void;
};

const TILE = 32;
const GRID_W = 20;
const GRID_H = 12;
const CENTER_X = GRID_W / 2;
const CENTER_Y = GRID_H / 2;
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

  canvas.addEventListener("contextmenu", (ev) => ev.preventDefault());

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  let worldRef: World | null = null;
  let frame = 0;
  let last = performance.now();
  let camera: Position = { x: 0, y: 0, map: "Felucca" };
  let rightHandler: ((pos: Position) => void) | null = null;
  let leftHandler: ((pos: Position) => void) | null = null;
  let selected: Position | null = null;

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

    const local = worldRef.getLocalPosition();
    if (local) {
      camera = { ...camera, x: local.x, y: local.y, map: local.map };
    }

    const entities: DrawEntity[] = worldRef.getEntities().map((entity) => {
      const target = entity.target ?? entity.position;
      const blended = blendPosition(entity.position, target, delta);
      // Atualiza posição interpolada para próxima iteração
      worldRef?.updatePosition(entity.id, blended);

      // Ajusta posição para câmera centrada no player local
      const screenX = blended.x - camera.x + CENTER_X;
      const screenY = blended.y - camera.y + CENTER_Y;
      return { id: entity.id, x: screenX, y: screenY, name: entity.name };
    });

    const sprite = avatarSprite.frames[frame % avatarSprite.frames.length];

    entities.forEach((entity) => {
      ctx.drawImage(sprite, entity.x * TILE + 2, entity.y * TILE + 2);
      ctx.fillStyle = palette.outline;
      ctx.fillText(entity.name, entity.x * TILE + 4, entity.y * TILE + TILE - 4);
    });

    if (selected) {
      const sx = (selected.x - camera.x + CENTER_X) * TILE;
      const sy = (selected.y - camera.y + CENTER_Y) * TILE;
      ctx.strokeStyle = palette.select;
      ctx.lineWidth = 2;
      ctx.strokeRect(sx + 2, sy + 2, TILE - 4, TILE - 4);
    }
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

  const screenToWorld = (clientX: number, clientY: number): Position | null => {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const worldX = Math.floor(x / TILE + camera.x - CENTER_X);
    const worldY = Math.floor(y / TILE + camera.y - CENTER_Y);
    return { x: worldX, y: worldY, map: camera.map };
  };

  canvas.addEventListener("mousedown", (ev) => {
    const pos = screenToWorld(ev.clientX, ev.clientY);
    if (!pos) return;
    if (ev.button === 2 && rightHandler) {
      rightHandler(pos);
    } else if (ev.button === 0 && leftHandler) {
      leftHandler(pos);
    }
  });

  requestAnimationFrame(render);

  return {
    setWorld(world: World) {
      worldRef = world;
    },
    onRightClick(handler: (pos: Position) => void) {
      rightHandler = handler;
    },
    onLeftClick(handler: (pos: Position) => void) {
      leftHandler = handler;
    },
    highlight(pos: Position | null) {
      selected = pos;
    }
  };
}
