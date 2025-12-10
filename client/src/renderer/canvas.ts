import { Palette } from "./palette";
import type { SpriteFrames } from "./sprites";
import type { World } from "../state/world";
import type { Position } from "@shared/types/position";
import type { MapData } from "../types/map";

type Renderer = {
  setWorld: (world: World) => void;
  onRightClick: (handler: (pos: Position) => void) => void;
  onLeftClick: (handler: (pos: Position) => void) => void;
  highlight: (pos: Position | null) => void;
  markDestination: (pos: Position | null) => void;
  setObstacles: (coords: Array<{ x: number; y: number }>) => void;
  flashError: (pos: Position) => void;
};

const TILE = 32;
const CENTER_X = 10;
const CENTER_Y = 6;
const LERP_SPEED = 10; // maior = mais rápido

type DrawEntity = {
  id: string;
  x: number;
  y: number;
  name: string;
  frame: number;
  moved: boolean;
};

export function createRenderer(root: HTMLElement, palette: Palette, avatarSprite: SpriteFrames, mapData?: MapData): Renderer {
  const canvas = document.createElement("canvas");
  const gridW = mapData?.width ?? 20;
  const gridH = mapData?.height ?? 12;
  canvas.width = gridW * TILE;
  canvas.height = gridH * TILE;
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
  let destination: Position | null = null;
  let obstacles: Array<{ x: number; y: number }> = [];
  let errorPos: { pos: Position; ttl: number } | null = null;
  const map = mapData;
  const mapColor = (x: number, y: number): string => {
    if (!map || !map.tiles) {
      return (x + y) % 2 === 0 ? palette.grass : palette.dirt;
    }
    const row = map.tiles[y] ?? "";
    const tile = row[x] ?? "g";
    switch (tile) {
      case "g":
        return palette.grass;
      case "s":
        return palette.sand;
      case "w":
        return palette.water;
      case "r":
        return palette.stone;
      default:
        return palette.dirt;
    }
  };

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
    for (let y = 0; y < gridH; y++) {
      for (let x = 0; x < gridW; x++) {
        const color = mapColor(x, y);
        drawTile(x, y, color);
      }
    }

    obstacles.forEach((o) => {
      const sx = (o.x - camera.x + CENTER_X) * TILE;
      const sy = (o.y - camera.y + CENTER_Y) * TILE;
      ctx.fillStyle = palette.obstacle;
      ctx.fillRect(sx, sy, TILE, TILE);
    });
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
      const moved = Math.round(blended.x) !== Math.round(entity.position.x) || Math.round(blended.y) !== Math.round(entity.position.y);
      // Atualiza posição interpolada para próxima iteração
      worldRef?.updatePosition(entity.id, blended);

      // Ajusta posição para câmera centrada no player local
      const screenX = blended.x - camera.x + CENTER_X;
      const screenY = blended.y - camera.y + CENTER_Y;
      return { id: entity.id, x: screenX, y: screenY, name: entity.name, moved, frame: frame % avatarSprite.frames.length };
    });

    entities.forEach((entity) => {
      const sprite = avatarSprite.frames[entity.moved ? entity.frame : 0];
      const shadow = avatarSprite.shadow;
      const px = entity.x * TILE + 2;
      const py = entity.y * TILE + 2;
      if (shadow) {
        ctx.drawImage(shadow, px, py + 6);
      }
      ctx.drawImage(sprite, px, py);
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

    if (destination) {
      const dx = (destination.x - camera.x + CENTER_X) * TILE;
      const dy = (destination.y - camera.y + CENTER_Y) * TILE;
      ctx.strokeStyle = palette.destination;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(dx + TILE / 2, dy + TILE / 2, TILE / 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (errorPos) {
      errorPos.ttl -= delta;
      if (errorPos.ttl <= 0) {
        errorPos = null;
      } else {
        const ex = (errorPos.pos.x - camera.x + CENTER_X) * TILE;
        const ey = (errorPos.pos.y - camera.y + CENTER_Y) * TILE;
        ctx.strokeStyle = palette.error;
        ctx.lineWidth = 3;
        ctx.strokeRect(ex + 2, ey + 2, TILE - 4, TILE - 4);
      }
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
    },
    markDestination(pos: Position | null) {
      destination = pos;
    },
    setObstacles(coords: Array<{ x: number; y: number }>) {
      obstacles = coords;
    },
    flashError(pos: Position) {
      errorPos = { pos, ttl: 700 };
    }
  };
}
