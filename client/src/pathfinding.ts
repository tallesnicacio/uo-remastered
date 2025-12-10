import type { Position } from "@shared/types/position";

export type PathResult = {
  ok: boolean;
  path: Position[];
};

// Caminho em linha reta (grid) com Bresenham; pode ser trocado por A* futuramente
export function straightPath(from: Position, to: Position): PathResult {
  const path: Position[] = [];

  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  const sx = from.x < to.x ? 1 : -1;
  const sy = from.y < to.y ? 1 : -1;
  let err = dx - dy;

  let x = from.x;
  let y = from.y;

  while (!(x === to.x && y === to.y)) {
    path.push({ x, y, map: from.map });
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
    if (path.length > 256) {
      // segurança contra loops
      break;
    }
  }

  path.push({ x: to.x, y: to.y, map: from.map });

  return { ok: true, path };
}
