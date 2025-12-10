import { GAME_NAME } from "@shared/constants/runtime";
import { createRenderer } from "./renderer/canvas";
import { Palette } from "./renderer/palette";
import { makeAvatarSprite } from "./renderer/sprites";
import { World } from "./state/world";
import { NetClient } from "./net/client";
import { aStarPath } from "./pathfinding";
import { Overlay } from "./ui/overlay";
import { demoObstacles } from "./data/obstacles";

const VERSION = "0.1.0";

function bootstrap() {
  console.info(`[${GAME_NAME}] Client bootstrap`);

  if (typeof document === "undefined") {
    console.warn("Client requires browser environment");
    return;
  }

  const root = document.getElementById("app") ?? document.body;

  const palette = new Palette();
  const avatarSprites = makeAvatarSprite(palette);
  const world = new World();
  const renderer = createRenderer(root, palette, avatarSprites);
  const net = new NetClient(`ws://localhost:2593`, VERSION);
  const overlay = new Overlay(root);

  world.setObstacles(demoObstacles);
  renderer.setObstacles(world.getObstacles());

  net.onWelcome = (info) => {
    console.info(`MOTD: ${info.motd}, tickRate=${info.tickRate}`);
    net.login(`anon-${Math.floor(Math.random() * 9999)}`);
  };

  net.onLogin = (session) => {
    world.setLocal(session.playerId, session.name, session.position);
    renderer.setWorld(world);
  };

  net.onSpawn = (entity) => {
    world.upsertEntity(entity.entityId, entity.name, entity.position);
  };

  net.onMove = (entityId, position) => {
    // usa target para interpolar
    world.setTarget(entityId, position);
  };

  net.onReconcile = (pos) => {
    if (!world.localId) return;
    world.updatePosition(world.localId, pos);
  };

  net.onSnapshot = (entities) => {
    world.applySnapshot(entities);
  };

  net.onError = (code, message) => {
    overlay.log(`[erro] ${code}: ${message}`);
    if (code === "blocked_tile") {
      const last = net.getLastServerPosition();
      if (world.localId && last) {
        world.updatePosition(world.localId, last);
        renderer.markDestination(null);
      }
    }
  };

  net.onChat = (from, text) => {
    console.log(`[chat] ${from}: ${text}`);
    overlay.log(`[chat] ${from}: ${text}`);
  };

  net.connect();

  // Input simples: seta movimenta e envia move.
  window.addEventListener("keydown", (ev) => {
    if (!world.localId) return;

    const pos = world.getPosition(world.localId);
    if (!pos) return;

    const step = 1;
    const next = { ...pos };
    if (ev.key === "ArrowUp") next.y -= step;
    if (ev.key === "ArrowDown") next.y += step;
    if (ev.key === "ArrowLeft") next.x -= step;
    if (ev.key === "ArrowRight") next.x += step;

    if (next.x !== pos.x || next.y !== pos.y) {
      world.setTarget(world.localId, next);
      net.sendMove(next);
    }
  });

  renderer.onRightClick((pos) => {
    if (!world.localId) return;
    const current = world.getLocalPosition();
    if (!current) return;
    const path = aStarPath(current, pos, (x, y) => world.isWalkable(x, y));
    if (!path.ok || path.path.length === 0) {
      overlay.log("Destino inalcançável");
      return;
    }
    renderer.highlight(pos);
    renderer.markDestination(pos);

    // Envia somente último ponto por enquanto; caminho completo fica para passo futuro
    const last = path.path[path.path.length - 1];
    world.setTarget(world.localId, last);
    net.sendMove(last);
  });

  renderer.onLeftClick((pos) => {
    const hit = world.findEntityAt(Math.round(pos.x), Math.round(pos.y));
    if (hit) {
      renderer.highlight(hit.position);
      overlay.log(`Selecionado: ${hit.name} (${hit.id}) @ (${hit.position.x},${hit.position.y})`);
      const stats = hit.stats ?? {
        hp: 50,
        hpMax: 100,
        mana: 30,
        manaMax: 60,
        level: 5,
        title: "Viajante"
      };
      const local = world.getLocalPosition();
      const dist = local ? Math.hypot(hit.position.x - local.x, hit.position.y - local.y).toFixed(1) : "?";
      overlay.showDetails(hit.name, [
        stats.title ?? "",
        `HP: ${stats.hp}/${stats.hpMax}`,
        `Mana: ${stats.mana}/${stats.manaMax}`,
        `Nível: ${stats.level}`,
        `Distância: ${dist}`
      ]);
      overlay.showTooltip(
        pos.x * 32,
        pos.y * 32,
        hit.name,
        [`HP ${stats.hp}/${stats.hpMax}`, `Mana ${stats.mana}/${stats.manaMax}`, `Nível ${stats.level}`, `Dist: ${dist}`]
      );
    } else {
      renderer.highlight(pos);
      overlay.log(`Terreno em (${Math.round(pos.x)},${Math.round(pos.y)})`);
      overlay.showDetails("Terreno", ["Nenhum alvo"]);
      overlay.hideTooltip();
    }
  });
}

bootstrap();
