import { GAME_NAME } from "@shared/constants/runtime";
import { createRenderer } from "./renderer/canvas";
import { Palette } from "./renderer/palette";
import { makeAvatarSprite } from "./renderer/sprites";
import { World } from "./state/world";
import { NetClient } from "./net/client";

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
    world.updatePosition(entityId, position);
  };

  net.onChat = (from, text) => {
    console.log(`[chat] ${from}: ${text}`);
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
      world.updatePosition(world.localId, next);
      net.sendMove(next);
    }
  });
}

bootstrap();
