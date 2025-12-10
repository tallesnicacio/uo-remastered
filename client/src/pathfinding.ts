import type { Position } from "@shared/types/position";

export type PathResult = {
  ok: boolean;
  path: Position[];
};

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1]
];

export function aStarPath(from: Position, to: Position, walkable: (x: number, y: number) => boolean): PathResult {
  const open: { x: number; y: number; g: number; f: number; parent?: { x: number; y: number } }[] = [];
  const key = (x: number, y: number) => `${x},${y}`;
  const closed = new Set<string>();

  open.push({ x: from.x, y: from.y, g: 0, f: heuristic(from.x, from.y, to.x, to.y) });

  const parents = new Map<string, { x: number; y: number }>();

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;
    const currentKey = key(current.x, current.y);

    if (closed.has(currentKey)) continue;
    closed.add(currentKey);

    if (current.x === to.x && current.y === to.y) {
      const path: Position[] = [];
      let nodeKey = currentKey;
      let node: { x: number; y: number } | undefined = { x: current.x, y: current.y };
      while (node) {
        path.push({ x: node.x, y: node.y, map: from.map });
        node = parents.get(nodeKey);
        nodeKey = node ? key(node.x, node.y) : "";
      }
      path.reverse();
      return { ok: true, path };
    }

    for (const [dx, dy] of DIRS) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      const nKey = key(nx, ny);
      if (!walkable(nx, ny) || closed.has(nKey)) continue;

      const g = current.g + 1;
      const f = g + heuristic(nx, ny, to.x, to.y);
      const existing = open.find((n) => n.x === nx && n.y === ny);
      if (existing && existing.g <= g) continue;
      parents.set(nKey, { x: current.x, y: current.y });
      open.push({ x: nx, y: ny, g, f });
    }
  }

  return { ok: false, path: [] };
}

function heuristic(x1: number, y1: number, x2: number, y2: number) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
