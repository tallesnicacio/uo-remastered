import { readFileSync } from "fs";
import path from "path";

export type ServerConfig = {
  name: string;
  host: string;
  port: number;
  motd: string;
  maxPlayers: number;
  tickRate: number;
};

export type PlayersConfig = {
  startLocation: string;
  startMap: string;
  startGold: number;
  maxBackpackWeight: number;
  maxFollowers: number;
};

export type CombatConfig = {
  defaultDamage: number;
  swingDelayMs: number;
  spellFizzleChance: number;
  weaponSwingVariance: number;
  pvpEnabled: boolean;
};

export type GameConfig = {
  server: ServerConfig;
  players: PlayersConfig;
  combat: CombatConfig;
};

const CONFIG_DIR = path.resolve(import.meta.dir, "../config");

function loadJson<T>(filename: string): T {
  const filePath = path.join(CONFIG_DIR, filename);
  const buffer = readFileSync(filePath, "utf8");
  return JSON.parse(buffer) as T;
}

export function loadConfig(): GameConfig {
  const server = loadJson<ServerConfig>("server.json");
  const players = loadJson<PlayersConfig>("players.json");
  const combat = loadJson<CombatConfig>("combat.json");

  return { server, players, combat };
}
