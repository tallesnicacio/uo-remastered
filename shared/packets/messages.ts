// Mensagens cliente -> servidor
import type { Position } from "@shared/types/position";

export type ClientHello = {
  type: "hello";
  version: string;
  session?: string;
};

export type ClientLogin = {
  type: "login";
  name: string;
  password?: string;
  clientVersion?: string;
  sessionId?: string;
};

export type ClientPing = {
  type: "ping";
  nonce: number;
};

export type ClientChat = {
  type: "chat";
  text: string;
};

export type ClientTarget = {
  type: "target";
  entityId: string;
};

export type ClientKill = {
  type: "kill";
  entityId: string;
};

export type ClientSave = {
  type: "save";
};

export type EntityStatsWire = {
  hp: number;
  hpMax: number;
  mana: number;
  manaMax: number;
  stamina: number;
  staminaMax: number;
  level: number;
  exp: number;
  expMax: number;
};

export type ClientMove = {
  type: "move";
  position: Position;
};

export type ClientMessage = ClientHello | ClientLogin | ClientPing | ClientChat | ClientMove | ClientTarget | ClientKill | ClientSave;

// Mensagens servidor -> cliente
export type ServerWelcome = {
  type: "welcome";
  motd: string;
  serverTime: number;
  tickRate: number;
};

export type ServerLoginOk = {
  type: "login_ok";
  playerId: string;
  name: string;
  position: Position;
  sessionId: string;
};

export type ServerPong = {
  type: "pong";
  nonce: number;
  serverTime: number;
};

export type ServerChat = {
  type: "chat";
  from: string;
  text: string;
};

export type ServerError = {
  type: "error";
  code: string;
  message: string;
};

export type ServerSpawn = {
  type: "spawn";
  entityId: string;
  name: string;
  position: Position;
  stats?: EntityStatsWire;
  dead?: boolean;
};

export type ServerEntityMove = {
  type: "entity_move";
  entityId: string;
  position: Position;
};

export type ServerDespawn = {
  type: "despawn";
  entityId: string;
};

export type ServerTargetAck = {
  type: "target_ack";
  entityId: string;
  name: string;
};

export type ServerSnapshot = {
  type: "snapshot";
  entities: Array<{
    id: string;
    name: string;
    position: Position;
    stats?: EntityStatsWire;
    dead?: boolean;
  }>;
};

export type ServerMessage =
  | ServerWelcome
  | ServerLoginOk
  | ServerPong
  | ServerChat
  | ServerError
  | ServerSpawn
  | ServerEntityMove
  | ServerDespawn
  | ServerTargetAck
  | ServerSnapshot;
