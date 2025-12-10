import { GAME_NAME } from "@shared/constants/runtime";
import { createRenderer } from "./renderer/canvas";
import { Palette } from "./renderer/palette";
import { makeAvatarSprite } from "./renderer/sprites";
import { World } from "./state/world";
import { NetClient } from "./net/client";
import { aStarPath } from "./pathfinding";
import { Overlay } from "./ui/overlay";
import { demoObstacles } from "./data/obstacles";
import { ChatBox } from "./ui/chat";
import { Hud } from "./ui/hud";
import { LoginForm } from "./ui/login";
import type { Position } from "@shared/types/position";

const VERSION = "0.1.0";
let moveQueue: Position[] = [];
const MOVE_INTERVAL_MS = 150;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 12;
let lastSnapshotCount = 0;
let playerName = "";
let playerPassword = "1234";

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
  const chat = new ChatBox(root);
  const hud = new Hud(root);
  const login = new LoginForm(root);

  world.setObstacles(demoObstacles);
  renderer.setObstacles(world.getObstacles());

  net.onWelcome = (info) => {
    console.info(`MOTD: ${info.motd}, tickRate=${info.tickRate}`);
    const name = playerName || `anon-${Math.floor(Math.random() * 9999)}`;
    net.login(name, playerPassword);
    overlay.setStatus("Conectado");
  };

  net.onLogin = (session) => {
    world.setLocal(session.playerId, session.name, session.position);
    renderer.setWorld(world);
    const stats = world.getLocalStats() ?? {
      hp: 80,
      hpMax: 100,
      mana: 50,
      manaMax: 80,
      stamina: 100,
      staminaMax: 100,
      level: 1,
      exp: 0,
      expMax: 100
    };
    hud.update(stats);
  };

  net.onSpawn = (entity) => {
    world.upsertEntity(entity.entityId, entity.name, entity.position, entity.stats);
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
    lastSnapshotCount = entities.length;
    overlay.setStatus(`Conectado | Entidades: ${entities.length} | Fila: ${moveQueue.length}`);
    // Se snapshot não contém localId, limpar fila para evitar drift
    if (world.localId && !entities.find((e) => e.id === world.localId)) {
      moveQueue = [];
    }

    const localStats = world.getLocalStats();
    if (localStats) {
      hud.update(localStats);
    }
  };

  net.onError = (code, message) => {
    overlay.log(`[erro] ${code}: ${message}`);
    if (code === "blocked_tile") {
      const last = net.getLastServerPosition();
      if (world.localId && last) {
        world.updatePosition(world.localId, last);
        renderer.markDestination(null);
        moveQueue = [];
      }
      if (renderer && moveQueue.length > 0) {
        const lastPos = moveQueue[moveQueue.length - 1];
        renderer.flashError(lastPos);
      }
    } else if (code === "auth_failed") {
      overlay.log("Falha na senha. Tente novamente.");
      playerPassword = "1234";
      login.show("Senha inválida.");
    }
  };

  net.onPong = (latency) => {
    overlay.log(`Ping: ${latency}ms`);
    overlay.setStatus(`Conectado | Ping: ${latency}ms | Fila: ${moveQueue.length}`);
  };

  net.onChat = (from, text) => {
    overlay.log(`[chat] ${from}: ${text}`);
  };

  net.onDespawn = (entityId) => {
    world.removeEntity(entityId);
    overlay.log(`Despawn: ${entityId}`);
    // Se o jogador local estava movendo, limpar destino/seleção
    renderer.markDestination(null);
    moveQueue = [];
  };

  net.onTargetAck = (entityId, name) => {
    overlay.log(`Target: ${name} (${entityId})`);
  };

  net.onSnapshot = (entities) => {
    world.applySnapshot(entities);
    lastSnapshotCount = entities.length;
    overlay.setStatus(`Conectado | Entidades: ${entities.length} | Fila: ${moveQueue.length}`);
    // Se snapshot não contém localId, limpar fila para evitar drift
    if (world.localId && !entities.find((e) => e.id === world.localId)) {
      moveQueue = [];
    }

    const localStats = world.getLocalStats();
    if (localStats) {
      hud.update(localStats);
      if (localStats.hp <= 0) {
        renderer.flashError(world.getLocalPosition() ?? { x: 0, y: 0, map: "Felucca" });
      }
    }
  };

  net.connect();

  login.onSubmit = (name, password) => {
    playerName = name;
    playerPassword = password || "1234";
    net.connect();
  };

  chat.onSend = (text) => {
    if (text === "/ping") {
      net.send({ type: "ping", nonce: Date.now() });
      return;
    }
    if (text.startsWith("/kill ")) {
      const [, targetId] = text.split(" ");
      if (targetId) {
        net.sendKill(targetId);
        overlay.log(`[você]: kill ${targetId}`);
      }
      return;
    }
    if (text === "/save") {
      net.send({ type: "save" });
      overlay.log("Solicitado save ao servidor");
      return;
    }
    net.sendChat(text);
    overlay.log(`[você]: ${text}`);
  };

  setInterval(() => {
    if (!world.localId) return;
    if (moveQueue.length === 0) return;
    const next = moveQueue.shift();
    if (!next) return;
    overlay.log(`Passo: (${next.x},${next.y}) fila=${moveQueue.length}`);
    world.setTarget(world.localId, next);
    net.sendMove(next);
  }, MOVE_INTERVAL_MS);

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
    if (pos.x < 0 || pos.y < 0 || pos.x >= MAP_WIDTH || pos.y >= MAP_HEIGHT) {
      overlay.log("Destino fora do mapa");
      renderer.flashError(pos);
      return;
    }
    const current = world.getLocalPosition();
    if (!current) return;
    const path = aStarPath(current, pos, (x, y) => world.isWalkable(x, y));
    if (!path.ok || path.path.length === 0) {
      overlay.log("Destino inalcançável");
      renderer.flashError(pos);
      return;
    }
    renderer.highlight(pos);
    renderer.markDestination(pos);

    // Enfileira caminho inteiro (ignora primeira posição se for a atual)
    moveQueue = path.path.slice(1);
    overlay.log(`Movendo: ${moveQueue.length} passos`);
  });

  renderer.onLeftClick((pos) => {
    const hit = world.findEntityAt(Math.round(pos.x), Math.round(pos.y));
    if (hit) {
      renderer.highlight(hit.position);
      overlay.log(`Selecionado: ${hit.name} (${hit.id}) @ (${hit.position.x},${hit.position.y}) | Entidades: ${lastSnapshotCount}`);
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
      net.send({ type: "target", entityId: hit.id });
    } else {
      renderer.highlight(pos);
      overlay.log(`Terreno em (${Math.round(pos.x)},${Math.round(pos.y)})`);
      overlay.showDetails("Terreno", ["Nenhum alvo"]);
      overlay.hideTooltip();
    }
  });
}

bootstrap();
